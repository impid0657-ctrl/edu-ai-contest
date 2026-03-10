import { GoogleGenAI } from "@google/genai";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Chatbot utility module — Gemini API integration.
 * Embedding generation, vector search, topic filtering, conversation logging.
 * Used by /api/chat and scripts/generate-embeddings.mjs.
 */

// Settings cache (5 min TTL)
let settingsCache = null;
let settingsCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

// Gemini client singleton
let geminiClient = null;

/**
 * Get or create Gemini AI client singleton
 */
export function getGeminiClient() {
  if (geminiClient) return geminiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  geminiClient = new GoogleGenAI({ apiKey });
  return geminiClient;
}

/**
 * Get chatbot settings from DB (cached for 5 min)
 */
export async function getChatbotSettings() {
  const now = Date.now();
  if (settingsCache && now - settingsCacheTime < CACHE_TTL) {
    return settingsCache;
  }

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("chatbot_settings")
    .select("*")
    .limit(1)
    .single();

  if (error || !data) {
    return {
      provider: "google",
      model_name: "gemini-3-flash-preview",
      system_prompt: "당신은 제8회 교육 공공데이터 AI활용대회의 안내 도우미입니다. 대회 요강 범위 내에서만 답변하세요. 범위 밖 질문에는 정중히 거절하세요.",
      max_tokens: 1000,
      temperature: 0.7,
      allowed_topics: ["대회 일정", "신청 방법", "참가 자격"],
      blocked_topics: ["정치", "성인 콘텐츠", "개인정보", "욕설"],
      is_active: true,
      daily_limit: 1000,
    };
  }

  settingsCache = data;
  settingsCacheTime = now;
  return data;
}

/**
 * Invalidate settings cache (called after admin updates settings)
 */
export function invalidateSettingsCache() {
  settingsCache = null;
  settingsCacheTime = 0;
}

/**
 * Generate embedding vector for a text string using Gemini embedding REST API.
 * Uses node:https to bypass Next.js fetch patching.
 * Model: gemini-embedding-001 with 768 dimensions.
 */
export async function generateEmbedding(text) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const https = await import("node:https");
  const url = new URL(`https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`);
  const postData = JSON.stringify({
    content: { parts: [{ text }] },
    outputDimensionality: 768,
  });

  return new Promise((resolve, reject) => {
    const req = https.default.request(
      {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: "POST",
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(postData) },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const parsed = JSON.parse(data);
              resolve(parsed.embedding?.values || []);
            } catch { reject(new Error("Invalid embedding JSON")); }
          } else {
            reject(new Error(`Embedding API ${res.statusCode}: ${data.substring(0, 200)}`));
          }
        });
        res.on("error", reject);
      }
    );
    req.on("error", reject);
    req.setTimeout(10000, () => { req.destroy(new Error("Embedding API timeout")); });
    req.write(postData);
    req.end();
  });
}

/**
 * Search contest_documents by cosine similarity.
 * Returns top N results with similarity >= threshold.
 */
export async function searchDocuments(queryEmbedding, topN = 5, threshold = 0.75) {
  const adminClient = createAdminClient();

  const { data, error } = await adminClient.rpc("match_contest_documents", {
    query_embedding: queryEmbedding,
    match_threshold: threshold,
    match_count: topN,
  });

  if (error) {
    console.error("Vector search error:", error.message);
    const { data: allDocs } = await adminClient
      .from("contest_documents")
      .select("title, content")
      .limit(topN);
    return allDocs || [];
  }

  return data || [];
}

/**
 * Check if a message matches blocked topics (simple keyword matching)
 */
export function isBlockedTopic(message, blockedTopics) {
  if (!blockedTopics || !Array.isArray(blockedTopics)) return false;
  const lowerMsg = message.toLowerCase();
  return blockedTopics.some((topic) => lowerMsg.includes(topic.toLowerCase()));
}

/**
 * Check daily usage limit
 */
export async function checkDailyLimit(dailyLimit) {
  if (!dailyLimit || dailyLimit <= 0) return false;

  const adminClient = createAdminClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count, error } = await adminClient
    .from("chatbot_logs")
    .select("id", { count: "exact", head: true })
    .gte("created_at", today.toISOString());

  if (error) {
    console.error("Daily limit check error:", error.message);
    return false;
  }

  return (count || 0) >= dailyLimit;
}

/**
 * Log chatbot conversation (graceful — 핵심 필드만이라도 저장)
 */
export async function logConversation({
  sessionId,
  userQuery,
  aiResponse,
  isBlocked = false,
  tokensUsed = 0,
  provider,
  model,
  latencyMs,
}) {
  const adminClient = createAdminClient();

  // DB 실제 컬럼명: user_message (NOT NULL), assistant_message, session_id (NOT NULL)
  const fullRow = {
    session_id: sessionId || "anonymous",
    user_message: userQuery,
    assistant_message: aiResponse,
    is_blocked: isBlocked,
    tokens_used: tokensUsed,
    provider,
    model,
    latency_ms: latencyMs,
  };

  const { error } = await adminClient.from("chatbot_logs").insert(fullRow);

  if (error) {
    console.error("Log conversation error (full):", error.message);

    // 2차 시도: 핵심 필드만 (스키마 불일치 대비)
    const coreRow = {
      session_id: sessionId || "anonymous",
      user_message: userQuery,
      assistant_message: aiResponse,
      is_blocked: isBlocked,
      tokens_used: tokensUsed,
    };

    const { error: coreErr } = await adminClient.from("chatbot_logs").insert(coreRow);
    if (coreErr) {
      console.error("Log conversation error (core):", coreErr.message);
    } else {
      console.log("Log saved with core fields only");
    }
  }
}

/**
 * Log a fallback event when Gemini fails and OpenRouter is used.
 */
export async function logFallbackEvent({
  originalProvider,
  originalModel,
  fallbackProvider,
  fallbackModel,
  errorMessage,
  description,
}) {
  try {
    const adminClient = createAdminClient();
    const { error } = await adminClient.from("chatbot_fallback_logs").insert({
      original_provider: originalProvider,
      original_model: originalModel,
      fallback_provider: fallbackProvider,
      fallback_model: fallbackModel,
      error_message: errorMessage,
      description: description,
    });
    if (error) console.error("Fallback log error:", error.message);
  } catch (err) {
    console.error("logFallbackEvent exception:", err.message);
  }
}

/**
 * Log a health check result.
 */
export async function logHealthCheck({
  provider,
  model,
  status,
  errorMessage,
  latencyMs,
}) {
  try {
    const adminClient = createAdminClient();
    const { error } = await adminClient.from("chatbot_health_checks").insert({
      provider,
      model,
      status,
      error_message: errorMessage,
      latency_ms: latencyMs,
      checked_at: new Date().toISOString(),
    });
    if (error) console.error("Health check log error:", error.message);
  } catch (err) {
    console.error("logHealthCheck exception:", err.message);
  }
}

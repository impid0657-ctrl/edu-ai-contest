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
 * Generate embedding vector for a text string using Gemini embedding model.
 * Uses gemini-embedding-001 with 768 dimensions.
 */
export async function generateEmbedding(text) {
  const ai = getGeminiClient();
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
    config: {
      outputDimensionality: 768,
    },
  });
  return response.embeddings[0].values;
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
 * Log chatbot conversation
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
  const { error } = await adminClient.from("chatbot_logs").insert({
    session_id: sessionId,
    user_query: userQuery,
    ai_response: aiResponse,
    is_blocked: isBlocked,
    tokens_used: tokensUsed,
    provider,
    model,
    latency_ms: latencyMs,
  });

  if (error) {
    console.error("Log conversation error:", error.message);
  }
}

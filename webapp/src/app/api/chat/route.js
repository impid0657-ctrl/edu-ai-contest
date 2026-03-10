import { NextResponse } from "next/server";
import {
  getChatbotSettings,
  generateEmbedding,
  searchDocuments,
  isBlockedTopic,
  checkDailyLimit,
  logConversation,
  logFallbackEvent,
} from "@/lib/chatbot";
import { callOpenRouter, DEFAULT_FALLBACK_MODEL } from "@/lib/openrouter";
import { rateLimit, getClientIP } from "@/lib/rateLimit";

const chatLimiter = rateLimit({ interval: 60_000, limit: 20 });

/**
 * Call Gemini REST API using node:https to completely bypass Next.js fetch patching.
 * Next.js monkey-patches globalThis.fetch causing infinite hangs with external APIs.
 * Using node:https avoids this entirely.
 */
async function callGeminiDirect(url, requestBody) {
  const https = await import("node:https");
  const parsedUrl = new URL(url);

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(requestBody);
    const req = https.default.request(
      {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch {
              reject(new Error("Invalid JSON from Gemini: " + data.substring(0, 200)));
            }
          } else {
            reject(new Error(`Gemini API ${res.statusCode}: ${data.substring(0, 300)}`));
          }
        });
        res.on("error", reject);
      }
    );
    req.on("error", reject);
    req.setTimeout(10000, () => {
      req.destroy(new Error("Gemini API timeout (10s)"));
    });
    req.write(postData);
    req.end();
  });
}

/**
 * POST /api/chat
 * RAG chatbot endpoint.
 * Primary: Google Gemini (via node:https to bypass Next.js fetch patch).
 * Fallback: OpenRouter.
 */
export async function POST(request) {
  const startTime = Date.now();

  try {
    const ip = getClientIP(request);
    const { success } = chatLimiter.check(ip);
    if (!success) {
      return NextResponse.json({ error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." }, { status: 429 });
    }

    const body = await request.json();
    const { message, session_id } = body;

    if (!message || message.trim() === "") {
      return NextResponse.json({ error: "메시지를 입력해주세요." }, { status: 400 });
    }

    // 글자수 제한 (300자) — 토큰 오버 방지
    if (message.length > 300) {
      return NextResponse.json({ error: "입력 글자수가 300자를 초과했습니다. 질문을 간결하게 줄여주세요." }, { status: 400 });
    }

    const settings = await getChatbotSettings();

    if (!settings.is_active) {
      return NextResponse.json({ error: "챗봇이 비활성화 상태입니다." }, { status: 503 });
    }

    // Daily limit check (graceful)
    try {
      const limitReached = await checkDailyLimit(settings.daily_limit);
      if (limitReached) {
        return NextResponse.json({ error: "일일 대화 한도에 도달했습니다." }, { status: 429 });
      }
    } catch (limitErr) {
      console.warn("Daily limit check skipped:", limitErr.message);
    }

    // Blocked topics
    const blockedTopics = Array.isArray(settings.blocked_topics)
      ? settings.blocked_topics
      : JSON.parse(settings.blocked_topics || "[]");

    if (isBlockedTopic(message, blockedTopics)) {
      logConversation({ sessionId: session_id, userQuery: message, aiResponse: "차단됨", isBlocked: true, provider: "google", model: settings.model_name, latencyMs: Date.now() - startTime }).catch(() => { });
      return NextResponse.json({ response: "죄송합니다. 해당 주제는 답변할 수 없습니다.", blocked: true });
    }

    // Embedding
    let queryEmbedding;
    try {
      queryEmbedding = await generateEmbedding(message);
    } catch (err) {
      console.error("Embedding failed:", err.message);
      queryEmbedding = null;
    }

    // Vector search
    let contextDocs = [];
    if (queryEmbedding) {
      contextDocs = await searchDocuments(queryEmbedding, 5, 0.5);
      console.log(`[chat] RAG search: ${contextDocs.length} docs found`);
    } else {
      console.log("[chat] RAG search: skipped (no embedding)");
    }

    const contextText = contextDocs.length > 0
      ? contextDocs.map((d) => `[${d.title || "문서"}]: ${d.content}`).join("\n\n")
      : "";

    // Build prompt — 공모전 안내 전용 + RAG 기반만 답변 + 비공모전 질문 거부
    const STRICT_RULES = `
[필수 준수 규칙]
1. 당신은 "제8회 교육 공공데이터 AI활용대회" 안내 전용 챗봇입니다.
2. 오직 아래 참고 문서에 포함된 내용만 답변할 수 있습니다. 문서에 없는 내용은 절대로 추측하거나 지어내지 마세요.
3. 공모전과 관련 없는 질문(일상 대화, 프로그래밍 도움, 번역, 다른 대회 정보 등)에는 반드시 다음과 같이 답변하세요:
   "죄송합니다. 저는 교육 공공데이터 AI활용대회 안내 전용 챗봇이므로 해당 질문에는 답변드리기 어렵습니다. 대회 관련 질문을 해주세요."
4. 참고 문서에 없는 대회 정보를 질문받으면: "해당 정보는 현재 등록된 문서에서 확인할 수 없습니다. 자세한 내용은 대회 공모요강을 확인하시거나 관리자에게 문의해주세요."
5. 답변은 매우 친절하고 따뜻한 어조로 작성합니다. 반말이 아닌 존댓말을 사용하세요.
6. 절대로 마크다운 문법(*, **, #, - 등)을 사용하지 마세요. 순수 텍스트로만 답변하세요. 줄바꿈과 숫자 목록(1. 2. 3.)은 사용 가능합니다.
7. 답변에 적절한 이모지를 활용하여 보기 좋고 친근하게 꾸며주세요. 예: 📌, ✅, 📅, 🎯, 💡, 😊 등. 단, 과도하게 많이 사용하지는 마세요.`;

    let systemPrompt;
    if (contextDocs.length > 0) {
      systemPrompt = `${settings.system_prompt}\n${STRICT_RULES}\n\n--- 참고 문서 ---\n${contextText}\n--- 참고 문서 끝 ---`;
    } else {
      systemPrompt = `${settings.system_prompt}\n${STRICT_RULES}\n\n현재 참고할 수 있는 문서가 없습니다. 모든 질문에 대해 "죄송합니다. 현재 참고할 수 있는 대회 요강 문서가 등록되지 않아 정확한 답변이 어렵습니다. 관리자에게 문의해주세요."라고 안내하세요.`;
    }

    // 3단계 폴백: gemini-2.5-flash-lite → gemini-2.5-flash → OpenRouter
    if (settings.provider === "openrouter") {
      // 관리자가 명시적으로 OpenRouter 지정
      const model = settings.model_name || DEFAULT_FALLBACK_MODEL;
      return await handleOpenRouter({ settings, model, systemPrompt, message, session_id, startTime });
    }

    // Gemini 캐스케이드 시도
    return await tryGeminiCascade({ settings, systemPrompt, message, session_id, startTime });
  } catch (err) {
    console.error("POST /api/chat error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * 3단계 Gemini 캐스케이드: gemini-2.5-flash-lite → gemini-2.5-flash → OpenRouter
 */
async function tryGeminiCascade({ settings, systemPrompt, message, session_id, startTime }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const geminiModels = ["gemini-2.5-flash-lite", "gemini-2.5-flash"];

  const requestBody = {
    contents: [{ role: "user", parts: [{ text: message }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      maxOutputTokens: settings.max_tokens || 1000,
      temperature: parseFloat(settings.temperature) || 0.7,
    },
  };

  // Gemini 모델 순차 시도
  if (apiKey) {
    for (const model of geminiModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        console.log(`[chat] trying: ${model} (+${Date.now() - startTime}ms)`);

        const geminiData = await callGeminiDirect(url, requestBody);
        const fullResponse = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        if (!fullResponse) {
          console.warn(`[chat] ${model}: empty response, trying next`);
          continue;
        }

        console.log(`[chat] success: ${model} (+${Date.now() - startTime}ms)`);

        const estimatedTokens = Math.ceil((message.length + fullResponse.length) / 4);
        logConversation({ sessionId: session_id, userQuery: message, aiResponse: fullResponse, isBlocked: false, tokensUsed: estimatedTokens, provider: "google", model, latencyMs: Date.now() - startTime }).catch(() => { });

        return createSSEResponse(stripMarkdown(fullResponse));
      } catch (err) {
        console.warn(`[chat] ${model} failed: ${err.message}, trying next`);
      }
    }
  }

  // 3차: OpenRouter 폴백
  const fallbackModel = settings.fallback_model || DEFAULT_FALLBACK_MODEL;
  console.log(`[chat] all Gemini failed, falling back to OpenRouter: ${fallbackModel} (+${Date.now() - startTime}ms)`);

  logFallbackEvent({
    originalProvider: "google", originalModel: geminiModels[0],
    fallbackProvider: "openrouter", fallbackModel,
    errorMessage: "All Gemini models failed",
    description: "Gemini 전체 실패 → OpenRouter 전환",
  }).catch(() => { });

  return await handleOpenRouter({ settings, model: fallbackModel, systemPrompt, message, session_id, startTime });
}

/**
 * Handle OpenRouter non-streaming response.
 */
async function handleOpenRouter({ settings, model, systemPrompt, message, session_id, startTime }) {
  const fullResponse = await callOpenRouter({ model, systemPrompt, userMessage: message, maxTokens: settings.max_tokens || 1000, temperature: parseFloat(settings.temperature) || 0.7 });

  if (!fullResponse) {
    return NextResponse.json({ error: "AI 서비스에서 응답을 받지 못했습니다." }, { status: 503 });
  }

  const estimatedTokens = Math.ceil((message.length + fullResponse.length) / 4);
  logConversation({ sessionId: session_id, userQuery: message, aiResponse: fullResponse, isBlocked: false, tokensUsed: estimatedTokens, provider: "openrouter", model, latencyMs: Date.now() - startTime }).catch(() => { });

  return createSSEResponse(stripMarkdown(fullResponse));
}

/**
 * Strip markdown formatting from AI response text.
 * Preserves emoji, numbered lists, and plain text.
 */
function stripMarkdown(text) {
  return text
    .replace(/^#{1,6}\s+/gm, "")         // # 헤딩 제거
    .replace(/\*\*(.+?)\*\*/g, "$1")       // **볼드** → 볼드
    .replace(/\*(.+?)\*/g, "$1")           // *이탤릭* → 이탤릭
    .replace(/^[\s]*\*\s+/gm, "• ")        // * 리스트 → • 리스트
    .replace(/^[\s]*-\s+/gm, "• ")         // - 리스트 → • 리스트
    .replace(/`([^`]+)`/g, "$1");          // `코드` → 코드
}

/**
 * Create SSE response from complete text, simulating streaming for frontend.
 */
function createSSEResponse(text) {
  const encoder = new TextEncoder();
  // Array.from()은 유니코드 코드포인트 단위로 분해하므로 서로게이트 페어가 깨지지 않음
  const codePoints = Array.from(text);
  const chunkSize = 50;
  const chunks = [];
  for (let i = 0; i < codePoints.length; i += chunkSize) {
    chunks.push(codePoints.slice(i, i + chunkSize).join(""));
  }

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode("data: " + JSON.stringify({ content: chunk }) + "\n\n"));
          await new Promise((r) => setTimeout(r, 15));
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch {
        controller.enqueue(encoder.encode("data: " + JSON.stringify({ content: "\n\n오류가 발생했습니다." }) + "\n\n"));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

import { NextResponse } from "next/server";
import {
  getGeminiClient,
  getChatbotSettings,
  generateEmbedding,
  searchDocuments,
  isBlockedTopic,
  checkDailyLimit,
  logConversation,
  logFallbackEvent,
} from "@/lib/chatbot";
import { callOpenRouterStream, DEFAULT_FALLBACK_MODEL } from "@/lib/openrouter";
import { rateLimit, getClientIP } from "@/lib/rateLimit";

const chatLimiter = rateLimit({ interval: 60_000, limit: 20 });

/**
 * POST /api/chat
 * Streaming RAG chatbot endpoint.
 * Primary: Google Gemini. Fallback: OpenRouter (non-Google models).
 * Embeds query → cosine search → AI stream → log.
 */
export async function POST(request) {
  const startTime = Date.now();

  try {
    // Rate limit
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

    // Get settings
    const settings = await getChatbotSettings();

    // Check if chatbot is active
    if (!settings.is_active) {
      return NextResponse.json(
        { error: "챗봇이 비활성화 상태입니다." },
        { status: 503 }
      );
    }

    // Check daily limit
    const limitReached = await checkDailyLimit(settings.daily_limit);
    if (limitReached) {
      return NextResponse.json(
        { error: "일일 대화 한도에 도달했습니다. 내일 다시 이용해주세요." },
        { status: 429 }
      );
    }

    // Check blocked topics
    const blockedTopics = Array.isArray(settings.blocked_topics)
      ? settings.blocked_topics
      : JSON.parse(settings.blocked_topics || "[]");

    if (isBlockedTopic(message, blockedTopics)) {
      const blockedResponse = "죄송합니다. 해당 주제는 답변할 수 없습니다. 대회 요강 관련 질문을 해주세요.";

      await logConversation({
        sessionId: session_id,
        userQuery: message,
        aiResponse: blockedResponse,
        isBlocked: true,
        provider: settings.provider || "google",
        model: settings.model_name,
        latencyMs: Date.now() - startTime,
      });

      return NextResponse.json({ response: blockedResponse, blocked: true });
    }

    // Generate embedding for user query
    let queryEmbedding;
    try {
      queryEmbedding = await generateEmbedding(message);
    } catch (err) {
      console.error("Embedding generation failed:", err.message);
      queryEmbedding = null;
    }

    // Search for relevant documents
    let contextDocs = [];
    if (queryEmbedding) {
      contextDocs = await searchDocuments(queryEmbedding, 5, 0.75);
    }

    // Build context string from matched documents
    const contextText = contextDocs.length > 0
      ? contextDocs.map((d) => `[${d.title || "문서"}]: ${d.content}`).join("\n\n")
      : "관련 문서를 찾지 못했습니다. 일반적인 대회 안내를 참고하여 답변해주세요.";

    // Build prompt
    const systemPrompt = `${settings.system_prompt}\n\n--- 참고 문서 ---\n${contextText}\n--- 참고 문서 끝 ---`;

    const activeProvider = settings.provider || "google";
    const modelName = settings.model_name || "gemini-3-flash-preview";
    const autoFallback = settings.auto_fallback !== false; // default true

    // ─── Try primary provider ───
    if (activeProvider === "google") {
      return await tryGeminiWithFallback({
        settings, modelName, systemPrompt, message, session_id, startTime, autoFallback,
      });
    } else if (activeProvider === "openrouter") {
      return await handleOpenRouterStream({
        settings, model: modelName, systemPrompt, message, session_id, startTime, isFallback: false,
      });
    } else {
      // Unknown provider, try Gemini as default
      return await tryGeminiWithFallback({
        settings, modelName, systemPrompt, message, session_id, startTime, autoFallback,
      });
    }
  } catch (err) {
    console.error("POST /api/chat error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Try Gemini first, fallback to OpenRouter on failure.
 */
async function tryGeminiWithFallback({ settings, modelName, systemPrompt, message, session_id, startTime, autoFallback }) {
  try {
    const ai = getGeminiClient();

    const response = await ai.models.generateContentStream({
      model: modelName,
      config: {
        maxOutputTokens: settings.max_tokens || 1000,
        temperature: parseFloat(settings.temperature) || 0.7,
        systemInstruction: systemPrompt,
      },
      contents: message,
    });

    // Gemini streaming
    let fullResponse = "";
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = chunk.text || "";
            if (content) {
              fullResponse += content;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\\n\\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\\n\\n"));
          controller.close();

          const estimatedTokens = Math.ceil((message.length + fullResponse.length) / 4);
          await logConversation({
            sessionId: session_id,
            userQuery: message,
            aiResponse: fullResponse,
            isBlocked: false,
            tokensUsed: estimatedTokens,
            provider: "google",
            model: modelName,
            latencyMs: Date.now() - startTime,
          });
        } catch (err) {
          console.error("Gemini stream error:", err);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ content: "\\n\\n오류가 발생했습니다." })}\\n\\n`)
          );
          controller.enqueue(encoder.encode("data: [DONE]\\n\\n"));
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
  } catch (geminiError) {
    console.error("Gemini API failed, error:", geminiError.message);

    if (!autoFallback) {
      return NextResponse.json({ error: "AI 서비스에 일시적 문제가 발생했습니다." }, { status: 503 });
    }

    // ─── Fallback to OpenRouter ───
    const fallbackModel = settings.fallback_model || DEFAULT_FALLBACK_MODEL;
    const errorDesc = `Gemini API 오류로 OpenRouter(${fallbackModel})로 자동 전환되었습니다. 오류: ${geminiError.message}`;

    // Log fallback event (async, don't block)
    logFallbackEvent({
      originalProvider: "google",
      originalModel: modelName,
      fallbackProvider: "openrouter",
      fallbackModel: fallbackModel,
      errorMessage: geminiError.message,
      description: errorDesc,
    }).catch(() => {});

    console.log(`Falling back to OpenRouter: ${fallbackModel}`);

    return await handleOpenRouterStream({
      settings,
      model: fallbackModel,
      systemPrompt,
      message,
      session_id,
      startTime,
      isFallback: true,
    });
  }
}

/**
 * Handle OpenRouter streaming response.
 */
async function handleOpenRouterStream({ settings, model, systemPrompt, message, session_id, startTime, isFallback }) {
  const orStream = await callOpenRouterStream({
    model,
    systemPrompt,
    userMessage: message,
    maxTokens: settings.max_tokens || 1000,
    temperature: parseFloat(settings.temperature) || 0.7,
  });

  let fullResponse = "";
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const reader = orStream.getReader();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || "";
                if (content) {
                  fullResponse += content;
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\\n\\n`));
                }
              } catch {}
            }
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\\n\\n"));
        controller.close();

        const estimatedTokens = Math.ceil((message.length + fullResponse.length) / 4);
        await logConversation({
          sessionId: session_id,
          userQuery: message,
          aiResponse: fullResponse,
          isBlocked: false,
          tokensUsed: estimatedTokens,
          provider: "openrouter",
          model: model,
          latencyMs: Date.now() - startTime,
        });
      } catch (err) {
        console.error("OpenRouter stream error:", err);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ content: "\\n\\n오류가 발생했습니다." })}\\n\\n`)
        );
        controller.enqueue(encoder.encode("data: [DONE]\\n\\n"));
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

import { NextResponse } from "next/server";
import {
  getGeminiClient,
  getChatbotSettings,
  generateEmbedding,
  searchDocuments,
  isBlockedTopic,
  checkDailyLimit,
  logConversation,
} from "@/lib/chatbot";
import { rateLimit, getClientIP } from "@/lib/rateLimit";

const chatLimiter = rateLimit({ interval: 60_000, limit: 20 });

/**
 * POST /api/chat
 * Streaming RAG chatbot endpoint using Google Gemini.
 * Embeds query → cosine search → Gemini stream → log.
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
        provider: "google",
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

    // Gemini streaming
    const ai = getGeminiClient();
    const modelName = settings.model_name || "gemini-3-flash-preview";

    const response = await ai.models.generateContentStream({
      model: modelName,
      config: {
        maxOutputTokens: settings.max_tokens || 1000,
        temperature: parseFloat(settings.temperature) || 0.7,
        systemInstruction: systemPrompt,
      },
      contents: message,
    });

    // Create SSE response stream
    let fullResponse = "";
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = chunk.text || "";
            if (content) {
              fullResponse += content;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();

          // Estimate tokens (Gemini doesn't always return usage in stream)
          const estimatedTokens = Math.ceil((message.length + fullResponse.length) / 4);

          // Log conversation after stream completes
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
          console.error("Stream error:", err);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ content: "\n\n오류가 발생했습니다." })}\n\n`)
          );
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
  } catch (err) {
    console.error("POST /api/chat error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

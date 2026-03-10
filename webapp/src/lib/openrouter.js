/**
 * OpenRouter API integration module.
 * Provides streaming chat completions via OpenRouter.
 * Used as fallback when Gemini API fails.
 */

// 챗봇에 적합한 OpenRouter 모델 목록 (Google 모델 제외)
export const OPENROUTER_MODELS = [
  { id: "anthropic/claude-3.5-haiku", name: "Claude 3.5 Haiku", desc: "빠르고 저렴, 한국어 우수" },
  { id: "meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B", desc: "고성능, 저비용" },
  { id: "mistralai/mistral-small-3.1-24b-instruct", name: "Mistral Small 3.1", desc: "중간 성능, 빠른 응답" },
  { id: "qwen/qwen-2.5-72b-instruct", name: "Qwen 2.5 72B", desc: "다국어 우수, 고성능" },
];

// Google 제외 자동 폴백용 기본 모델
export const DEFAULT_FALLBACK_MODEL = "anthropic/claude-3.5-haiku";

/**
 * Call OpenRouter API with streaming response.
 * Returns a ReadableStream of SSE events.
 */
export async function callOpenRouterStream({ model, systemPrompt, userMessage, maxTokens = 1000, temperature = 0.7 }) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://edu-ai-contest.vercel.app",
      "X-Title": "교육 공공데이터 AI활용대회 챗봇",
    },
    body: JSON.stringify({
      model: model || DEFAULT_FALLBACK_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: maxTokens,
      temperature: temperature,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
  }

  return response.body;
}

/**
 * Call OpenRouter API without streaming (for health checks).
 */
export async function callOpenRouter({ model, systemPrompt, userMessage, maxTokens = 100, temperature = 0.7 }) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://edu-ai-contest.vercel.app",
      "X-Title": "교육 공공데이터 AI활용대회 챗봇",
    },
    body: JSON.stringify({
      model: model || DEFAULT_FALLBACK_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: maxTokens,
      temperature: temperature,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

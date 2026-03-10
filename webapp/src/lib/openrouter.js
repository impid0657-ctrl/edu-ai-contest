/**
 * OpenRouter API integration module.
 * Uses node:https to bypass Next.js fetch patching.
 * Used as primary or fallback AI provider.
 */

export const OPENROUTER_MODELS = [
  { id: "anthropic/claude-3.5-haiku", name: "Claude 3.5 Haiku", desc: "빠르고 저렴, 한국어 우수" },
  { id: "meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B", desc: "고성능, 저비용" },
  { id: "mistralai/mistral-small-3.1-24b-instruct", name: "Mistral Small 3.1", desc: "중간 성능, 빠른 응답" },
  { id: "qwen/qwen-2.5-72b-instruct", name: "Qwen 2.5 72B", desc: "다국어 우수, 고성능" },
];

export const DEFAULT_FALLBACK_MODEL = "anthropic/claude-3.5-haiku";

/**
 * node:https 기반 OpenRouter API 호출 (Next.js fetch 패치 우회)
 */
async function callOpenRouterHTTPS(body) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

  const https = await import("node:https");
  const postData = JSON.stringify(body);

  return new Promise((resolve, reject) => {
    const req = https.default.request(
      {
        hostname: "openrouter.ai",
        path: "/api/v1/chat/completions",
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://edu-ai-contest.vercel.app",
          "X-Title": "Edu AI Contest Chatbot",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try { resolve(JSON.parse(data)); }
            catch { reject(new Error("Invalid JSON from OpenRouter")); }
          } else {
            reject(new Error(`OpenRouter API ${res.statusCode}: ${data.substring(0, 300)}`));
          }
        });
        res.on("error", reject);
      }
    );
    req.on("error", reject);
    req.setTimeout(30000, () => { req.destroy(new Error("OpenRouter timeout (30s)")); });
    req.write(postData);
    req.end();
  });
}

/**
 * Call OpenRouter API — non-streaming.
 * Returns the text response.
 */
export async function callOpenRouter({ model, systemPrompt, userMessage, maxTokens = 1000, temperature = 0.7 }) {
  const data = await callOpenRouterHTTPS({
    model: model || DEFAULT_FALLBACK_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    max_tokens: maxTokens,
    temperature,
    stream: false,
  });

  return data.choices?.[0]?.message?.content || "";
}

/**
 * Call OpenRouter API — streaming. Returns ReadableStream.
 * NOTE: Still uses fetch for streaming (node:https doesn't easily support SSE parsing).
 * If this hangs on Next.js, use callOpenRouter (non-streaming) instead.
 */
export async function callOpenRouterStream({ model, systemPrompt, userMessage, maxTokens = 1000, temperature = 0.7 }) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://edu-ai-contest.vercel.app",
      "X-Title": "교육 공공데이터 AI활용대회 챗봇",
    },
    cache: "no-store",
    body: JSON.stringify({
      model: model || DEFAULT_FALLBACK_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: maxTokens,
      temperature,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
  }

  return response.body;
}

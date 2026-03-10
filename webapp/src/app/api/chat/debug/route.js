import { NextResponse } from "next/server";

/**
 * GET /api/chat/debug — test each step of the chat pipeline
 * DELETE THIS FILE BEFORE PRODUCTION
 */
export async function GET() {
  const results = {};

  // Step 1: Test Gemini import
  try {
    const { getGeminiClient } = await import("@/lib/chatbot");
    results.step1_import = "OK";
  } catch (err) {
    results.step1_import = "FAIL: " + err.message;
    return NextResponse.json(results);
  }

  // Step 2: Test Gemini client creation
  try {
    const { getGeminiClient } = await import("@/lib/chatbot");
    const client = getGeminiClient();
    results.step2_client = "OK";
  } catch (err) {
    results.step2_client = "FAIL: " + err.message;
    return NextResponse.json(results);
  }

  // Step 3: Test getChatbotSettings
  try {
    const { getChatbotSettings } = await import("@/lib/chatbot");
    const settings = await getChatbotSettings();
    results.step3_settings = { provider: settings.provider, model: settings.model_name, active: settings.is_active };
  } catch (err) {
    results.step3_settings = "FAIL: " + err.message;
    return NextResponse.json(results);
  }

  // Step 4: Test simple Gemini API call
  try {
    const { getGeminiClient } = await import("@/lib/chatbot");
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash",
      contents: "Say hello in Korean, one sentence only.",
      config: { maxOutputTokens: 50 },
    });
    results.step4_gemini_call = response.text || "no text";
  } catch (err) {
    results.step4_gemini_call = "FAIL: " + err.message;
  }

  // Step 5: Test embedding
  try {
    const { generateEmbedding } = await import("@/lib/chatbot");
    const emb = await generateEmbedding("테스트");
    results.step5_embedding = `OK (${emb.length} dimensions)`;
  } catch (err) {
    results.step5_embedding = "FAIL: " + err.message;
  }

  return NextResponse.json(results);
}

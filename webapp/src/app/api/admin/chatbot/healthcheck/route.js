import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getGeminiClient, getChatbotSettings, logHealthCheck } from "@/lib/chatbot";
import { callOpenRouter } from "@/lib/openrouter";

/**
 * POST /api/admin/chatbot/healthcheck
 * Run health check against configured AI provider.
 * Sends a simple test question and verifies response.
 *
 * GET /api/admin/chatbot/healthcheck
 * Returns latest health check result.
 */

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const ac = createAdminClient();
  const { data: userData } = await ac.from("users").select("role").eq("id", user.id).single();
  if (!userData || userData.role !== "admin") return null;
  return user;
}

export async function POST() {
  try {
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const settings = await getChatbotSettings();
    const provider = settings.provider || "google";
    const modelName = settings.model_name || "gemini-3-flash-preview";
    const testMessage = "안녕하세요. 이 메시지는 API 상태 확인을 위한 테스트입니다. '정상 작동 중'이라고 짧게 답변해주세요.";
    const testPrompt = "당신은 테스트용 응답 봇입니다. 간단히 답변하세요.";

    const start = Date.now();
    let status = "ok";
    let errorMessage = null;

    try {
      if (provider === "google") {
        const ai = getGeminiClient();
        const result = await ai.models.generateContent({
          model: modelName,
          config: { maxOutputTokens: 50, temperature: 0.3, systemInstruction: testPrompt },
          contents: testMessage,
        });
        if (!result.text) throw new Error("Empty response from Gemini");
      } else if (provider === "openrouter") {
        const result = await callOpenRouter({
          model: modelName,
          systemPrompt: testPrompt,
          userMessage: testMessage,
          maxTokens: 50,
          temperature: 0.3,
        });
        if (!result) throw new Error("Empty response from OpenRouter");
      }
    } catch (err) {
      status = "error";
      errorMessage = err.message;
    }

    const latencyMs = Date.now() - start;

    // Log to DB
    await logHealthCheck({ provider, model: modelName, status, errorMessage, latencyMs });

    return NextResponse.json({
      status,
      provider,
      model: modelName,
      latency_ms: latencyMs,
      error_message: errorMessage,
      checked_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Health check error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const adminClient = createAdminClient();

    // Get latest health check
    const { data, error } = await adminClient
      .from("chatbot_health_checks")
      .select("*")
      .order("checked_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn("Health check read error:", error.message);
      return NextResponse.json({ latest: null });
    }

    return NextResponse.json({ latest: data });
  } catch (err) {
    console.error("GET healthcheck error:", err);
    return NextResponse.json({ latest: null });
  }
}

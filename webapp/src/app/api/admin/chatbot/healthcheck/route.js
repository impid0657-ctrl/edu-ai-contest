import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getChatbotSettings, logHealthCheck } from "@/lib/chatbot";
import { callOpenRouter } from "@/lib/openrouter";

/**
 * POST /api/admin/chatbot/healthcheck
 * Run health check against all AI providers (Gemini + OpenRouter).
 * Uses node:https for Gemini to bypass Next.js fetch patching.
 *
 * GET /api/admin/chatbot/healthcheck
 * Returns latest health check result.
 * If last check > 1 hour old, auto-triggers a new check.
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

/**
 * Gemini 테스트 호출 (node:https 사용)
 */
async function testGemini(model, apiKey) {
  const https = await import("node:https");
  const url = new URL(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`);
  const postData = JSON.stringify({
    contents: [{ role: "user", parts: [{ text: "say ok" }] }],
    generationConfig: { maxOutputTokens: 10 },
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
              const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || "";
              if (!text) reject(new Error("Empty Gemini response"));
              else resolve(text);
            } catch { reject(new Error("Invalid JSON from Gemini")); }
          } else {
            reject(new Error(`Gemini ${res.statusCode}: ${data.substring(0, 200)}`));
          }
        });
        res.on("error", reject);
      }
    );
    req.on("error", reject);
    req.setTimeout(10000, () => { req.destroy(new Error("Gemini timeout (10s)")); });
    req.write(postData);
    req.end();
  });
}

/**
 * 전체 헬스체크 실행 (Gemini 모델 2개 + OpenRouter)
 */
async function runFullHealthCheck() {
  const settings = await getChatbotSettings();
  const apiKey = process.env.GEMINI_API_KEY;
  const testPrompt = "테스트 봇입니다. 간단히 답변하세요.";
  const testMessage = "say ok";
  const start = Date.now();

  const results = {
    gemini_primary: { model: "gemini-2.5-flash-lite", status: "unknown", latency: 0, error: null },
    gemini_secondary: { model: "gemini-2.5-flash", status: "unknown", latency: 0, error: null },
    openrouter: { model: settings.fallback_model || "anthropic/claude-3.5-haiku", status: "unknown", latency: 0, error: null },
  };

  // 1. Gemini primary
  if (apiKey) {
    const t1 = Date.now();
    try {
      await testGemini("gemini-2.5-flash-lite", apiKey);
      results.gemini_primary.status = "ok";
      results.gemini_primary.latency = Date.now() - t1;
    } catch (e) {
      results.gemini_primary.status = "error";
      results.gemini_primary.error = e.message;
      results.gemini_primary.latency = Date.now() - t1;
    }

    // 2. Gemini secondary
    const t2 = Date.now();
    try {
      await testGemini("gemini-2.5-flash", apiKey);
      results.gemini_secondary.status = "ok";
      results.gemini_secondary.latency = Date.now() - t2;
    } catch (e) {
      results.gemini_secondary.status = "error";
      results.gemini_secondary.error = e.message;
      results.gemini_secondary.latency = Date.now() - t2;
    }
  } else {
    results.gemini_primary.status = "skipped";
    results.gemini_primary.error = "GEMINI_API_KEY not set";
    results.gemini_secondary.status = "skipped";
    results.gemini_secondary.error = "GEMINI_API_KEY not set";
  }

  // 3. OpenRouter
  const t3 = Date.now();
  try {
    const orResult = await callOpenRouter({
      model: results.openrouter.model,
      systemPrompt: testPrompt,
      userMessage: testMessage,
      maxTokens: 10,
      temperature: 0.3,
    });
    if (!orResult) throw new Error("Empty OpenRouter response");
    results.openrouter.status = "ok";
    results.openrouter.latency = Date.now() - t3;
  } catch (e) {
    results.openrouter.status = "error";
    results.openrouter.error = e.message;
    results.openrouter.latency = Date.now() - t3;
  }

  // 전체 상태 판단
  const overallStatus =
    results.gemini_primary.status === "ok" || results.gemini_secondary.status === "ok" || results.openrouter.status === "ok"
      ? "ok" : "error";

  const errorMessages = [
    results.gemini_primary.status !== "ok" ? `Gemini(lite): ${results.gemini_primary.error || results.gemini_primary.status}` : null,
    results.gemini_secondary.status !== "ok" ? `Gemini(flash): ${results.gemini_secondary.error || results.gemini_secondary.status}` : null,
    results.openrouter.status !== "ok" ? `OpenRouter: ${results.openrouter.error || results.openrouter.status}` : null,
  ].filter(Boolean).join("; ");

  const totalLatency = Date.now() - start;

  // DB 로그 저장 (graceful)
  try {
    await logHealthCheck({
      provider: "all",
      model: "cascade",
      status: overallStatus,
      errorMessage: overallStatus === "ok" ? null : errorMessages,
      latencyMs: totalLatency,
    });
  } catch (logErr) {
    console.warn("Health check log save failed:", logErr.message);
  }

  return {
    status: overallStatus,
    details: results,
    total_latency_ms: totalLatency,
    error_message: overallStatus === "ok" ? null : errorMessages,
    checked_at: new Date().toISOString(),
  };
}

export async function POST() {
  try {
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const result = await runFullHealthCheck();
    return NextResponse.json(result);
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

    // 최신 헬스체크 결과 가져오기
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

    // 마지막 체크가 1시간 이상 경과했으면 자동 체크 실행
    if (data) {
      const lastCheck = new Date(data.checked_at);
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
      if (lastCheck < hourAgo) {
        // 백그라운드로 자동 체크 (응답은 즉시 반환)
        runFullHealthCheck().catch(err => console.warn("Auto health check failed:", err.message));
      }
    } else {
      // 체크 이력 없으면 즉시 체크 (백그라운드)
      runFullHealthCheck().catch(err => console.warn("Initial health check failed:", err.message));
    }

    return NextResponse.json({ latest: data });
  } catch (err) {
    console.error("GET healthcheck error:", err);
    return NextResponse.json({ latest: null });
  }
}

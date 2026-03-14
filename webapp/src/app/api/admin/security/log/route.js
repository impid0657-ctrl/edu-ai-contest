import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/admin/security/log
 * 로그인 페이지에서 호출하는 전용 엔드포인트 (인증 불필요)
 * 로그인 성공/실패 이벤트만 기록
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { event_type, email } = body;

    if (!event_type || !["login_success", "login_fail"].includes(event_type)) {
      return NextResponse.json({ error: "Invalid event_type" }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";
    const userAgent = request.headers.get("user-agent") || "";

    const admin = createAdminClient();

    // 연속 실패 횟수 계산
    let severity = "info";
    let consecutiveFails = 0;

    if (event_type === "login_fail") {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data: recentFails } = await admin
        .from("admin_access_logs")
        .select("id")
        .eq("ip_address", ip)
        .eq("event_type", "login_fail")
        .gte("created_at", oneHourAgo);

      consecutiveFails = (recentFails?.length || 0) + 1;
      if (consecutiveFails >= 10) severity = "critical";
      else if (consecutiveFails >= 5) severity = "warning";
    }

    const { error: insertError } = await admin
      .from("admin_access_logs")
      .insert({
        event_type,
        ip_address: ip,
        user_agent: userAgent.slice(0, 500),
        email: email || null,
        path: "/login",
        severity,
        details: event_type === "login_fail"
          ? { consecutive_fails: consecutiveFails }
          : {},
      });

    if (insertError) {
      console.error("Security log error:", insertError.message);
      // 로그 실패해도 로그인 자체에는 영향 없도록
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    return NextResponse.json({ ok: true, severity });
  } catch (err) {
    console.error("POST /api/admin/security/log error:", err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

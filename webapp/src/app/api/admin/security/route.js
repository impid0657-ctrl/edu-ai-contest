import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/adminAuth";

/**
 * POST /api/admin/security/log
 * 보안 이벤트 기록 (로그인 성공/실패)
 * - 로그인 페이지에서 호출 (인증 불필요)
 * - 연속 실패 횟수에 따라 severity 자동 설정
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { event_type, email, path } = body;

    if (!event_type || !["login_success", "login_fail", "page_access"].includes(event_type)) {
      return NextResponse.json({ error: "Invalid event_type" }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";
    const userAgent = request.headers.get("user-agent") || "";

    const admin = createAdminClient();

    // 연속 실패 횟수 계산 (login_fail일 때만)
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

    // 로그 기록
    const { error: insertError } = await admin
      .from("admin_access_logs")
      .insert({
        event_type,
        ip_address: ip,
        user_agent: userAgent.slice(0, 500),
        email: email || null,
        path: path || null,
        severity,
        details: event_type === "login_fail"
          ? { consecutive_fails: consecutiveFails }
          : {},
      });

    if (insertError) {
      console.error("Security log insert error:", insertError.message);
      return NextResponse.json({ error: "Log failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, severity });
  } catch (err) {
    console.error("POST /api/admin/security/log error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/**
 * GET /api/admin/security
 * 보안 로그 조회 (관리자 전용)
 * Query params: event_type, severity, page, limit, ip, start_date, end_date
 */
export async function GET(request) {
  const { admin, error } = await verifyAdmin();
  if (error) return error;

  const url = new URL(request.url);
  const eventType = url.searchParams.get("event_type");
  const severity = url.searchParams.get("severity");
  const ip = url.searchParams.get("ip");
  const startDate = url.searchParams.get("start_date");
  const endDate = url.searchParams.get("end_date");
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 100);
  const offset = (page - 1) * limit;

  let query = admin
    .from("admin_access_logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (eventType) query = query.eq("event_type", eventType);
  if (severity) query = query.eq("severity", severity);
  if (ip) query = query.ilike("ip_address", `%${ip}%`);
  if (startDate) query = query.gte("created_at", startDate);
  if (endDate) query = query.lte("created_at", endDate);

  const { data, count, error: queryError } = await query;

  if (queryError) {
    console.error("Security log query error:", queryError.message);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  return NextResponse.json({ logs: data, total: count, page, limit });
}

/**
 * DELETE /api/admin/security
 * 90일 이상 된 로그 정리 (관리자 전용)
 */
export async function DELETE(request) {
  const { admin, error } = await verifyAdmin();
  if (error) return error;

  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error: delError } = await admin
    .from("admin_access_logs")
    .delete()
    .lt("created_at", cutoff)
    .select("id");

  if (delError) {
    return NextResponse.json({ error: delError.message }, { status: 500 });
  }

  return NextResponse.json({ deleted: data?.length || 0, cutoff_date: cutoff });
}

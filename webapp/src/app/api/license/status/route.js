import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/license/status?email=xxx@example.com
 * Public — no auth required. Returns license application status by email.
 * Searches both OAuth users (via users table) and guest applications (via applicant_email).
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email || email.trim() === "") {
      return NextResponse.json(
        { error: "이메일을 입력해주세요." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const adminClient = createAdminClient();

    // 1. users 테이블에서 이메일로 user_id 찾기 → license_applications 조회
    let app = null;
    try {
      const { data: userRow } = await adminClient
        .from("users")
        .select("id")
        .eq("email", normalizedEmail)
        .single();

      if (userRow) {
        const { data: userApps } = await adminClient
          .from("license_applications")
          .select("status, category, team_name, created_at")
          .eq("user_id", userRow.id)
          .is("deleted_at", null)
          .order("created_at", { ascending: false })
          .limit(1);

        if (userApps && userApps.length > 0) {
          app = userApps[0];
        }
      }
    } catch { /* users 조회 실패 시 무시 */ }

    // 2. applicant_email로 검색 (게스트/직접 입력 이메일)
    if (!app) {
      const { data: emailApps } = await adminClient
        .from("license_applications")
        .select("status, category, team_name, created_at")
        .eq("applicant_email", normalizedEmail)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(1);

      if (emailApps && emailApps.length > 0) {
        app = emailApps[0];
      }
    }

    if (!app) {
      return NextResponse.json({ application: null });
    }

    return NextResponse.json({
      application: {
        status: app.status,
        category: app.category,
        team_name: app.team_name,
        created_at: app.created_at,
      },
    });
  } catch (err) {
    console.error("GET /api/license/status error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

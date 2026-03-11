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

    // 1. OAuth 사용자 조회 (users 테이블 JOIN)
    let app = null;
    const { data: oauthApps } = await adminClient
      .from("license_applications")
      .select("status, category, team_name, created_at, users!inner(email)")
      .eq("users.email", normalizedEmail)
      .order("created_at", { ascending: false })
      .limit(1);

    if (oauthApps && oauthApps.length > 0) {
      app = oauthApps[0];
    }

    // 2. 게스트(학교이메일/학생증) 조회 (applicant_email 직접 검색)
    if (!app) {
      const { data: guestApps } = await adminClient
        .from("license_applications")
        .select("status, category, team_name, created_at")
        .eq("applicant_email", normalizedEmail)
        .is("user_id", null)
        .order("created_at", { ascending: false })
        .limit(1);

      if (guestApps && guestApps.length > 0) {
        app = guestApps[0];
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

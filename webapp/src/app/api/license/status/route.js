import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/license/status?email=xxx@example.com
 * Public — no auth required. Returns license application status by email.
 * Only returns status, category, date — no sensitive info.
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

    const adminClient = createAdminClient();

    // Find application by email via users table join
    const { data: applications, error } = await adminClient
      .from("license_applications")
      .select("status, category, team_name, created_at, users!inner(email)")
      .eq("users.email", email.trim())
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("License status query error:", error.message);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    if (!applications || applications.length === 0) {
      return NextResponse.json({ application: null });
    }

    const app = applications[0];
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

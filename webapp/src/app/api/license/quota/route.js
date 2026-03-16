import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const LICENSE_QUOTA = 800;

/**
 * GET /api/license/quota
 * 현재 이용권 신청 현황 반환 (마감 여부 확인용)
 */
export async function GET() {
  try {
    const adminClient = createAdminClient();
    const { count, error } = await adminClient
      .from("license_applications")
      .select("id", { count: "exact", head: true })
      .neq("status", "rejected");

    if (error) {
      return NextResponse.json({ error: "Failed to check quota" }, { status: 500 });
    }

    return NextResponse.json({
      total: LICENSE_QUOTA,
      used: count || 0,
      remaining: Math.max(0, LICENSE_QUOTA - (count || 0)),
      closed: (count || 0) >= LICENSE_QUOTA,
    });
  } catch (err) {
    console.error("GET /api/license/quota error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

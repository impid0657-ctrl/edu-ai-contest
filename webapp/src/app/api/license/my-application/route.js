import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/license/my-application
 * OAuth 사용자의 기존 신청 조회
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ application: null });

    const admin = createAdminClient();
    const { data: application } = await admin
      .from("license_applications")
      .select("id, status, category, team_name, created_at")
      .eq("user_id", user.id)
      .neq("status", "rejected")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return NextResponse.json({ application: application || null });
  } catch (err) {
    console.error("GET /api/license/my-application error:", err);
    return NextResponse.json({ application: null });
  }
}

/**
 * DELETE /api/license/my-application
 * 반려된 내 신청서를 DB에서 완전 삭제 (재신청 가능하도록)
 * - OAuth 유저: user_id 기반
 * - 비회원: email query param 기반
 */
export async function DELETE(request) {
  try {
    const supabase = await createClient();
    const admin = createAdminClient();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    // OAuth 사용자 확인
    const { data: { user } } = await supabase.auth.getUser();

    let query;

    if (user) {
      // OAuth 유저 — user_id 기반
      query = admin
        .from("license_applications")
        .delete()
        .eq("user_id", user.id)
        .eq("status", "rejected"); // 반려된 건만 삭제 가능
    } else if (email) {
      // 비회원 — email 기반
      query = admin
        .from("license_applications")
        .delete()
        .eq("applicant_email", email.trim().toLowerCase())
        .is("user_id", null)
        .eq("status", "rejected"); // 반려된 건만 삭제 가능
    } else {
      return NextResponse.json({ error: "인증 정보가 없습니다." }, { status: 401 });
    }

    const { error, count } = await query;

    if (error) {
      console.error("Delete rejected application error:", error.message);
      return NextResponse.json({ error: "삭제에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({
      message: "반려된 신청서가 삭제되었습니다. 재신청이 가능합니다.",
      deleted: true,
    });
  } catch (err) {
    console.error("DELETE /api/license/my-application error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

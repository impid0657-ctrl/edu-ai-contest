import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTestEmail, clearEmailSettingsCache } from "@/lib/email";

/**
 * POST /api/admin/email-test
 * 테스트 이메일 발송
 */
export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: profile } = await createAdminClient()
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { to } = body;

    if (!to || !to.trim()) {
      return NextResponse.json({ error: "수신 이메일을 입력해주세요." }, { status: 400 });
    }

    // 캐시 초기화 후 테스트 (방금 저장한 설정 반영)
    clearEmailSettingsCache();

    await sendTestEmail({ to: to.trim() });

    return NextResponse.json({ success: true, message: "테스트 이메일이 발송되었습니다." });
  } catch (err) {
    console.error("Email test error:", err.message);
    return NextResponse.json({ error: err.message || "이메일 발송에 실패했습니다." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/admin/ai-review/pre-screening
 * 사전규격 심사 — 자동화된 규격 검증
 *
 * Body: { submission_ids?: string[] }
 */

const VALID_CATEGORIES = ["elementary", "secondary", "general"];
const MAX_FILE_SIZE = 500 * 1024 * 1024;
const MIN_DESC_LENGTH = 50;

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { data: userData } = await createAdminClient().from("users").select("role").eq("id", user.id).single();
    if (!userData || userData.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { submission_ids } = body;
    const adminClient = createAdminClient();

    let query = adminClient
      .from("submissions")
      .select("id, submission_no, title, description, category, contact_email, contact_phone, submission_files(id, file_name, file_size)")
      .in("review_stage", ["none"]);

    if (submission_ids?.length > 0) query = query.in("id", submission_ids);

    const { data: submissions, error: fetchError } = await query;

    if (fetchError) {
      console.error("Pre-screening fetch error:", fetchError.message);
      return NextResponse.json({ error: "작품 조회 실패" }, { status: 500 });
    }

    if (!submissions?.length) {
      return NextResponse.json({ processed: 0, passed: 0, failed: 0, message: "사전규격 심사 대상이 없습니다." });
    }

    let passed = 0, failed = 0;

    for (const sub of submissions) {
      const checks = [
        {
          key: "has_title", label: "작품 제목",
          passed: !!(sub.title?.trim()),
          detail: sub.title || "제목 없음",
        },
        {
          key: "has_description", label: "작품 설명 (50자 이상)",
          passed: (sub.description || "").trim().length >= MIN_DESC_LENGTH,
          detail: `${(sub.description || "").trim().length}자`,
        },
        {
          key: "has_files", label: "파일 첨부",
          passed: (sub.submission_files?.length || 0) >= 1,
          detail: `${sub.submission_files?.length || 0}개`,
        },
        {
          key: "valid_category", label: "부문 적합성",
          passed: VALID_CATEGORIES.includes(sub.category),
          detail: sub.category || "미선택",
        },
        {
          key: "has_contact", label: "연락처 정보",
          passed: !!(sub.contact_email || sub.contact_phone),
          detail: sub.contact_email || sub.contact_phone || "없음",
        },
        {
          key: "file_size_ok", label: "파일 용량 (500MB 이하)",
          passed: (sub.submission_files || []).reduce((s, f) => s + (f.file_size || 0), 0) <= MAX_FILE_SIZE,
          detail: `${((sub.submission_files || []).reduce((s, f) => s + (f.file_size || 0), 0) / 1024 / 1024).toFixed(1)}MB`,
        },
      ];

      const allPassed = checks.every((c) => c.passed);

      await adminClient.from("submissions").update({
        review_stage: allPassed ? "pre_screening_pass" : "pre_screening_fail",
        pre_screening_result: {
          checks,
          passed: allPassed,
          failed_count: checks.filter((c) => !c.passed).length,
          total_count: checks.length,
          reviewed_at: new Date().toISOString(),
        },
      }).eq("id", sub.id);

      if (allPassed) passed++; else failed++;
    }

    return NextResponse.json({
      processed: submissions.length, passed, failed,
      message: `사전규격 심사 완료: ${passed}건 통과, ${failed}건 탈락`,
    });
  } catch (err) {
    console.error("POST pre-screening error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

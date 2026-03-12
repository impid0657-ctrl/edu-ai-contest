import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const VALID_CATEGORIES = ["elementary", "secondary", "general"];
const VALID_REGIONS = [
  "서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시", "대전광역시", "울산광역시",
  "세종특별자치시", "경기도", "강원특별자치도", "충청북도", "충청남도", "전북특별자치도",
  "전라남도", "경상북도", "경상남도", "제주특별자치도"
];

/**
 * POST /api/license/apply
 * OAuth 인증 사용자 (카카오 등) 이용권 신청
 */
export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 자동 프로필 생성
    const admin = createAdminClient();
    const { data: existingProfile } = await admin
      .from("users").select("id").eq("id", user.id).maybeSingle();

    if (!existingProfile) {
      const meta = user.user_metadata || {};
      await admin.from("users").upsert({
        id: user.id,
        email: user.email || meta.email || "",
        name: meta.full_name || meta.name || meta.preferred_username || "사용자",
        role: "user",
      }, { onConflict: "id" });
    }

    const body = await request.json();
    const {
      category, team_name, school_name, grade, member_count, phone, motivation,
      auth_method, birth_year, representative_name, member1_name, member2_name,
      topic, region, privacy_agreed, third_party_agreed, applicant_name,
      teacher_name, teacher_email, teacher_phone,
    } = body;

    // ── Validation ──
    if (!category || !VALID_CATEGORIES.includes(category))
      return NextResponse.json({ error: "유효하지 않은 참가 부문입니다." }, { status: 400 });
    if (!birth_year || !birth_year.trim())
      return NextResponse.json({ error: "출생연도는 필수 입력 항목입니다." }, { status: 400 });
    if (!phone || !phone.trim())
      return NextResponse.json({ error: "휴대폰번호는 필수 입력 항목입니다." }, { status: 400 });
    if (!representative_name || !representative_name.trim())
      return NextResponse.json({ error: "대표자명은 필수 입력 항목입니다." }, { status: 400 });
    if (!topic || !topic.trim())
      return NextResponse.json({ error: "주제는 필수 입력 항목입니다." }, { status: 400 });
    if (!region || !VALID_REGIONS.includes(region))
      return NextResponse.json({ error: "유효하지 않은 지역입니다." }, { status: 400 });
    if (!privacy_agreed || !third_party_agreed)
      return NextResponse.json({ error: "개인정보 동의는 필수입니다." }, { status: 400 });

    if (category !== "general") {
      if (!school_name || !school_name.trim())
        return NextResponse.json({ error: "학교명은 필수 입력 항목입니다." }, { status: 400 });
      if (!grade || !grade.trim())
        return NextResponse.json({ error: "학년은 필수 입력 항목입니다." }, { status: 400 });
    }

    const memberCount = parseInt(member_count, 10) || 1;
    if (memberCount < 1 || memberCount > 3)
      return NextResponse.json({ error: "팀원 수는 1~3명이어야 합니다." }, { status: 400 });

    // Duplicate check
    const { data: existing } = await supabase
      .from("license_applications").select("id, status")
      .eq("user_id", user.id).neq("status", "rejected").maybeSingle();

    if (existing)
      return NextResponse.json({ error: "이미 신청서가 존재합니다" }, { status: 409 });

    const now = new Date().toISOString();
    const baseData = {
      user_id: user.id,
      category,
      team_name: team_name || null,
      school_name: school_name || null,
      grade: grade || null,
      member_count: memberCount,
      phone: phone.trim(),
      motivation: motivation ? motivation.slice(0, 500) : null,
      auth_method: auth_method || "kakao",
      applicant_name: applicant_name || null,
    };

    // 확장 필드 (migration 015 적용 시에만 사용 가능)
    const extendedFields = {
      birth_year: birth_year ? birth_year.trim() : null,
      representative_name: representative_name ? representative_name.trim() : null,
      member1_name: member1_name || null,
      member2_name: member2_name || null,
      topic: topic ? topic.trim() : null,
      region: region || null,
      teacher_name: category === "elementary" ? (teacher_name ? teacher_name.trim() : null) : null,
      teacher_email: category === "elementary" ? (teacher_email ? teacher_email.trim() : null) : null,
      teacher_phone: category === "elementary" ? (teacher_phone ? teacher_phone.trim() : null) : null,
      privacy_agreed_at: now,
      third_party_agreed_at: now,
    };

    // 확장 필드 포함하여 시도 → 실패 시 기본 필드만으로 재시도
    let insertData = { ...baseData, ...extendedFields };
    let { data: application, error: insertError } = await admin
      .from("license_applications")
      .insert(insertData)
      .select("id, status, created_at")
      .single();

    if (insertError && insertError.message && insertError.message.includes("schema cache")) {
      console.warn("Extended fields not in DB, retrying with base fields only:", insertError.message);
      insertData = baseData;
      const retry = await admin
        .from("license_applications")
        .insert(insertData)
        .select("id, status, created_at")
        .single();
      application = retry.data;
      insertError = retry.error;
    }

    if (insertError) {
      console.error("License application insert error:", insertError.message, insertError.details, insertError.code);
      if (insertError.code === "23505") {
        return NextResponse.json({ error: "이미 이용권 신청이 접수되어 있습니다." }, { status: 409 });
      }
      if (insertError.code === "23514") {
        return NextResponse.json({ error: `입력값 검증 실패: ${insertError.message}` }, { status: 400 });
      }
      return NextResponse.json({ error: `신청서 제출에 실패했습니다. (${insertError.message})` }, { status: 500 });
    }

    // 이력 기록
    try {
      await admin.from("license_application_history").insert({
        application_id: application.id,
        changed_by: user.email || user.id,
        change_type: "create",
        old_data: null,
        new_data: insertData,
        changed_fields: Object.keys(insertData),
      });
    } catch { /* 이력 기록 실패해도 신청 성공 유지 */ }

    return NextResponse.json({ application }, { status: 201 });
  } catch (err) {
    console.error("POST /api/license/apply error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

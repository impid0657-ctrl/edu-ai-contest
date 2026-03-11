import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/license/apply
 * Submit a new license application.
 * Status is always 'pending' — NEVER auto-approve (doc 12.2).
 */
export async function POST(request) {
  try {
    const supabase = await createClient();

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // OAuth 사용자(카카오/네이버)는 users 테이블에 프로필이 없을 수 있음 → 자동 생성
    const admin = createAdminClient();
    const { data: existingProfile } = await admin
      .from("users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!existingProfile) {
      const meta = user.user_metadata || {};
      await admin.from("users").upsert({
        id: user.id,
        email: user.email || meta.email || "",
        name: meta.full_name || meta.name || meta.preferred_username || "사용자",
        role: "user",
      }, { onConflict: "id" });
      console.log(`[license] Auto-created user profile for: ${user.email}`);
    }

    const body = await request.json();
    const { category, team_name, school_name, grade, member_count, phone, motivation, auth_method } = body;

    // Validation: category
    if (!category || !["elementary", "secondary", "general"].includes(category)) {
      return NextResponse.json(
        { error: "유효하지 않은 참가 부문입니다." },
        { status: 400 }
      );
    }

    // Validation: conditional fields
    if (category !== "general") {
      if (!school_name || school_name.trim() === "") {
        return NextResponse.json(
          { error: "학교명은 필수 입력 항목입니다." },
          { status: 400 }
        );
      }
      if (!grade || grade.trim() === "") {
        return NextResponse.json(
          { error: "학년은 필수 입력 항목입니다." },
          { status: 400 }
        );
      }
    }

    // Validation: member_count
    const memberCount = parseInt(member_count, 10) || 1;
    if (memberCount < 1 || memberCount > 4) {
      return NextResponse.json(
        { error: "팀원 수는 1~4명이어야 합니다." },
        { status: 400 }
      );
    }

    // Validation: phone
    if (!phone || phone.trim() === "") {
      return NextResponse.json(
        { error: "연락처는 필수 입력 항목입니다." },
        { status: 400 }
      );
    }

    // Duplicate check
    const { data: existing } = await supabase
      .from("license_applications")
      .select("id, status")
      .eq("user_id", user.id)
      .neq("status", "rejected")
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "이미 신청서가 존재합니다" },
        { status: 409 }
      );
    }

    // Insert application — always pending
    const { data: application, error: insertError } = await supabase
      .from("license_applications")
      .insert({
        user_id: user.id,
        category,
        team_name: team_name || null,
        school_name: school_name || null,
        grade: grade || null,
        member_count: memberCount,
        phone: phone.trim(),
        motivation: motivation ? motivation.slice(0, 500) : null,
        auth_method: auth_method || "kakao",
      })
      .select("id, status, created_at")
      .single();

    if (insertError) {
      console.error("License application insert error:", insertError.message);
      return NextResponse.json(
        { error: "신청서 제출에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ application }, { status: 201 });
  } catch (err) {
    console.error("POST /api/license/apply error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

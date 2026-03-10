import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rateLimit";

const limiter = rateLimit({ interval: 60_000, limit: 5 });

/**
 * POST /api/license/apply-guest
 * License application for non-account users (school email OTP verified).
 *
 * Flow:
 *   1. Student verifies school email via OTP (/api/school-email/send-otp → verify-otp)
 *   2. After OTP success, student fills out license form
 *   3. This API validates that the email was recently OTP-verified, then creates the application
 *
 * No Supabase auth required — verified email is the identity proof.
 *
 * Body:
 *   applicant_email: string (required) — OTP-verified school email
 *   applicant_name: string (required) — student name
 *   auth_method: "school_email" (required)
 *   category: "elementary" | "secondary" | "general" (required)
 *   school_name: string (required for elementary/secondary)
 *   grade: string (required for elementary/secondary)
 *   team_name: string (optional)
 *   member_count: number 1-4 (optional, default 1)
 *   phone: string (required)
 *   motivation: string (optional, max 500 chars)
 */
export async function POST(request) {
  try {
    // Rate limit
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = limiter.check(ip);
    if (!success) {
      return NextResponse.json({ error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." }, { status: 429 });
    }

    const body = await request.json();
    const {
      applicant_email,
      applicant_name,
      auth_method,
      category,
      school_name,
      grade,
      team_name,
      member_count,
      phone,
      motivation,
    } = body;

    // ── Validation ──

    if (!applicant_email || !applicant_email.trim()) {
      return NextResponse.json({ error: "이메일은 필수입니다." }, { status: 400 });
    }

    if (!applicant_name || !applicant_name.trim()) {
      return NextResponse.json({ error: "이름은 필수입니다." }, { status: 400 });
    }

    if (!auth_method || !["school_email", "student_direct"].includes(auth_method)) {
      return NextResponse.json({ error: "유효하지 않은 인증 방법입니다." }, { status: 400 });
    }

    if (!category || !["elementary", "secondary", "general"].includes(category)) {
      return NextResponse.json({ error: "유효하지 않은 참가 부문입니다." }, { status: 400 });
    }

    if (category !== "general") {
      if (!school_name || !school_name.trim()) {
        return NextResponse.json({ error: "학교명은 필수 입력 항목입니다." }, { status: 400 });
      }
      if (!grade || !grade.trim()) {
        return NextResponse.json({ error: "학년은 필수 입력 항목입니다." }, { status: 400 });
      }
    }

    const memberCount = parseInt(member_count, 10) || 1;
    if (memberCount < 1 || memberCount > 4) {
      return NextResponse.json({ error: "팀원 수는 1~4명이어야 합니다." }, { status: 400 });
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json({ error: "연락처는 필수 입력 항목입니다." }, { status: 400 });
    }

    const normalizedEmail = applicant_email.trim().toLowerCase();
    const adminClient = createAdminClient();

    // ── Verify authentication based on method ──

    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

    if (auth_method === "school_email") {
      // OTP 인증 확인 (30분 내)
      const { data: otpRecord, error: otpError } = await adminClient
        .from("school_email_verifications")
        .select("id, email, verified")
        .eq("email", normalizedEmail)
        .eq("verified", true)
        .gte("created_at", thirtyMinAgo)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (otpError || !otpRecord) {
        return NextResponse.json(
          { error: "이메일 인증이 완료되지 않았거나 만료되었습니다. 다시 인증해주세요." },
          { status: 403 }
        );
      }
    } else if (auth_method === "student_direct") {
      // 학생증 업로드 확인 (30분 내 제출 기록)
      const { data: studentRecord, error: studentError } = await adminClient
        .from("student_verifications")
        .select("id, email")
        .eq("email", normalizedEmail)
        .gte("created_at", thirtyMinAgo)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (studentError || !studentRecord) {
        return NextResponse.json(
          { error: "학생증 인증이 완료되지 않았거나 만료되었습니다. 다시 인증해주세요." },
          { status: 403 }
        );
      }
    }

    // ── Duplicate check ──

    const { data: existing } = await adminClient
      .from("license_applications")
      .select("id, status")
      .eq("applicant_email", normalizedEmail)
      .is("user_id", null)
      .neq("status", "rejected")
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "이미 이용권 신청이 접수되어 있습니다." },
        { status: 409 }
      );
    }

    // ── Insert application ──

    const { data: application, error: insertError } = await adminClient
      .from("license_applications")
      .insert({
        user_id: null,
        applicant_name: applicant_name.trim(),
        applicant_email: normalizedEmail,
        auth_method,
        category,
        team_name: team_name || null,
        school_name: school_name || null,
        grade: grade || null,
        member_count: memberCount,
        phone: phone.trim(),
        motivation: motivation ? motivation.slice(0, 500) : null,
        status: "pending",
      })
      .select("id, status, created_at")
      .single();

    if (insertError) {
      console.error("Guest license application insert error:", insertError.message);
      return NextResponse.json(
        { error: "이용권 신청에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ application }, { status: 201 });
  } catch (err) {
    console.error("POST /api/license/apply-guest error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

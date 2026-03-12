import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/school-email/upload-student-id
 * Upload student ID image when OTP verification fails 3+ times.
 * Creates a student_verifications record for admin manual review.
 * No auth required (student couldn't authenticate — that's the whole point).
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const email = formData.get("email");
    const schoolName = formData.get("school_name");

    if (!file || !email) {
      return NextResponse.json(
        { error: "파일과 이메일을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    // Validate file
    const maxSizeMb = 5;
    if (file.size > maxSizeMb * 1024 * 1024) {
      return NextResponse.json(
        { error: `파일 크기는 ${maxSizeMb}MB를 초과할 수 없습니다.` },
        { status: 400 }
      );
    }

    const allowedExtensions = ["jpg", "jpeg", "png", "pdf"];
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { error: "jpg, png, pdf 파일만 업로드 가능합니다." },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Check for existing pending verification
    const { data: existing } = await adminClient
      .from("student_verifications")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .eq("status", "pending")
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "이미 학생증 인증 요청이 접수되어 있습니다. 관리자 확인을 기다려주세요." },
        { status: 409 }
      );
    }

    // Upload to Supabase Storage
    const safeFileName = `student-id-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const storagePath = `student-ids/${safeFileName}`;

    const fileBuffer = await file.arrayBuffer();
    const { error: uploadError } = await adminClient.storage
      .from("contest-files")
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Student ID upload error:", uploadError.message);
      return NextResponse.json(
        { error: "파일 업로드에 실패했습니다." },
        { status: 500 }
      );
    }

    // Create student_verifications record
    const { error: insertError } = await adminClient
      .from("student_verifications")
      .insert({
        email: email.trim().toLowerCase(),
        student_id_file_path: storagePath,
        school_name: schoolName || null,
        status: "pending",
      });

    if (insertError) {
      console.error("Student verification insert error:", insertError.message);
      return NextResponse.json(
        { error: "인증 요청 등록에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "학생증이 제출되었습니다. 구독권 이용대상 선정여부는 검토 후 이메일로 개별연락 드릴 예정입니다.",
    });
  } catch (err) {
    console.error("POST /api/school-email/upload-student-id error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

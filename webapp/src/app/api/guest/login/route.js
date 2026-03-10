import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { issueGuestToken } from "@/lib/guestAuth";

/**
 * POST /api/guest/login
 * Guest login using submission_no + email + password.
 * Returns guest JWT for subsequent edit operations.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { submission_no, email, password } = body;

    if (!submission_no || !email || !password) {
      return NextResponse.json(
        { error: "접수번호, 이메일, 비밀번호를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Query submission by submission_no + contact_email
    const { data: submission, error: queryError } = await adminClient
      .from("submissions")
      .select("id, submission_no, title, status, password_hash, contact_email")
      .eq("submission_no", submission_no.trim())
      .eq("contact_email", email.trim())
      .maybeSingle();

    if (queryError || !submission) {
      return NextResponse.json(
        { error: "인증에 실패했습니다" },
        { status: 401 }
      );
    }

    // Verify password with bcryptjs
    const isMatch = await bcrypt.compare(password, submission.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "인증에 실패했습니다" },
        { status: 401 }
      );
    }

    // Issue guest JWT
    const token = issueGuestToken({
      submission_id: submission.id,
      submission_no: submission.submission_no,
      email: submission.contact_email,
    });

    return NextResponse.json({
      token,
      submission: {
        id: submission.id,
        title: submission.title,
        status: submission.status,
      },
    });
  } catch (err) {
    console.error("POST /api/guest/login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

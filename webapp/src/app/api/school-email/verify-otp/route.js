import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerClient } from "@/lib/supabase/server";

/**
 * POST /api/school-email/verify-otp
 * Verifies OTP code. On success, creates Supabase auth user.
 * On 3+ failures, returns failedAttempts count for client-side fallback UI.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: "이메일과 인증번호를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const adminClient = createAdminClient();

    // Find the latest unexpired OTP for this email
    const { data: otpRecord, error: fetchError } = await adminClient
      .from("school_email_verifications")
      .select("*")
      .eq("email", normalizedEmail)
      .eq("verified", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError || !otpRecord) {
      return NextResponse.json(
        { error: "인증번호가 만료되었거나 존재하지 않습니다. 다시 발송해주세요." },
        { status: 401 }
      );
    }

    // Check attempts
    if (otpRecord.attempts >= 5) {
      return NextResponse.json(
        { error: "인증 시도 횟수를 초과했습니다. 학생증 업로드를 이용해주세요.", failedAttempts: otpRecord.attempts },
        { status: 429 }
      );
    }

    // Increment attempt count
    await adminClient
      .from("school_email_verifications")
      .update({ attempts: otpRecord.attempts + 1 })
      .eq("id", otpRecord.id);

    // Verify OTP
    if (otpRecord.otp_code !== otp.trim()) {
      const newAttempts = otpRecord.attempts + 1;
      return NextResponse.json(
        {
          error: "인증번호가 올바르지 않습니다.",
          failedAttempts: newAttempts,
        },
        { status: 401 }
      );
    }

    // Mark as verified
    await adminClient
      .from("school_email_verifications")
      .update({ verified: true })
      .eq("id", otpRecord.id);

    // Create or sign-in Supabase auth user with email
    // Using admin API to create magic link or OTP-based user
    const { data: signInData, error: signInError } = await adminClient.auth.admin.generateLink({
      type: "magiclink",
      email: normalizedEmail,
      options: {
        data: { auth_method: "school_email" },
      },
    });

    if (signInError) {
      console.error("Auth user creation error:", signInError.message);
      // OTP is verified even if auth creation fails
      return NextResponse.json({ verified: true, authError: true });
    }

    return NextResponse.json({
      verified: true,
      // The client will use the session from Supabase
    });
  } catch (err) {
    console.error("POST /api/school-email/verify-otp error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

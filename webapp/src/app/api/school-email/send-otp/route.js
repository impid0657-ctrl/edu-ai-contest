import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOTPEmail } from "@/lib/email";

/**
 * POST /api/school-email/send-otp
 * Validates school email domain, generates 6-digit OTP,
 * stores in DB (TTL 5 min), sends via shared email utility.
 *
 * Phase 1 fix: removed duplicate Resend init — now uses lib/email.js#sendOTPEmail()
 */

const ALLOWED_DOMAINS = [".ac.kr", ".hs.kr", ".ms.kr", ".es.kr"];

// 테스트용 이메일 화이트리스트 (도메인 체크 바이패스)
const TEST_WHITELIST = ["min_0657@naver.com"];

function isSchoolEmail(email) {
  const lower = email.toLowerCase();
  if (TEST_WHITELIST.includes(lower)) return true;
  return ALLOWED_DOMAINS.some((domain) => lower.endsWith(domain));
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "이메일을 입력해주세요." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!isSchoolEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: "학교 이메일(*.ac.kr, *.hs.kr, *.ms.kr, *.es.kr)만 사용 가능합니다." },
        { status: 400 }
      );
    }

    // Rate limit: max 5 OTPs per email within 10 minutes
    const adminClient = createAdminClient();
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await adminClient
      .from("school_email_verifications")
      .select("id", { count: "exact", head: true })
      .eq("email", normalizedEmail)
      .gte("created_at", tenMinAgo);

    if (count && count >= 5) {
      return NextResponse.json(
        { error: "너무 많은 인증 요청입니다. 10분 후 다시 시도해주세요." },
        { status: 429 }
      );
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Insert OTP record
    const { error: insertError } = await adminClient
      .from("school_email_verifications")
      .insert({
        email: normalizedEmail,
        otp_code: otpCode,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error("OTP insert error:", insertError.message);
      return NextResponse.json({ error: "인증번호 생성에 실패했습니다." }, { status: 500 });
    }

    // Send email via shared email utility (no duplicate Resend init)
    await sendOTPEmail({ to: normalizedEmail, otpCode });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/school-email/send-otp error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

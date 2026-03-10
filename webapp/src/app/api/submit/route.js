import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateSubmissionNo } from "@/lib/utils";
import { isDeadlinePassed } from "@/lib/dateUtils";
import { sendSubmissionConfirmation } from "@/lib/email";
import { rateLimit, getClientIP } from "@/lib/rateLimit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const submitLimiter = rateLimit({ interval: 60_000, limit: 5 });

/**
 * Check deadline from DB (site_settings table) first, env var as fallback.
 */
async function checkDeadline() {
  try {
    const adminClient = createAdminClient();
    const { data } = await adminClient
      .from("site_settings")
      .select("value")
      .eq("key", "contest_deadline")
      .single();

    if (data?.value) {
      // value is stored as JSON string, e.g. '"2026-05-31T23:59:59+09:00"'
      const deadlineStr = typeof data.value === "string" ? data.value : JSON.stringify(data.value);
      return isDeadlinePassed(deadlineStr.replace(/"/g, ""));
    }
  } catch {
    // DB not available or table doesn't exist yet — fall through to env var
  }
  return isDeadlinePassed(); // falls back to CONTEST_DEADLINE_KST env var
}

/**
 * POST /api/submit
 * Universal submission endpoint — no auth required.
 * Everyone enters their info + password → gets submission_no + JWT token.
 * This is the ONLY submission endpoint (guest/submit merged here).
 */
export async function POST(request) {
  try {
    // Rate limit
    const ip = getClientIP(request);
    const { success } = submitLimiter.check(ip);
    if (!success) {
      return NextResponse.json({ error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." }, { status: 429 });
    }

    // Deadline check (DB first, env var fallback)
    if (await checkDeadline()) {
      return NextResponse.json(
        { error: "접수가 마감되었습니다." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      team_name,
      contact_name,
      contact_email,
      contact_phone,
      password,
    } = body;

    // Validation
    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "작품 제목은 필수입니다." }, { status: 400 });
    }
    if (!category || !["elementary", "secondary", "general"].includes(category)) {
      return NextResponse.json({ error: "유효하지 않은 참가 부문입니다." }, { status: 400 });
    }
    if (!contact_name || contact_name.trim() === "") {
      return NextResponse.json({ error: "이름은 필수입니다." }, { status: 400 });
    }
    if (!contact_email || contact_email.trim() === "") {
      return NextResponse.json({ error: "연락 이메일은 필수입니다." }, { status: 400 });
    }
    if (!password || password.length < 4) {
      return NextResponse.json({ error: "비밀번호는 4자 이상이어야 합니다." }, { status: 400 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    const adminClient = createAdminClient();

    // Generate submission number with retry on collision
    let submissionNo;
    let retries = 0;
    while (retries < 5) {
      submissionNo = generateSubmissionNo();
      const { data: existing } = await adminClient
        .from("submissions")
        .select("id")
        .eq("submission_no", submissionNo)
        .maybeSingle();
      if (!existing) break;
      retries++;
    }

    // Insert submission (user_id = NULL — no auth)
    const { data: submission, error: insertError } = await adminClient
      .from("submissions")
      .insert({
        user_id: null,
        submission_no: submissionNo,
        title: title.trim(),
        description: description ? description.slice(0, 1000) : null,
        category,
        team_name: team_name || null,
        contact_name: contact_name.trim(),
        contact_email: contact_email.trim(),
        contact_phone: contact_phone || null,
        password_hash: passwordHash,
      })
      .select("id, submission_no, status")
      .single();

    if (insertError) {
      console.error("Submission insert error:", insertError.message);
      return NextResponse.json({ error: "작품 접수에 실패했습니다." }, { status: 500 });
    }

    // Send confirmation email (non-blocking)
    try {
      await sendSubmissionConfirmation({
        to: contact_email.trim(),
        submissionNo: submission.submission_no,
        title: title.trim(),
      });
    } catch (emailErr) {
      console.error("Confirmation email failed:", emailErr.message);
    }

    // Issue JWT token for file uploads + later lookup/edit
    const jwtSecret = process.env.GUEST_JWT_SECRET;
    if (!jwtSecret) {
      console.error("GUEST_JWT_SECRET not configured");
      return NextResponse.json(
        { submission },
        { status: 201 }
      );
    }

    const token = jwt.sign(
      {
        submission_id: submission.id,
        submission_no: submission.submission_no,
        email: contact_email.trim(),
      },
      jwtSecret,
      { algorithm: "HS256", expiresIn: "2h" }
    );

    return NextResponse.json({ submission, token }, { status: 201 });
  } catch (err) {
    console.error("POST /api/submit error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

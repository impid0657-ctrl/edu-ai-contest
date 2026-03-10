import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/settings/auth-providers
 * Public API — returns which auth methods are enabled.
 * No auth required. Used by /license-apply page to show/hide auth buttons.
 *
 * Response:
 *   { auth_providers: { kakao: true, naver: true, school_email: true, student_direct: true } }
 *
 * If admin toggles off "naver" in /admin/settings,
 * this API returns { ..., naver: false } and frontend hides the naver button.
 */
export async function GET() {
  try {
    const adminClient = createAdminClient();

    const { data: chatSettings, error } = await adminClient
      .from("chatbot_settings")
      .select("auth_providers")
      .limit(1)
      .single();

    if (error || !chatSettings) {
      // Fallback: all enabled
      return NextResponse.json({
        auth_providers: {
          kakao: true,
          naver: true,
          school_email: true,
          student_direct: true,
        },
      });
    }

    const providers = chatSettings.auth_providers || {};

    return NextResponse.json({
      auth_providers: {
        kakao: providers.kakao ?? true,
        naver: providers.naver ?? true,
        school_email: providers.school_email ?? true,
        student_direct: providers.student_direct ?? true,
      },
    });
  } catch (err) {
    console.error("GET /api/settings/auth-providers error:", err);
    // Fail-open: show all buttons rather than blocking users
    return NextResponse.json({
      auth_providers: {
        kakao: true,
        naver: true,
        school_email: true,
        student_direct: true,
      },
    });
  }
}

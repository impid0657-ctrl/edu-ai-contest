import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth Callback Handler — exchanges auth code for session.
 * On success: upserts user into public.users, redirects to /.
 * On failure: redirects to /login?error=auth_failed.
 */
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  try {
    const supabase = await createClient();

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("Auth code exchange error:", exchangeError.message);
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Failed to get user after code exchange:", userError?.message);
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    // Upsert user into public.users table
    const { error: upsertError } = await supabase.from("users").upsert(
      {
        id: user.id,
        email: user.email || user.user_metadata?.email || null,
        name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.preferred_username ||
          null,
        phone: user.user_metadata?.phone || null,
        role: "user",
      },
      {
        onConflict: "id",
        ignoreDuplicates: false,
      }
    );

    if (upsertError) {
      console.error("User upsert error:", upsertError.message);
      // Don't block login on upsert failure — user can still proceed
    }

    return NextResponse.redirect(`${origin}${next}`);
  } catch (err) {
    console.error("Callback handler error:", err);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }
}

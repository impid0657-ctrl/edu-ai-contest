import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/auth/me
 * Returns current authenticated user's profile from public.users.
 * Uses session-based client for auth check, admin client for profile read
 * (avoids RLS issues with newly created users).
 *
 * 200: { user: { id, email, name, role } }
 * 401: { error: "Not authenticated" }
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Use admin client to read profile (bypasses RLS — reliable for role check)
    const admin = createAdminClient();
    const { data: profile, error: profileError } = await admin
      .from("users")
      .select("id, email, name, phone, role, created_at")
      .eq("id", authUser.id)
      .single();

    if (profileError || !profile) {
      // Profile doesn't exist — return basic info with role from auth metadata
      return NextResponse.json(
        {
          user: {
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.full_name || null,
            role: "user",
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ user: profile }, { status: 200 });
  } catch (err) {
    console.error("GET /api/auth/me error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

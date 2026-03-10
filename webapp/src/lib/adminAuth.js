import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Verify that the current request is from an authenticated admin user.
 * Uses session client for auth check, admin client for role read (bypasses RLS).
 *
 * Usage:
 *   import { verifyAdmin } from "@/lib/adminAuth";
 *
 *   export async function GET(request) {
 *     const { supabase, admin, user, error } = await verifyAdmin();
 *     if (error) return error;
 *     // use admin client for DB queries
 *   }
 */
export async function verifyAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      supabase: null,
      admin: null,
      user: null,
      profile: null,
      error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }),
    };
  }

  // Use admin client for role check — bypasses RLS
  const admin = createAdminClient();
  const { data: profile, error: profileError } = await admin
    .from("users")
    .select("id, email, name, role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    return {
      supabase: null,
      admin: null,
      user: null,
      profile: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { supabase, admin, user, profile, error: null };
}

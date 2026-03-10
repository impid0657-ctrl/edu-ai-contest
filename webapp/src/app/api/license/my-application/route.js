import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/license/my-application
 * Returns the current user's license application (if any).
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { data: application, error: queryError } = await supabase
      .from("license_applications")
      .select("id, category, team_name, school_name, grade, member_count, phone, motivation, status, created_at")
      .eq("user_id", user.id)
      .neq("status", "rejected")
      .maybeSingle();

    if (queryError) {
      console.error("My application query error:", queryError.message);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ application: application || null }, { status: 200 });
  } catch (err) {
    console.error("GET /api/license/my-application error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

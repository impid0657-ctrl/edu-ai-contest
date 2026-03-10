import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/license/[id]
 * Full license application detail + student verification status
 */
export async function GET(request, { params }) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { data: profile } = await createAdminClient().from("users").select("role").eq("id", user.id).single();
    if (!profile || profile.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const ac = createAdminClient();
    const { id } = await params;

    // Fetch license application
    const { data: application, error } = await ac
      .from("license_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Fetch related user info if user_id exists
    let userInfo = null;
    if (application.user_id) {
      const { data } = await ac
        .from("users")
        .select("email, name, phone")
        .eq("id", application.user_id)
        .single();
      userInfo = data;
    }

    // Fetch student verification if exists (school email OTP or student ID)
    let verification = null;
    const lookupEmail = userInfo?.email || application.applicant_email;
    if (lookupEmail) {
      const { data: emailVerif } = await ac
        .from("school_email_verifications")
        .select("*")
        .eq("email", lookupEmail)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data: studentVerif } = await ac
        .from("student_verifications")
        .select("*")
        .eq("email", lookupEmail)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      verification = {
        email_otp: emailVerif || null,
        student_id: studentVerif || null,
      };
    }

    return NextResponse.json({
      ...application,
      user_info: userInfo,
      verification,
    });
  } catch (err) {
    console.error("GET /api/admin/license/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

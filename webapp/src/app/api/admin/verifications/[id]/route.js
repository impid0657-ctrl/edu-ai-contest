import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/verifications/[id]
 * Return verification detail + signed URL for student ID image
 */
export async function GET(request, { params }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { data: profile } = await createAdminClient().from("users").select("role").eq("id", user.id).single();
    if (!profile || profile.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const adminClient = createAdminClient();

    const { data: verification, error } = await adminClient
      .from("student_verifications")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !verification) {
      return NextResponse.json({ error: "인증 기록을 찾을 수 없습니다." }, { status: 404 });
    }

    // Generate signed URL for student ID image (60 min expiry)
    let fileUrl = null;
    if (verification.student_id_file_path) {
      const { data: signedData, error: signError } = await adminClient.storage
        .from("contest-files")
        .createSignedUrl(verification.student_id_file_path, 3600);

      if (!signError && signedData) {
        fileUrl = signedData.signedUrl;
      }
    }

    return NextResponse.json({
      ...verification,
      file_url: fileUrl,
    });
  } catch (err) {
    console.error("GET /api/admin/verifications/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/submissions/[id]/files/[fileId]
 * Generate signed URL for file download (60 min expiry)
 */
export async function GET(request, { params }) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { data: profile } = await createAdminClient().from("users").select("role").eq("id", user.id).single();
    if (!profile || profile.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const ac = createAdminClient();
    const { fileId } = await params;

    // Fetch file record
    const { data: file, error } = await ac
      .from("submission_files")
      .select("*")
      .eq("id", fileId)
      .single();

    if (error || !file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Generate signed URL (60 min = 3600 seconds)
    const { data: signedData, error: signError } = await ac
      .storage
      .from("contest-files")
      .createSignedUrl(file.file_path, 3600);

    if (signError) {
      console.error("Signed URL error:", signError.message);
      return NextResponse.json({ error: "Failed to generate download URL" }, { status: 500 });
    }

    return NextResponse.json({
      url: signedData.signedUrl,
      fileName: file.file_name,
    });
  } catch (err) {
    console.error("GET /api/admin/submissions/[id]/files/[fileId] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

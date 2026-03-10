import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/submissions/[id]
 * Return full submission detail: info + files + AI review result
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

    // Fetch submission with files
    const { data: submission, error } = await ac
      .from("submissions")
      .select("*, submission_files(*)")
      .eq("id", id)
      .single();

    if (error || !submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    // Fetch latest AI review queue entry
    const { data: aiReview } = await ac
      .from("ai_review_queue")
      .select("*")
      .eq("submission_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return NextResponse.json({
      ...submission,
      ai_review: aiReview || null,
    });
  } catch (err) {
    console.error("GET /api/admin/submissions/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/submissions/[id]
 * Update submission status
 * Body: { "status": "submitted" | "under_review" | "accepted" | "rejected" }
 */
export async function PATCH(request, { params }) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { data: profile } = await createAdminClient().from("users").select("role").eq("id", user.id).single();
    if (!profile || profile.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const ac = createAdminClient();
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ["submitted", "under_review", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` }, { status: 400 });
    }

    const { data: updated, error } = await ac
      .from("submissions")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("PATCH submission error:", error.message);
      return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /api/admin/submissions/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

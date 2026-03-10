import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/admin/license/bulk-action
 * Bulk approve or reject license applications.
 * 500-seat cap enforced on approve (doc 12.2).
 */
export async function POST(request) {
  try {
    const supabase = await createClient();

    // Auth + admin check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: profile } = await createAdminClient()
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ac = createAdminClient();

    const body = await request.json();
    const { ids, action } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No applications selected" },
        { status: 400 }
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    // 500-seat cap check for approve
    if (action === "approve") {
      const { count: approvedCount } = await ac
        .from("license_applications")
        .select("id", { count: "exact", head: true })
        .eq("status", "approved");

      const currentApproved = approvedCount || 0;

      if (currentApproved + ids.length > 500) {
        return NextResponse.json(
          {
            error: `승인 시 500명 한도 초과 (현재 ${currentApproved}명 승인, ${ids.length}명 추가 시 ${currentApproved + ids.length}명)`,
          },
          { status: 400 }
        );
      }
    }

    // Update applications
    const newStatus = action === "approve" ? "approved" : "rejected";
    // UTC ISO string for DB TIMESTAMPTZ — intentional, not a KST violation
    const now = new Date().toISOString();

    const { data: updated, error: updateError } = await ac
      .from("license_applications")
      .update({
        status: newStatus,
        reviewed_at: now,
        reviewed_by: user.id,
      })
      .in("id", ids)
      .select("id");

    if (updateError) {
      console.error("Bulk action error:", updateError.message);
      return NextResponse.json(
        { error: "Update failed" },
        { status: 500 }
      );
    }

    // Get updated approved count
    const { count: newApprovedCount } = await ac
      .from("license_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved");

    return NextResponse.json({
      updated: updated?.length || 0,
      approved_count: newApprovedCount || 0,
      remaining_seats: 500 - (newApprovedCount || 0),
    });
  } catch (err) {
    console.error("POST /api/admin/license/bulk-action error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

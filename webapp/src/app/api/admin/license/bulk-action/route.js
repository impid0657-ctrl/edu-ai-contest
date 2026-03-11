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

    if (!["approve", "reject", "delete", "restore", "permanent_delete"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    // Permanent delete (DB에서 완전 삭제 — 휴지통 항목만)
    if (action === "permanent_delete") {
      // 먼저 해당 ID들이 실제로 휴지통에 있는지 확인
      const { data: trashItems } = await ac
        .from("license_applications")
        .select("id")
        .in("id", ids)
        .not("deleted_at", "is", null);

      if (!trashItems || trashItems.length === 0) {
        // deleted_at 컬럼이 없거나 다른 이유로 필터가 안 되는 경우 → id만으로 삭제
        const { error: pdError2 } = await ac
          .from("license_applications")
          .delete()
          .in("id", ids);

        if (pdError2) {
          console.error("Permanent delete fallback error:", pdError2.message, pdError2.code);
          return NextResponse.json({ error: `완전 삭제 실패: ${pdError2.message}` }, { status: 500 });
        }
        return NextResponse.json({ updated: ids.length });
      }

      const trashIds = trashItems.map(t => t.id);
      const { error: pdError } = await ac
        .from("license_applications")
        .delete()
        .in("id", trashIds);

      if (pdError) {
        console.error("Permanent delete error:", pdError.message, pdError.code);
        return NextResponse.json({ error: `완전 삭제 실패: ${pdError.message}` }, { status: 500 });
      }
      return NextResponse.json({ updated: trashIds.length });
    }

    // Soft delete
    if (action === "delete") {
      const { data: deleted, error: delError } = await ac
        .from("license_applications")
        .update({ deleted_at: new Date().toISOString() })
        .in("id", ids)
        .is("deleted_at", null)
        .select("id");

      if (delError) {
        console.error("Soft delete error:", delError.message);
        return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
      }
      return NextResponse.json({ updated: deleted?.length || 0 });
    }

    // Restore from trash
    if (action === "restore") {
      const { data: restored, error: restoreError } = await ac
        .from("license_applications")
        .update({ deleted_at: null })
        .in("id", ids)
        .not("deleted_at", "is", null)
        .select("id");

      if (restoreError) {
        console.error("Restore error:", restoreError.message);
        return NextResponse.json({ error: "복구 실패" }, { status: 500 });
      }
      return NextResponse.json({ updated: restored?.length || 0 });
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

    // Get updated counts (pending + approved = active)
    const { count: newApprovedCount } = await ac
      .from("license_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved")
      .is("deleted_at", null);

    const { count: newPendingCount } = await ac
      .from("license_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .is("deleted_at", null);

    const activeCount = (newApprovedCount || 0) + (newPendingCount || 0);

    return NextResponse.json({
      updated: updated?.length || 0,
      approved_count: newApprovedCount || 0,
      remaining_seats: 500 - activeCount,
    });
  } catch (err) {
    console.error("POST /api/admin/license/bulk-action error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

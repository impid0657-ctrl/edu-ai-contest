import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/verifications — list student ID verifications
 * PATCH /api/admin/verifications — approve or reject a verification
 *
 * MISS-001: Admin UI for student_verifications table.
 * Students upload student IDs when OTP fails. Admin must approve/reject.
 */

async function getAdminUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const ac = createAdminClient();
  const { data } = await ac.from("users").select("id, role").eq("id", user.id).single();
  if (!data || data.role !== "admin") return null;
  return data;
}

export async function GET(request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;

    const adminClient = createAdminClient();

    let query = adminClient
      .from("student_verifications")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, count, error } = await query;

    if (error) {
      console.warn("Fetch verifications error (table may not exist):", error.message);
      return NextResponse.json({ verifications: [], total: 0, pending_count: 0 });
    }

    // Get pending count for badge
    const { count: pendingCount } = await adminClient
      .from("student_verifications")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");

    // Generate signed URLs for student ID images
    const verificationsWithUrls = await Promise.all(
      (data || []).map(async (v) => {
        let fileUrl = null;
        if (v.student_id_file_path) {
          const { data: urlData } = await adminClient.storage
            .from("contest-files")
            .createSignedUrl(v.student_id_file_path, 3600); // 1 hour
          fileUrl = urlData?.signedUrl || null;
        }
        return { ...v, file_url: fileUrl };
      })
    );

    return NextResponse.json({
      verifications: verificationsWithUrls,
      total: count || 0,
      pending_count: pendingCount || 0,
    });
  } catch (err) {
    console.warn("GET /api/admin/verifications error:", err.message);
    return NextResponse.json({ verifications: [], total: 0, pending_count: 0 });
  }
}

export async function PATCH(request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { id, action, admin_note } = body;

    if (!id || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "id와 action(approve/reject)이 필요합니다." }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const newStatus = action === "approve" ? "approved" : "rejected";

    const { data, error } = await adminClient
      .from("student_verifications")
      .update({
        status: newStatus,
        admin_note: admin_note || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update verification error:", error.message);
      return NextResponse.json({ error: "처리에 실패했습니다." }, { status: 500 });
    }

    // 연결된 license_applications 상태 동기화 (승인/반려 모두)
    let licenseSynced = false;
    if (data) {
      try {
        // 기존 연결된 license_application이 있으면 상태 업데이트
        const { data: existing } = await adminClient
          .from("license_applications")
          .select("id")
          .eq("student_verification_id", id)
          .maybeSingle();

        if (existing) {
          // 기존 레코드 상태 업데이트
          const { error: updateErr } = await adminClient
            .from("license_applications")
            .update({ status: newStatus })
            .eq("student_verification_id", id);

          if (updateErr) {
            console.error("License sync error:", updateErr.message);
          } else {
            licenseSynced = true;
          }
        } else if (newStatus === "approved") {
          // 승인인데 연결된 신청이 없으면 자동 생성
          const { error: insertErr } = await adminClient
            .from("license_applications")
            .insert({
              user_id: null,
              applicant_name: data.school_name ? `${data.school_name} 학생` : "학생",
              applicant_email: data.email,
              category: "elementary",
              school_name: data.school_name || null,
              auth_method: "student_direct",
              student_verification_id: id,
              status: "approved",
            });

          if (insertErr) {
            console.error("Auto license creation error:", insertErr.message);
          } else {
            licenseSynced = true;
          }
        }
      } catch (syncErr) {
        console.error("License sync failed:", syncErr);
      }
    }

    return NextResponse.json({
      message: newStatus === "approved"
        ? `승인 완료${licenseSynced ? " — 이용권 상태가 동기화되었습니다." : ""}`
        : `반려 완료${licenseSynced ? " — 이용권 상태가 동기화되었습니다." : ""}`,
      verification: data,
      license_synced: licenseSynced,
    });
  } catch (err) {
    console.error("PATCH /api/admin/verifications error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/admin/license/mark-issued
 * Mark approved license applications as "issued" (license actually sent via EduFit)
 * Body: { ids: string[] }
 */
export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { data: profile } = await createAdminClient().from("users").select("role").eq("id", user.id).single();
    if (!profile || profile.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ID 목록이 필요합니다." }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Only mark approved applications that haven't been issued yet
    const { data, error } = await adminClient
      .from("license_applications")
      .update({ license_issued_at: new Date().toISOString() })
      .in("id", ids)
      .eq("status", "approved")
      .is("license_issued_at", null)
      .select("id");

    if (error) {
      console.error("Mark issued error:", error.message);
      return NextResponse.json({ error: "발급 처리에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ updated: data?.length || 0 });
  } catch (err) {
    console.error("POST /api/admin/license/mark-issued error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

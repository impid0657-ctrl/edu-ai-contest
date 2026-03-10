import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/license
 * List license applications with filters for admin.
 * Query: ?status=pending&category=elementary&search=학교이름&page=1&limit=20
 */
export async function GET(request) {
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
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;

    // Build query
    let query = ac
      .from("license_applications")
      .select("*, users(name, email)", { count: "exact" });

    // Note: auth_method, applicant_name, applicant_email are included via * select

    if (status) query = query.eq("status", status);
    if (category) query = query.eq("category", category);
    if (search) query = query.ilike("school_name", `%${search}%`);

    query = query.order("created_at", { ascending: false });
    query = query.range(offset, offset + limit - 1);

    const { data: applications, count, error: queryError } = await query;

    if (queryError) {
      console.warn("Admin license query error (table may not exist):", queryError.message);
      return NextResponse.json({
        applications: [],
        total: 0,
        approved_count: 0,
        remaining_seats: 500,
      });
    }

    // Get approved count for seat cap
    const { count: approvedCount } = await ac
      .from("license_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved");

    // Get pending count
    const { count: pendingCount } = await ac
      .from("license_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");

    return NextResponse.json({
      applications: applications || [],
      total: count || 0,
      approved_count: approvedCount || 0,
      pending_count: pendingCount || 0,
      remaining_seats: 500 - (approvedCount || 0),
    });
  } catch (err) {
    console.warn("GET /api/admin/license error:", err.message);
    return NextResponse.json({
      applications: [],
      total: 0,
      approved_count: 0,
      remaining_seats: 500,
    });
  }
}

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
    const trash = searchParams.get("trash") === "true";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;

    // Build query — users JOIN 없이 전체 조회 (guest 신청도 포함)
    let query = ac
      .from("license_applications")
      .select("*", { count: "exact" });

    // Note: auth_method, applicant_name, applicant_email are included via * select

    // 휴지통 모드: deleted_at 필터
    if (trash) {
      query = query.not("deleted_at", "is", null);
    } else {
      query = query.is("deleted_at", null);
    }

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

    // OAuth 사용자의 이름/이메일 보충 (users 테이블에서 별도 조회)
    if (applications && applications.length > 0) {
      const userIds = applications.filter(a => a.user_id).map(a => a.user_id);
      if (userIds.length > 0) {
        const { data: userProfiles } = await ac
          .from("users")
          .select("id, name, email")
          .in("id", userIds);

        const profileMap = {};
        if (userProfiles) {
          for (const p of userProfiles) profileMap[p.id] = p;
        }

        for (const app of applications) {
          if (app.user_id && profileMap[app.user_id]) {
            app.users = profileMap[app.user_id];
          } else {
            app.users = null;
          }
        }
      }
    }

    // Get approved count
    const { count: approvedCount } = await ac
      .from("license_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved")
      .is("deleted_at", null);

    // Get pending count
    const { count: pendingCount } = await ac
      .from("license_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .is("deleted_at", null);

    const activeCount = (approvedCount || 0) + (pendingCount || 0);

    return NextResponse.json({
      applications: applications || [],
      total: count || 0,
      approved_count: approvedCount || 0,
      pending_count: pendingCount || 0,
      remaining_seats: 500 - activeCount,
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

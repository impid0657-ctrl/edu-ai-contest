import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/submissions
 * List submissions for admin with filters.
 * Query: ?status=submitted&category=elementary&search=keyword&page=1&limit=20
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

    // Build query — join with submission_files to get file count
    let query = ac
      .from("submissions")
      .select("*, submission_files(id)", { count: "exact" });

    if (status) query = query.eq("status", status);
    if (category) query = query.eq("category", category);
    if (search) {
      query = query.or(`title.ilike.%${search}%,submission_no.ilike.%${search}%`);
    }

    query = query.order("created_at", { ascending: false });
    query = query.range(offset, offset + limit - 1);

    const { data: submissions, count, error: queryError } = await query;

    if (queryError) {
      console.warn("Admin submissions query error (table may not exist):", queryError.message);
      return NextResponse.json({ submissions: [], total: 0 });
    }

    // Transform to include file_count
    const result = (submissions || []).map((s) => ({
      ...s,
      file_count: s.submission_files?.length || 0,
      submission_files: undefined, // Remove raw file data
    }));

    return NextResponse.json({
      submissions: result,
      total: count || 0,
    });
  } catch (err) {
    console.warn("GET /api/admin/submissions error:", err.message);
    return NextResponse.json({ submissions: [], total: 0 });
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Admin Board Management API — requires admin auth.
 *
 * GET    /api/admin/board?type=all&page=1 — list all posts (including secret)
 * POST   /api/admin/board — create new post (notice, faq, qna)
 * PATCH  /api/admin/board — update any post (title, content, is_pinned)
 * DELETE /api/admin/board — delete any post without password
 */

async function getAdminUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const ac = createAdminClient();
  const { data: userData } = await ac.from("users").select("id, role").eq("id", user.id).single();
  if (!userData || userData.role !== "admin") return null;
  return userData;
}

export async function GET(request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;

    const adminClient = createAdminClient();

    let query = adminClient
      .from("posts")
      .select("*", { count: "exact" })
      .is("parent_id", null)
      .order("is_pinned", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (type !== "all") {
      query = query.eq("type", type);
    }

    const { data: posts, count, error } = await query;

    if (error) {
      console.warn("Admin board list error (table may not exist):", error.message);
      return NextResponse.json({ posts: [], total: 0 });
    }

    // For QnA posts, check if they have replies
    const qnaPosts = (posts || []).filter((p) => p.type === "qna");
    let replyMap = {};
    if (qnaPosts.length > 0) {
      const { data: replies } = await adminClient
        .from("posts")
        .select("parent_id")
        .in("parent_id", qnaPosts.map((p) => p.id));
      (replies || []).forEach((r) => { replyMap[r.parent_id] = true; });
    }

    const result = (posts || []).map((p) => ({
      ...p,
      has_reply: !!replyMap[p.id],
    }));

    return NextResponse.json({ posts: result, total: count || 0 });
  } catch (err) {
    console.warn("GET /api/admin/board error:", err.message);
    return NextResponse.json({ posts: [], total: 0 });
  }
}

export async function POST(request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { type, title, content, is_pinned, is_secret, category } = body;

    if (!type || !title || !content) {
      return NextResponse.json({ error: "type, title, content are required" }, { status: 400 });
    }

    const validTypes = ["notice", "faq", "qna"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid post type" }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const { data: post, error } = await adminClient
      .from("posts")
      .insert({
        type,
        title: title.trim(),
        content: content.trim(),
        author_id: admin.id,
        author_name: "관리자",
        is_pinned: !!is_pinned,
        is_secret: !!is_secret,
        ...(category ? { category } : {}),
      })
      .select()
      .single();

    if (error) {
      console.error("Create post error:", error.message);
      return NextResponse.json({ error: "작성에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/board error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { id, title, content, is_pinned, category } = body;

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (is_pinned !== undefined) updateData.is_pinned = is_pinned;
    if (category !== undefined) updateData.category = category;

    const { data: post, error } = await adminClient
      .from("posts")
      .update(updateData)
      .eq("id", id)
      .select("id, title, type, is_pinned")
      .single();

    if (error) {
      return NextResponse.json({ error: "수정에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ post });
  } catch (err) {
    console.error("PATCH /api/admin/board error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient.from("posts").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: "삭제에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/board error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


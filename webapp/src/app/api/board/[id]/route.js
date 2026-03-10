import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import bcrypt from "bcryptjs";

/**
 * GET /api/board/[id] — Post detail (increments view_count)
 * PATCH /api/board/[id] — Edit post (verify password via bcrypt)
 * DELETE /api/board/[id] — Delete post (verify password via bcrypt)
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const adminClient = createAdminClient();

    const { data: post, error } = await adminClient
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Secret post: always return limited info on GET (use POST to verify password)
    if (post.is_secret && post.type === "qna") {
      return NextResponse.json({
        post: {
          id: post.id,
          type: post.type,
          title: post.title,
          author_name: post.author_name,
          is_secret: true,
          created_at: post.created_at,
          view_count: post.view_count,
        },
        requires_password: true,
      });
    }

    // Increment view_count
    await adminClient
      .from("posts")
      .update({ view_count: (post.view_count || 0) + 1 })
      .eq("id", id);

    // Strip password_hash from response
    const { password_hash, ...safePost } = post;
    return NextResponse.json({ post: safePost });
  } catch (err) {
    console.error("GET /api/board/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/board/[id] — Verify secret post password (body: { password })
 * Returns full post content if password matches.
 */
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: "비밀번호를 입력해주세요." }, { status: 400 });
    }

    const adminClient = createAdminClient();

    const { data: post, error } = await adminClient
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!post.is_secret) {
      // Not a secret post, just return it
      const { password_hash, ...safePost } = post;
      return NextResponse.json({ post: safePost });
    }

    const isValid = await bcrypt.compare(password, post.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: "비밀번호가 일치하지 않습니다.", requires_password: true }, { status: 403 });
    }

    // Increment view_count
    await adminClient
      .from("posts")
      .update({ view_count: (post.view_count || 0) + 1 })
      .eq("id", id);

    const { password_hash, ...safePost } = post;
    return NextResponse.json({ post: safePost });
  } catch (err) {
    console.error("POST /api/board/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { password, title, content } = body;

    if (!password) {
      return NextResponse.json({ error: "비밀번호를 입력해주세요." }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Get post and verify password
    const { data: post, error: fetchError } = await adminClient
      .from("posts")
      .select("password_hash")
      .eq("id", id)
      .single();

    if (fetchError || !post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, post.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: "비밀번호가 일치하지 않습니다." }, { status: 403 });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();

    const { data: updated, error: updateError } = await adminClient
      .from("posts")
      .update(updateData)
      .eq("id", id)
      .select("id, title, type")
      .single();

    if (updateError) {
      return NextResponse.json({ error: "수정에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ post: updated });
  } catch (err) {
    console.error("PATCH /api/board/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: "비밀번호를 입력해주세요." }, { status: 400 });
    }

    const adminClient = createAdminClient();

    const { data: post, error: fetchError } = await adminClient
      .from("posts")
      .select("password_hash")
      .eq("id", id)
      .single();

    if (fetchError || !post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, post.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: "비밀번호가 일치하지 않습니다." }, { status: 403 });
    }

    const { error: deleteError } = await adminClient
      .from("posts")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json({ error: "삭제에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/board/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

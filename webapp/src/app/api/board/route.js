import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, getClientIP } from "@/lib/rateLimit";
import bcrypt from "bcryptjs";

const boardPostLimiter = rateLimit({ interval: 60_000, limit: 5 });

/**
 * GET /api/board?type=notice&page=1&limit=20
 * Public board list. Exclude secret QnA posts for non-admin.
 *
 * POST /api/board
 * Create a new QnA post (public, no auth). Password is bcrypt hashed.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "notice";
    const parentId = searchParams.get("parent_id");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;

    const adminClient = createAdminClient();

    // If parent_id is provided, fetch child posts (admin replies)
    if (parentId) {
      const { data: posts, error } = await adminClient
        .from("posts")
        .select("id, type, title, content, author_name, created_at")
        .eq("parent_id", parentId)
        .order("created_at", { ascending: true });
      if (error) return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      return NextResponse.json({ posts: posts || [] });
    }

    let query = adminClient
      .from("posts")
      .select("id, type, title, author_name, is_secret, view_count, created_at", { count: "exact" })
      .eq("type", type)
      .is("parent_id", null)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // QnA 비밀글도 리스트에 표시 (제목만 보임, 내용 접근은 비밀번호 필요)

    const { data: posts, count, error } = await query;

    if (error) {
      console.error("Board list error:", error.message);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    return NextResponse.json({ posts: posts || [], total: count || 0 });
  } catch (err) {
    console.error("GET /api/board error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Rate limit
    const ip = getClientIP(request);
    const { success } = boardPostLimiter.check(ip);
    if (!success) {
      return NextResponse.json({ error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." }, { status: 429 });
    }

    const body = await request.json();
    const { type, author_name, password, title, content, is_secret } = body;

    // Validation
    if (!author_name || author_name.trim() === "") {
      return NextResponse.json({ error: "작성자 이름은 필수입니다." }, { status: 400 });
    }
    if (!password || password.length < 4) {
      return NextResponse.json({ error: "비밀번호는 4자 이상이어야 합니다." }, { status: 400 });
    }
    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "제목은 필수입니다." }, { status: 400 });
    }
    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "내용은 필수입니다." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const adminClient = createAdminClient();

    const { data: post, error } = await adminClient
      .from("posts")
      .insert({
        type: type || "qna",
        title: title.trim(),
        content: content.trim(),
        author_name: author_name.trim(),
        password_hash: passwordHash,
        is_secret: is_secret || false,
      })
      .select("id, title, type, created_at")
      .single();

    if (error) {
      console.error("Post insert error:", error.message);
      return NextResponse.json({ error: "게시글 작성에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error("POST /api/board error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

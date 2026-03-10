import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/admin/board/reply
 * Admin reply to a QnA post — creates a child post linked via parent_id
 * Body: { "parent_id": "uuid", "content": "reply text" }
 */
export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { data: profile } = await createAdminClient().from("users").select("id, role").eq("id", user.id).single();
    if (!profile || profile.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { parent_id, content } = body;

    if (!parent_id || !content) {
      return NextResponse.json({ error: "parent_id and content are required" }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Verify parent post exists and is QnA
    const { data: parent } = await adminClient
      .from("posts")
      .select("id, type")
      .eq("id", parent_id)
      .single();

    if (!parent) {
      return NextResponse.json({ error: "원본 게시글을 찾을 수 없습니다." }, { status: 404 });
    }

    // Create reply as child post
    const { data: reply, error } = await adminClient
      .from("posts")
      .insert({
        type: parent.type,
        title: "관리자 답변",
        content: content.trim(),
        parent_id,
        author_id: profile.id,
        author_name: "관리자",
      })
      .select()
      .single();

    if (error) {
      console.error("Create reply error:", error.message);
      return NextResponse.json({ error: "답변 작성에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ reply }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/board/reply error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

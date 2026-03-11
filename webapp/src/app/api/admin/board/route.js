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

    const contentType = request.headers.get("content-type") || "";
    let type, title, content, is_pinned, is_secret, category, attachments = [];

    if (contentType.includes("multipart/form-data")) {
      // FormData — 파일 포함
      const formData = await request.formData();
      type = formData.get("type");
      title = formData.get("title");
      content = formData.get("content");
      is_pinned = formData.get("is_pinned") === "true";
      is_secret = formData.get("is_secret") === "true";
      category = formData.get("category") || "";

      // 기존 attachments (JSON 문자열)
      const existingAttachments = formData.get("existingAttachments");
      if (existingAttachments) {
        try { attachments = JSON.parse(existingAttachments); } catch {}
      }

      // 새 파일 업로드
      const files = formData.getAll("files");
      const adminClient = createAdminClient();
      for (const file of files) {
        if (!(file instanceof File) || file.size === 0) continue;
        const buffer = Buffer.from(await file.arrayBuffer());
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9가-힣._-]/g, "_");
        const storagePath = `${timestamp}_${safeName}`;

        const { error: uploadError } = await adminClient.storage
          .from("board-attachments")
          .upload(storagePath, buffer, {
            contentType: file.type || "application/octet-stream",
            upsert: false,
          });

        if (uploadError) {
          console.error("File upload error:", uploadError.message);
          continue;
        }

        const { data: urlData } = adminClient.storage.from("board-attachments").getPublicUrl(storagePath);
        attachments.push({
          name: file.name,
          path: storagePath,
          size: file.size,
          url: urlData?.publicUrl || "",
        });
      }
    } else {
      // JSON
      const body = await request.json();
      type = body.type;
      title = body.title;
      content = body.content;
      is_pinned = body.is_pinned;
      is_secret = body.is_secret;
      category = body.category;
      attachments = body.attachments || [];
    }

    if (!type || !title || !content) {
      return NextResponse.json({ error: "type, title, content are required" }, { status: 400 });
    }

    const validTypes = ["notice", "faq", "qna"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid post type" }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const insertData = {
      type,
      title: title.trim(),
      content: content.trim(),
      author_id: admin.id,
      author_name: "관리자",
      is_pinned: !!is_pinned,
      is_secret: !!is_secret,
      ...(category ? { category } : {}),
    };
    if (attachments.length > 0) {
      insertData.attachments = attachments;
    }

    let { data: post, error } = await adminClient
      .from("posts")
      .insert(insertData)
      .select()
      .single();

    // attachments 컬럼 미존재 시 fallback
    if (error && error.message?.includes("attachments")) {
      delete insertData.attachments;
      const fallback = await adminClient.from("posts").insert(insertData).select().single();
      post = fallback.data;
      error = fallback.error;
    }

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
    const { id, title, content, is_pinned, category, attachments } = body;

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (is_pinned !== undefined) updateData.is_pinned = is_pinned;
    if (category !== undefined) updateData.category = category;
    if (attachments !== undefined) updateData.attachments = attachments;

    const { data: post, error } = await adminClient
      .from("posts")
      .update(updateData)
      .eq("id", id)
      .select("id, title, type, is_pinned, attachments")
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

    // 삭제 전 첨부파일 정리
    try {
      const { data: existing } = await adminClient.from("posts").select("attachments").eq("id", id).single();
      if (existing?.attachments && Array.isArray(existing.attachments) && existing.attachments.length > 0) {
        const paths = existing.attachments.map((a) => a.path).filter(Boolean);
        if (paths.length > 0) {
          await adminClient.storage.from("board-attachments").remove(paths);
        }
      }
    } catch (e) { console.warn("Attachment cleanup warning:", e.message); }

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


import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateEmbedding } from "@/lib/chatbot";

/**
 * RAG Document CRUD API for admin chatbot management.
 * Table: contest_documents (id, title, content, embedding, metadata, created_at)
 *
 * GET    — list all documents
 * POST   — create new document + auto-generate embedding
 * PATCH  — update document + auto-regenerate embedding
 * DELETE — delete document
 *
 * Embedding is generated automatically on create/update.
 * No manual `npm run generate-embeddings` needed.
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

/**
 * Generate embedding for a document and save it to DB.
 * Runs in background — doesn't block the response.
 */
async function autoGenerateEmbedding(docId, title, content) {
  try {
    const text = title ? `${title}: ${content}` : content;
    const embedding = await generateEmbedding(text);

    if (!embedding || embedding.length === 0) {
      console.warn(`⚠️ Empty embedding for ${title || docId}`);
      return;
    }

    const adminClient = createAdminClient();

    // 1차: JSON 배열로 시도
    const { error } = await adminClient
      .from("contest_documents")
      .update({ embedding })
      .eq("id", docId);

    if (error) {
      console.warn(`Embedding update (array) failed: ${error.message}, trying string format...`);

      // 2차: PostgreSQL 벡터 문자열 형식으로 시도 "[0.1,0.2,...]"
      const vectorStr = `[${embedding.join(",")}]`;
      const { error: err2 } = await adminClient
        .from("contest_documents")
        .update({ embedding: vectorStr })
        .eq("id", docId);

      if (err2) {
        console.error(`⚠️ Embedding update (string) also failed for ${docId}:`, err2.message);
        return;
      }
    }

    console.log(`✅ Embedding generated for document: ${title || docId} (${embedding.length} dims)`);
  } catch (err) {
    console.error(`⚠️ Embedding generation failed for ${docId}:`, err.message);
  }
}

export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const adminClient = createAdminClient();
    const { data: documents, error } = await adminClient
      .from("contest_documents")
      .select("id, title, content, metadata, created_at, embedding")
      .order("created_at", { ascending: true });

    if (error) {
      console.warn("Fetch documents error (table may not exist yet):", error.message);
      return NextResponse.json({ documents: [] });
    }

    // Add embedding status for UI display (don't send actual vector)
    const docsWithStatus = (documents || []).map((doc) => ({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      metadata: doc.metadata,
      created_at: doc.created_at,
      has_embedding: doc.embedding !== null,
    }));

    return NextResponse.json({ documents: docsWithStatus });
  } catch (err) {
    console.error("GET /api/admin/chatbot/documents error:", err);
    return NextResponse.json({ documents: [] });
  }
}

export async function POST(request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { title, content, metadata } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "내용은 필수입니다." }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const { data: doc, error } = await adminClient
      .from("contest_documents")
      .insert({
        title: title?.trim() || null,
        content: content.trim(),
        metadata: metadata || {},
      })
      .select("id, title, content, metadata, created_at")
      .single();

    if (error) {
      console.error("Insert document error:", error.message, error.details, error.hint);
      const msg = error.message?.includes("relation")
        ? "문서 테이블이 없습니다. DB 마이그레이션(006_chatbot.sql)을 실행해주세요."
        : `문서 추가 실패: ${error.message}`;
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    // Auto-generate embedding (non-blocking)
    autoGenerateEmbedding(doc.id, doc.title, doc.content);

    return NextResponse.json({
      document: { ...doc, has_embedding: false },
      message: "문서가 추가되었습니다. 임베딩이 자동 생성됩니다.",
    }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/chatbot/documents error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { id, title, content } = body;

    if (!id) return NextResponse.json({ error: "문서 ID 필수" }, { status: 400 });

    const adminClient = createAdminClient();
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) {
      updateData.content = content.trim();
      updateData.embedding = null; // clear old embedding
    }

    const { data: doc, error } = await adminClient
      .from("contest_documents")
      .update(updateData)
      .eq("id", id)
      .select("id, title, content, metadata, created_at")
      .single();

    if (error) {
      console.error("Update document error:", error.message);
      const msg = error.message?.includes("relation") ? "DB 마이그레이션이 필요합니다." : "문서 수정 실패";
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    // Auto-regenerate embedding if content changed (non-blocking)
    if (content !== undefined) {
      autoGenerateEmbedding(doc.id, doc.title, doc.content);
    }

    return NextResponse.json({
      document: { ...doc, has_embedding: false },
      message: "문서가 수정되었습니다. 임베딩이 자동 재생성됩니다.",
    });
  } catch (err) {
    console.error("PATCH /api/admin/chatbot/documents error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: "문서 ID 필수" }, { status: 400 });

    const adminClient = createAdminClient();
    const { error } = await adminClient.from("contest_documents").delete().eq("id", id);

    if (error) {
      console.error("Delete document error:", error.message);
      const msg = error.message?.includes("relation") ? "DB 마이그레이션이 필요합니다." : "문서 삭제 실패";
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/chatbot/documents error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

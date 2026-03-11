import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/admin/board/upload
 * 게시판 첨부파일 업로드 — multipart/form-data
 * Returns: { files: [{ name, path, size, url }] }
 */
export async function POST(request) {
  try {
    // Admin auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const ac = createAdminClient();
    const { data: profile } = await ac.from("users").select("role").eq("id", user.id).single();
    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploaded = [];
    const bucketName = "board-attachments";

    for (const file of files) {
      if (!(file instanceof File)) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9가-힣._-]/g, "_");
      const storagePath = `${timestamp}_${safeName}`;

      const { data, error } = await ac.storage
        .from(bucketName)
        .upload(storagePath, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error.message);
        continue; // 개별 파일 실패 시 건너뜀
      }

      const { data: urlData } = ac.storage.from(bucketName).getPublicUrl(storagePath);

      uploaded.push({
        name: file.name,
        path: storagePath,
        size: file.size,
        url: urlData?.publicUrl || "",
      });
    }

    return NextResponse.json({ files: uploaded });
  } catch (err) {
    console.error("POST /api/admin/board/upload error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

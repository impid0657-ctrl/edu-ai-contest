import { NextResponse } from "next/server";
import { verifyGuestToken } from "@/lib/guestAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, getClientIP } from "@/lib/rateLimit";

const uploadLimiter = rateLimit({ interval: 60_000, limit: 30 });

/**
 * POST /api/guest/upload
 * Guest file upload proxy (doc 12.6).
 * Guest browser → this API → Supabase Storage (via SUPABASE_SERVICE_ROLE_KEY).
 * BANNED: guest browser → Supabase Storage direct.
 */

const ALLOWED_EXTENSIONS = [
  "pdf", "zip", "hwp", "hwpx", "pptx", "ppt",
  "docx", "doc", "xlsx", "xls",
  "png", "jpg", "jpeg", "mp4", "avi", "mov",
];

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

export async function POST(request) {
  try {
    // Rate limit
    const ip = getClientIP(request);
    const { success } = uploadLimiter.check(ip);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // Validate guest JWT from Authorization header
    const guest = verifyGuestToken(request);
    if (!guest) {
      return NextResponse.json(
        { error: "Invalid or expired guest token" },
        { status: 401 }
      );
    }

    // Verify submission exists and is still editable (submitted/draft only)
    const adminClient = createAdminClient();
    const { data: submission, error: subError } = await adminClient
      .from("submissions")
      .select("id, status")
      .eq("id", guest.submission_id)
      .single();

    if (subError || !submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    if (submission.status !== "submitted" && submission.status !== "draft") {
      return NextResponse.json(
        { error: "심사 중이거나 완료된 접수건에는 파일을 추가할 수 없습니다." },
        { status: 403 }
      );
    }

    // Check total file count per submission (max 20 files)
    const { count: fileCount } = await adminClient
      .from("submission_files")
      .select("id", { count: "exact", head: true })
      .eq("submission_id", guest.submission_id);

    if (fileCount && fileCount >= 20) {
      return NextResponse.json(
        { error: "파일은 최대 20개까지 첨부할 수 있습니다." },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "파일 크기가 500MB를 초과합니다." },
        { status: 400 }
      );
    }

    // Validate extension
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `허용되지 않는 파일 형식입니다. 허용: ${ALLOWED_EXTENSIONS.join(", ")}` },
        { status: 400 }
      );
    }

    // Generate safe path — 원본 파일명에 한글 등 비ASCII 포함 가능하므로 UUID+확장자만 사용
    const safeName = `${crypto.randomUUID()}.${ext}`;
    const path = `submissions/${guest.submission_id}/${safeName}`;

    // Upload to Supabase Storage using admin client (reuse from above)
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await adminClient.storage
      .from("contest-files")
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Guest file upload error:", uploadError.message);
      return NextResponse.json(
        { error: "파일 업로드에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      file: {
        name: file.name,
        path,
        size: file.size,
        mime_type: file.type,
      },
    });
  } catch (err) {
    console.error("POST /api/guest/upload error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

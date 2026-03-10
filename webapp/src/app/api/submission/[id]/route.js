import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyGuestToken } from "@/lib/guestAuth";
import { isDeadlinePassed } from "@/lib/dateUtils";

/**
 * GET /api/submission/[id]
 * Fetch submission details. JWT-only auth (no member auth fallback).
 *
 * PATCH /api/submission/[id]
 * Update submission fields. Deadline enforced. JWT-only.
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Verify JWT
    const guest = verifyGuestToken(request);
    if (!guest) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    if (guest.submission_id !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const adminClient = createAdminClient();
    const { data: submission, error } = await adminClient
      .from("submissions")
      .select("*, submission_files(*)")
      .eq("id", id)
      .single();

    if (error || !submission) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ submission });
  } catch (err) {
    console.error("GET /api/submission/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;

    // Deadline check
    if (isDeadlinePassed()) {
      return NextResponse.json(
        { error: "마감되어 수정할 수 없습니다." },
        { status: 403 }
      );
    }

    // Verify JWT
    const guest = verifyGuestToken(request);
    if (!guest) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    if (guest.submission_id !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, category, team_name, contact_phone, files } = body;

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description ? description.slice(0, 1000) : null;
    if (category !== undefined) updateData.category = category;
    if (team_name !== undefined) updateData.team_name = team_name || null;
    if (contact_phone !== undefined) updateData.contact_phone = contact_phone || null;

    const adminClient = createAdminClient();
    const { data: submission, error } = await adminClient
      .from("submissions")
      .update(updateData)
      .eq("id", id)
      .select("id, submission_no, title, status")
      .single();

    if (error) {
      console.error("PATCH error:", error.message);
      return NextResponse.json({ error: "수정에 실패했습니다." }, { status: 500 });
    }

    // Insert new file records if provided
    if (files && Array.isArray(files) && files.length > 0) {
      const fileRecords = files.map((f) => ({
        submission_id: id,
        file_name: f.name,
        file_path: f.path,
        file_size: f.size || null,
        mime_type: f.mime_type || null,
      }));
      await adminClient.from("submission_files").insert(fileRecords);
    }

    return NextResponse.json({ submission });
  } catch (err) {
    console.error("PATCH /api/submission/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

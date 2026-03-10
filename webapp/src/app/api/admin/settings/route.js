import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/settings — read from DB (chatbot_settings + file_upload_settings)
 * PATCH /api/admin/settings — persist to DB
 *
 * Auth providers stored in chatbot_settings.auth_providers (JSONB)
 * File upload settings stored in file_upload_settings table
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

export async function GET(request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const adminClient = createAdminClient();

    // Read auth_providers from chatbot_settings singleton
    const { data: chatSettings } = await adminClient
      .from("chatbot_settings")
      .select("auth_providers")
      .limit(1)
      .single();

    const authProviders = chatSettings?.auth_providers || {
      kakao: true,
      naver: true,
      school_email: true,
      student_direct: true,
    };

    // Read file_upload_settings from dedicated table
    const { data: fileSettings } = await adminClient
      .from("file_upload_settings")
      .select("*")
      .order("upload_type");

    return NextResponse.json({
      settings: {
        auth_providers: authProviders,
        file_upload_settings: fileSettings || [],
      },
    });
  } catch (err) {
    console.error("GET /api/admin/settings error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const adminClient = createAdminClient();
    const body = await request.json();
    const { auth_providers, file_upload_settings } = body;

    // Update auth_providers in chatbot_settings
    if (auth_providers) {
      const { error: authErr } = await adminClient
        .from("chatbot_settings")
        .update({ auth_providers })
        .not("id", "is", null); // update all rows (singleton)

      if (authErr) {
        console.error("Update auth_providers error:", authErr.message);
        return NextResponse.json({ error: "인증 설정 저장 실패" }, { status: 500 });
      }
    }

    // Update file_upload_settings (each row by upload_type)
    if (file_upload_settings && Array.isArray(file_upload_settings)) {
      for (const fs of file_upload_settings) {
        if (!fs.upload_type) continue;
        const { error: fsErr } = await adminClient
          .from("file_upload_settings")
          .update({
            max_file_size_mb: fs.max_file_size_mb,
            allowed_extensions: fs.allowed_extensions,
            is_active: fs.is_active,
          })
          .eq("upload_type", fs.upload_type);

        if (fsErr) console.error(`Update file setting ${fs.upload_type} error:`, fsErr.message);
      }
    }

    return NextResponse.json({ message: "설정이 저장되었습니다." });
  } catch (err) {
    console.error("PATCH /api/admin/settings error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

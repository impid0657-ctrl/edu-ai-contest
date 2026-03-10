import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/site-settings — read all site settings (admin only)
 * PATCH /api/admin/site-settings — update one or more site settings
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
    const { data, error } = await adminClient
      .from("site_settings")
      .select("*")
      .order("key");

    if (error) {
      console.error("Site settings fetch error:", error.message);
      return NextResponse.json({ error: "설정을 불러올 수 없습니다." }, { status: 500 });
    }

    // Convert array to key-value map for convenience
    const settingsMap = {};
    (data || []).forEach((row) => {
      settingsMap[row.key] = {
        value: row.value,
        description: row.description,
        updated_at: row.updated_at,
      };
    });

    return NextResponse.json({ settings: settingsMap, raw: data });
  } catch (err) {
    console.error("GET /api/admin/site-settings error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { updates } = body;
    // updates = { "contest_deadline": "2026-08-31T23:59:59+09:00", "contest_name": "...", ... }

    if (!updates || typeof updates !== "object") {
      return NextResponse.json({ error: "updates 객체가 필요합니다." }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const errors = [];

    for (const [key, value] of Object.entries(updates)) {
      const { error } = await adminClient
        .from("site_settings")
        .upsert(
          { key, value: JSON.stringify(value), updated_at: new Date().toISOString(), updated_by: admin.id },
          { onConflict: "key" }
        );

      if (error) {
        console.error(`Update site_settings[${key}] error:`, error.message);
        errors.push(key);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: `일부 설정 저장 실패: ${errors.join(", ")}` }, { status: 500 });
    }

    return NextResponse.json({ message: "설정이 저장되었습니다." });
  } catch (err) {
    console.error("PATCH /api/admin/site-settings error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/pages — list all menu items (admin only)
 * PATCH handled per item via /api/admin/pages/[id]
 * POST — disabled (menus are predefined, no add)
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

export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const ac = createAdminClient();
    const { data, error } = await ac
      .from("pages")
      .select("id, slug, title, path, menu_order, is_visible, is_public, is_published, access_warning, updated_at")
      .order("menu_order", { ascending: true });

    if (error) {
      console.error("Pages fetch error:", error.message);
      return NextResponse.json({ error: "메뉴 목록 조회 실패" }, { status: 500 });
    }

    return NextResponse.json({ pages: data || [] });
  } catch (err) {
    console.error("GET /api/admin/pages error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST disabled — menus are predefined
export async function POST() {
  return NextResponse.json({ error: "메뉴 추가는 지원되지 않습니다. 기존 메뉴의 설정만 변경할 수 있습니다." }, { status: 405 });
}

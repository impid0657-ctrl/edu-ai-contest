import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * PATCH /api/admin/pages/[id] — update menu item settings
 * Allowed fields: is_visible, is_public, access_warning, menu_order, title
 * NOT allowed: slug, path (these are hardcoded route mappings)
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

export async function GET(request, { params }) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const ac = createAdminClient();

    const { data, error } = await ac
      .from("pages")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "메뉴를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ page: data });
  } catch (err) {
    console.error("GET /api/admin/pages/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const body = await request.json();

    // Only allow safe fields to be updated
    const updateData = { updated_at: new Date().toISOString() };
    if (body.title !== undefined) updateData.title = body.title;
    if (body.is_visible !== undefined) updateData.is_visible = body.is_visible;
    if (body.is_public !== undefined) updateData.is_public = body.is_public;
    if (body.is_published !== undefined) updateData.is_published = body.is_published;
    if (body.access_warning !== undefined) updateData.access_warning = body.access_warning;
    if (body.menu_order !== undefined) updateData.menu_order = body.menu_order;

    const ac = createAdminClient();
    const { data, error } = await ac
      .from("pages")
      .update(updateData)
      .eq("id", id)
      .select("id, slug, title, path, menu_order, is_visible, is_public, is_published, access_warning, updated_at")
      .single();

    if (error) {
      console.error("Menu update error:", error.message);
      return NextResponse.json({ error: "메뉴 설정 변경 실패" }, { status: 500 });
    }

    return NextResponse.json({ page: data, message: "메뉴 설정이 변경되었습니다." });
  } catch (err) {
    console.error("PATCH /api/admin/pages/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE disabled — menus cannot be removed
export async function DELETE() {
  return NextResponse.json({ error: "메뉴 삭제는 지원되지 않습니다." }, { status: 405 });
}

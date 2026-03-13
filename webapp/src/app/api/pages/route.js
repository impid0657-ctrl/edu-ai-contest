import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/pages — public menu/page API
 *
 * ?menu=true — returns visible menu items (for header navigation)
 * ?slug=xxx — returns single page by slug
 * ?path=/xxx — returns single page by path (for access check)
 *
 * Graceful fallback: if pages table or menu columns are missing, returns hardcoded defaults.
 */

const DEFAULT_MENU = [
  { slug: "home", title: "홈", path: "/", menu_order: 0, is_public: true },
  { slug: "contest-info", title: "공모요강", path: "/contest-info", menu_order: 1, is_public: true },
  { slug: "submit", title: "작품접수", path: "/submit", menu_order: 2, is_public: true },
  { slug: "submit-lookup", title: "접수조회", path: "/submit/lookup", menu_order: 3, is_public: true },
  { slug: "board", title: "공지사항", path: "/board", menu_order: 4, is_public: true },
  { slug: "contact", title: "문의하기", path: "/contact", menu_order: 5, is_public: true },
  { slug: "license-apply", title: "이용권 신청", path: "/license-apply", menu_order: 6, is_public: true },
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const menu = searchParams.get("menu");
    const slug = searchParams.get("slug");
    const path = searchParams.get("path");
    const admin = createAdminClient();

    // Menu mode: return all published, visible menu items (for header)
    if (menu === "true") {
      try {
        const { data, error } = await admin
          .from("pages")
          .select("slug, title, path, menu_order, is_public, access_warning")
          .eq("is_published", true)
          .eq("is_visible", true)
          .order("menu_order", { ascending: true });

        if (error) {
          // is_visible/path/menu_order 컬럼이 없을 수 있음 (migration 013 미실행)
          console.error("Menu fetch error (fallback to defaults):", error.message);
          return NextResponse.json({ menu: DEFAULT_MENU });
        }

        return NextResponse.json({ menu: data || [] });
      } catch (menuErr) {
        console.error("Menu query exception (fallback to defaults):", menuErr.message);
        return NextResponse.json({ menu: DEFAULT_MENU });
      }
    }

    // Path mode: check access for a specific path (for middleware/page guard)
    if (path) {
      try {
        const { data, error } = await admin
          .from("pages")
          .select("slug, title, path, is_public, is_published, access_warning")
          .eq("path", path)
          .single();

        if (error || !data) {
          return NextResponse.json({ page: null, access: "public" });
        }

        if (!data.is_published) {
          return NextResponse.json({ page: data, access: "unpublished", warning: data.access_warning });
        }

        if (!data.is_public) {
          return NextResponse.json({ page: data, access: "private", warning: data.access_warning });
        }

        return NextResponse.json({ page: data, access: "public" });
      } catch {
        return NextResponse.json({ page: null, access: "public" });
      }
    }

    // Slug mode: return single page content
    if (slug) {
      try {
        const { data, error } = await admin
          .from("pages")
          .select("slug, title, content, path, is_public, is_published, access_warning, updated_at")
          .eq("slug", slug)
          .eq("is_published", true)
          .single();

        if (error || !data) {
          return NextResponse.json({ error: "페이지를 찾을 수 없습니다." }, { status: 404 });
        }

        return NextResponse.json({ page: data });
      } catch {
        return NextResponse.json({ error: "페이지를 찾을 수 없습니다." }, { status: 404 });
      }
    }

    return NextResponse.json({ error: "menu=true, slug, 또는 path 파라미터가 필요합니다." }, { status: 400 });
  } catch (err) {
    console.error("GET /api/pages error:", err);
    // Graceful fallback
    return NextResponse.json({ menu: DEFAULT_MENU });
  }
}

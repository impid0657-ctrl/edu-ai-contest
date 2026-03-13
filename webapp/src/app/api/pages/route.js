import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// Vercel 캐시 방지 — 사용자별 세션 기반 응답이 필요
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/pages — public menu/page API
 *
 * ?menu=true — returns visible menu items (for header navigation)
 *   - 일반 사용자: is_visible=true인 메뉴만 반환
 *   - 관리자: 모든 메뉴 반환 (is_visible 값 포함, 프론트에서 시각적 구분 가능)
 * ?slug=xxx — returns single page by slug
 * ?path=/xxx — returns single page by path (for access check)
 *   - 비공개 페이지: 관리자면 access="admin_bypass", 일반 사용자면 access="private"
 *
 * Graceful fallback: if pages table or menu columns are missing, returns hardcoded defaults.
 */

const DEFAULT_MENU = [
  { slug: "home", title: "홈", path: "/", menu_order: 0, is_public: true, is_visible: true },
  { slug: "contest-info", title: "공모요강", path: "/contest-info", menu_order: 1, is_public: true, is_visible: true },
  { slug: "submit", title: "작품접수", path: "/submit", menu_order: 2, is_public: true, is_visible: true },
  { slug: "submit-lookup", title: "접수조회", path: "/submit/lookup", menu_order: 3, is_public: true, is_visible: true },
  { slug: "board", title: "공지사항", path: "/board", menu_order: 4, is_public: true, is_visible: true },
  { slug: "contact", title: "문의하기", path: "/contact", menu_order: 5, is_public: true, is_visible: true },
  { slug: "license-apply", title: "이용권 신청", path: "/license-apply", menu_order: 6, is_public: true, is_visible: true },
];

/**
 * 현재 요청의 세션에서 관리자 여부를 확인
 * @returns {boolean} 관리자이면 true
 */
async function checkIsAdmin() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const ac = createAdminClient();
    const { data } = await ac.from("users").select("role").eq("id", user.id).single();
    return data?.role === "admin";
  } catch {
    return false;
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const menu = searchParams.get("menu");
    const slug = searchParams.get("slug");
    const path = searchParams.get("path");
    const ac = createAdminClient();

    // Menu mode: return menu items for header navigation
    if (menu === "true") {
      try {
        const isAdmin = await checkIsAdmin();

        // 관리자: 모든 메뉴 반환 (is_visible 값 포함)
        // 일반 사용자: is_visible=true인 메뉴만 반환
        let query = ac
          .from("pages")
          .select("slug, title, path, menu_order, is_public, is_visible, access_warning")
          .eq("is_published", true)
          .order("menu_order", { ascending: true });

        if (!isAdmin) {
          query = query.eq("is_visible", true);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Menu fetch error (fallback to defaults):", error.message);
          return NextResponse.json({ menu: DEFAULT_MENU, isAdmin });
        }

        return NextResponse.json({ menu: data || [], isAdmin });
      } catch (menuErr) {
        console.error("Menu query exception (fallback to defaults):", menuErr.message);
        return NextResponse.json({ menu: DEFAULT_MENU, isAdmin: false });
      }
    }

    // Path mode: check access for a specific path (for page guard)
    if (path) {
      try {
        const { data, error } = await ac
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
          // 비공개 페이지 → 관리자 세션 확인
          const isAdmin = await checkIsAdmin();
          if (isAdmin) {
            return NextResponse.json({ page: data, access: "admin_bypass" });
          }
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
        const { data, error } = await ac
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
    return NextResponse.json({ menu: DEFAULT_MENU, isAdmin: false });
  }
}

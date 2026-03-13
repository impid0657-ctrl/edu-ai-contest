import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// Vercel 캐시 방지 — 사용자별 세션 기반 응답
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/pages — public menu/page API
 *
 * ?menu=true — 메뉴 반환
 *   - 일반 사용자: is_visible=true 기준
 *   - 관리자: admin_visible=true 기준 (일반 설정과 독립)
 * ?slug=xxx — 단일 페이지 반환
 * ?path=/xxx — 접근 권한 체크
 *   - 일반 사용자: is_public / access_warning 기준
 *   - 관리자: admin_public / admin_access_warning 기준
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

/**
 * 현재 요청의 세션에서 관리자 여부를 확인
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

    // Menu mode
    if (menu === "true") {
      try {
        const isAdmin = await checkIsAdmin();

        const selectFields = isAdmin
          ? "slug, title, path, menu_order, admin_visible, admin_public, admin_access_warning"
          : "slug, title, path, menu_order, is_public, access_warning";

        const visibleField = isAdmin ? "admin_visible" : "is_visible";

        const { data, error } = await ac
          .from("pages")
          .select(selectFields)
          .eq("is_published", true)
          .eq(visibleField, true)
          .order("menu_order", { ascending: true });

        if (error) {
          console.error("Menu fetch error (fallback to defaults):", error.message);
          return NextResponse.json({ menu: DEFAULT_MENU, isAdmin });
        }

        // 관리자용 응답: admin_* 필드를 is_*/access_warning으로 매핑
        // → 프론트엔드가 동일한 필드명으로 처리 가능
        const normalizedMenu = isAdmin
          ? (data || []).map(item => ({
              slug: item.slug,
              title: item.title,
              path: item.path,
              menu_order: item.menu_order,
              is_public: item.admin_public,
              access_warning: item.admin_access_warning,
            }))
          : (data || []);

        return NextResponse.json({ menu: normalizedMenu, isAdmin });
      } catch (menuErr) {
        console.error("Menu query exception (fallback):", menuErr.message);
        return NextResponse.json({ menu: DEFAULT_MENU, isAdmin: false });
      }
    }

    // Path mode: 접근 권한 체크
    if (path) {
      try {
        const { data, error } = await ac
          .from("pages")
          .select("slug, title, path, is_public, is_published, access_warning, admin_public, admin_access_warning")
          .eq("path", path)
          .single();

        if (error || !data) {
          return NextResponse.json({ page: null, access: "public" });
        }

        if (!data.is_published) {
          return NextResponse.json({ page: data, access: "unpublished", warning: data.access_warning });
        }

        const isAdmin = await checkIsAdmin();

        if (isAdmin) {
          // 관리자: admin_public 기준
          if (data.admin_public === false) {
            return NextResponse.json({
              page: data,
              access: "private",
              warning: data.admin_access_warning || "이 페이지는 관리자에게도 비공개 상태입니다.",
            });
          }
          return NextResponse.json({ page: data, access: "public" });
        } else {
          // 일반 사용자: is_public 기준
          if (!data.is_public) {
            return NextResponse.json({ page: data, access: "private", warning: data.access_warning });
          }
          return NextResponse.json({ page: data, access: "public" });
        }
      } catch {
        return NextResponse.json({ page: null, access: "public" });
      }
    }

    // Slug mode
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
    return NextResponse.json({ menu: DEFAULT_MENU, isAdmin: false });
  }
}

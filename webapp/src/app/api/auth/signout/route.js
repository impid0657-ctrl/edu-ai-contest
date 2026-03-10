import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/auth/signout
 * Signs out the current user — clears Supabase session cookies.
 */
export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();

    // Supabase 세션 쿠키를 명시적으로 삭제
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    const response = NextResponse.json({ success: true });

    // sb-* 쿠키 모두 삭제 (Supabase 세션 쿠키 패턴)
    allCookies.forEach(({ name }) => {
      if (name.startsWith("sb-")) {
        response.cookies.set(name, "", {
          maxAge: 0,
          path: "/",
        });
      }
    });

    return response;
  } catch (err) {
    console.error("Signout error:", err);
    // 에러가 나도 쿠키는 삭제 시도
    const response = NextResponse.json({ error: "Signout failed" }, { status: 500 });
    const cookieStore = await cookies();
    cookieStore.getAll().forEach(({ name }) => {
      if (name.startsWith("sb-")) {
        response.cookies.set(name, "", { maxAge: 0, path: "/" });
      }
    });
    return response;
  }
}

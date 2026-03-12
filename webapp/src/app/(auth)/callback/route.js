import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

/**
 * OAuth Callback Handler — exchanges auth code for session.
 * On success: upserts user into public.users, redirects to /.
 * On failure: redirects to /login?error=auth_failed.
 */
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  try {
    const supabase = await createClient();

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("Auth code exchange error:", exchangeError.message);
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Failed to get user after code exchange:", userError?.message);
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    // Upsert user into public.users table (role omitted — DB DEFAULT handles new users, existing roles preserved)
    const { error: upsertError } = await supabase.from("users").upsert(
      {
        id: user.id,
        email: user.email || user.user_metadata?.email || null,
        name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.preferred_username ||
          null,
        phone: user.user_metadata?.phone || null,
      },
      {
        onConflict: "id",
        ignoreDuplicates: false,
      }
    );

    if (upsertError) {
      console.error("User upsert error:", upsertError.message);
      // Don't block login on upsert failure — user can still proceed
    }

    // 팝업 모드 감지: next 파라미터에 popup=1이 포함되어 있으면 postMessage로 처리
    const isPopup = next.includes("popup=1");
    if (isPopup) {
      // 팝업 창에서 부모 창으로 인증 완료 메시지 전송 후 닫기
      // NextResponse를 사용하여 세션 쿠키가 응답에 포함되도록 함
      const html = `<!DOCTYPE html><html><head><title>인증 완료</title></head><body>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'oauth_complete', provider: 'kakao' }, '*');
            window.close();
          } else {
            window.location.href = '/license-apply?auth=done';
          }
        </script>
        <p>인증이 완료되었습니다. 창이 닫히지 않으면 <a href="/license-apply?auth=done">여기를 클릭</a>하세요.</p>
      </body></html>`;

      // cookieStore에서 Supabase 세션 쿠키를 가져와 응답 헤더에 포함
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();
      const response = new NextResponse(html, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });

      // Supabase 세션 관련 쿠키를 응답에 복사
      for (const cookie of allCookies) {
        if (cookie.name.startsWith("sb-") || cookie.name.includes("supabase")) {
          response.cookies.set(cookie.name, cookie.value, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
          });
        }
      }

      return response;
    }

    // 일반 모드: 기존 redirect
    const separator = next.includes("?") ? "&" : "?";
    return NextResponse.redirect(`${origin}${next}${separator}auth=done`);
  } catch (err) {
    console.error("Callback handler error:", err);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }
}


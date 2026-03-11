import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/auth/naver/callback
 * 네이버 OAuth 콜백 — 토큰 교환 → 유저 정보 → 세션 쿠키 → 리다이렉트
 */
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    if (error || !code) {
        return NextResponse.redirect(`${siteUrl}/license-apply?error=naver_denied`);
    }

    try {
        const clientId = process.env.NAVER_CLIENT_ID;
        const clientSecret = process.env.NAVER_CLIENT_SECRET;
        const redirectUri = `${siteUrl}/api/auth/naver/callback`;

        // 1. 토큰 교환
        const tokenRes = await fetch(
            `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${code}&state=${state}`,
            { method: "GET" }
        );
        const tokenData = await tokenRes.json();

        if (!tokenData.access_token) {
            console.error("Naver token error:", tokenData);
            return NextResponse.redirect(`${siteUrl}/license-apply?error=naver_token`);
        }

        // 2. 유저 정보 조회
        const profileRes = await fetch("https://openapi.naver.com/v1/nid/me", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const profileData = await profileRes.json();

        if (profileData.resultcode !== "00") {
            console.error("Naver profile error:", profileData);
            return NextResponse.redirect(`${siteUrl}/license-apply?error=naver_profile`);
        }

        const naverUser = profileData.response;
        // naverUser: { id, email, name, nickname, profile_image, ... }

        // 3. 네이버 유저 정보를 쿠키에 저장 (세션 대용)
        const naverSession = {
            provider: "naver",
            id: naverUser.id,
            email: naverUser.email || "",
            name: naverUser.name || naverUser.nickname || "",
            profile_image: naverUser.profile_image || "",
        };

        // 팝업 모드 감지: state에 popup=1이 포함되어 있으면 postMessage로 처리
        const isPopup = state && state.includes("popup");
        if (isPopup) {
          const html = `<!DOCTYPE html><html><head><title>인증 완료</title></head><body>
            <script>
              // 네이버 세션 쿠키 설정 (팝업 내에서)
              document.cookie = "naver_session=" + encodeURIComponent('${JSON.stringify(naverSession).replace(/'/g, "\\'")}') + "; path=/; max-age=600; SameSite=Lax";
              if (window.opener) {
                window.opener.postMessage({ type: 'oauth_complete', provider: 'naver' }, '*');
                window.close();
              } else {
                window.location.href = '/license-apply?naver_auth=success';
              }
            </script>
            <p>인증이 완료되었습니다. 창이 닫히지 않으면 <a href="/license-apply?naver_auth=success">여기를 클릭</a>하세요.</p>
          </body></html>`;
          return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
        }

        const res = NextResponse.redirect(`${siteUrl}/license-apply?naver_auth=success`);
        res.cookies.set("naver_session", JSON.stringify(naverSession), {
            httpOnly: false, // 프론트에서 읽어야 함
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 600, // 10분 (임시 세션)
            path: "/",
        });

        return res;
    } catch (err) {
        console.error("Naver callback error:", err);
        return NextResponse.redirect(`${siteUrl}/license-apply?error=naver_server`);
    }
}

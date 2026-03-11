import { NextResponse } from "next/server";

/**
 * GET /api/auth/naver
 * 네이버 OAuth 인가 페이지로 리다이렉트
 */
export async function GET(request) {
    const clientId = process.env.NAVER_CLIENT_ID;
    const { searchParams } = new URL(request.url);
    const siteUrl = searchParams.get("siteUrl") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const redirectUri = `${siteUrl}/api/auth/naver/callback`;
    const state = crypto.randomUUID();

    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&auth_type=reprompt`;

    // state를 쿠키에 저장 (CSRF 방지)
    const res = NextResponse.redirect(naverAuthUrl);
    res.cookies.set("naver_oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 300, // 5분
        path: "/",
    });
    return res;
}

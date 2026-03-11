import { cookies } from "next/headers";

/**
 * GET /api/auth/signout?redirect=/license-apply
 * Server-side sign out — forcefully clears all Supabase auth cookies.
 * Shows a confirmation page before redirecting.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const redirect = searchParams.get("redirect") || "/";

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  // Build Set-Cookie headers to delete auth cookies
  const deleteCookies = [];
  for (const cookie of allCookies) {
    if (
      cookie.name.includes("supabase") ||
      cookie.name.includes("sb-") ||
      cookie.name.includes("auth-token") ||
      cookie.name === "naver_session" ||
      cookie.name === "naver_oauth_state"
    ) {
      deleteCookies.push(`${cookie.name}=; Max-Age=0; Path=/;`);
    }
  }

  // Return an HTML page that shows logout message and auto-redirects
  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>로그아웃 완료</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      background: #fff;
      border-radius: 20px;
      padding: 60px 50px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
      max-width: 450px;
      width: 90%;
    }
    .icon { font-size: 64px; margin-bottom: 20px; }
    h2 { font-size: 24px; font-weight: 700; color: #333; margin-bottom: 12px; }
    p { font-size: 15px; color: #666; line-height: 1.6; margin-bottom: 24px; }
    .countdown {
      display: inline-block;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      padding: 10px 24px;
      border-radius: 30px;
    }
    a {
      display: inline-block;
      margin-top: 16px;
      color: #667eea;
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
    }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✅</div>
    <h2>로그아웃 되었습니다</h2>
    <p>인증 세션이 정상적으로 해제되었습니다.<br>잠시 후 이용권 신청 페이지로 이동합니다.</p>
    <div class="countdown"><span id="sec">3</span>초 후 자동 이동...</div>
    <br>
    <a href="${redirect}">바로 이동하기 →</a>
  </div>
  <script>
    // Clear client-side storage too
    try { localStorage.clear(); } catch {}
    try { sessionStorage.clear(); } catch {}
    // 네이버 세션 쿠키 삭제
    document.cookie = 'naver_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'naver_oauth_state=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    let count = 3;
    const el = document.getElementById('sec');
    const timer = setInterval(() => {
      count--;
      if (el) el.textContent = count;
      if (count <= 0) {
        clearInterval(timer);
        window.location.href = "${redirect}";
      }
    }, 1000);
  </script>
</body>
</html>`;

  const headers = {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store, no-cache, must-revalidate",
  };

  // Add cookie deletion headers
  if (deleteCookies.length > 0) {
    headers["Set-Cookie"] = deleteCookies.join(", ");
  }

  return new Response(html, { status: 200, headers });
}

import { updateSession } from "@/lib/supabase/middleware";
import { formatKST } from "@/lib/dateUtils";
import { NextResponse } from "next/server";

/**
 * Next.js Middleware
 * - Refreshes Supabase auth session on every request
 * - Logs requests with KST timestamp (doc 12.7 Rule 5)
 * - Protects /admin/* routes (requires admin role — queries public.users)
 * - If Supabase connection fails, /admin routes are BLOCKED (fail-secure)
 */
export async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Log request with KST timestamp
  try {
    const kstTimestamp = formatKST(new Date(), "yyyy-MM-dd HH:mm:ss");
    console.log(`[${kstTimestamp} KST] ${request.method} ${pathname}`);
  } catch { /* logging failure should never block requests */ }

  // Protect /admin/* routes — MUST block before anything else
  if (pathname.startsWith("/admin")) {
    try {
      const { supabase, user, supabaseResponse } = await updateSession(request);

      if (!user) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Query user role from public.users table
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError || !profile || profile.role !== "admin") {
        return NextResponse.redirect(new URL("/access-denied", request.url));
      }

      // 보안 로그: 관리자 페이지 접근 기록 (비동기, fire-and-forget)
      // 정적 리소스나 API는 제외하고 페이지 접근만 기록
      if (!pathname.startsWith("/admin/api") && !pathname.includes(".")) {
        try {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
          if (supabaseUrl && serviceKey) {
            const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
              || request.headers.get("x-real-ip") || "unknown";
            // fire-and-forget: waitUntil 대안으로 catch 무시
            fetch(`${supabaseUrl}/rest/v1/admin_access_logs`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "apikey": serviceKey,
                "Authorization": `Bearer ${serviceKey}`,
              },
              body: JSON.stringify({
                event_type: "page_access",
                ip_address: ip,
                user_agent: (request.headers.get("user-agent") || "").slice(0, 500),
                email: user.email || null,
                path: pathname,
                severity: "info",
              }),
            }).catch(() => {});
          }
        } catch { /* 로깅 실패는 무시 */ }
      }

      return supabaseResponse;
    } catch (err) {
      // Supabase connection failed — FAIL SECURE: block admin access
      console.error("Middleware auth error for /admin:", err.message);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("error", "auth_unavailable");
      return NextResponse.redirect(loginUrl);
    }
  }

  // Non-admin routes: just refresh session (non-blocking)
  try {
    const { supabaseResponse } = await updateSession(request);
    return supabaseResponse;
  } catch {
    // Supabase unavailable for non-admin routes — let request through
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, css, js, etc.)
     * - original-template/ (Evalo static files)
     * - evalo-*/ (legacy Evalo asset dirs)
     */
    "/((?!_next/static|_next/image|favicon.ico|assets/|original-template/|evalo-css/|evalo-fonts/|evalo-images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)",
  ],
};

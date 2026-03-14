import { updateSession } from "@/lib/supabase/middleware";
import { formatKST } from "@/lib/dateUtils";
import { NextResponse } from "next/server";

// 공격 패턴 (SQL Injection, XSS, 경로 탐색)
const ATTACK_PATTERNS = [
  // SQL Injection
  { pattern: /('\s*(OR|AND)\s+[\d'"])/i, type: "sql_injection" },
  { pattern: /(UNION\s+(ALL\s+)?SELECT)/i, type: "sql_injection" },
  { pattern: /(DROP\s+(TABLE|DATABASE))/i, type: "sql_injection" },
  { pattern: /(INSERT\s+INTO|DELETE\s+FROM)/i, type: "sql_injection" },
  { pattern: /(\bEXEC(\s|UTE))/i, type: "sql_injection" },
  // XSS
  { pattern: /(<script[\s>])/i, type: "xss" },
  { pattern: /(javascript\s*:)/i, type: "xss" },
  { pattern: /(on(error|load|click|mouseover)\s*=)/i, type: "xss" },
  { pattern: /(<iframe[\s>])/i, type: "xss" },
  // 경로 탐색
  { pattern: /(\.\.\/|\.\.\\)/i, type: "path_traversal" },
  { pattern: /(\/etc\/passwd|\/windows\/)/i, type: "path_traversal" },
];

function detectAttack(url) {
  const fullUrl = decodeURIComponent(url);
  for (const { pattern, type } of ATTACK_PATTERNS) {
    if (pattern.test(fullUrl)) {
      return { detected: true, type, matched: fullUrl.match(pattern)?.[0] || "" };
    }
  }
  return { detected: false };
}

/**
 * Next.js Middleware
 * - Refreshes Supabase auth session on every request
 * - Detects attack patterns (SQL injection, XSS, path traversal) — log only
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

  // 공격 패턴 감지 (기록만, 차단 안함)
  try {
    const fullUrl = request.nextUrl.href;
    const attack = detectAttack(fullUrl);
    if (attack.detected) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl && serviceKey) {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
          || request.headers.get("x-real-ip") || "unknown";
        fetch(`${supabaseUrl}/rest/v1/admin_access_logs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": serviceKey,
            "Authorization": `Bearer ${serviceKey}`,
          },
          body: JSON.stringify({
            event_type: "attack_detected",
            ip_address: ip,
            user_agent: (request.headers.get("user-agent") || "").slice(0, 500),
            email: null,
            path: pathname,
            severity: attack.type === "path_traversal" ? "warning" : "critical",
            details: { attack_type: attack.type, matched: attack.matched.slice(0, 200) },
          }),
        }).catch(() => {});
      }
    }
  } catch { /* 감지 실패는 무시 */ }

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
    // Match all request paths except:
    // _next/static, _next/image, favicon.ico, public assets,
    // original-template/, evalo-* (legacy Evalo asset dirs)
    "/((?!_next/static|_next/image|favicon.ico|assets/|original-template/|evalo-css/|evalo-fonts/|evalo-images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)",
  ],
};

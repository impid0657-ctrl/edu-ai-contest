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

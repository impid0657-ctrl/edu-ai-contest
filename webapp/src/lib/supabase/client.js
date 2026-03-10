import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for browser-side usage.
 * Uses the public anon key — safe to expose in client bundles.
 * 빌드 시(프리렌더링) 환경변수가 없으면 더미값으로 대체하여 빌드 에러 방지.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"
  );
}

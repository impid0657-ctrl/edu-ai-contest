import { createClient } from "@supabase/supabase-js";

/**
 * Create a Supabase admin client using SERVICE_ROLE_KEY.
 * Server-only — NEVER import in client components.
 * Used for guest file uploads and guest submission inserts.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-role-key"
  );
}

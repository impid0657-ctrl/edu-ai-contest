/**
 * Environment variable validation.
 * Import in layout.jsx or middleware to catch missing vars early.
 *
 * Usage (server-side only):
 *   import { validateEnv } from "@/lib/validateEnv";
 *   validateEnv(); // throws if critical vars are missing
 */

const REQUIRED_VARS = [
  { key: "NEXT_PUBLIC_SUPABASE_URL", description: "Supabase project URL" },
  { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", description: "Supabase public anon key" },
  { key: "SUPABASE_SERVICE_ROLE_KEY", description: "Supabase service role key (server-only)" },
  { key: "GUEST_JWT_SECRET", description: "Secret for guest submission JWT tokens" },
];

const OPTIONAL_VARS = [
  { key: "GEMINI_API_KEY", description: "Google Gemini API key (needed for chatbot RAG)" },
  { key: "RESEND_API_KEY", description: "Resend API key (needed for OTP + confirmation emails)" },
  { key: "KAKAO_CLIENT_ID", description: "Kakao OAuth client ID" },
  { key: "KAKAO_CLIENT_SECRET", description: "Kakao OAuth client secret" },
  { key: "NAVER_CLIENT_ID", description: "Naver OAuth client ID" },
  { key: "NAVER_CLIENT_SECRET", description: "Naver OAuth client secret" },
  { key: "CONTEST_DEADLINE_KST", description: "Fallback deadline (DB-backed is primary)" },
];

/**
 * Validate that all required environment variables are set.
 * Logs warnings for optional but recommended vars.
 * @param {{ throwOnMissing?: boolean }} opts
 * @returns {{ valid: boolean, missing: string[], warnings: string[] }}
 */
export function validateEnv({ throwOnMissing = false } = {}) {
  const missing = [];
  const warnings = [];

  for (const { key, description } of REQUIRED_VARS) {
    if (!process.env[key]) {
      missing.push(`❌ ${key} — ${description}`);
    }
  }

  for (const { key, description } of OPTIONAL_VARS) {
    if (!process.env[key]) {
      warnings.push(`⚠️ ${key} — ${description}`);
    }
  }

  if (missing.length > 0) {
    const msg = `\n🚨 Missing REQUIRED environment variables:\n${missing.join("\n")}\n`;
    console.error(msg);
    if (throwOnMissing) {
      throw new Error(`Missing required env vars: ${missing.map((m) => m.split(" — ")[0].replace("❌ ", "")).join(", ")}`);
    }
  }

  if (warnings.length > 0) {
    console.warn(`\n⚠️ Missing OPTIONAL environment variables (some features will be disabled):\n${warnings.join("\n")}\n`);
  }

  return {
    valid: missing.length === 0,
    missing: missing.map((m) => m.split(" — ")[0].replace("❌ ", "")),
    warnings: warnings.map((w) => w.split(" — ")[0].replace("⚠️ ", "")),
  };
}

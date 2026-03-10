import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/site-settings — public read-only access to site settings
 * Returns only safe, public-facing settings (deadline, contest name, etc.)
 * No auth required.
 * Graceful fallback: returns defaults if DB unavailable.
 */

const PUBLIC_KEYS = [
  "contest_deadline",
  "contest_name",
  "contest_location",
  "submission_enabled",
];

const DEFAULTS = {
  contest_deadline: "2026-05-31T23:59:59+09:00",
  contest_name: "제8회 교육 공공데이터 AI활용대회",
  contest_location: "세종특별자치시 교육부",
  submission_enabled: true,
};

export async function GET() {
  try {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("site_settings")
      .select("key, value")
      .in("key", PUBLIC_KEYS);

    if (error) {
      console.error("Public site settings fetch error:", error.message);
      // Graceful fallback — return defaults instead of 500
      return NextResponse.json({ settings: DEFAULTS });
    }

    const settings = { ...DEFAULTS };
    (data || []).forEach((row) => {
      try {
        settings[row.key] = typeof row.value === "string" ? JSON.parse(row.value) : row.value;
      } catch {
        settings[row.key] = row.value;
      }
    });

    return NextResponse.json({ settings });
  } catch (err) {
    console.error("GET /api/site-settings error:", err);
    // Graceful fallback — return defaults instead of 500
    return NextResponse.json({ settings: DEFAULTS });
  }
}

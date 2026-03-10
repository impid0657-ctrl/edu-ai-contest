import { format, parseISO } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

/**
 * KST Timezone Utilities (doc 12.7 — Mandatory)
 * All date/time operations MUST use these helpers.
 * BANNED: raw `new Date()` for deadline comparisons,
 *         `date.toLocaleDateString()`, storing KST strings in DB.
 */

export const KST_TIMEZONE = "Asia/Seoul";

/**
 * Format any date to a KST-localized string.
 * @param {Date|string} date - Date object or ISO string
 * @param {string} formatStr - date-fns format pattern (e.g. "yyyy-MM-dd HH:mm:ss")
 * @returns {string} Formatted date string in KST
 */
export function formatKST(date, formatStr = "yyyy-MM-dd HH:mm:ss") {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const kstDate = toZonedTime(dateObj, KST_TIMEZONE);
  return format(kstDate, formatStr);
}

/**
 * Get the current time in KST as a Date-like object.
 * @returns {Date} Current KST time
 */
export function nowKST() {
  return toZonedTime(new Date(), KST_TIMEZONE);
}

/**
 * Convert a KST date string to a UTC Date object (for DB storage).
 * @param {string} kstDateStr - Date string assumed to be in KST (e.g. "2026-05-31T23:59:59")
 * @returns {Date} UTC Date object
 */
export function kstStringToUTC(kstDateStr) {
  return fromZonedTime(kstDateStr, KST_TIMEZONE);
}

/**
 * Check if a KST deadline has passed.
 * Priority: explicit param → env var.
 * For DB-backed deadline, use getDeadlineFromDB() first, then pass the result here.
 *
 * @param {string} [deadlineKST] - ISO 8601 deadline string.
 *   Defaults to env var CONTEST_DEADLINE_KST.
 * @returns {boolean} true if the deadline has passed
 */
export function isDeadlinePassed(deadlineKST) {
  const deadline = deadlineKST || process.env.CONTEST_DEADLINE_KST;
  if (!deadline) {
    // If no deadline configured, default to open (not passed)
    console.warn("No contest deadline configured — treating as open");
    return false;
  }
  const deadlineUTC = parseISO(deadline);
  const currentKST = nowKST();
  const deadlineInKST = toZonedTime(deadlineUTC, KST_TIMEZONE);
  return currentKST > deadlineInKST;
}

/**
 * Fetch contest deadline from DB (site_settings table).
 * SERVER-SIDE ONLY — requires createAdminClient.
 * Returns the deadline string or null if not set.
 *
 * @returns {Promise<string|null>} ISO 8601 deadline string or null
 */
export async function getDeadlineFromDB() {
  try {
    // Dynamic import to avoid bundling in client code
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from("site_settings")
      .select("value")
      .eq("key", "contest_deadline")
      .single();

    if (error || !data) return null;

    // value is stored as JSONB — may be a quoted string
    const val = data.value;
    if (typeof val === "string") {
      try { return JSON.parse(val); } catch { return val; }
    }
    return val;
  } catch (err) {
    console.error("getDeadlineFromDB error:", err);
    return null;
  }
}

/**
 * Check submission enabled status from DB.
 * SERVER-SIDE ONLY.
 *
 * @returns {Promise<boolean>} true if submissions are enabled
 */
export async function isSubmissionEnabled() {
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const adminClient = createAdminClient();

    const { data } = await adminClient
      .from("site_settings")
      .select("value")
      .eq("key", "submission_enabled")
      .single();

    if (!data) return true; // default: enabled
    const val = data.value;
    if (typeof val === "boolean") return val;
    if (typeof val === "string") {
      try { return JSON.parse(val); } catch { return val === "true"; }
    }
    return true;
  } catch (err) {
    console.error("isSubmissionEnabled error:", err);
    return true;
  }
}

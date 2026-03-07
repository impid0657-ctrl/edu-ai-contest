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
 * @param {string} [deadlineKST] - ISO 8601 deadline string with KST offset.
 *   Defaults to env var CONTEST_DEADLINE_KST.
 * @returns {boolean} true if the deadline has passed
 */
export function isDeadlinePassed(deadlineKST) {
  const deadline = deadlineKST || process.env.CONTEST_DEADLINE_KST;
  if (!deadline) {
    throw new Error("CONTEST_DEADLINE_KST is not set");
  }
  const deadlineUTC = parseISO(deadline);
  const currentKST = nowKST();
  const deadlineInKST = toZonedTime(deadlineUTC, KST_TIMEZONE);
  return currentKST > deadlineInKST;
}

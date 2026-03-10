/**
 * General utility functions.
 */

/**
 * Combine CSS class names, filtering out falsy values.
 * @param  {...string} classes - Class name strings
 * @returns {string} Combined class string
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Truncate text to a given length with ellipsis.
 * @param {string} text - Input text
 * @param {number} maxLength - Maximum character length
 * @returns {string} Truncated text
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Generate a unique submission number.
 * Format: EDU-YYYYMMDD-XXXXX (random 5 alphanumeric chars)
 * Example: EDU-20260315-A3F7K
 */
export function generateSubmissionNo() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No I, O, 0, 1 (ambiguity)
  let random = "";
  for (let i = 0; i < 5; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `EDU-${y}${m}${d}-${random}`;
}


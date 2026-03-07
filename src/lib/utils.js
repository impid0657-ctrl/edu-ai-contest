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

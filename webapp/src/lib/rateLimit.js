/**
 * In-memory rate limiter for Vercel serverless functions.
 *
 * NOTE: Vercel serverless = per-instance memory. This won't share state
 * across instances, but it blocks single-IP floods within one instance.
 * For production, upgrade to Upstash Redis (@upstash/ratelimit).
 *
 * Usage:
 *   import { rateLimit } from "@/lib/rateLimit";
 *   const limiter = rateLimit({ interval: 60_000, limit: 10 });
 *
 *   export async function POST(request) {
 *     const ip = request.headers.get("x-forwarded-for") || "unknown";
 *     const { success, remaining } = limiter.check(ip);
 *     if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
 *     // ...
 *   }
 */

const caches = new Map();

/**
 * Create a rate limiter instance.
 * @param {{ interval: number, limit: number }} opts
 *   interval — time window in ms (e.g. 60_000 for 1 minute)
 *   limit — max requests per IP within the window
 */
export function rateLimit({ interval = 60_000, limit = 10 } = {}) {
  // Use a unique cache per limiter instance
  const id = Symbol();
  caches.set(id, new Map());

  // Cleanup expired entries every 5 minutes
  const cleanupInterval = setInterval(() => {
    const cache = caches.get(id);
    if (!cache) return;
    const now = Date.now();
    for (const [key, entry] of cache) {
      if (now - entry.start > interval * 2) {
        cache.delete(key);
      }
    }
  }, 5 * 60_000);

  // Don't prevent process exit
  if (cleanupInterval.unref) cleanupInterval.unref();

  return {
    /**
     * Check if the key (IP) is within the rate limit.
     * @param {string} key — typically the client IP
     * @returns {{ success: boolean, remaining: number, resetAt: number }}
     */
    check(key) {
      const cache = caches.get(id);
      const now = Date.now();
      const entry = cache.get(key);

      if (!entry || now - entry.start > interval) {
        // New window
        cache.set(key, { start: now, count: 1 });
        return { success: true, remaining: limit - 1, resetAt: now + interval };
      }

      entry.count++;
      const remaining = Math.max(0, limit - entry.count);

      if (entry.count > limit) {
        return { success: false, remaining: 0, resetAt: entry.start + interval };
      }

      return { success: true, remaining, resetAt: entry.start + interval };
    },
  };
}

/**
 * Extract client IP from request headers (Vercel sets x-forwarded-for).
 * @param {Request} request
 * @returns {string}
 */
export function getClientIP(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

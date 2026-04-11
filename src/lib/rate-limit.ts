/**
 * Simple in-memory rate limiter for API routes.
 * For production with multiple serverless instances, swap with @upstash/ratelimit.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitEntry>();

// Periodic cleanup to prevent memory leak
let cleanupStarted = false;
function startCleanup() {
  if (cleanupStarted) return;
  cleanupStarted = true;
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of buckets.entries()) {
      if (entry.resetAt < now) buckets.delete(key);
    }
  }, 60_000);
}

export interface RateLimitOptions {
  /** Max requests per window */
  limit: number;
  /** Window in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  startCleanup();
  const now = Date.now();
  const entry = buckets.get(identifier);

  if (!entry || entry.resetAt < now) {
    const resetAt = now + options.windowMs;
    buckets.set(identifier, { count: 1, resetAt });
    return { success: true, remaining: options.limit - 1, resetAt };
  }

  if (entry.count >= options.limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: options.limit - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Extract a stable identifier for the client from the request.
 * Falls back to "anonymous" if no IP headers are available.
 */
export function getClientId(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "anonymous";
}

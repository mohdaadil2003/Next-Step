import { NextRequest, NextResponse } from "next/server";
import { redis } from "./redis";

/**
 * Redis-backed rate limiter — works across serverless instances.
 * Falls back to allowing the request if Redis is unavailable.
 */
export function rateLimit(limit: number = 60, windowMs: number = 60_000) {
  const windowSec = Math.ceil(windowMs / 1000);

  return async function checkRateLimit(
    req: NextRequest
  ): Promise<NextResponse | null> {
    // Use rightmost x-forwarded-for (set by proxy), not leftmost (spoofable)
    const forwarded = req.headers.get("x-forwarded-for")?.split(",");
    const ip =
      forwarded?.[forwarded.length - 1]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const key = `nextstep:rl:${ip}`;

    try {
      const current = await redis.incr(key);
      if (current === 1) {
        await redis.expire(key, windowSec);
      }

      if (current > limit) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          {
            status: 429,
            headers: { "Retry-After": String(windowSec) },
          }
        );
      }
    } catch {
      // If Redis is down, allow the request rather than blocking everyone
    }

    return null;
  };
}

// Preconfigured rate limiters
export const apiLimiter = rateLimit(200, 15 * 60_000); // 200 req / 15 min
export const authLimiter = rateLimit(10, 15 * 60_000); // 10 req / 15 min (tighter for auth)
export const uploadLimiter = rateLimit(10, 60_000); // 10 req / 1 min
export const contactLimiter = rateLimit(5, 15 * 60_000); // 5 req / 15 min

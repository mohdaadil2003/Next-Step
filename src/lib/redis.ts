import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

// Cache helpers
const DEFAULT_TTL = 300; // 5 minutes

const PREFIX = "nextstep:";

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(`${PREFIX}${key}`);
    return data ? (JSON.parse(data) as T) : null;
  } catch (err) {
    console.warn("[Redis] Cache read failed:", (err as Error).message);
    return null;
  }
}

export async function setCache(
  key: string,
  data: unknown,
  ttl: number = DEFAULT_TTL
): Promise<void> {
  try {
    await redis.set(`${PREFIX}${key}`, JSON.stringify(data), "EX", ttl);
  } catch (err) {
    console.warn("[Redis] Cache write failed:", (err as Error).message);
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  try {
    const fullPattern = `${PREFIX}${pattern}`;
    let cursor = "0";
    do {
      const [nextCursor, keys] = await redis.scan(
        cursor, "MATCH", fullPattern, "COUNT", 100
      );
      cursor = nextCursor;
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== "0");
  } catch (err) {
    console.warn("[Redis] Cache invalidation failed:", (err as Error).message);
  }
}

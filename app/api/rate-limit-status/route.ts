import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Reuse the same ratelimiter config
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    analytics: true,
    prefix: "@upstash/ratelimit",
});

export async function GET(req: Request) {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';

    let rateLimitInfo = { limit: 5, remaining: 5, reset: 0 };

    // Only check rate limit if Redis env vars are present
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        try {
            const redis = Redis.fromEnv();
            const key = `@upstash/ratelimit:${ip}`;

            // Get current count and TTL without incrementing
            const [count, ttl] = await Promise.all([
                redis.get<number>(key),
                redis.ttl(key)
            ]);

            const limit = 5;
            const currentCount = count ?? 0;
            const remaining = Math.max(0, limit - currentCount);
            const reset = ttl > 0 ? Date.now() + (ttl * 1000) : Date.now() + (10 * 60 * 1000);

            rateLimitInfo = { limit, remaining, reset };
        } catch (error) {
            console.error('Rate limit check error:', error);
        }
    } else {
        // Fallback for local dev
        const globalStore = globalThis as any;
        if (!globalStore.localRateLimit) {
            globalStore.localRateLimit = new Map<string, { count: number, reset: number }>();
        }

        const now = Date.now();
        const window = 10 * 60 * 1000; // 10m
        const limit = 5;

        let record = globalStore.localRateLimit.get(ip);
        if (!record || now > record.reset) {
            // No record or expired - user has full limit
            rateLimitInfo = { limit, remaining: limit, reset: now + window };
        } else {
            // Use existing record
            const remaining = Math.max(0, limit - record.count);
            rateLimitInfo = { limit, remaining, reset: record.reset };
        }
    }

    return new Response(JSON.stringify(rateLimitInfo), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { createClient } from '@/utils/supabase/server';

// Initialize Redis client
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

// Rate limiter for anonymous users (IP-based): 10 requests per 30 minutes
const anonymousRatelimit = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "30 m"),
    analytics: true,
    prefix: "ratelimit:anon",
}) : null;

// Rate limiter for authenticated users (user ID-based): 10 requests per 30 minutes
const authenticatedRatelimit = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "30 m"),
    analytics: true,
    prefix: "ratelimit:auth",
}) : null;

export async function GET(req: Request) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';

    // Check if user is authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const rateLimitKey = user ? `user:${user.id}` : `ip:${ip}`;
    const limiter = user ? authenticatedRatelimit : anonymousRatelimit;

    let rateLimitInfo = { limit: 10, remaining: 10, reset: 0 };

    if (limiter) {
        // Use getRemaining to check without incrementing
        // getRemaining() returns Promise<number> - just the remaining count, not an object
        try {
            // Type assertion needed because TypeScript types may be incomplete
            // Some versions of the custom limiter might return an object { remaining, reset }
            const remainingResult = await (limiter as any).getRemaining(rateLimitKey);
            const remaining = typeof remainingResult === 'object' ? remainingResult.remaining : remainingResult;

            // getRemaining() doesn't always provide reset time, so we estimate based on window duration
            const windowMs = 30 * 60 * 1000; // 30 minutes
            const reset = typeof remainingResult === 'object' && remainingResult.reset
                ? remainingResult.reset
                : Date.now() + windowMs;

            rateLimitInfo = {
                limit: 10,
                remaining: typeof remaining === 'number' ? remaining : 10,
                reset: typeof reset === 'number' ? reset : Date.now() + windowMs
            };
        } catch (error) {
            console.error('Rate limit check error:', error);
            // Fallback to default values on error
        }
    } else {
        // Fallback for local dev (no Redis)
        const globalStore = globalThis as any;
        if (!globalStore.localRateLimit) {
            globalStore.localRateLimit = new Map<string, { count: number, reset: number }>();
        }

        const now = Date.now();
        const window = 30 * 60 * 1000; // 30 min (match production)
        const limit = 10;

        let record = globalStore.localRateLimit.get(rateLimitKey);
        if (!record || now > record.reset) {
            rateLimitInfo = { limit, remaining: limit, reset: now + window };
        } else {
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


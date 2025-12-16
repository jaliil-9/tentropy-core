import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { createClient } from '@/utils/supabase/server';

// Initialize Redis client
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

// Rate limiter for anonymous users (IP-based): 5 requests per 20 minutes
const anonymousRatelimit = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "20 m"),
    analytics: true,
    prefix: "ratelimit:anon",
}) : null;

// Rate limiter for authenticated users (user ID-based): 5 requests per 20 minutes
const authenticatedRatelimit = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "20 m"),
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

    let rateLimitInfo = { limit: 5, remaining: 5, reset: 0 };

    if (limiter) {
        // Use getRemaining to check without incrementing
        // getRemaining() returns Promise<number> - just the remaining count, not an object
        try {
            // Type assertion needed because TypeScript types may be incomplete
            const remaining = (await (limiter as any).getRemaining(rateLimitKey)) as number;
            
            // getRemaining() doesn't provide reset time, so we estimate based on window duration
            // Since it's a 20-minute sliding window, return reset as 20 minutes from now
            // This is an approximation - actual reset time depends on when first request in window was made
            const windowMs = 20 * 60 * 1000; // 20 minutes
            const reset = Date.now() + windowMs;
            
            rateLimitInfo = {
                limit: 5,
                remaining: remaining,
                reset: reset
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
        const window = 20 * 60 * 1000; // 20 min (match production)
        const limit = 5;

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


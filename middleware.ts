import { type NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis for rate limiting (edge-compatible)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

// Global rate limiter: 100 requests per minute per IP
const globalRatelimit = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    prefix: 'ratelimit:global',
}) : null;

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'anonymous';

    // Global rate limiting for all requests
    if (globalRatelimit) {
        const { success, limit, remaining, reset } = await globalRatelimit.limit(ip);

        if (!success) {
            return new NextResponse(
                JSON.stringify({ error: 'Too many requests. Please slow down.' }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RateLimit-Limit': limit.toString(),
                        'X-RateLimit-Remaining': remaining.toString(),
                        'X-RateLimit-Reset': reset.toString(),
                        'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
                    },
                }
            );
        }
    }

    // Open-core: No session management, just pass through
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)',
    ],
};

import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

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

// Tighter rate limiter for specific API routes (per IP)
const routeRatelimit = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'),
    prefix: 'ratelimit:route',
}) : null;

// Protected routes that require authentication
const PROTECTED_ROUTES = [
    '/api/admin',
    '/admin',
    '/profile',
    '/settings',
    '/logs',
];

// API routes that should be rate limited more aggressively
const RATE_LIMITED_API_ROUTES = [
    '/api/submit',
    '/api/feedback',
];

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

    // Route-specific throttling for sensitive APIs
    const isRateLimitedApi = RATE_LIMITED_API_ROUTES.some(route => pathname.startsWith(route));
    if (isRateLimitedApi && routeRatelimit) {
        const { success, limit, remaining, reset } = await routeRatelimit.limit(ip);
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

    // Update Supabase session
    const response = await updateSession(request);

    // Check protected routes
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

    if (isProtectedRoute) {
        // Session check happens in updateSession, but we can add additional checks here
        // For now, the individual pages handle their own auth redirects
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - Static assets (images, fonts, etc.)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)',
    ],
}

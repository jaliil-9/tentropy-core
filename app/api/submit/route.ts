import { Sandbox } from '@e2b/code-interpreter';
import { getChallengeById } from '@/lib/challenges';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { logger } from '@/lib/logger';
import { createClient } from '@/utils/supabase/server';

// Initialize Redis client (reused for rate limiting and idempotency)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

// Rate limiter for anonymous users (IP-based): 5 requests per 30 minutes
const anonymousRatelimit = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "30 m"),
    analytics: true,
    prefix: "ratelimit:anon",
}) : null;

// Rate limiter for authenticated users (user ID-based): 5 requests per 30 minutes
const authenticatedRatelimit = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "30 m"),
    analytics: true,
    prefix: "ratelimit:auth",
}) : null;

export async function POST(req: Request) {
    try {
        // Get authenticated user (if any)
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Extract IP address (use first IP if comma-separated proxies)
        const forwardedFor = req.headers.get('x-forwarded-for');
        const ip = forwardedFor?.split(',')[0].trim() ?? '127.0.0.1';

        // Parse request body early to get idempotency key
        const body = await req.json();
        const { code, challengeId, sandboxID, idempotencyKey } = body;

        // ==================== IDEMPOTENCY CHECK ====================
        if (idempotencyKey && redis) {
            const existingRun = await redis.get(`idem:${idempotencyKey}`);
            if (existingRun) {
                logger.info(`[API Submit] Duplicate submission blocked: ${idempotencyKey}`);
                return new Response(JSON.stringify({
                    error: 'Duplicate submission detected. Please wait for your previous submission to complete.',
                    status: existingRun
                }), {
                    status: 409,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            // Mark this submission as in-progress (5 minute TTL)
            await redis.set(`idem:${idempotencyKey}`, 'pending', { ex: 300 });
        }

        // ==================== RATE LIMIT CHECK ====================
        // Use composite key: userId for auth users, IP for anonymous
        const rateLimitKey = user ? `user:${user.id}` : `ip:${ip}`;
        const limiter = user ? authenticatedRatelimit : anonymousRatelimit;
        const limitValue = 5; // Same limit for both auth and anon

        let rateLimitInfo = { limit: limitValue, remaining: limitValue, reset: 0 };

        if (limiter) {
            const { success, limit, reset, remaining } = await limiter.limit(rateLimitKey);
            rateLimitInfo = { limit, remaining, reset };

            if (!success) {
                // Clean up idempotency key if rate limited
                if (idempotencyKey && redis) {
                    await redis.del(`idem:${idempotencyKey}`);
                }

                const message = `Rate limit exceeded. You have ${limit} runs every 30 minutes.`;

                return new Response(JSON.stringify({ error: message }), {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RateLimit-Limit': limit.toString(),
                        'X-RateLimit-Remaining': remaining.toString(),
                        'X-RateLimit-Reset': reset.toString()
                    }
                });
            }
        } else {
            // Fallback for local dev without Redis
            const globalStore = globalThis as any;
            if (!globalStore.localRateLimit) {
                globalStore.localRateLimit = new Map<string, { count: number, reset: number }>();
            }

            const now = Date.now();
            const window = 30 * 60 * 1000; // 30m
            const limit = 5;

            let record = globalStore.localRateLimit.get(rateLimitKey);
            if (!record || now > record.reset) {
                record = { count: 0, reset: now + window };
            }

            record.count++;
            globalStore.localRateLimit.set(rateLimitKey, record);

            const remaining = Math.max(0, limit - record.count);
            rateLimitInfo = { limit, remaining, reset: record.reset };

            if (record.count > limit) {
                return new Response(JSON.stringify({ error: "Rate limit exceeded (Local)." }), {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RateLimit-Limit': limit.toString(),
                        'X-RateLimit-Remaining': remaining.toString(),
                        'X-RateLimit-Reset': record.reset.toString()
                    }
                });
            }
        }

        // ==================== VALIDATION ====================
        if (!code || !challengeId) {
            // Clean up idempotency key on validation failure
            if (idempotencyKey && redis) {
                await redis.del(`idem:${idempotencyKey}`);
            }
            return new Response(JSON.stringify({ error: 'Missing code or challengeId' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const challenge = await getChallengeById(challengeId);
        if (!challenge) {
            if (idempotencyKey && redis) {
                await redis.del(`idem:${idempotencyKey}`);
            }
            return new Response('Challenge not found', { status: 404 });
        }

        const encoder = new TextEncoder();

        const stream = new ReadableStream({
            async start(controller) {
                let sandbox;
                try {
                    // 1. Connect/Create Sandbox
                    if (sandboxID) {
                        try {
                            sandbox = await Sandbox.connect(sandboxID, { apiKey: process.env.E2B_API_KEY });
                        } catch (e) {
                            logger.debug('Failed to connect to sandbox:', e);
                        }
                    }

                    if (!sandbox) {
                        const templateId = process.env.E2B_TEMPLATE_ID || 'base';
                        sandbox = await Sandbox.create(templateId, {
                            apiKey: process.env.E2B_API_KEY,
                            timeoutMs: 60000 // 60s timeout to allow for pip install
                        });
                    }

                    // 2. Setup Files
                    await sandbox.files.write('solution.py', code);
                    await sandbox.files.write('test_main.py', challenge.testCode);

                    // 3. Install Dependencies (Restored)
                    controller.enqueue(encoder.encode("Installing dependencies...\n"));
                    await sandbox.commands.run('pip install pytest requests');

                    // 4. Run Tests
                    controller.enqueue(encoder.encode("Running tests...\n\n"));

                    // 4. Run Tests with Streaming
                    let exitCode = 0;
                    try {
                        const execution = await sandbox.commands.run('pytest -s test_main.py', {
                            timeoutMs: 15000,
                            onStdout: (text) => {
                                controller.enqueue(encoder.encode(text));
                            },
                            onStderr: (text) => {
                                controller.enqueue(encoder.encode(text));
                            }
                        });
                        exitCode = execution.exitCode ?? 0;
                    } catch (e: unknown) {
                        // If it throws, it might be a timeout or a non-zero exit code (depending on SDK version)
                        const error = e as { exitCode?: number; message?: string };
                        exitCode = error.exitCode ?? 1;
                        if (!error.exitCode && error.message) {
                            controller.enqueue(encoder.encode(`\nSystem Error: ${error.message}\n`));
                        }
                    }

                    // 5. Send Result Footer
                    const result = {
                        success: exitCode === 0,
                        sandboxID: sandbox.sandboxId
                    };

                    // Send a special delimiter line that the frontend can parse
                    controller.enqueue(encoder.encode(`\n__JSON_RESULT__:${JSON.stringify(result)}`));

                } catch (error) {
                    const errorMsg = error instanceof Error ? error.message : String(error);
                    controller.enqueue(encoder.encode(`\nCritical Error: ${errorMsg}`));
                    const result = { success: false, sandboxID: sandbox?.sandboxId };
                    controller.enqueue(encoder.encode(`\n__JSON_RESULT__:${JSON.stringify(result)}`));
                } finally {
                    // Clean up idempotency key after execution completes
                    if (idempotencyKey && redis) {
                        redis.del(`idem:${idempotencyKey}`).catch((e) =>
                            logger.error('[API Submit] Failed to delete idempotency key:', e)
                        );
                    }
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
                'X-RateLimit-Limit': rateLimitInfo.limit.toString(),
                'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
                'X-RateLimit-Reset': rateLimitInfo.reset.toString()
            }
        });
    } catch (error) {
        logger.error('[API Submit] Unexpected error:', error);
        return new Response(JSON.stringify({
            error: 'An unexpected error occurred while processing your submission. Please try again.'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

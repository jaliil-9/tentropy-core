import { Sandbox } from '@e2b/code-interpreter';
import { getChallengeById } from '@/lib/challenges';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { logger } from '@/lib/logger';

// Create a new ratelimiter, that allows 5 requests per 10 minutes
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    analytics: true,
    prefix: "@upstash/ratelimit",
});

export async function POST(req: Request) {
    try {
        // Rate Limit Check
        const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';

        let rateLimitInfo = { limit: 5, remaining: 5, reset: 0 };

        // Only check rate limit if Redis env vars are present to avoid crashing in dev without them
        if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
            const { success, limit, reset, remaining } = await ratelimit.limit(ip);
            rateLimitInfo = { limit, remaining, reset };

            if (!success) {
                return new Response(JSON.stringify({ error: "Rate limit exceeded. You have 5 runs every 10m." }), {
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
            // Use a simple global variable (note: this resets on server restart/hot reload)
            // We attach it to globalThis to persist across hot reloads in dev
            const globalStore = globalThis as any;
            if (!globalStore.localRateLimit) {
                globalStore.localRateLimit = new Map<string, { count: number, reset: number }>();
            }

            const now = Date.now();
            const window = 10 * 60 * 1000; // 10m
            const limit = 5;

            let record = globalStore.localRateLimit.get(ip);
            if (!record || now > record.reset) {
                record = { count: 0, reset: now + window };
            }

            record.count++;
            globalStore.localRateLimit.set(ip, record);

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

        const { code, challengeId, sandboxID } = await req.json();

        if (!code || !challengeId) {
            return new Response(JSON.stringify({ error: 'Missing code or challengeId' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const challenge = await getChallengeById(challengeId);
        if (!challenge) {
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
                            timeoutMs: 10000 // 10s timeout to save costs and prevent abuse
                        });
                    }

                    // 2. Setup Files
                    await sandbox.files.write('solution.py', code);
                    await sandbox.files.write('test_main.py', challenge.testCode);

                    // 3. Run Tests (Dependencies pre-installed in custom template)
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

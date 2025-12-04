import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { usePostHog } from 'posthog-js/react';
import { createClient } from '@/utils/supabase/client';
import { logger } from '@/lib/logger';
import { Challenge } from '@/types/challenge';
import { Attempt } from '@/types/attempt'; // We might need to define this type centrally

// Define types locally if not available globally yet
export interface RateLimitState {
    remaining: number;
    limit: number;
    reset: number;
}

export interface RunnerState {
    output: string;
    isLoading: boolean;
    sandboxID: string | undefined;
    status: 'idle' | 'running' | 'success' | 'failure';
    rateLimit: RateLimitState;
}

export function useChallengeRunner(challenge: Challenge, user: any) {
    const [output, setOutput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sandboxID, setSandboxID] = useState<string | undefined>(undefined);
    const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'failure' | 'cancelled'>('idle');
    const [rateLimit, setRateLimit] = useState<RateLimitState>({ remaining: 5, limit: 5, reset: 0 });

    const startTimeRef = useRef<number>(0);
    const abortControllerRef = useRef<AbortController | null>(null);
    const posthog = usePostHog();

    // Fetch rate limit status on mount
    useEffect(() => {
        const fetchRateLimit = async () => {
            try {
                const response = await fetch('/api/rate-limit-status');
                if (response.ok) {
                    const data = await response.json();
                    setRateLimit(data);
                }
            } catch (error) {
                logger.error('Failed to fetch rate limit:', error);
            }
        };
        fetchRateLimit();
    }, []);

    const stripAnsi = (str: string) => str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1, 4}(?:;[0-9]{0, 4})*)?[0-9A-ORZcf-nqry=><]/g, '');

    const submitSolution = async (code: string, onSuccess?: (executionTime: number) => void, onFailure?: () => void) => {
        if (isLoading) return;

        // Create new AbortController for this submission
        abortControllerRef.current = new AbortController();

        setIsLoading(true);
        setStatus('running');
        setOutput('');
        startTimeRef.current = Date.now();

        // Generate unique idempotency key to prevent double-submissions
        const idempotencyKey = crypto.randomUUID();

        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code,
                    challengeId: challenge.id,
                    sandboxID,
                    idempotencyKey
                }),
                signal: abortControllerRef.current.signal,
            });

            // Parse Rate Limit Headers
            const limitHeader = response.headers.get('X-RateLimit-Limit');
            const remainingHeader = response.headers.get('X-RateLimit-Remaining');
            const resetHeader = response.headers.get('X-RateLimit-Reset');

            logger.debug('Rate Limit Headers:', { limitHeader, remainingHeader, resetHeader });

            const limit = parseInt(limitHeader || '5');
            const remaining = parseInt(remainingHeader || '5');
            const reset = parseInt(resetHeader || '0');
            setRateLimit({ limit, remaining, reset });

            if (response.status === 429) {
                toast.error('RATE LIMIT EXCEEDED', {
                    style: { background: '#EF4444', color: '#fff', fontFamily: 'monospace' },
                    iconTheme: { primary: '#fff', secondary: '#EF4444' },
                });
                setStatus('failure');
                setIsLoading(false);
                posthog?.capture('code_submitted', { challenge_id: challenge.id, result: 'rate_limited' });
                return;
            }

            // Handle duplicate submission (idempotency check)
            if (response.status === 409) {
                toast.error('SUBMISSION IN PROGRESS', {
                    style: { background: '#F59E0B', color: '#fff', fontFamily: 'monospace' },
                    iconTheme: { primary: '#fff', secondary: '#F59E0B' },
                });
                setStatus('idle');
                setIsLoading(false);
                return;
            }

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                // Update output in real-time
                const visibleOutput = buffer.replace(/__JSON_RESULT__:.+$/, '');
                setOutput(stripAnsi(visibleOutput));

                // Check for result footer
                const resultMatch = buffer.match(/__JSON_RESULT__:(.+)$/);
                if (resultMatch) {
                    const resultJson = resultMatch[1];
                    try {
                        const result = JSON.parse(resultJson);
                        if (result.sandboxID) {
                            setSandboxID(result.sandboxID);
                        }

                        const isSuccess = result.success;
                        const executionTime = Date.now() - startTimeRef.current;

                        if (isSuccess) {
                            setStatus('success');
                            toast.success('PATCH SUCCESSFUL', {
                                style: { background: '#10B981', color: '#fff', fontFamily: 'monospace' },
                                iconTheme: { primary: '#fff', secondary: '#10B981' },
                            });

                            if (onSuccess) onSuccess(executionTime);

                            posthog?.capture('code_submitted', { challenge_id: challenge.id, result: 'success', execution_time: executionTime });
                        } else {
                            setStatus('failure');
                            toast.error('PATCH FAILED', {
                                style: { background: '#EF4444', color: '#fff', fontFamily: 'monospace' },
                                iconTheme: { primary: '#fff', secondary: '#EF4444' },
                            });

                            if (onFailure) onFailure();
                        }
                        posthog?.capture('code_submitted', { challenge_id: challenge.id, result: isSuccess ? 'success' : 'failure', execution_time: executionTime });

                        // Remove footer from display
                        buffer = buffer.replace(/__JSON_RESULT__:.+$/, '');
                    } catch (e) {
                        logger.error("Failed to parse result footer", e);
                    }
                }
            }

            setOutput(stripAnsi(buffer));
        } catch (error) {
            // Check if this was a user-initiated cancellation
            if (error instanceof Error && error.name === 'AbortError') {
                setStatus('cancelled');
                setOutput(prev => prev + '\n\n⚠️ Execution cancelled by user.');
                toast('EXECUTION CANCELLED', {
                    style: { background: '#F59E0B', color: '#fff', fontFamily: 'monospace' },
                    icon: '⏹️',
                });
                posthog?.capture('code_submitted', { challenge_id: challenge.id, result: 'cancelled' });
            } else {
                setStatus('failure');
                setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                toast.error('EXECUTION ERROR');
            }
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    };

    // Cancel a running submission
    const cancelSubmission = () => {
        if (abortControllerRef.current && isLoading) {
            abortControllerRef.current.abort();
        }
    };

    return {
        output,
        isLoading,
        sandboxID,
        status,
        rateLimit,
        submitSolution,
        cancelSubmission,
        setStatus, // Exporting setStatus if needed for reset
        setOutput,
        setSandboxID
    };
}

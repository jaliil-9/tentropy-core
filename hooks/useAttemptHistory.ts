'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/utils/auth';
import { createClient } from '@/utils/supabase/client';

interface ChallengeAttempt {
    id: string;
    user_id: string;
    challenge_id: string;
    status: boolean;
    code: string | null;
    execution_time: number | null;
    created_at: string;
}

/**
 * Hook to fetch attempt history for a challenge
 */
export function useAttemptHistory(challengeId: string) {
    const { user } = useAuth();
    const [attempts, setAttempts] = useState<ChallengeAttempt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAttempts() {
            if (!user) {
                setLoading(false);
                return;
            }

            setLoading(true);
            const supabase = createClient();

            const { data, error } = await supabase
                .from('challenge_attempts')
                .select('*')
                .eq('user_id', user.id)
                .eq('challenge_id', challengeId)
                .order('created_at', { ascending: false })
                .limit(20); // Limit to last 20 attempts

            if (error) {
                console.error('Error fetching attempt history:', error);
            } else if (data) {
                setAttempts(data);
            }

            setLoading(false);
        }

        fetchAttempts();
    }, [user, challengeId]);

    return {
        attempts,
        loading
    };
}

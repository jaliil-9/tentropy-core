// Open-core stub - no persistent attempt history
import { useState, useEffect } from 'react';

interface Attempt {
    id: string;
    created_at: string;
    status: boolean;
    code: string;
    execution_time: number;
}

export function useAttemptHistory(challengeId: string) {
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [loading, setLoading] = useState(false);

    // Open-core: No persistent history, only session history
    // Session history is managed by useChallengeState
    useEffect(() => {
        setLoading(false);
    }, [challengeId]);

    return { attempts, loading, refetch: () => {} };
}

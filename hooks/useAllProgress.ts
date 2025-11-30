'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/utils/auth';
import { ChallengeProgress } from '@/types/progress';
import { ProgressManager } from '@/lib/progress';

/**
 * Hook for loading all challenge progress
 * Returns a Map for efficient lookup by challengeId
 */
export function useAllProgress() {
    const { user } = useAuth();
    const [progressMap, setProgressMap] = useState<Map<string, ChallengeProgress>>(new Map());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAllProgress() {
            setLoading(true);

            if (user) {
                // Authenticated: Load all from Supabase
                const map = await ProgressManager.getAllSyncedProgress(user.id);
                setProgressMap(map);
            } else {
                // Anonymous: Load all from localStorage
                const allProgress = ProgressManager.getAllLocalProgress();
                const map = new Map<string, ChallengeProgress>();

                allProgress.forEach(progress => {
                    map.set(progress.challengeId, progress);
                });

                setProgressMap(map);
            }

            setLoading(false);
        }

        loadAllProgress();
    }, [user]);

    return {
        progressMap,
        loading
    };
}

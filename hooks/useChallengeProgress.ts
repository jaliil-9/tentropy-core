'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/utils/auth';
import { ChallengeProgress } from '@/types/progress';
import { ProgressManager } from '@/lib/progress';
import toast from 'react-hot-toast';

type SyncStatus = 'idle' | 'saving' | 'saved' | 'error' | 'offline';

/**
 * Hook for managing progress of a single challenge
 * Automatically uses localStorage for anonymous users, Supabase for authenticated users
 */
export function useChallengeProgress(challengeId: string) {
    const { user } = useAuth();
    const [progress, setProgress] = useState<ChallengeProgress | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');

    // Load progress on mount and when auth state changes
    useEffect(() => {
        async function loadProgress() {
            setLoading(true);

            if (user) {
                // Authenticated: Load from Supabase
                const data = await ProgressManager.getSyncedProgress(user.id, challengeId);
                setProgress(data || {
                    challengeId,
                    status: 'not_started' as const
                });
            } else {
                // Anonymous: Load from localStorage
                const data = ProgressManager.getLocalProgress(challengeId);
                setProgress(data || {
                    challengeId,
                    status: 'not_started' as const
                });
            }

            setLoading(false);
        }

        loadProgress();
    }, [user, challengeId]);

    /**
     * Update progress (saves to appropriate storage)
     */
    const updateProgress = useCallback(async (updates: Partial<Omit<ChallengeProgress, 'challengeId'>>) => {
        const currentProgress = progress || { challengeId, status: 'not_started' as const };
        const newProgress: ChallengeProgress = {
            challengeId,
            status: currentProgress.status,
            ...updates
        };

        setIsSaving(true);
        setSyncStatus('saving');

        try {
            if (user) {
                // Check if online
                if (!navigator.onLine) {
                    setSyncStatus('offline');
                    toast.error('You\'re offline. Progress will save when connection is restored.');
                    setIsSaving(false);
                    return;
                }

                // Save to Supabase
                const success = await ProgressManager.saveSyncedProgress(user.id, newProgress);
                if (success) {
                    setProgress(newProgress);
                    setSyncStatus('saved');

                    // Reset to idle after animation
                    setTimeout(() => setSyncStatus('idle'), 2000);
                } else {
                    setSyncStatus('error');
                    toast.error('Failed to save progress. Please try again.');
                    console.error('Failed to save progress to Supabase');
                }
            } else {
                // Save to localStorage (instant)
                ProgressManager.saveLocalProgress(newProgress);
                setProgress(newProgress);
                setSyncStatus('saved');

                setTimeout(() => setSyncStatus('idle'), 1000);
            }
        } catch (error) {
            setSyncStatus('error');
            toast.error('Error saving progress');
            console.error('Error in updateProgress:', error);
        } finally {
            setIsSaving(false);
        }
    }, [user, progress, challengeId]);

    return {
        progress,
        updateProgress,
        loading,
        isSaving,
        syncStatus
    };
}

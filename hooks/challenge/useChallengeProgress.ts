'use client';
import { useState, useEffect, useCallback } from 'react';
import { ProgressManager } from '@/services/progress';
import { ChallengeProgress } from '@/types/progress';

export function useChallengeProgress(challengeId: string) {
    const [progress, setProgress] = useState<ChallengeProgress | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'offline'>('idle');

    useEffect(() => {
        const data = ProgressManager.getLocalProgress(challengeId);
        setProgress(data || { challengeId, status: 'not_started' });
        setLoading(false);
    }, [challengeId]);

    const updateProgress = useCallback(async (updates: Partial<ChallengeProgress>) => {
        const newProgress = { ...(progress || { challengeId, status: 'not_started' }), ...updates } as ChallengeProgress;
        setIsSaving(true);
        setSyncStatus('saving');
        ProgressManager.saveLocalProgress(newProgress);
        setProgress(newProgress);
        setSyncStatus('saved');
        setIsSaving(false);
        setTimeout(() => setSyncStatus('idle'), 1000);
    }, [progress, challengeId]);

    return { progress, updateProgress, loading, isSaving, syncStatus };
}

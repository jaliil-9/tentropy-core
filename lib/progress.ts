
import { ChallengeProgress } from '@/types/progress';

const PROGRESS_KEY = 'tentropy_progress';

function getStoredProgress(): ChallengeProgress[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(PROGRESS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveProgress(progress: ChallengeProgress[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export const ProgressManager = {
    async getProgress(challengeId: string): Promise<ChallengeProgress | null> {
        const all = getStoredProgress();
        return all.find(p => p.challengeId === challengeId) || null;
    },

    async getAllProgress(): Promise<ChallengeProgress[]> {
        return getStoredProgress();
    },

    getAllLocalProgress(): ChallengeProgress[] {
        return getStoredProgress();
    },

    async getAllSyncedProgress(userId: string): Promise<Map<string, ChallengeProgress>> {
        // In open-core/stub mode, we return local progress even for "synced" requests
        // or we could return an empty map if we strictly want no-sync behavior.
        // Returning local progress allows the app to function if auth is bypassed or mocked.
        const all = getStoredProgress();
        const map = new Map<string, ChallengeProgress>();
        all.forEach(p => map.set(p.challengeId, p));
        return map;
    },

    async updateProgress(challengeId: string, updates: Partial<ChallengeProgress>): Promise<void> {
        const all = getStoredProgress();
        const existing = all.findIndex(p => p.challengeId === challengeId);

        if (existing >= 0) {
            all[existing] = { ...all[existing], ...updates };
        } else {
            const newProgress: ChallengeProgress = {
                challengeId,
                status: (updates.status as any) || 'not_started',
                ...updates
            };
            all.push(newProgress);
        }

        saveProgress(all);
    },

    async migrateAnonymousProgress(): Promise<void> {
        // No-op in open-core
    }
};

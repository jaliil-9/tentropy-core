// Open-core stub - localStorage-only progress management
import { ChallengeProgress } from '@/types/progress';
import { STORAGE_PREFIX, ALL_PROGRESS_KEY } from '@/lib/constants';

export class ProgressManager {
    static getLocalProgress(challengeId: string): ChallengeProgress | null {
        if (typeof window === 'undefined') return null;
        try {
            const key = `${STORAGE_PREFIX}${challengeId}`;
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch { return null; }
    }

    static saveLocalProgress(progress: ChallengeProgress): void {
        if (typeof window === 'undefined') return;
        try {
            const key = `${STORAGE_PREFIX}${progress.challengeId}`;
            localStorage.setItem(key, JSON.stringify(progress));
            
            // Update master list
            const all = this.getAllLocalProgress();
            const index = all.findIndex(p => p.challengeId === progress.challengeId);
            if (index >= 0) all[index] = progress;
            else all.push(progress);
            localStorage.setItem(ALL_PROGRESS_KEY, JSON.stringify(all));
        } catch {}
    }

    static getAllLocalProgress(): ChallengeProgress[] {
        if (typeof window === 'undefined') return [];
        try {
            const data = localStorage.getItem(ALL_PROGRESS_KEY);
            return data ? JSON.parse(data) : [];
        } catch { return []; }
    }

    // Stubs for synced progress (always returns null/false in open-core)
    static async getSyncedProgress() { return null; }
    static async saveSyncedProgress() { return false; }
    static async getAllSyncedProgress() { return new Map(); }
    static async migrateAnonymousProgress() { return; }
}

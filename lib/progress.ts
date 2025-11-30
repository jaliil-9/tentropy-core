import { createClient } from '@/utils/supabase/client';
import { ChallengeProgress, SupabaseProgress } from '@/types/progress';

const STORAGE_PREFIX = 'challenge_progress_';
const ALL_PROGRESS_KEY = 'all_challenge_progress';

export class ProgressManager {
    // ==================== LOCAL STORAGE (Anonymous Users) ====================

    /**
     * Get progress for a specific challenge from localStorage
     */
    static getLocalProgress(challengeId: string): ChallengeProgress | null {
        if (typeof window === 'undefined') return null;

        try {
            const key = `${STORAGE_PREFIX}${challengeId}`;
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    /**
     * Save progress for a specific challenge to localStorage
     */
    static saveLocalProgress(progress: ChallengeProgress): void {
        if (typeof window === 'undefined') return;

        try {
            const key = `${STORAGE_PREFIX}${progress.challengeId}`;
            localStorage.setItem(key, JSON.stringify(progress));

            // Also update the master list
            this.updateAllProgressList(progress);
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    }

    /**
     * Get all progress from localStorage (for migration)
     */
    static getAllLocalProgress(): ChallengeProgress[] {
        if (typeof window === 'undefined') return [];

        try {
            const data = localStorage.getItem(ALL_PROGRESS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading all progress from localStorage:', error);
            return [];
        }
    }

    /**
     * Update the master list of all progress
     */
    private static updateAllProgressList(progress: ChallengeProgress): void {
        const allProgress = this.getAllLocalProgress();
        const index = allProgress.findIndex(p => p.challengeId === progress.challengeId);

        if (index >= 0) {
            allProgress[index] = progress;
        } else {
            allProgress.push(progress);
        }

        localStorage.setItem(ALL_PROGRESS_KEY, JSON.stringify(allProgress));
    }

    /**
     * Clear all progress from localStorage (after migration)
     */
    static clearAllLocalProgress(): void {
        if (typeof window === 'undefined') return;

        try {
            const allProgress = this.getAllLocalProgress();

            // Remove individual progress items
            allProgress.forEach(progress => {
                const key = `${STORAGE_PREFIX}${progress.challengeId}`;
                localStorage.removeItem(key);
            });

            // Remove master list
            localStorage.removeItem(ALL_PROGRESS_KEY);
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }

    // ==================== SUPABASE (Authenticated Users) ====================

    /**
     * Get progress for a specific challenge from Supabase
     */
    static async getSyncedProgress(userId: string, challengeId: string): Promise<ChallengeProgress | null> {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('user_progress')
                .select('*')
                .eq('user_id', userId)
                .eq('challenge_id', challengeId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // No rows returned, not an error
                    return null;
                }
                console.error('Error fetching progress from Supabase:', error);
                return null;
            }

            return this.mapSupabaseToProgress(data);
        } catch (error) {
            console.error('Exception fetching progress:', error);
            return null;
        }
    }

    /**
     * Get all progress for a user from Supabase
     */
    static async getAllSyncedProgress(userId: string): Promise<Map<string, ChallengeProgress>> {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('user_progress')
                .select('*')
                .eq('user_id', userId);

            if (error) {
                console.error('Error fetching all progress from Supabase:', error);
                return new Map();
            }

            const progressMap = new Map<string, ChallengeProgress>();
            data?.forEach(item => {
                const progress = this.mapSupabaseToProgress(item);
                progressMap.set(progress.challengeId, progress);
            });

            return progressMap;
        } catch (error) {
            console.error('Exception fetching all progress:', error);
            return new Map();
        }
    }

    /**
     * Save progress to Supabase (upsert)
     */
    static async saveSyncedProgress(userId: string, progress: ChallengeProgress): Promise<boolean> {
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('user_progress')
                .upsert({
                    user_id: userId,
                    challenge_id: progress.challengeId,
                    status: progress.status,
                    last_attempt_at: progress.lastAttemptAt || new Date().toISOString(),
                    solved_at: progress.status === 'solved' ? (progress.solvedAt || new Date().toISOString()) : null
                }, {
                    onConflict: 'user_id,challenge_id'
                });

            if (error) {
                console.error('Error saving progress to Supabase:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Exception saving progress:', error);
            return false;
        }
    }

    // ==================== MIGRATION ====================

    /**
     * Migrate all anonymous progress to authenticated user's account
     */
    static async migrateAnonymousProgress(userId: string): Promise<void> {
        const localProgress = this.getAllLocalProgress();

        if (localProgress.length === 0) {
            console.log('[Migration] No local progress to migrate');
            return;
        }

        console.log(`[Migration] Migrating ${localProgress.length} progress items...`);

        for (const progress of localProgress) {
            // Check if user already has progress for this challenge
            const existingProgress = await this.getSyncedProgress(userId, progress.challengeId);

            if (existingProgress) {
                // Merge: prioritize 'solved' status
                const mergedProgress = this.mergeProgress(existingProgress, progress);
                await this.saveSyncedProgress(userId, mergedProgress);
            } else {
                // No conflict, just save
                await this.saveSyncedProgress(userId, progress);
            }
        }

        console.log('[Migration] Migration complete');

        // Clear localStorage after successful migration
        this.clearAllLocalProgress();
    }

    /**
     * Merge two progress records (conflict resolution)
     * Priority: solved > in_progress > not_started
     */
    private static mergeProgress(existing: ChallengeProgress, local: ChallengeProgress): ChallengeProgress {
        // Prioritize 'solved' status
        if (existing.status === 'solved') {
            return existing;
        }
        if (local.status === 'solved') {
            return local;
        }

        // Both not solved, take the one with latest attempt
        const existingTime = existing.lastAttemptAt ? new Date(existing.lastAttemptAt).getTime() : 0;
        const localTime = local.lastAttemptAt ? new Date(local.lastAttemptAt).getTime() : 0;

        return localTime > existingTime ? local : existing;
    }

    // ==================== HELPERS ====================

    /**
     * Map Supabase record to ChallengeProgress
     */
    private static mapSupabaseToProgress(data: SupabaseProgress): ChallengeProgress {
        return {
            challengeId: data.challenge_id,
            status: data.status,
            lastAttemptAt: data.last_attempt_at || undefined,
            solvedAt: data.solved_at || undefined
        };
    }
}

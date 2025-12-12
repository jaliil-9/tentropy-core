import { Challenge } from '@/types/challenge';
import { challenges } from '@/data/challenges';

/**
 * TEMPORARY: Fetching directly from local data/ folder
 * TODO: Re-enable Supabase once database is synced
 * 
 * Original implementation is preserved below as comments.
 */

/**
 * Get all challenges from local data
 */
export async function getChallenges(): Promise<Challenge[]> {
    return challenges;
}

/**
 * Get a single challenge by ID from local data
 */
export async function getChallengeById(id: string): Promise<Challenge | null> {
    return challenges.find(c => c.id === id) || null;
}

/* ============================================================================
 * ORIGINAL SUPABASE IMPLEMENTATION - Restore when database is synced
 * ============================================================================

import { createClient } from '@/utils/supabase/server';
import { Challenge } from '@/types/challenge';
import { logger } from '@/lib/logger';

export async function getChallenges(): Promise<Challenge[]> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('challenges')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            logger.error('[getChallenges] Error fetching from Supabase:', error);
            const { challenges } = await import('@/data/challenges');
            return challenges;
        }

        if (!data || data.length === 0) {
            logger.warn('[getChallenges] No challenges found in database, using fallback');
            const { challenges } = await import('@/data/challenges');
            return challenges;
        }

        return data.map(row => ({
            id: row.id,
            title: row.title,
            difficulty: row.difficulty as 'Easy' | 'Medium' | 'Hard',
            summary: row.summary,
            description: row.description,
            brokenCode: row.broken_code,
            testCode: row.test_code,
            successMessage: row.success_message,
            solutionCode: row.solution_code,
            debrief: row.debrief
        }));
    } catch (error) {
        logger.error('[getChallenges] Exception:', error);
        const { challenges } = await import('@/data/challenges');
        return challenges;
    }
}

export async function getChallengeById(id: string): Promise<Challenge | null> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('challenges')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            logger.error(`[getChallengeById] Error fetching challenge ${id}:`, error);
            const { challenges } = await import('@/data/challenges');
            return challenges.find(c => c.id === id) || null;
        }

        if (!data) {
            logger.warn(`[getChallengeById] Challenge ${id} not found in database, using fallback`);
            const { challenges } = await import('@/data/challenges');
            return challenges.find(c => c.id === id) || null;
        }

        return {
            id: data.id,
            title: data.title,
            difficulty: data.difficulty as 'Easy' | 'Medium' | 'Hard',
            summary: data.summary,
            description: data.description,
            brokenCode: data.broken_code,
            testCode: data.test_code,
            successMessage: data.success_message,
            solutionCode: data.solution_code,
            debrief: data.debrief
        };
    } catch (error) {
        logger.error(`[getChallengeById] Exception for ${id}:`, error);
        const { challenges } = await import('@/data/challenges');
        return challenges.find(c => c.id === id) || null;
    }
}

============================================================================ */

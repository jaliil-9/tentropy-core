// Open-core stub - local data only, no Supabase
import { Challenge } from '@/types/challenge';
import { challenges as localChallenges } from '@/data/challenges';

/**
 * Get all challenges from local data
 */
export async function getChallenges(): Promise<Challenge[]> {
    return localChallenges;
}

/**
 * Get a single challenge by ID from local data
 */
export async function getChallengeById(id: string): Promise<Challenge | null> {
    return localChallenges.find(c => c.id === id) || null;
}

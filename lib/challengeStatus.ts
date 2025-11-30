import { ChallengeProgress, ChallengeUIStatus } from '@/types/progress';

/**
 * Determine the UI status of a challenge based on progress and position in track
 * 
 * Logic:
 * - If solved: always show as 'solved'
 * - If first challenge: always 'current' (unlocked)
 * - If previous challenge is solved: 'current' (unlocked)
 * - Otherwise: 'locked'
 */
export function getChallengeStatus(
    challengeId: string,
    allProgress: Map<string, ChallengeProgress>,
    trackChallengeIds: string[]
): ChallengeUIStatus {
    const index = trackChallengeIds.indexOf(challengeId);
    const currentProgress = allProgress.get(challengeId);

    // If solved, always show as solved
    if (currentProgress?.status === 'solved') {
        return 'solved';
    }

    // First challenge is always unlocked
    if (index === 0) {
        return 'current';
    }

    // Check if previous challenge is solved
    const previousId = trackChallengeIds[index - 1];
    const previousProgress = allProgress.get(previousId);

    if (previousProgress?.status === 'solved') {
        return 'current';
    }

    // Otherwise locked
    return 'locked';
}

/**
 * Get all unlocked challenge IDs in a track
 */
export function getUnlockedChallenges(
    allProgress: Map<string, ChallengeProgress>,
    trackChallengeIds: string[]
): string[] {
    const unlocked: string[] = [];

    for (const challengeId of trackChallengeIds) {
        const status = getChallengeStatus(challengeId, allProgress, trackChallengeIds);

        if (status === 'current' || status === 'solved') {
            unlocked.push(challengeId);
        }
    }

    return unlocked;
}

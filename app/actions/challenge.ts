'use server';

import { challenges } from '@/data/challenges';

export async function revealSolution(challengeId: string) {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) {
        return { success: false, error: 'Challenge not found' };
    }
    // Note: solutionCode is stripped in open-core version
    return { success: true, code: challenge.solutionCode || '# Solution not available in open-core version' };
}

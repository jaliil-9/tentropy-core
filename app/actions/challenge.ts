'use server';

import { challenges } from '@/data/challenges';
import { createClient } from '@/utils/supabase/server';
import { logger } from '@/lib/logger';

export async function revealSolution(challengeId: string) {
    try {
        const challenge = challenges.find(c => c.id === challengeId);

        if (!challenge) {
            throw new Error('Challenge not found');
        }

        // In a real implementation, we might want to log this "give up" event to the database
        // or check if the user is allowed to see it (though "reveal" implies giving up).

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            logger.info(`[revealSolution] User ${user.id} revealed solution for ${challengeId}`);
            // Optionally track this in the database
        } else {
            logger.info(`[revealSolution] Anonymous user revealed solution for ${challengeId}`);
        }

        return { success: true, code: challenge.solutionCode };
    } catch (error) {
        logger.error('[revealSolution] Error:', error);
        return { success: false, error: 'Failed to reveal solution' };
    }
}

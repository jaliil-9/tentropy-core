export type ChallengeStatus = 'not_started' | 'in_progress' | 'solved';

export type ChallengeUIStatus = 'locked' | 'current' | 'solved';

export interface ChallengeProgress {
    challengeId: string;
    status: ChallengeStatus;
    lastCode?: string;
    lastAttemptAt?: string;
    solvedAt?: string;
}

export interface SupabaseProgress {
    id: string;
    user_id: string;
    challenge_id: string;
    status: ChallengeStatus;
    last_attempt_at?: string;
    solved_at?: string;
    created_at: string;
    updated_at: string;
}

export interface ChallengeAttempt {
    id?: string;
    user_id: string;
    challenge_id: string;
    code_submitted: string;
    test_passed: boolean;
    error_message?: string;
    execution_time_ms?: number;
    created_at?: string;
}

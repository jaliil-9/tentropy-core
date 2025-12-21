'use client';

import React, { createContext, useContext } from 'react';
import { Challenge } from '@/types/challenge';
import { useChallenge as useChallengeHook } from '@/hooks/challenge/useChallenge';

// Type for the context value
type ChallengeContextType = ReturnType<typeof useChallengeHook>;

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

interface ChallengeProviderProps {
    challenge: Challenge;
    children: React.ReactNode;
}

/**
 * Provider component that wraps the challenge workspace.
 * Allows any child component to access challenge state without prop drilling.
 */
export function ChallengeProvider({ challenge, children }: ChallengeProviderProps) {
    const workspace = useChallengeHook(challenge);

    return (
        <ChallengeContext.Provider value={workspace}>
            {children}
        </ChallengeContext.Provider>
    );
}

// Hook to access the challenge context.
// Must be used within a ChallengeProvider.
export function useChallenge() {
    const context = useContext(ChallengeContext);
    if (context === undefined) {
        throw new Error('useChallenge must be used within a ChallengeProvider');
    }
    return context;
}

// Selective hooks for performance optimization
export function useChallengeRunner() {
    const { runner } = useChallenge();
    return runner;
}

export function useChallengeAuth() {
    const { isAuthenticated, user, authLogout } = useChallenge();
    return { isAuthenticated, user, authLogout };
}

export function useChallengeModals() {
    const {
        showRevealConfirm, setShowRevealConfirm,
        showSuccessModal, setShowSuccessModal,
        isAuthModalOpen, setIsAuthModalOpen
    } = useChallenge();
    return {
        showRevealConfirm, setShowRevealConfirm,
        showSuccessModal, setShowSuccessModal,
        isAuthModalOpen, setIsAuthModalOpen
    };
}

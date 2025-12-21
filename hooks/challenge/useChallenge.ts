'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { toast } from 'react-hot-toast';

import { Challenge } from '@/types/challenge';
import { Attempt } from '@/types/attempt';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useChallengeProgress } from '@/hooks/challenge/useChallengeProgress';
import { useAllProgress } from '@/hooks/progress/useAllProgress';
import { useChallengeRunner } from '@/hooks/challenge/useChallengeRunner';
import { useChallengeState } from '@/hooks/challenge/useChallengeState';
import { useAttemptHistory } from '@/hooks/progress/useAttemptHistory';
import { getChallengeStatus } from '@/services/challengeStatus';
import { tracks } from '@/data/challenges';
import { logger } from '@/lib/logger';
import { revealSolution } from '@/app/actions/challenge';

const ONBOARDING_COMPLETE_KEY = 'tentropy_onboarding_complete';
const INTRO_CHALLENGE_ID = 'ai-cost-cache-002';

/**
 * Consolidates all workspace state and workflows for the challenge interface.
 * This hook manages:
 * - UI modal states (success, reveal confirm, auth)
 * - Debrief/solution lock states
 * - Certificate unlocking
 * - Attempt history merging
 * - All handler functions (submit, reveal, save)
 */
export function useChallenge(challenge: Challenge) {
    // Core hooks
    const state = useChallengeState(challenge);
    const runner = useChallengeRunner(challenge);
    const { progress, updateProgress, syncStatus } = useChallengeProgress(challenge.id);
    const { progressMap } = useAllProgress();
    const { attempts: dbAttempts } = useAttemptHistory(challenge.id);
    const { isAuthenticated, user, logout: authLogout } = useAuth();
    const posthog = usePostHog();
    const searchParams = useSearchParams();

    // UI Modal States
    const [showRevealConfirm, setShowRevealConfirm] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Debrief/Solution States
    const [hasRevealedSolution, setHasRevealedSolution] = useState(false);
    const [isDebriefLocked, setIsDebriefLocked] = useState(true);
    const [activeLeftTab, setActiveLeftTab] = useState<'BRIEFING' | 'DEBRIEF'>('BRIEFING');

    // Certificate States
    const [unlockedCertId, setUnlockedCertId] = useState<string | null>(null);
    const [unlockedTrackTitle, setUnlockedTrackTitle] = useState<string | null>(null);

    // UI States
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showOnboardingBanner, setShowOnboardingBanner] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Refs
    const successCountRef = useRef<number>(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Computed: Challenge lock status
    const track = tracks.find(t => t.challengeIds.includes(challenge.id));
    const trackIds = track ? track.challengeIds : [];
    const challengeStatus = getChallengeStatus(challenge.id, progressMap, trackIds);
    const isLocked = challengeStatus === 'locked';

    // Computed: Next challenge in track
    const nextChallengeId = useMemo(() => {
        if (!track) return null;
        const currentIndex = track.challengeIds.indexOf(challenge.id);
        if (currentIndex !== -1 && currentIndex < track.challengeIds.length - 1) {
            return track.challengeIds[currentIndex + 1];
        }
        return null;
    }, [track, challenge.id]);

    // Merged history (local + DB, deduplicated)
    const mergedHistory = useMemo(() => {
        const dbFormatted: Attempt[] = dbAttempts.map(a => ({
            id: a.id,
            timestamp: new Date(a.created_at).getTime(),
            status: a.status ? 'PASS' : 'FAIL',
            code: a.code || '',
            executionTime: a.execution_time || 0
        }));

        const sessionOnly = state.history.filter(h => {
            const isDuplicate = dbFormatted.some(d => {
                const timeDiff = Math.abs(d.timestamp - h.timestamp);
                const isCloseInTime = timeDiff < 120000;
                const hasSameCode = (d.code || '').trim() === (h.code || '').trim();
                return (isCloseInTime && hasSameCode) || (timeDiff < 5000);
            });
            return !isDuplicate;
        });

        return [...sessionOnly, ...dbFormatted].sort((a, b) => b.timestamp - a.timestamp);
    }, [dbAttempts, state.history]);

    // Effect: Check if challenge is solved via query param or progress
    useEffect(() => {
        const isSolvedParam = searchParams.get('solved') === 'true';
        const isSolvedProgress = progress?.status === 'solved';

        if (isSolvedParam || isSolvedProgress) {
            setIsDebriefLocked(false);
            setActiveLeftTab('DEBRIEF');
        }
    }, [searchParams, progress]);

    // Effect: Fetch saved status
    useEffect(() => {
        const checkSavedStatus = async () => {
            if (isAuthenticated && user) {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('saved_challenges')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('challenge_id', challenge.id)
                    .maybeSingle();

                if (error) {
                    if (error.code !== 'PGRST116') {
                        logger.error('Error fetching saved status:', error);
                    }
                } else if (data) {
                    setIsSaved(true);
                    setIsDebriefLocked(false);
                    setHasRevealedSolution(true);
                }
            }
        };
        checkSavedStatus();
    }, [isAuthenticated, user, challenge.id]);

    // Effect: Process pending save after authentication
    useEffect(() => {
        const processPendingSave = async () => {
            if (isAuthenticated && user) {
                const pendingSaveStr = localStorage.getItem('tentropy_pending_save');
                if (pendingSaveStr) {
                    try {
                        const pendingSave = JSON.parse(pendingSaveStr);
                        logger.debug('[processPendingSave] Found pending save:', pendingSave);

                        const isRecent = Date.now() - pendingSave.timestamp < 5 * 60 * 1000;
                        const isCurrentChallenge = pendingSave.challengeId === challenge.id;

                        if (isRecent && isCurrentChallenge) {
                            logger.info('[processPendingSave] Saving challenge to saved_challenges...');
                            const supabase = createClient();
                            const { data, error } = await supabase
                                .from('saved_challenges')
                                .insert({
                                    user_id: user.id,
                                    challenge_id: challenge.id
                                })
                                .select();

                            if (error) {
                                logger.error('Error saving challenge:', error);
                            } else {
                                logger.info('Challenge saved successfully:', data);
                                setIsSaved(true);
                                setIsDebriefLocked(false);
                                setHasRevealedSolution(true);
                            }
                        }
                        localStorage.removeItem('tentropy_pending_save');
                    } catch (e) {
                        logger.error('Error processing pending save:', e);
                        localStorage.removeItem('tentropy_pending_save');
                    }
                }
            }
        };
        processPendingSave();
    }, [isAuthenticated, user, challenge.id]);

    // Effect: Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Effect: Window resize handler for responsive layout
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Effect: Detect intro challenge for onboarding
    useEffect(() => {
        const isIntro = challenge.id === INTRO_CHALLENGE_ID;
        const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_COMPLETE_KEY);
        setShowOnboardingBanner(isIntro && !isAuthenticated && !hasCompletedOnboarding);
    }, [challenge.id, isAuthenticated]);

    // Handler: Success
    const handleSuccess = useCallback(async (executionTime: number) => {
        successCountRef.current += 1;
        if (successCountRef.current === 1 || successCountRef.current % 20 === 0) {
            setShowSuccessModal(true);
        }

        setIsDebriefLocked(false);

        // Mark onboarding complete for intro challenge
        if (challenge.id === INTRO_CHALLENGE_ID) {
            localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
            setShowOnboardingBanner(false);
        }

        await updateProgress({
            status: 'solved',
            solvedAt: new Date().toISOString(),
            lastAttemptAt: new Date().toISOString()
        });

        // Create attempt object
        const newAttempt: Attempt = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            status: 'PASS',
            code: state.activeTab.content,
            executionTime: executionTime
        };

        // Save attempt to DB
        if (isAuthenticated && user) {
            const supabase = createClient();
            await supabase.from('challenge_attempts').insert({
                user_id: user.id,
                challenge_id: challenge.id,
                status: true,
                code: state.activeTab.content,
                execution_time: executionTime
            });

            // Check for certificate
            try {
                const currentTrack = tracks.find(t => t.challengeIds.includes(challenge.id));
                if (currentTrack) {
                    const { data: progressData, error: progressError } = await supabase
                        .from('user_progress')
                        .select('challenge_id, status')
                        .in('challenge_id', currentTrack.challengeIds)
                        .eq('user_id', user.id);

                    if (!progressError) {
                        const solvedIds = new Set(progressData?.filter(p => p.status === 'solved').map(p => p.challenge_id) || []);
                        solvedIds.add(challenge.id);

                        const isTrackComplete = currentTrack.challengeIds.every(id => solvedIds.has(id));

                        if (isTrackComplete) {
                            logger.info('[useChallengeWorkspace] Track complete! Issuing certificate...');
                            const { data: certId, error: certError } = await supabase.rpc('issue_certificate', {
                                p_user_id: user.id,
                                p_track_id: currentTrack.id,
                                p_metadata: { userName: user.name || user.email?.split('@')[0] || 'Operator' }
                            });

                            if (certId && !certError) {
                                setUnlockedCertId(certId);
                                setUnlockedTrackTitle(currentTrack.title);
                                toast.success(`CERTIFICATE UNLOCKED: ${currentTrack.title}`, {
                                    style: { background: '#FFB000', color: '#000', fontFamily: 'monospace', fontWeight: 'bold' },
                                    iconTheme: { primary: '#000', secondary: '#FFB000' },
                                    duration: 5000
                                });
                            }
                        }
                    }
                }
            } catch (error) {
                logger.error('[useChallengeWorkspace] Exception in certificate logic:', error);
            }
        }

        state.setHistory(prev => [newAttempt, ...prev]);
    }, [challenge.id, isAuthenticated, user, state.activeTab.content, updateProgress, state.setHistory]);

    // Handler: Failure
    const handleFailure = useCallback(async () => {
        await updateProgress({
            status: 'in_progress',
            lastAttemptAt: new Date().toISOString()
        });

        const newAttempt: Attempt = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            status: 'FAIL',
            code: state.activeTab.content,
            executionTime: 0
        };
        state.setHistory(prev => [newAttempt, ...prev]);
    }, [updateProgress, state.activeTab.content, state.setHistory]);

    // Handler: Submit
    const handleSubmit = useCallback(() => {
        runner.submitSolution(state.activeTab.content, handleSuccess, handleFailure);
    }, [runner, state.activeTab.content, handleSuccess, handleFailure]);

    // Handler: Reveal solution (opens confirm modal)
    const revealSolutionHandler = useCallback(() => {
        if (!challenge.solutionCode && !challenge.hasSolution) {
            toast.error("No solution available for this challenge.");
            return;
        }
        setShowRevealConfirm(true);
    }, [challenge.solutionCode, challenge.hasSolution]);

    // Handler: Confirm reveal
    const confirmReveal = useCallback(async () => {
        try {
            let code = challenge.solutionCode;

            if (!code) {
                const result = await revealSolution(challenge.id);
                if (result.success && result.code) {
                    code = result.code;
                } else {
                    toast.error(result.error || "Failed to fetch solution");
                    return;
                }
            }

            if (code) {
                state.updateTabContent(code);
                setHasRevealedSolution(true);
                posthog?.capture('solution_revealed', { challenge_id: challenge.id });

                setIsDebriefLocked(false);
                setActiveLeftTab('DEBRIEF');

                // Mark onboarding complete for intro challenge
                if (challenge.id === INTRO_CHALLENGE_ID) {
                    localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
                    setShowOnboardingBanner(false);
                }

                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        } catch (error) {
            logger.error('Error revealing solution:', error);
            toast.error("An error occurred while revealing the solution.");
        }
        setShowRevealConfirm(false);
    }, [challenge.id, challenge.solutionCode, state.updateTabContent, posthog]);

    // Handler: Save solution (for anonymous users)
    const handleSaveSolution = useCallback(() => {
        localStorage.setItem('tentropy_pending_save', JSON.stringify({
            challengeId: challenge.id,
            timestamp: Date.now()
        }));
        logger.debug('[handleSaveSolution] Stored pending save in localStorage');
        setIsAuthModalOpen(true);
    }, [challenge.id]);

    // Handler: Auth success
    const handleAuthSuccess = useCallback(async () => {
        logger.debug('[handleAuthSuccess] Reloading page...');
        window.location.reload();
    }, []);

    // Handler: Toggle save challenge
    const toggleSaveChallenge = useCallback(async () => {
        if (!isAuthenticated || !user) {
            toast.error("Please sign in to save challenges");
            return;
        }

        const supabase = createClient();

        if (isSaved) {
            const { error } = await supabase
                .from('saved_challenges')
                .delete()
                .eq('user_id', user.id)
                .eq('challenge_id', challenge.id);

            if (error) {
                logger.error('Error unsaving challenge:', error);
                toast.error(`Failed to unsave: ${error.message}`);
            } else {
                setIsSaved(false);
                toast.success("Challenge removed from saved items");
            }
        } else {
            const { data, error } = await supabase
                .from('saved_challenges')
                .insert({
                    user_id: user.id,
                    challenge_id: challenge.id
                })
                .select();

            if (error) {
                logger.error('Error saving challenge:', error);
                toast.error(`Failed to save: ${error.message}`);
            } else {
                logger.info('Challenge saved successfully:', data);
                setIsSaved(true);
                setIsDebriefLocked(false);
                setHasRevealedSolution(true);
                toast.success("Challenge saved! Solution & Debrief unlocked.");
            }
        }
    }, [isAuthenticated, user, isSaved, challenge.id]);

    return {
        // From useChallengeState (passthrough)
        tabs: state.tabs,
        activeTabId: state.activeTabId,
        activeTab: state.activeTab,
        history: state.history,
        isHistoryOpen: state.isHistoryOpen,
        setActiveTabId: state.setActiveTabId,
        setHistory: state.setHistory,
        setIsHistoryOpen: state.setIsHistoryOpen,
        setMonacoInstance: state.setMonacoInstance,
        setEditorInstance: state.setEditorInstance,
        updateTabContent: state.updateTabContent,
        addNewTab: state.addNewTab,
        closeTab: state.closeTab,
        loadAttempt: state.loadAttempt,

        // From useChallengeRunner (passthrough)
        runner,

        // From useChallengeProgress
        progress,
        syncStatus,
        updateProgress,

        // Auth
        isAuthenticated,
        user,
        authLogout,

        // Computed
        isLocked,
        nextChallengeId,
        mergedHistory,
        track,

        // UI Modal States
        showRevealConfirm,
        setShowRevealConfirm,
        showSuccessModal,
        setShowSuccessModal,
        isAuthModalOpen,
        setIsAuthModalOpen,

        // Debrief/Solution States
        hasRevealedSolution,
        isDebriefLocked,
        activeLeftTab,
        setActiveLeftTab,

        // Certificate States
        unlockedCertId,
        unlockedTrackTitle,

        // UI States
        isMenuOpen,
        setIsMenuOpen,
        isSaved,
        showOnboardingBanner,
        setShowOnboardingBanner,
        isMobile,

        // Refs
        dropdownRef,
        scrollContainerRef,

        // Handlers
        handleSubmit,
        handleSuccess,
        handleFailure,
        revealSolutionHandler,
        confirmReveal,
        handleSaveSolution,
        handleAuthSuccess,
        toggleSaveChallenge,

        // Analytics
        posthog,
    };
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import {
    BookOpen,
    Lock,
    Unlock,
    AlertTriangle,
    History,
    LayoutGrid,
    Settings,
    User,
    LogOut,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Toaster, toast } from 'react-hot-toast';
import { usePostHog } from 'posthog-js/react';

import EmailModal from './EmailModal';
import ConfirmationModal from './ConfirmationModal';
import AuthModal from './AuthModal';
import SuccessModal from './SuccessModal';
import EditorPanel from './challenge/EditorPanel';
import ConsolePanel from './challenge/ConsolePanel';

import { Challenge } from '@/types/challenge';
import { trackEvent } from '@/lib/analytics';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/utils/auth';
import { logout } from '@/app/auth/actions';
import { cn } from '@/lib/utils';
import { useChallengeProgress } from '@/hooks/useChallengeProgress';
import { useAllProgress } from '@/hooks/useAllProgress';
import { getChallengeStatus } from '@/lib/challengeStatus';
import { tracks } from '@/data/challenges';
import { logger } from '@/lib/logger';

import { useChallengeRunner } from '@/hooks/useChallengeRunner';
import { useChallengeState } from '@/hooks/useChallengeState';
import { Attempt } from '@/types/attempt';
import { revealSolution } from '@/app/actions/challenge';

// Simple ANSI stripper
const stripAnsi = (str: string) => str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1, 4}(?:;[0-9]{0, 4})*)?[0-9A-ORZcf-nqry=><]/g, '');

interface ChallengeInterfaceProps {
    challenge: Challenge;
}

export default function ChallengeInterface({ challenge }: ChallengeInterfaceProps) {
    // Hooks
    const {
        tabs,
        activeTabId,
        activeTab,
        history,
        isHistoryOpen,
        monacoInstance,
        editorInstance,
        setTabs,
        setActiveTabId,
        setHistory,
        setIsHistoryOpen,
        setMonacoInstance,
        setEditorInstance,
        updateTabContent,
        addNewTab,
        closeTab,
        loadAttempt
    } = useChallengeState(challenge);

    const { isAuthenticated, user, logout: authLogout } = useAuth();
    const runner = useChallengeRunner(challenge, user);
    const posthog = usePostHog();
    const searchParams = useSearchParams();

    // Progress tracking
    const { progress, updateProgress, syncStatus, isSaving } = useChallengeProgress(challenge.id);
    const { progressMap, loading: loadingAllProgress } = useAllProgress();

    // UI State
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showRevealConfirm, setShowRevealConfirm] = useState(false);
    const [hasRevealedSolution, setHasRevealedSolution] = useState(false);
    const [unlockedCertId, setUnlockedCertId] = useState<string | null>(null);
    const [unlockedTrackTitle, setUnlockedTrackTitle] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [activeLeftTab, setActiveLeftTab] = useState<'BRIEFING' | 'DEBRIEF'>('BRIEFING');
    const [isDebriefLocked, setIsDebriefLocked] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [pendingSaveAttempt, setPendingSaveAttempt] = useState<Attempt | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    const successCountRef = useRef<number>(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Determine lock status
    const track = tracks.find(t => t.challengeIds.includes(challenge.id));
    const trackIds = track ? track.challengeIds : [];
    const challengeStatus = getChallengeStatus(challenge.id, progressMap, trackIds);
    const isLocked = challengeStatus === 'locked';

    // Check if challenge is solved via query param or progress
    useEffect(() => {
        const isSolvedParam = searchParams.get('solved') === 'true';
        const isSolvedProgress = progress?.status === 'solved';

        if (isSolvedParam || isSolvedProgress) {
            setIsDebriefLocked(false);
            setActiveLeftTab('DEBRIEF');
        }
    }, [searchParams, progress]);

    // Fetch saved status
    useEffect(() => {
        const checkSavedStatus = async () => {
            if (isAuthenticated && user) {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('saved_challenges')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('challenge_id', challenge.id)
                    .single();

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

    // Check for pending save after authentication
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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Window resize handler for responsive layout
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleSuccess = async (executionTime: number) => {
        successCountRef.current += 1;
        if (successCountRef.current === 1 || successCountRef.current % 20 === 0) {
            setShowSuccessModal(true);
        }

        setIsDebriefLocked(false);

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
            code: activeTab.content,
            executionTime: executionTime
        };

        // Save attempt
        if (isAuthenticated && user) {
            const supabase = createClient();
            await supabase.from('challenge_attempts').insert({
                user_id: user.id,
                challenge_id: challenge.id,
                status: true,
                code: activeTab.content,
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
                            logger.info('[ChallengeInterface] Track complete! Issuing certificate...');
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
                logger.error('[ChallengeInterface] Exception in certificate logic:', error);
            }
        }

        setHistory(prev => [newAttempt, ...prev]);
    };

    const handleFailure = async () => {
        await updateProgress({
            status: 'in_progress',
            lastAttemptAt: new Date().toISOString()
        });

        const newAttempt: Attempt = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            status: 'FAIL',
            code: activeTab.content,
            executionTime: 0 // We might want to track this even for failures
        };
        setHistory(prev => [newAttempt, ...prev]);
    };

    const handleSubmit = () => {
        runner.submitSolution(activeTab.content, handleSuccess, handleFailure);
    };



    const revealSolutionHandler = () => {
        if (!challenge.solutionCode && !challenge.hasSolution) {
            toast.error("No solution available for this challenge.");
            return;
        }
        setShowRevealConfirm(true);
    };

    const confirmReveal = async () => {
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
                updateTabContent(code);
                setHasRevealedSolution(true);
                trackEvent('solution_revealed', { challenge_id: challenge.id });
                posthog?.capture('solution_revealed', { challenge_id: challenge.id });

                setIsDebriefLocked(false);
                setActiveLeftTab('DEBRIEF');

                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        } catch (error) {
            logger.error('Error revealing solution:', error);
            toast.error("An error occurred while revealing the solution.");
        }
        setShowRevealConfirm(false);
    };

    const handleSaveSolution = () => {
        localStorage.setItem('tentropy_pending_save', JSON.stringify({
            challengeId: challenge.id,
            timestamp: Date.now()
        }));
        logger.debug('[handleSaveSolution] Stored pending save in localStorage');
        setIsAuthModalOpen(true);
    };

    const handleAuthSuccess = async () => {
        logger.debug('[handleAuthSuccess] Reloading page...');
        window.location.reload();
    };

    const toggleSaveChallenge = async () => {
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
    };

    const DescriptionPanel = (
        <div className={cn(
            "flex flex-col bg-deep-anthracite/95 backdrop-blur-sm",
            isMobile ? "h-auto min-h-fit" : "h-full border-r border-tungsten-grey"
        )}>
            <div className="h-10 border-b border-tungsten-grey flex items-center bg-carbon-grey/50 shrink-0">
                <button
                    onClick={() => setActiveLeftTab('BRIEFING')}
                    className={cn(
                        "h-full px-4 text-xs font-bold tracking-widest transition-colors border-r border-tungsten-grey flex items-center gap-2",
                        activeLeftTab === 'BRIEFING'
                            ? "bg-deep-anthracite text-hazard-amber border-b-2 border-b-hazard-amber"
                            : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                    )}
                >
                    <BookOpen className="w-3 h-3" />
                    BRIEFING
                </button>
                <button
                    onClick={() => !isDebriefLocked && setActiveLeftTab('DEBRIEF')}
                    disabled={isDebriefLocked}
                    className={cn(
                        "h-full px-4 text-xs font-bold tracking-widest transition-colors border-r border-tungsten-grey flex items-center gap-2",
                        activeLeftTab === 'DEBRIEF'
                            ? "bg-deep-anthracite text-hazard-amber border-b-2 border-b-hazard-amber"
                            : isDebriefLocked
                                ? "text-gray-600 cursor-not-allowed opacity-50"
                                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                    )}
                >
                    {isDebriefLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    DEBRIEF
                </button>
            </div>

            <div className={cn(
                "p-4 md:p-6 scrollbar-thin scrollbar-thumb-tungsten-grey scrollbar-track-transparent",
                isMobile ? "overflow-visible h-auto" : "flex-1 overflow-y-auto"
            )}>
                {activeLeftTab === 'BRIEFING' ? (
                    <>
                        <div className="mb-6 md:mb-8 border-l-2 border-hazard-amber pl-4">
                            <h1 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">{challenge.title}</h1>
                            <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                                <span className="px-2 py-1 border border-hazard-amber/30 text-hazard-amber bg-hazard-amber/10 rounded-sm">
                                    Difficulty: {challenge.difficulty.toUpperCase()}
                                </span>
                                <span>ID: {challenge.id}</span>
                            </div>
                        </div>

                        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-headings:font-mono prose-p:text-gray-400 prose-code:text-hazard-amber prose-code:bg-carbon-grey prose-code:px-1 prose-code:py-0.5 prose-code:rounded-none prose-pre:bg-carbon-grey prose-pre:border prose-pre:border-tungsten-grey">
                            <ReactMarkdown>{challenge.description}</ReactMarkdown>
                        </div>
                    </>
                ) : (
                    <div className="animate-in fade-in duration-300">
                        {isDebriefLocked ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center border border-dashed border-tungsten-grey rounded-sm bg-black/20 p-8">
                                <div className="p-4 bg-tungsten-grey/10 rounded-full mb-4">
                                    <Lock className="w-8 h-8 text-gray-500" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-400 mb-2">Encrypted Data</h3>
                                <p className="text-xs text-gray-600 max-w-[250px]">
                                    Solve the challenge or reveal the solution to decrypt this debrief.
                                </p>
                            </div>
                        ) : (
                            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-headings:font-mono prose-p:text-gray-400 prose-code:text-hazard-amber prose-code:bg-carbon-grey prose-code:px-1 prose-code:py-0.5 prose-code:rounded-none prose-pre:bg-carbon-grey prose-pre:border prose-pre:border-tungsten-grey">
                                <ReactMarkdown>{challenge.debrief || "No debrief available."}</ReactMarkdown>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    const RightPane = (
        <PanelGroup direction="vertical">
            <Panel defaultSize={70} minSize={30}>
                <EditorPanel
                    challenge={challenge}
                    tabs={tabs}
                    activeTabId={activeTabId}
                    setActiveTabId={setActiveTabId}
                    updateTabContent={updateTabContent}
                    addNewTab={addNewTab}
                    closeTab={closeTab}
                    setEditorInstance={setEditorInstance}
                    setMonacoInstance={setMonacoInstance}
                    submitSolution={handleSubmit}
                    cancelSubmission={runner.cancelSubmission}
                    isLoading={runner.isLoading}
                    revealSolution={revealSolutionHandler}
                    isAuthenticated={isAuthenticated}
                    isDebriefLocked={isDebriefLocked}
                    toggleSaveChallenge={toggleSaveChallenge}
                    isSaved={isSaved}
                    hasRevealedSolution={hasRevealedSolution}
                    handleSaveSolution={handleSaveSolution}
                    syncStatus={syncStatus}
                    isLocked={isLocked}
                    isMobile={isMobile}
                    activeTab={activeTab}
                    posthog={posthog}
                    showPiiWarning={true}
                />
            </Panel>

            <PanelResizeHandle className="h-[2px] bg-tungsten-grey hover:bg-hazard-amber transition-colors" />

            <Panel defaultSize={30} minSize={10}>
                <ConsolePanel
                    output={runner.output}
                    status={runner.status}
                    rateLimit={runner.rateLimit}
                />
            </Panel>
        </PanelGroup>
    );

    return (
        <div className="h-screen flex flex-col bg-deep-anthracite text-gray-400 font-mono overflow-hidden selection:bg-hazard-amber selection:text-deep-anthracite">
            <Toaster position="bottom-right" toastOptions={{
                style: {
                    background: '#121214',
                    color: '#EDEDED',
                    border: '1px solid #27272A',
                    fontFamily: 'monospace',
                },
                success: { iconTheme: { primary: '#00E090', secondary: '#121214' } },
                error: { iconTheme: { primary: '#FFB000', secondary: '#121214' } }
            }} />

            {/* Top Bar - Simplified for brevity, assuming NavBar component or similar could be used, but keeping inline for now to match original style */}
            <div className="h-14 border-b border-tungsten-grey bg-deep-anthracite flex items-center justify-between px-4 shrink-0 z-20 relative">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8 rounded overflow-hidden border border-hazard-amber/50 group-hover:border-hazard-amber transition-colors">
                            <Image src="/icon.jpg" alt="Tentropy" fill className="object-cover" />
                        </div>
                        <span className="font-bold tracking-tighter text-lg text-white group-hover:text-hazard-amber transition-colors hidden md:inline">TENTROPY</span>
                    </Link>
                </div>

                {/* ... (Menu logic kept similar but cleaned up) ... */}
                {/* I'll use a simplified version of the menu for now to save space, or I can extract it too. 
                    For now, I'll keep the essential parts. */}
                <div className="flex items-center gap-2">
                    {/* History Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                            className={cn(
                                "p-2 rounded transition-colors relative",
                                isHistoryOpen ? "text-white bg-carbon-grey" : "text-gray-400 hover:text-white hover:bg-carbon-grey"
                            )}
                            title="Attempt History"
                        >
                            <History className="w-5 h-5" />
                        </button>

                        {isHistoryOpen && (
                            <div className="absolute top-full right-0 mt-2 w-64 bg-deep-anthracite border border-tungsten-grey shadow-xl z-[100] max-h-96 overflow-y-auto rounded-sm">
                                <div className="p-2 border-b border-tungsten-grey text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Recent Attempts
                                </div>
                                {history.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500 text-xs italic">
                                        No attempts recorded yet.
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {history.slice(0, 3).map((attempt) => (
                                            <button
                                                key={attempt.id || attempt.timestamp}
                                                onClick={() => loadAttempt(attempt)}
                                                className="w-full text-left p-2 rounded hover:bg-white/5 group transition-colors border border-transparent hover:border-tungsten-grey"
                                            >
                                                <div className="flex items-center justify-between text-xs mb-1">
                                                    <span className={cn("font-bold", attempt.status === 'PASS' ? "text-terminal-green" : "text-red-500")}>
                                                        {attempt.status}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 font-mono">
                                                        {new Date(attempt.timestamp).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-gray-400 font-mono truncate opacity-60 group-hover:opacity-100">
                                                    {attempt.executionTime}ms
                                                </div>
                                            </button>
                                        ))}
                                        {history.length > 3 && (
                                            <Link
                                                href="/logs"
                                                className="block w-full text-center py-2 text-[10px] text-gray-500 hover:text-hazard-amber hover:bg-hazard-amber/5 rounded transition-colors uppercase tracking-wider font-bold mt-2 border border-dashed border-tungsten-grey hover:border-hazard-amber/30"
                                            >
                                                View All Logs ({history.length})
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Challenges Link */}
                    <Link
                        href="/challenges"
                        className="p-2 text-gray-400 hover:text-white hover:bg-carbon-grey rounded transition-colors"
                        title="All Challenges"
                    >
                        <LayoutGrid className="w-5 h-5" />
                    </Link>

                    <Link href="/" className="text-xs font-mono text-red-500 hover:text-red-400 ml-2 md:ml-4 hidden">
                        <span className="hidden md:inline">Exit</span>
                        <X className="w-5 h-5 md:hidden" />
                    </Link>

                    {/* Auth Menu */}
                    <div className="ml-2 md:ml-4 border-l border-tungsten-grey pl-4">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-2 p-1 rounded-full border border-transparent hover:border-tungsten-grey hover:bg-carbon-grey transition-all"
                            >
                                <div className="w-8 h-8 rounded-full bg-hazard-amber/10 text-hazard-amber flex items-center justify-center border border-hazard-amber/20">
                                    {user?.avatarUrl ? (
                                        <Image
                                            src={user.avatarUrl}
                                            alt={user.name}
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <span className="font-bold text-xs">
                                            {isAuthenticated && user?.name ? user.name.substring(0, 2).toUpperCase() : 'A'}
                                        </span>
                                    )}
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-deep-anthracite border border-tungsten-grey rounded-md shadow-xl py-1 animate-in fade-in zoom-in-95 duration-200 z-[100]">
                                    {isAuthenticated && user ? (
                                        <>
                                            <div className="px-4 py-2 border-b border-tungsten-grey mb-1">
                                                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>

                                            <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-carbon-grey transition-colors">
                                                <User className="w-4 h-4" /> Profile
                                            </Link>
                                            <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-carbon-grey transition-colors">
                                                <Settings className="w-4 h-4" /> Settings
                                            </Link>
                                            <Link href="/history" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-carbon-grey transition-colors">
                                                <History className="w-4 h-4" /> Engineering Log
                                            </Link>

                                            <div className="h-px bg-tungsten-grey my-1" />

                                            <button
                                                onClick={authLogout}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" /> Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="px-4 py-3 border-b border-tungsten-grey mb-1 bg-hazard-amber/5">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                                    <p className="text-sm font-bold text-gray-300">Anonymous User</p>
                                                </div>
                                                <p className="text-[10px] text-gray-500">
                                                    Progress is saved locally but may be lost if you clear cache.
                                                </p>
                                            </div>

                                            <div className="px-2 py-1">
                                                <div className="flex items-center justify-between px-2 py-2 text-sm text-gray-600 cursor-not-allowed">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4" /> Profile
                                                    </div>
                                                    <Lock className="w-3 h-3" />
                                                </div>
                                                <div className="flex items-center justify-between px-2 py-2 text-sm text-gray-600 cursor-not-allowed">
                                                    <div className="flex items-center gap-2">
                                                        <Settings className="w-4 h-4" /> Settings
                                                    </div>
                                                    <Lock className="w-3 h-3" />
                                                </div>
                                                <div className="flex items-center justify-between px-2 py-2 text-sm text-gray-600 cursor-not-allowed">
                                                    <div className="flex items-center gap-2">
                                                        <History className="w-4 h-4" /> Engineering Log
                                                    </div>
                                                    <Lock className="w-3 h-3" />
                                                </div>
                                            </div>

                                            <div className="h-px bg-tungsten-grey my-1" />

                                            <div className="p-2">
                                                <Link
                                                    href="/login"
                                                    className="flex items-center justify-center gap-2 w-full py-2 bg-white text-black text-xs font-bold rounded hover:bg-gray-200 transition-colors"
                                                >
                                                    Sign In to Unlock
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative z-10">
                <div className="absolute inset-0 pointer-events-none z-0 opacity-10" style={{
                    backgroundImage: 'linear-gradient(to right, #27272A 1px, transparent 1px), linear-gradient(to bottom, #27272A 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}></div>

                {isMobile ? (
                    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto z-10 scrollbar-thin scrollbar-thumb-tungsten-grey scrollbar-track-transparent">
                        {DescriptionPanel}
                        <div className="h-[85vh] border-t border-tungsten-grey">
                            {RightPane}
                        </div>
                    </div>
                ) : (
                    <PanelGroup direction="horizontal" className="flex-1 z-10">
                        <Panel defaultSize={35} minSize={20} maxSize={50} className="flex flex-col">
                            {DescriptionPanel}
                        </Panel>
                        <PanelResizeHandle className="w-[2px] bg-tungsten-grey hover:bg-hazard-amber transition-colors" />
                        <Panel defaultSize={65}>
                            {RightPane}
                        </Panel>
                    </PanelGroup>
                )}
            </div>

            <EmailModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} />
            <ConfirmationModal
                isOpen={showRevealConfirm}
                onClose={() => setShowRevealConfirm(false)}
                onConfirm={confirmReveal}
                title="Reveal Solution?"
                description="This will mark the challenge as revealed and may affect your score. Are you sure you want to proceed?"
                confirmText="Reveal Code"
            />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={handleAuthSuccess} />
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                challengeTitle={challenge.title}
                challengeId={challenge.id}
                executionTime={history[0]?.executionTime || 0}
                certificateId={unlockedCertId}
                trackTitle={unlockedTrackTitle}
            />

            {isMobile && !hasRevealedSolution && (challenge.solutionCode || challenge.hasSolution) && !isLocked && (
                <div className="fixed bottom-0 left-0 right-0 bg-deep-anthracite border-t border-hazard-amber p-4 z-50 flex items-center justify-between animate-in slide-in-from-bottom duration-500">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-hazard-amber/10 rounded-full text-hazard-amber shrink-0">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="text-xs text-gray-300">
                            <p className="font-bold text-white mb-0.5">Coding on mobile is hard.</p>
                            <p>Tap "Reveal" to see the fix instantly.</p>
                        </div>
                    </div>
                    <button onClick={revealSolutionHandler} className="px-4 py-2 bg-hazard-amber text-black text-xs font-bold rounded shadow-lg hover:bg-hazard-amber/90 transition-colors">
                        REVEAL
                    </button>
                </div>
            )}

            {isLocked && (
                <div className="fixed bottom-0 left-0 right-0 z-[100] bg-deep-anthracite/95 border-t border-hazard-amber backdrop-blur-md p-4 flex items-center justify-center gap-3 animate-in slide-in-from-bottom duration-500 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
                    <Lock className="w-5 h-5 text-hazard-amber animate-pulse" />
                    <span className="text-sm font-bold text-hazard-amber tracking-widest">PREVIEW MODE — SOLVE PREVIOUS MISSIONS TO UNLOCK</span>
                </div>
            )}
        </div>
    );
}

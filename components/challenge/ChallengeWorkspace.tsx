'use client';

import React from 'react';
import { AlertTriangle, Lock, X } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Toaster } from 'react-hot-toast';

import ConfirmationModal from '@/components/modals/ConfirmationModal';
import AuthModal from '@/components/modals/AuthModal';
import SuccessModal from '@/components/modals/SuccessModal';
import EditorPanel from './EditorPanel';
import ConsolePanel from './ConsolePanel';
import WorkspaceHeader from './WorkspaceHeader';
import DescriptionPanel from './DescriptionPanel';

import { Challenge } from '@/types/challenge';
import { ChallengeProvider, useChallenge } from '@/context/ChallengeContext';

interface ChallengeWorkspaceProps {
    challenge: Challenge;
}

/**
 * Main entry point for the challenge workspace.
 * Wraps everything in the context provider for state management.
 */
export default function ChallengeWorkspace({ challenge }: ChallengeWorkspaceProps) {
    return (
        <ChallengeProvider challenge={challenge}>
            <ChallengeWorkspaceContent challenge={challenge} />
        </ChallengeProvider>
    );
}

// Inner component that consumes the workspace context
function ChallengeWorkspaceContent({ challenge }: { challenge: Challenge }) {
    const workspace = useChallenge();

    const RightPane = (
        <PanelGroup direction="vertical">
            <Panel defaultSize={70} minSize={30}>
                <EditorPanel challenge={challenge} />
            </Panel>

            <PanelResizeHandle className="h-[2px] bg-tungsten-grey hover:bg-hazard-amber transition-colors" />

            <Panel defaultSize={30} minSize={10}>
                <ConsolePanel />
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

            {/* Top Bar */}
            <WorkspaceHeader />

            {/* Guest Onboarding Banner */}
            {workspace.showOnboardingBanner && (
                <div className="bg-hazard-amber/10 px-4 py-2 flex items-center justify-center shrink-0 z-10 relative">
                    <span className="text-hazard-amber font-mono text-sm font-bold tracking-wide">
                        Read Problem → Edit the Code → Test the Fix
                    </span>
                    <button
                        onClick={() => workspace.setShowOnboardingBanner(false)}
                        className="absolute right-3 text-hazard-amber/60 hover:text-hazard-amber transition-colors p-1"
                        aria-label="Dismiss banner"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden relative z-10">
                <div className="absolute inset-0 pointer-events-none z-0 opacity-10" style={{
                    backgroundImage: 'linear-gradient(to right, #27272A 1px, transparent 1px), linear-gradient(to bottom, #27272A 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}></div>

                {workspace.isMobile ? (
                    <div ref={workspace.scrollContainerRef} className="flex-1 overflow-y-auto z-10 scrollbar-thin scrollbar-thumb-tungsten-grey scrollbar-track-transparent">
                        <DescriptionPanel challenge={challenge} />
                        <div className="h-[85vh] border-t border-tungsten-grey">
                            {RightPane}
                        </div>
                    </div>
                ) : (
                    <PanelGroup direction="horizontal" className="flex-1 z-10">
                        <Panel defaultSize={35} minSize={20} maxSize={50} className="flex flex-col">
                            <DescriptionPanel challenge={challenge} />
                        </Panel>
                        <PanelResizeHandle className="w-[2px] bg-tungsten-grey hover:bg-hazard-amber transition-colors" />
                        <Panel defaultSize={65}>
                            {RightPane}
                        </Panel>
                    </PanelGroup>
                )}
            </div>

            {/* Modals */}
            <ConfirmationModal
                isOpen={workspace.showRevealConfirm}
                onClose={() => workspace.setShowRevealConfirm(false)}
                onConfirm={workspace.confirmReveal}
                title="Reveal Solution?"
                description="This will cost 2 credits and mark the challenge as revealed. Are you sure you want to proceed?"
                confirmText="Reveal (2 Credits)"
            />
            <AuthModal isOpen={workspace.isAuthModalOpen} onClose={() => workspace.setIsAuthModalOpen(false)} onSuccess={workspace.handleAuthSuccess} />
            <SuccessModal
                isOpen={workspace.showSuccessModal}
                onClose={() => workspace.setShowSuccessModal(false)}
                challengeTitle={challenge.title}
                challengeId={challenge.id}
                executionTime={workspace.mergedHistory[0]?.executionTime || 0}
                certificateId={workspace.unlockedCertId}
                trackTitle={workspace.unlockedTrackTitle}
                nextChallengeId={workspace.nextChallengeId}
            />

            {/* Mobile Reveal Prompt */}
            {workspace.isMobile && !workspace.hasRevealedSolution && (challenge.solutionCode || challenge.hasSolution) && !workspace.isLocked && (
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
                    <button onClick={workspace.revealSolutionHandler} className="px-4 py-2 bg-hazard-amber text-black text-xs font-bold rounded shadow-lg hover:bg-hazard-amber/90 transition-colors">
                        REVEAL
                    </button>
                </div>
            )}

            {/* Locked Challenge Banner */}
            {workspace.isLocked && (
                <div className="fixed bottom-0 left-0 right-0 z-[100] bg-deep-anthracite/95 border-t border-hazard-amber backdrop-blur-md p-4 flex items-center justify-center gap-3 animate-in slide-in-from-bottom duration-500 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
                    <Lock className="w-5 h-5 text-hazard-amber animate-pulse" />
                    <span className="text-sm font-bold text-hazard-amber tracking-widest">PREVIEW MODE — SOLVE PREVIOUS MISSIONS TO UNLOCK</span>
                </div>
            )}
        </div>
    );
}

'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { BookOpen, Lock, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChallenge } from '@/context/ChallengeContext';
import { Challenge } from '@/types/challenge';

interface DescriptionPanelProps {
    challenge: Challenge;
}

/**
 * Left panel containing both Briefing and Debrief tabs.
 * Uses context to access workspace state.
 */
export default function DescriptionPanel({ challenge }: DescriptionPanelProps) {
    const {
        isMobile,
        activeLeftTab,
        setActiveLeftTab,
        isDebriefLocked
    } = useChallenge();

    return (
        <div className={cn(
            "flex flex-col bg-deep-anthracite/95 backdrop-blur-sm",
            isMobile ? "h-auto min-h-fit" : "h-full border-r border-tungsten-grey"
        )}>
            {/* Tab Buttons */}
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

            {/* Content Area */}
            <div className={cn(
                "p-4 md:p-6 scrollbar-thin scrollbar-thumb-tungsten-grey scrollbar-track-transparent",
                isMobile ? "overflow-visible h-auto" : "flex-1 overflow-y-auto"
            )}>
                {activeLeftTab === 'BRIEFING' ? (
                    <BriefingContent challenge={challenge} />
                ) : (
                    <DebriefContent challenge={challenge} isLocked={isDebriefLocked} />
                )}
            </div>
        </div>
    );
}

/**
 * Briefing tab content
 */
function BriefingContent({ challenge }: { challenge: Challenge }) {
    return (
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
    );
}

/**
 * Debrief tab content
 */
function DebriefContent({ challenge, isLocked }: { challenge: Challenge; isLocked: boolean }) {
    if (isLocked) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center border border-dashed border-tungsten-grey rounded-sm bg-black/20 p-8">
                <div className="p-4 bg-tungsten-grey/10 rounded-full mb-4">
                    <Lock className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-400 mb-2">Encrypted Data</h3>
                <p className="text-xs text-gray-600 max-w-[250px]">
                    Solve the challenge or reveal the solution to decrypt this debrief.
                </p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-300">
            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-headings:font-mono prose-p:text-gray-400 prose-code:text-hazard-amber prose-code:bg-carbon-grey prose-code:px-1 prose-code:py-0.5 prose-code:rounded-none prose-pre:bg-carbon-grey prose-pre:border prose-pre:border-tungsten-grey">
                <ReactMarkdown>{challenge.debrief || "No debrief available."}</ReactMarkdown>
            </div>
        </div>
    );
}

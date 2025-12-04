import React from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { FileCode, Plus, X, Loader2, Play, Eye, Save, Lock, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import SyncIndicator from '@/components/SyncIndicator';
import { Tab } from '@/hooks/useChallengeState';
import { Challenge } from '@/types/challenge';

interface EditorPanelProps {
    challenge: Challenge;
    tabs: Tab[];
    activeTabId: string;
    setActiveTabId: (id: string) => void;
    updateTabContent: (value: string | undefined) => void;
    addNewTab: () => void;
    closeTab: (e: React.MouseEvent, id: string) => void;
    setEditorInstance: (editor: editor.IStandaloneCodeEditor) => void;
    setMonacoInstance: (monaco: Monaco) => void;
    submitSolution: () => void;
    cancelSubmission: () => void;
    isLoading: boolean;
    revealSolution: () => void;
    isAuthenticated: boolean;
    isDebriefLocked: boolean;
    toggleSaveChallenge: () => void;
    isSaved: boolean;
    hasRevealedSolution: boolean;
    handleSaveSolution: () => void;
    syncStatus: 'idle' | 'saving' | 'saved' | 'error' | 'offline';
    isLocked: boolean;
    isMobile: boolean;
    activeTab: Tab;
    posthog?: any;
    showPiiWarning?: boolean;
}

export default function EditorPanel({
    challenge,
    tabs,
    activeTabId,
    setActiveTabId,
    updateTabContent,
    addNewTab,
    closeTab,
    setEditorInstance,
    setMonacoInstance,
    submitSolution,
    cancelSubmission,
    isLoading,
    revealSolution,
    isAuthenticated,
    isDebriefLocked,
    toggleSaveChallenge,
    isSaved,
    hasRevealedSolution,
    handleSaveSolution,
    syncStatus,
    isLocked,
    isMobile,
    activeTab,
    posthog,
    showPiiWarning
}: EditorPanelProps) {
    return (
        <div className="h-full flex flex-col bg-deep-anthracite relative">
            {/* Editor Header */}
            <div className="h-10 border-b border-tungsten-grey bg-carbon-grey/50 flex items-center justify-between px-2 shrink-0 relative z-20">
                <div className="flex items-center gap-1 h-full pt-1 overflow-x-auto scrollbar-none min-w-0 flex-1 mr-2">
                    {tabs.map(tab => (
                        <div
                            key={tab.id}
                            onClick={() => {
                                if (activeTabId !== tab.id) {
                                    posthog?.capture('tab_switched', { challenge_id: challenge.id });
                                }
                                setActiveTabId(tab.id);
                            }}
                            className={cn(
                                "h-full px-3 md:px-4 flex items-center gap-2 text-xs font-mono cursor-pointer border-t-2 transition-colors whitespace-nowrap",
                                activeTabId === tab.id
                                    ? "border-hazard-amber bg-deep-anthracite text-white"
                                    : "border-transparent text-gray-600 hover:text-gray-400"
                            )}
                        >
                            <FileCode className="w-3 h-3" />
                            <span className="max-w-[100px] truncate">{tab.name}</span>
                            <button onClick={(e) => closeTab(e, tab.id)} className="ml-2 hover:text-white"><X className="w-3 h-3" /></button>
                        </div>
                    ))}
                    <button onClick={addNewTab} className="h-full px-3 flex items-center text-gray-600 hover:text-white transition-colors">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center gap-2 ml-2">
                    <button
                        onClick={submitSolution}
                        disabled={isLoading || isLocked}
                        className={cn(
                            "flex items-center gap-2 px-3 md:px-4 py-1.5 text-xs font-bold tracking-wider transition-all border shrink-0",
                            isLoading || isLocked
                                ? "bg-tungsten-grey/10 border-tungsten-grey text-gray-500 cursor-not-allowed"
                                : "bg-hazard-amber/10 border-hazard-amber/50 text-hazard-amber hover:bg-hazard-amber hover:text-black shadow-[0_0_10px_rgba(255,176,0,0.3)] hover:shadow-[0_0_15px_rgba(255,176,0,0.6)]"
                        )}
                        title={isLocked ? "Unlock previous missions to execute code" : "Execute Code"}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isLocked ? (
                                <Lock className="w-4 h-4" />
                            ) : (
                                <Play className="w-4 h-4 fill-current" />
                            )}
                            <span className="hidden md:inline">
                                {isLoading ? 'PATCHING...' : 'EXECUTE'}
                            </span>
                        </span>
                    </button>

                    {/* Cancel button - only show when loading */}
                    {isLoading && (
                        <button
                            onClick={cancelSubmission}
                            className="flex items-center gap-2 px-3 md:px-4 py-1.5 text-xs font-bold tracking-wider transition-all border border-red-500/50 text-red-500 hover:bg-red-500/10 shrink-0"
                            title="Cancel Execution"
                        >
                            <Square className="w-4 h-4 fill-current" />
                            <span className="hidden md:inline">CANCEL</span>
                        </button>
                    )}

                    {(challenge.solutionCode || challenge.hasSolution) && (
                        <button
                            onClick={revealSolution}
                            disabled={isLocked}
                            className={cn(
                                "flex items-center gap-2 px-3 md:px-4 py-1.5 text-xs font-bold tracking-wider transition-all border shrink-0",
                                isLocked
                                    ? "bg-tungsten-grey/10 border-tungsten-grey text-gray-500 cursor-not-allowed"
                                    : "border-tungsten-grey text-gray-400 hover:text-white hover:border-white/50"
                            )}
                            title={isLocked ? "Unlock previous missions to reveal solution" : "Reveal Solution"}
                        >
                            {isLocked ? <Lock className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            <span className="hidden md:inline">{'SOLUTION'}</span>
                        </button>
                    )}

                    {/* Authenticated Save Button (Only when debrief is unlocked) */}
                    {isAuthenticated && !isDebriefLocked && (
                        <button
                            onClick={toggleSaveChallenge}
                            className={cn(
                                "flex items-center gap-2 px-3 md:px-4 py-1.5 text-xs font-bold tracking-wider transition-all border shrink-0",
                                isSaved
                                    ? "bg-hazard-amber text-black border-hazard-amber hover:bg-hazard-amber/90"
                                    : "border-hazard-amber/50 text-hazard-amber hover:bg-hazard-amber/10"
                            )}
                            title={isSaved ? "Unsave Challenge" : "Save Challenge"}
                        >
                            <Save className={cn("w-4 h-4", isSaved && "fill-current")} />
                            <span className="hidden md:inline">{isSaved ? 'SAVED' : 'SAVE'}</span>
                        </button>
                    )}

                    {/* Anonymous Save Button (Only if revealed and NOT authenticated) */}
                    {hasRevealedSolution && !isAuthenticated && (
                        <button
                            onClick={handleSaveSolution}
                            className="flex items-center gap-2 px-3 md:px-4 py-1.5 text-xs font-bold tracking-wider transition-all border border-terminal-green/50 text-terminal-green hover:bg-terminal-green/10 shrink-0"
                            title="Save Solution"
                        >
                            <Save className="w-4 h-4" />
                            <span className="hidden md:inline">SAVE</span>
                        </button>
                    )}

                    {/* Cloud Sync Indicator */}
                    <SyncIndicator status={syncStatus} isAuthenticated={isAuthenticated} />
                </div>
            </div>

            {/* Editor Instance */}
            <div className="flex-1 relative min-h-0">
                <Editor
                    height="100%"
                    defaultLanguage="python"
                    theme="vs-dark"
                    value={activeTab.content}
                    onChange={updateTabContent}
                    onMount={(editor, monaco) => {
                        setEditorInstance(editor);
                        setMonacoInstance(monaco);
                        monaco.editor.defineTheme('industrial-dark', {
                            base: 'vs-dark',
                            inherit: true,
                            rules: [],
                            colors: {
                                'editor.background': '#09090B',
                                'editor.lineHighlightBackground': '#121214',
                                'editorLineNumber.foreground': '#3F3F46',
                            }
                        });
                        monaco.editor.setTheme('industrial-dark');
                    }}
                    options={{
                        minimap: { enabled: false },
                        fontSize: isMobile ? 12 : 13,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        lineHeight: 21,
                        padding: { top: 16, bottom: 16 },
                        renderLineHighlight: 'all',
                        cursorBlinking: 'phase',
                        cursorStyle: 'block',
                        scrollBeyondLastLine: false,
                        readOnly: isLocked,
                    }}
                />
            </div>

            {showPiiWarning && (
                <div className="absolute bottom-0 right-0 left-0 bg-deep-anthracite/80 backdrop-blur-sm border-t border-tungsten-grey px-4 py-1 text-[10px] text-gray-500 flex justify-end pointer-events-none z-10">
                    <span>⚠️ Do not include PII or secrets in your code.</span>
                </div>
            )}
        </div>
    );
}

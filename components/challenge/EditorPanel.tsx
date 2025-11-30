import React from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import type * as MonacoEditor from 'monaco-editor';
import { FileCode, Plus, X, Loader2, Play, Eye, Save, Lock } from 'lucide-react';
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
    setEditorInstance: (editor: MonacoEditor.editor.IStandaloneCodeEditor) => void;
    setMonacoInstance: (monaco: Monaco) => void;
    submitSolution: () => void;
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
    posthog
}: EditorPanelProps) {
    return (
        <div className="h-full flex flex-col bg-deep-anthracite">
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
                        disabled={isLoading}
                        className={cn(
                            "flex items-center gap-2 px-3 md:px-4 py-1.5 text-xs font-bold tracking-wider transition-all border border-hazard-amber/50 shrink-0",
                            isLoading
                                ? "bg-hazard-amber/10 text-hazard-amber/50 cursor-not-allowed"
                                : "bg-hazard-amber/10 text-hazard-amber hover:bg-hazard-amber hover:text-black shadow-[0_0_10px_rgba(255,176,0,0.3)] hover:shadow-[0_0_15px_rgba(255,176,0,0.6)]"
                        )}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                            <span className="hidden md:inline">{isLoading ? 'PATCHING...' : 'EXECUTE'}</span>
                        </span>
                    </button>

                    {(challenge.solutionCode || challenge.hasSolution) && (
                        <button
                            onClick={revealSolution}
                            className="flex items-center gap-2 px-3 md:px-4 py-1.5 text-xs font-bold tracking-wider transition-all border border-tungsten-grey text-gray-400 hover:text-white hover:border-white/50 shrink-0"
                            title="Reveal Solution"
                        >
                            <Eye className="w-4 h-4" />
                            <span className="hidden md:inline">SOLUTION</span>
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
                {isLocked && (
                    <div className="absolute inset-0 z-50 bg-deep-anthracite/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                        <Lock className="w-12 h-12 text-gray-500 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">MISSION LOCKED</h3>
                        <p className="text-gray-400 max-w-md">
                            Complete previous missions to unlock this challenge.
                        </p>
                    </div>
                )}
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
                    }}
                />
            </div>
        </div>
    );
}

import { useState, useRef, useCallback, useEffect } from 'react';
import { Monaco } from '@monaco-editor/react';
import type * as MonacoEditor from 'monaco-editor';
import { toast } from 'react-hot-toast';
import { usePostHog } from 'posthog-js/react';
import { logger } from '@/lib/logger';
import { Challenge } from '@/types/challenge';
import { Attempt } from '@/types/attempt';

export interface Tab {
    id: string;
    name: string;
    content: string;
}

export interface LintError {
    line: number;
    column: number;
    endLine?: number;
    endColumn?: number;
    message: string;
    severity: 'error' | 'warning' | 'info';
    source: string;
}

export function useChallengeState(challenge: Challenge) {
    // Tab State
    const [tabs, setTabs] = useState<Tab[]>([
        { id: '1', name: 'solution.py', content: challenge.brokenCode }
    ]);
    const [activeTabId, setActiveTabId] = useState<string>('1');
    const [history, setHistory] = useState<Attempt[]>([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const [monacoInstance, setMonacoInstance] = useState<Monaco | null>(null);
    const [editorInstance, setEditorInstance] = useState<MonacoEditor.editor.IStandaloneCodeEditor | null>(null);

    const posthog = usePostHog();
    const lintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

    // Reset code when challenge changes
    useEffect(() => {
        setTabs([{ id: '1', name: 'solution.py', content: challenge.brokenCode }]);
        setActiveTabId('1');
        setIsHistoryOpen(false);

        // Load history from local storage
        const saved = localStorage.getItem(`gradient-run-history-${challenge.id}`);
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                logger.error("Failed to parse history", e);
            }
        } else {
            setHistory([]);
        }
    }, [challenge]);

    const updateTabContent = (value: string | undefined) => {
        if (!value) return;
        setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, content: value } : t));
        debouncedLint(value);
    };

    const addNewTab = () => {
        const newId = Math.random().toString(36).substr(2, 9);
        const newTab: Tab = { id: newId, name: 'untitled.py', content: '' };
        setTabs([...tabs, newTab]);
        setActiveTabId(newId);
    };

    const closeTab = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (tabs.length === 1) return; // Don't close last tab

        const newTabs = tabs.filter(t => t.id !== id);
        setTabs(newTabs);

        if (activeTabId === id) {
            setActiveTabId(newTabs[newTabs.length - 1].id);
        }
    };

    const loadAttempt = (attempt: Attempt) => {
        if (!attempt.code) {
            toast.error("No code saved for this attempt");
            return;
        }
        posthog?.capture('attempt_loaded', { challenge_id: challenge.id });
        const newId = Math.random().toString(36).substr(2, 9);
        const date = new Date(attempt.timestamp);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        const name = `attempt_${timeStr}.py`.replace(/:/g, '-');

        const newTab: Tab = { id: newId, name, content: attempt.code };
        setTabs(prev => [...prev, newTab]);
        setActiveTabId(newId);
        setIsHistoryOpen(false);
    };

    const lintCode = useCallback(async (code: string) => {
        if (!monacoInstance || !editorInstance) return;

        try {
            const response = await fetch('/api/lint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });

            if (!response.ok) {
                logger.error('Linting failed');
                return;
            }

            const data = await response.json();

            if (data.errors && Array.isArray(data.errors)) {
                const markers: MonacoEditor.editor.IMarkerData[] = data.errors.map((error: LintError) => ({
                    startLineNumber: error.line,
                    startColumn: error.column || 1,
                    endLineNumber: error.endLine || error.line,
                    endColumn: error.endColumn || 100,
                    message: error.message,
                    severity: error.severity === 'error'
                        ? monacoInstance.MarkerSeverity.Error
                        : error.severity === 'warning'
                            ? monacoInstance.MarkerSeverity.Warning
                            : monacoInstance.MarkerSeverity.Info,
                    source: error.source || 'linter'
                }));

                const model = editorInstance.getModel();
                if (model) {
                    monacoInstance.editor.setModelMarkers(model, 'python-linter', markers);
                }
            }
        } catch (error) {
            logger.error('Linting error:', error);
        }
    }, [monacoInstance, editorInstance]);

    const debouncedLint = useCallback((code: string) => {
        if (lintTimeoutRef.current) {
            clearTimeout(lintTimeoutRef.current);
        }

        lintTimeoutRef.current = setTimeout(() => {
            lintCode(code);
        }, 1000); // Lint after 1 second of no typing
    }, [lintCode]);

    return {
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
    };
}

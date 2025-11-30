'use client';

import { useState } from 'react';
import { useAttemptHistory } from '@/hooks/useAttemptHistory';
import { Check, X, Clock, Code, Loader2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttemptHistoryProps {
    challengeId: string;
    onLoadCode?: (code: string, timestamp: number) => void;
}

export default function AttemptHistory({ challengeId, onLoadCode }: AttemptHistoryProps) {
    const { attempts, loading } = useAttemptHistory(challengeId);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const formatTime = (ms: number | null) => {
        if (!ms) return 'N/A';
        if (ms < 1000) return `${ms}ms`;
        return `${(ms / 1000).toFixed(2)}s`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Loading attempt history...
            </div>
        );
    }

    if (attempts.length === 0) {
        return (
            <div className="text-center p-8 border border-dashed border-tungsten-grey rounded-sm">
                <Code className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No attempts yet</p>
                <p className="text-xs text-gray-600 mt-1">Submit your first solution to see it here</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-bold">
                {attempts.length} {attempts.length === 1 ? 'Attempt' : 'Attempts'}
            </div>

            {attempts.map((attempt) => (
                <div
                    key={attempt.id}
                    className="bg-deep-anthracite border border-tungsten-grey rounded-sm overflow-hidden"
                >
                    <button
                        onClick={() => setExpandedId(expandedId === attempt.id ? null : attempt.id)}
                        className="w-full p-3 flex items-center justify-between hover:bg-carbon-grey transition-colors text-left"
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center",
                                attempt.status
                                    ? "bg-terminal-green/20 text-terminal-green"
                                    : "bg-red-500/20 text-red-400"
                            )}>
                                {attempt.status ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                            </div>

                            <div>
                                <div className="text-sm text-white font-mono">
                                    {attempt.status ? 'PASS' : 'FAIL'}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(attempt.created_at)}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {attempt.execution_time && (
                                <span className="text-xs text-gray-500 font-mono">
                                    {formatTime(attempt.execution_time)}
                                </span>
                            )}
                            <Eye className="w-4 h-4 text-gray-500" />
                        </div>
                    </button>

                    {expandedId === attempt.id && attempt.code && (
                        <div className="border-t border-tungsten-grey bg-black/30">
                            <div className="p-3">
                                <pre className="text-xs text-gray-300 font-mono overflow-x-auto scrollbar-thin scrollbar-thumb-tungsten-grey scrollbar-track-transparent mb-3 bg-black/50 p-3 rounded border border-tungsten-grey/30">
                                    <code>{attempt.code}</code>
                                </pre>
                                {onLoadCode && (
                                    <button
                                        onClick={() => onLoadCode(attempt.code!, new Date(attempt.created_at).getTime())}
                                        className="text-xs px-3 py-1.5 bg-hazard-amber/10 text-hazard-amber border border-hazard-amber/50 rounded hover:bg-hazard-amber/20 transition-colors font-mono"
                                    >
                                        Load in Editor
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

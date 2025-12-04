import React, { useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import RateLimitIndicator from '@/components/RateLimitIndicator';
import { RateLimitState } from '@/hooks/useChallengeRunner';

interface ConsolePanelProps {
    output: string;
    status: 'idle' | 'running' | 'success' | 'failure' | 'cancelled';
    rateLimit: RateLimitState;
}

export default function ConsolePanel({
    output,
    status,
    rateLimit
}: ConsolePanelProps) {
    const terminalRef = useRef<HTMLDivElement>(null);

    // Auto-scroll terminal
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [output]);

    const getStatusDisplay = () => {
        switch (status) {
            case 'running': return { text: 'PROCESSING...', classes: 'border-hazard-amber text-hazard-amber animate-pulse' };
            case 'success': return { text: 'PATCH SUCCESSFUL', classes: 'border-terminal-green text-terminal-green' };
            case 'failure': return { text: 'PATCH FAILED', classes: 'border-red-500 text-red-500' };
            case 'cancelled': return { text: 'CANCELLED', classes: 'border-orange-500 text-orange-500' };
            default: return null;
        }
    };

    const statusDisplay = getStatusDisplay();

    return (
        <div className="h-full flex flex-col bg-carbon-grey border-t border-tungsten-grey">
            <div className="h-8 flex items-center justify-between px-4 border-b border-tungsten-grey bg-carbon-grey shrink-0">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> SYSTEM_LOGS
                </span>
                <div className="flex items-center gap-3">
                    <RateLimitIndicator
                        remaining={rateLimit.remaining}
                        limit={rateLimit.limit}
                        reset={rateLimit.reset}
                    />
                    {statusDisplay && (
                        <span className={cn(
                            "text-[10px] font-bold uppercase px-2 py-0.5 border",
                            statusDisplay.classes
                        )}>
                            {statusDisplay.text}
                        </span>
                    )}
                </div>
            </div>
            <div
                ref={terminalRef}
                className="flex-1 p-4 overflow-auto font-mono text-sm bg-black/50"
            >
                {output ? (
                    <pre className={cn(
                        "whitespace-pre-wrap font-mono",
                        status === 'failure' ? "text-red-400" : "text-gray-300"
                    )}>
                        {output}
                    </pre>
                ) : (
                    <div className="text-gray-600 italic text-xs">
                        {"// Waiting for execution trigger..."}
                    </div>
                )}
            </div>
        </div>
    );
}

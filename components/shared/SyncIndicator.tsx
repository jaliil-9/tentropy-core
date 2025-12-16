'use client';

import { Cloud, CloudOff, Check, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type SyncStatus = 'idle' | 'saving' | 'saved' | 'error' | 'offline';

interface SyncIndicatorProps {
    status: SyncStatus;
    isAuthenticated: boolean;
}

export default function SyncIndicator({ status, isAuthenticated }: SyncIndicatorProps) {
    // Show local status for anonymous users
    if (!isAuthenticated) {
        return (
            <div
                className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono transition-colors text-gray-500"
                title="Not synced (Local only)"
            >
                <CloudOff className="w-3 h-3" />
            </div>
        );
    }

    const getIcon = () => {
        switch (status) {
            case 'saving':
                return <Loader2 className="w-3 h-3 animate-spin" />;
            case 'saved':
                return <Check className="w-3 h-3" />;
            case 'error':
                return <AlertCircle className="w-3 h-3" />;
            case 'offline':
                return <CloudOff className="w-3 h-3" />;
            default:
                return <Cloud className="w-3 h-3" />;
        }
    };

    const getColor = () => {
        switch (status) {
            case 'saving':
                return 'text-blue-400';
            case 'saved':
                return 'text-terminal-green';
            case 'error':
                return 'text-red-400';
            case 'offline':
                return 'text-gray-500';
            default:
                return 'text-gray-400';
        }
    };

    const getTooltip = () => {
        switch (status) {
            case 'saving':
                return 'Syncing to cloud...';
            case 'saved':
                return 'Synced';
            case 'error':
                return 'Sync failed';
            case 'offline':
                return 'Offline';
            default:
                return 'Cloud sync enabled';
        }
    };

    return (
        <div
            className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono transition-colors',
                getColor()
            )}
            title={getTooltip()}
        >
            {getIcon()}
            <span className="hidden md:inline text-[10px] uppercase tracking-wider">
                {status === 'saving' ? 'Syncing' : status === 'saved' ? 'Synced' : status === 'offline' ? 'Offline' : ''}
            </span>
        </div>
    );
}

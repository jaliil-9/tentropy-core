'use client';

import { useState, useEffect } from 'react';
import { Zap, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RateLimitIndicatorProps {
    remaining: number;
    limit: number;
    reset: number; // Timestamp in ms
}

export default function RateLimitIndicator({ remaining, limit, reset }: RateLimitIndicatorProps) {
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        if (remaining > 0) {
            setTimeLeft('');
            return;
        }

        const updateTimer = () => {
            const now = Date.now();
            const diff = reset - now;

            if (diff <= 0) {
                setTimeLeft('');
                return;
            }

            const mins = Math.floor(diff / 60000);
            const secs = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [remaining, reset]);

    // Calculate percentage for color
    const percentage = (remaining / limit) * 100;

    let colorClass = 'text-hazard-amber';
    if (percentage === 0) colorClass = 'text-red-500';
    else if (percentage <= 40) colorClass = 'text-hazard-amber';

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-deep-anthracite border border-tungsten-grey rounded text-xs font-mono" title={`Rate Limit: ${remaining}/${limit} runs remaining`}>
            {remaining === 0 ? (
                <div className="flex items-center gap-1.5 text-red-400">
                    <Clock className="w-3 h-3 animate-pulse" />
                    <span>{timeLeft || 'Refilling...'}</span>
                </div>
            ) : (
                <div className={cn("flex items-center gap-1.5", colorClass)}>
                    <Zap className={cn("w-3 h-3", percentage <= 40 && "animate-pulse")} />
                    <span>{remaining}/{limit}</span>
                </div>
            )}
        </div>
    );
}

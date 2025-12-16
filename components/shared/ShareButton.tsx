'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
    challengeTitle: string;
    challengeId: string;
    executionTime: number;
    className?: string;
}

export default function ShareButton({ challengeTitle, challengeId, executionTime, className }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const text = `
SYSTEM STATUS: STABILIZED 🟢
Mission: ${challengeTitle}
ID: ${challengeId}
Execution Time: ${executionTime}ms

Stabilize the Chaos at tentropy.app
        `.trim();

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success('PROTOCOL COPIED', {
                style: {
                    background: '#FFB000',
                    color: '#000',
                    fontFamily: 'monospace',
                    fontWeight: 'bold'
                },
                iconTheme: {
                    primary: '#000',
                    secondary: '#FFB000',
                },
            });
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('FAILED TO COPY');
        }
    };

    return (
        <button
            onClick={handleShare}
            className={cn(
                "flex items-center gap-2 px-4 py-2 bg-deep-anthracite border border-tungsten-grey hover:border-white/50 text-gray-300 hover:text-white transition-all rounded-sm group",
                className
            )}
        >
            {copied ? (
                <Check className="w-4 h-4 text-terminal-green" />
            ) : (
                <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-xs font-bold tracking-wider">
                {copied ? 'COPIED' : 'SHARE PROTOCOL'}
            </span>
        </button>
    );
}

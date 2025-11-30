'use client';

import React from 'react';
import { Save, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuccessCardProps {
    executionTime: number;
    onSave: () => void;
    className?: string;
}

export default function SuccessCard({ executionTime, onSave, className }: SuccessCardProps) {
    return (
        <div className={cn(
            "mt-4 p-6 rounded-sm border border-terminal-green/30 bg-terminal-green/5 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500",
            className
        )}>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <CheckCircle className="w-32 h-32" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                        <CheckCircle className="w-5 h-5 text-terminal-green" />
                        CHALLENGE PASSED
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-mono">
                        <Clock className="w-4 h-4" />
                        <span>Execution time: <span className="text-terminal-green">{executionTime}ms</span></span>
                    </div>
                </div>

                <button
                    onClick={onSave}
                    className="flex items-center gap-2 px-6 py-2 bg-terminal-green text-black font-bold rounded hover:bg-terminal-green/90 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] whitespace-nowrap"
                >
                    <Save className="w-4 h-4" />
                    Save Result to Profile
                </button>
            </div>
        </div>
    );
}

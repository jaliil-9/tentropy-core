'use client';

import React from 'react';
import { Award, Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CertificateCardProps {
    solvedCount: number;
    userName?: string;
}

export default function CertificateCard({ solvedCount, userName }: CertificateCardProps) {
    const REQUIRED_SOLVED = 4;
    const isUnlocked = solvedCount >= REQUIRED_SOLVED;
    const progress = Math.min((solvedCount / REQUIRED_SOLVED) * 100, 100);

    return (
        <div className="bg-deep-anthracite border border-tungsten-grey p-6 rounded-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Award className="w-24 h-24" />
            </div>

            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-tungsten-grey/50 pb-2 flex items-center gap-2">
                <Award className="w-4 h-4" /> Certifications
            </h2>

            <div className={cn(
                "relative border rounded-sm p-4 transition-all",
                isUnlocked
                    ? "border-hazard-amber bg-hazard-amber/5"
                    : "border-tungsten-grey bg-carbon-grey/50 opacity-70"
            )}>
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className={cn(
                            "font-bold text-lg mb-1",
                            isUnlocked ? "text-white" : "text-gray-500"
                        )}>
                            Level 1 AI Systems Engineer
                        </h3>
                        <p className="text-xs text-gray-400">
                            Demonstrated proficiency in system resilience and basic AI infrastructure.
                        </p>
                    </div>
                    {isUnlocked ? (
                        <div className="p-2 bg-hazard-amber text-black rounded-full">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                    ) : (
                        <div className="p-2 bg-tungsten-grey text-gray-400 rounded-full">
                            <Lock className="w-5 h-5" />
                        </div>
                    )}
                </div>

                {isUnlocked ? (
                    <div className="mt-4 pt-4 border-t border-hazard-amber/20">
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-hazard-amber font-bold">
                            <span>Certified: {userName || 'OPERATOR'}</span>
                            <span>ID: TENTROPY-L1-V1</span>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4">
                        <div className="flex justify-between text-[10px] uppercase text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{solvedCount} / {REQUIRED_SOLVED} Challenges</span>
                        </div>
                        <div className="h-1.5 bg-tungsten-grey rounded-full overflow-hidden">
                            <div
                                className="h-full bg-hazard-amber transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

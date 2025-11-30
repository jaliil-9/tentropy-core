'use client';

import React from 'react';
import { Track } from '@/types/challenge';
import { Play, CheckCircle2, Lock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface TrackProgressCardProps {
    tracks: Track[];
    progressMap: Map<string, any>;
}

export default function TrackProgressCard({ tracks, progressMap }: TrackProgressCardProps) {
    return (
        <div className="col-span-1 md:col-span-2 bg-deep-anthracite border border-tungsten-grey p-6 rounded-sm">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Play className="w-4 h-4" /> Active Operations
            </h2>

            <div className="space-y-6">
                {tracks.map(track => {
                    const total = track.challengeIds.length;
                    const solved = track.challengeIds.filter(id => progressMap.get(id)?.status === 'solved').length;
                    const percentage = Math.round((solved / total) * 100);
                    const isComplete = solved === total;

                    // Find next unsolved challenge
                    const nextChallengeId = track.challengeIds.find(id => progressMap.get(id)?.status !== 'solved');

                    return (
                        <div key={track.id} className="group">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-hazard-amber transition-colors">
                                        {track.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 line-clamp-1 max-w-md">
                                        {track.description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={cn(
                                        "text-xl font-mono font-bold",
                                        isComplete ? "text-terminal-green" : "text-white"
                                    )}>
                                        {percentage}%
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-carbon-grey h-2 rounded-full overflow-hidden mb-4">
                                <div
                                    className={cn(
                                        "h-full transition-all duration-500",
                                        isComplete ? "bg-terminal-green" : "bg-hazard-amber"
                                    )}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>

                            {/* Action Button */}
                            <div className="flex justify-end">
                                {isComplete ? (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-terminal-green/10 text-terminal-green text-xs font-bold rounded-sm border border-terminal-green/20">
                                        <CheckCircle2 className="w-4 h-4" />
                                        OPERATION COMPLETE
                                    </div>
                                ) : (
                                    <Link
                                        href={`/challenge/${nextChallengeId || track.challengeIds[0]}`}
                                        className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-sm hover:bg-gray-200 transition-colors"
                                    >
                                        <Play className="w-3 h-3 fill-current" />
                                        RESUME MISSION
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

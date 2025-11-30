import React from 'react';
import { cn } from '@/lib/utils';

export default function LoadingChallenge() {
    return (
        <div className="h-screen flex flex-col bg-deep-anthracite">
            {/* Top Bar Skeleton */}
            <div className="h-14 border-b border-tungsten-grey bg-deep-anthracite flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded bg-tungsten-grey/30 animate-pulse" />
                    <div className="w-24 h-4 rounded bg-tungsten-grey/30 animate-pulse hidden md:block" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-tungsten-grey/30 animate-pulse" />
                    <div className="w-8 h-8 rounded bg-tungsten-grey/30 animate-pulse" />
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel Skeleton */}
                <div className="w-[35%] border-r border-tungsten-grey bg-deep-anthracite/95 p-6 hidden md:block">
                    <div className="mb-8">
                        <div className="h-8 w-3/4 rounded bg-tungsten-grey/30 animate-pulse mb-3" />
                        <div className="h-4 w-32 rounded bg-tungsten-grey/30 animate-pulse" />
                    </div>

                    <div className="space-y-3">
                        <div className="h-4 w-full rounded bg-tungsten-grey/30 animate-pulse" />
                        <div className="h-4 w-5/6 rounded bg-tungsten-grey/30 animate-pulse" />
                        <div className="h-4 w-4/5 rounded bg-tungsten-grey/30 animate-pulse" />
                        <div className="h-4 w-full rounded bg-tungsten-grey/30 animate-pulse" />
                    </div>
                </div>

                {/* Right Panel Skeleton */}
                <div className="flex-1 flex flex-col">
                    {/* Editor Header Skeleton */}
                    <div className="h-12 border-b border-tungsten-grey bg-carbon-grey flex items-center gap-2 px-4">
                        <div className="w-24 h-6 rounded bg-tungsten-grey/30 animate-pulse" />
                        <div className="w-24 h-6 rounded bg-tungsten-grey/30 animate-pulse" />
                    </div>

                    {/* Editor Content Skeleton */}
                    <div className="flex-1 bg-black/50 p-4">
                        <div className="space-y-2">
                            {[...Array(15)].map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "h-4 rounded bg-tungsten-grey/30 animate-pulse",
                                        i % 3 === 0 ? 'w-1/4' : i % 2 === 0 ? 'w-3/4' : 'w-2/3'
                                    )}
                                    style={{ animationDelay: `${i * 50}ms` }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Console Skeleton */}
                    <div className="h-48 border-t border-tungsten-grey bg-carbon-grey p-4">
                        <div className="h-4 w-32 rounded bg-tungsten-grey/30 animate-pulse mb-3" />
                        <div className="h-3 w-48 rounded bg-tungsten-grey/30 animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}

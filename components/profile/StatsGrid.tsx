'use client';

import React from 'react';
import { Flame, Target, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsGridProps {
    streak: number;
    totalSolved: number;
    totalChallenges: number;
}

export default function StatsGrid({ streak, totalSolved, totalChallenges }: StatsGridProps) {
    return (
        <div className="col-span-1 grid grid-cols-2 md:grid-cols-1 gap-4">
            {/* Streak Card */}
            <div className="bg-deep-anthracite border border-tungsten-grey p-4 rounded-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Flame className="w-16 h-16" />
                </div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-hazard-amber" /> Current Streak
                </h3>
                <div className="text-3xl font-black text-white tracking-tight">
                    {streak} <span className="text-sm font-normal text-gray-500">DAYS</span>
                </div>
            </div>

            {/* Solved Card */}
            <div className="bg-deep-anthracite border border-tungsten-grey p-4 rounded-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Target className="w-16 h-16" />
                </div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-terminal-green" /> Missions Solved
                </h3>
                <div className="text-3xl font-black text-white tracking-tight">
                    {totalSolved} <span className="text-sm font-normal text-gray-500">/ {totalChallenges}</span>
                </div>
                <div className="w-full bg-carbon-grey h-1 mt-3 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-terminal-green transition-all duration-500"
                        style={{ width: `${(totalSolved / Math.max(totalChallenges, 1)) * 100}%` }}
                    />
                </div>
            </div>

            {/* Rank Card (Placeholder) */}
            <div className="col-span-2 md:col-span-1 bg-deep-anthracite border border-tungsten-grey p-4 rounded-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Trophy className="w-16 h-16" />
                </div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-blue-400" /> Global Rank
                </h3>
                <div className="text-3xl font-black text-white tracking-tight">
                    TOP 10%
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Based on completion speed</p>
            </div>
        </div>
    );
}

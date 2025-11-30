'use client';

import React, { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';

interface StreakIndicatorProps {
    userId?: string;
    className?: string;
}

export default function StreakIndicator({ userId, className }: StreakIndicatorProps) {
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStreak = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            const supabase = createClient();
            const { data, error } = await supabase
                .from('user_stats')
                .select('current_streak')
                .eq('user_id', userId)
                .single();

            if (!error && data) {
                setStreak(data.current_streak);
            }
            setLoading(false);
        };

        fetchStreak();
    }, [userId]);

    if (loading || !userId || streak === 0) return null;

    return (
        <div className={cn(
            "flex items-center gap-1.5 px-2 py-1 bg-hazard-amber/10 border border-hazard-amber/30 rounded-full",
            className
        )} title={`${streak} Day Streak`}>
            <Flame className="w-3.5 h-3.5 text-hazard-amber fill-hazard-amber animate-pulse" />
            <span className="text-xs font-bold text-hazard-amber font-mono">
                {streak}
            </span>
        </div>
    );
}

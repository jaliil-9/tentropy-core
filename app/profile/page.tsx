'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/utils/auth';
import { Loader2, Shield } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { tracks, challenges } from '@/data/challenges';
import Footer from '@/components/Footer';
import { useAllProgress } from '@/hooks/useAllProgress';

// New Components
import ProfileHeader from '@/components/profile/ProfileHeader';
import StatsGrid from '@/components/profile/StatsGrid';
import TrackProgressCard from '@/components/profile/TrackProgressCard';
import CertificateShowcase from '@/components/profile/CertificateShowcase';

export default function ProfilePage() {
    const { user, isAuthenticated, loading } = useAuth();
    const { progressMap, loading: progressLoading } = useAllProgress();
    const [streak, setStreak] = useState(0);

    // Fetch streak
    useEffect(() => {
        const fetchStreak = async () => {
            if (user) {
                const supabase = createClient();
                const { data } = await supabase
                    .from('user_stats')
                    .select('current_streak')
                    .eq('user_id', user.id)
                    .single();
                if (data) setStreak(data.current_streak);
            }
        };
        fetchStreak();
    }, [user]);

    if (loading || progressLoading) {
        return (
            <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-gray-500 font-mono text-sm gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> LOADING OPERATOR_DATA...
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-gray-400 font-mono">
                <Shield className="w-12 h-12 mb-4 text-gray-600" />
                <h1 className="text-xl font-bold text-white mb-2">ACCESS DENIED</h1>
                <p className="mb-6">Authentication required to view this console.</p>
                <Link
                    href="/login"
                    className="px-6 py-2 bg-hazard-amber text-black font-bold rounded hover:bg-hazard-amber/90 transition-colors"
                >
                    AUTHENTICATE
                </Link>
            </div>
        );
    }

    // Calculate stats
    const solvedCount = progressMap
        ? Array.from(progressMap.values()).filter(p => p.status === 'solved').length
        : 0;

    return (
        <div className="min-h-screen bg-[#09090B] text-gray-300 font-mono p-6 pt-24 md:p-12 md:pt-32">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* 1. Header (Full Width) */}
                    <ProfileHeader user={user} />

                    {/* 2. Left Column: Stats & Certificates */}
                    <div className="col-span-1 flex flex-col gap-6">
                        <StatsGrid
                            streak={streak}
                            totalSolved={solvedCount}
                            totalChallenges={challenges.length}
                        />
                        <CertificateShowcase
                            tracks={tracks}
                            progressMap={progressMap}
                            userId={user.id}
                            userName={user.name || user.email?.split('@')[0] || 'Operator'}
                        />
                    </div>

                    {/* 3. Right Column: Track Progress */}
                    <TrackProgressCard
                        tracks={tracks}
                        progressMap={progressMap}
                    />
                </div>
            </div>
        </div>
    );
}

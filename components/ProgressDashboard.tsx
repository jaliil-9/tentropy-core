'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/utils/auth';
import { createClient } from '@/utils/supabase/client';
import { tracks, challenges } from '@/data/challenges';
import { Target, TrendingUp, Clock, Award } from 'lucide-react';
import { useAllProgress } from '@/hooks/useAllProgress';

interface ProgressStats {
    totalChallenges: number;
    solvedChallenges: number;
    inProgressChallenges: number;
    completionPercentage: number;
}

interface TrackProgress {
    trackId: string;
    trackName: string;
    total: number;
    solved: number;
    percentage: number;
}

interface RecentActivity {
    challengeId: string;
    challengeTitle: string;
    solvedAt: string;
}

export default function ProgressDashboard() {
    const { user } = useAuth();
    const { progressMap, loading } = useAllProgress();
    const [stats, setStats] = useState<ProgressStats>({
        totalChallenges: 0,
        solvedChallenges: 0,
        inProgressChallenges: 0,
        completionPercentage: 0
    });
    const [trackProgress, setTrackProgress] = useState<TrackProgress[]>([]);
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

    useEffect(() => {
        if (!progressMap) return;

        // Calculate overall stats
        const allProgress = Array.from(progressMap.values());
        const solved = allProgress.filter(p => p.status === 'solved').length;
        const inProgress = allProgress.filter(p => p.status === 'in_progress').length;
        const total = challenges.length;

        setStats({
            totalChallenges: total,
            solvedChallenges: solved,
            inProgressChallenges: inProgress,
            completionPercentage: total > 0 ? Math.round((solved / total) * 100) : 0
        });

        // Calculate progress by track
        const trackStats: TrackProgress[] = tracks.map(track => {
            const trackTotal = track.challengeIds.length;
            const trackSolved = track.challengeIds.filter(id => {
                const progress = progressMap.get(id);
                return progress?.status === 'solved';
            }).length;

            return {
                trackId: track.id,
                trackName: track.title,
                total: trackTotal,
                solved: trackSolved,
                percentage: trackTotal > 0 ? Math.round((trackSolved / trackTotal) * 100) : 0
            };
        });
        setTrackProgress(trackStats);

        // Get recent activity (solved challenges)
        const recent = allProgress
            .filter(p => p.status === 'solved' && p.solvedAt)
            .sort((a, b) => {
                const dateA = new Date(a.solvedAt!).getTime();
                const dateB = new Date(b.solvedAt!).getTime();
                return dateB - dateA; // Most recent first
            })
            .slice(0, 5)
            .map(p => {
                const challenge = challenges.find(c => c.id === p.challengeId);
                return {
                    challengeId: p.challengeId,
                    challengeTitle: challenge?.title || 'Unknown Challenge',
                    solvedAt: p.solvedAt!
                };
            });
        setRecentActivity(recent);
    }, [progressMap]);

    if (loading) {
        return (
            <div className="bg-deep-anthracite border border-tungsten-grey p-6 rounded-sm">
                <p className="text-gray-500 text-sm">Loading progress...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-deep-anthracite border border-tungsten-grey p-4 rounded-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Target className="w-5 h-5 text-hazard-amber" />
                        <h3 className="text-xs uppercase text-gray-500 font-bold tracking-wider">Total Progress</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {stats.solvedChallenges}<span className="text-gray-600">/{stats.totalChallenges}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{stats.completionPercentage}% Complete</p>
                </div>

                <div className="bg-deep-anthracite border border-tungsten-grey p-4 rounded-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-terminal-green" />
                        <h3 className="text-xs uppercase text-gray-500 font-bold tracking-wider">In Progress</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.inProgressChallenges}</p>
                    <p className="text-xs text-gray-500 mt-1">Active Challenges</p>
                </div>

                <div className="bg-deep-anthracite border border-tungsten-grey p-4 rounded-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Award className="w-5 h-5 text-blue-400" />
                        <h3 className="text-xs uppercase text-gray-500 font-bold tracking-wider">Completion</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.completionPercentage}%</p>
                    <p className="text-xs text-gray-500 mt-1">Overall Progress</p>
                </div>
            </div>

            {/* Progress by Track */}
            <div className="bg-deep-anthracite border border-tungsten-grey p-6 rounded-sm">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Progress by Track</h3>
                <div className="space-y-4">
                    {trackProgress.map(track => (
                        <div key={track.trackId}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-white font-mono">{track.trackName}</span>
                                <span className="text-xs text-gray-500">
                                    {track.solved}/{track.total} ({track.percentage}%)
                                </span>
                            </div>
                            <div className="w-full bg-carbon-grey h-2 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-hazard-amber transition-all duration-500"
                                    style={{ width: `${track.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
                <div className="bg-deep-anthracite border border-tungsten-grey p-6 rounded-sm">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Recent Activity
                    </h3>
                    <div className="space-y-3">
                        {recentActivity.map((activity, index) => (
                            <div
                                key={`${activity.challengeId}-${index}`}
                                className="flex items-center justify-between py-2 border-b border-tungsten-grey/30 last:border-0"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-terminal-green" />
                                    <span className="text-sm text-white">{activity.challengeTitle}</span>
                                </div>
                                <span className="text-xs text-gray-500 font-mono">
                                    {new Date(activity.solvedAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

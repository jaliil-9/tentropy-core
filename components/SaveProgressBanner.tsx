'use client';

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/utils/auth';

const BANNER_DISMISSED_KEY = 'save_progress_banner_dismissed';
const MIN_SOLVES_TO_SHOW = 2;

export default function SaveProgressBanner() {
    const { user } = useAuth();
    const [isDismissed, setIsDismissed] = useState(true);
    const [solvedCount, setSolvedCount] = useState(0);

    useEffect(() => {
        // Don't show banner for authenticated users
        if (user) {
            setIsDismissed(true);
            return;
        }

        // Check if banner was previously dismissed
        const dismissed = localStorage.getItem(BANNER_DISMISSED_KEY);
        if (dismissed) {
            setIsDismissed(true);
            return;
        }

        // Count solved challenges in localStorage
        const allProgressKey = 'all_challenge_progress';
        const progressData = localStorage.getItem(allProgressKey);

        if (progressData) {
            try {
                const allProgress = JSON.parse(progressData);
                const solved = allProgress.filter((p: any) => p.status === 'solved').length;
                setSolvedCount(solved);

                // Show banner if user has solved at least MIN_SOLVES_TO_SHOW challenges
                if (solved >= MIN_SOLVES_TO_SHOW) {
                    setIsDismissed(false);
                }
            } catch (error) {
                console.error('Error parsing progress for banner:', error);
            }
        }
    }, [user]);

    const handleDismiss = () => {
        localStorage.setItem(BANNER_DISMISSED_KEY, 'true');
        setIsDismissed(true);
    };

    if (isDismissed) return null;

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full px-4">
            <div className="bg-gradient-to-r from-hazard-amber/20 to-yellow-600/20 border-2 border-hazard-amber rounded-lg p-4 shadow-[0_0_30px_rgba(255,176,0,0.3)] backdrop-blur-sm">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-0.5">
                        <Save className="w-6 h-6 text-hazard-amber" />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-white font-bold mb-1">
                            Great progress! 🎉
                        </h3>
                        <p className="text-sm text-gray-300 mb-3">
                            You've solved {solvedCount} {solvedCount === 1 ? 'challenge' : 'challenges'}.
                            Sign up to save your progress and track it across all devices!
                        </p>

                        <div className="flex gap-3">
                            <Link
                                href="/signup"
                                className="px-4 py-2 bg-hazard-amber text-black font-bold rounded hover:bg-yellow-500 transition-colors text-sm shadow-[0_0_10px_rgba(255,176,0,0.3)]"
                            >
                                Sign Up Free
                            </Link>
                            <Link
                                href="/login"
                                className="px-4 py-2 border border-hazard-amber text-hazard-amber font-bold rounded hover:bg-hazard-amber/10 transition-colors text-sm"
                            >
                                Log In
                            </Link>
                        </div>
                    </div>

                    <button
                        onClick={handleDismiss}
                        className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
                        aria-label="Dismiss banner"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

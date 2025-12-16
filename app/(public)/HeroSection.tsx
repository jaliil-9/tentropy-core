'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { ONBOARDING_COMPLETE_KEY, INTRO_CHALLENGE_ID } from "@/lib/constants";

export default function HeroSection() {
    const [isFirstTimeGuest, setIsFirstTimeGuest] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Handle hash navigation for smooth scrolling when coming from another page
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            setTimeout(() => {
                const element = document.getElementById(hash.substring(1));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, []);

    // Detect first-time guest on mount
    useEffect(() => {
        setMounted(true);
        const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_COMPLETE_KEY);
        setIsFirstTimeGuest(!hasCompletedOnboarding);
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 mb-24">
            <h1 className="text-3xl md:text-6xl font-black tracking-tighter text-white leading-none">
                STABILIZE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600">THE CHAOS.</span>
            </h1>

            <p className="text-base md:text-xl text-gray-400 font-mono max-w-2xl mx-auto text-center">
                {"// Learn AI engineering by repairing broken pipelines."}<br />
                <span className="text-hazard-amber">Latency. Hallucinations. Cost.</span>
            </p>

            <div className="pt-4 md:pt-8 flex flex-col md:flex-row gap-4 items-center justify-center">
                <Link
                    href={mounted && isFirstTimeGuest ? `/challenge/${INTRO_CHALLENGE_ID}` : "/challenges"}
                    className="group relative inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 font-mono font-bold text-white transition-all duration-200 bg-transparent border-2 border-hazard-amber hover:bg-hazard-amber/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hazard-amber focus:ring-offset-deep-anthracite text-sm md:text-base"
                >
                    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
                    <span className="relative flex items-center gap-3 text-hazard-amber group-hover:text-white transition-colors text-glow">
                        {mounted && isFirstTimeGuest ? "[ CAN YOU FIX THIS? ]" : "[ INITIALIZE ]"}
                    </span>
                </Link>

                <a
                    href="https://github.com/jaliil-9/tentropy-core"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 font-mono font-bold text-gray-400 transition-all duration-200 bg-transparent border-2 border-gray-700 hover:border-white hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-deep-anthracite text-sm md:text-base"
                >
                    <span className="relative flex items-center gap-3">
                        [ SOURCE CODE ]
                    </span>
                </a>
            </div>
        </div>
    );
}

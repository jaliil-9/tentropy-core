'use client';

import Link from "next/link";
import { Play, Terminal } from "lucide-react";

export default function HeroSection() {
    const scrollToRoadmap = () => {
        const roadmapElement = document.getElementById('roadmap');
        if (roadmapElement) {
            roadmapElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="relative z-20 flex flex-col justify-center items-center text-center px-4 min-h-[60vh] py-20">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hazard-amber/10 border border-hazard-amber/20 text-hazard-amber text-xs font-mono font-bold tracking-wider mb-4">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hazard-amber opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-hazard-amber"></span>
                    </span>
                    SYSTEM STATUS: CRITICAL
                </div>

                <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white leading-none">
                    STABILIZE <br className="md:hidden" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600">THE CHAOS.</span>
                </h1>

                <p className="text-lg md:text-2xl text-gray-400 font-mono max-w-2xl mx-auto leading-relaxed">
                    The Flight Simulator for AI Systems Engineering.
                    <br />
                    <span className="text-gray-500 text-base md:text-lg mt-2 block">
                        Master Rate Limits, ReDoS, and RAG Failures in isolated sandboxes.
                    </span>
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
                    <button
                        onClick={scrollToRoadmap}
                        className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-black transition-all duration-200 bg-hazard-amber rounded-lg hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hazard-amber focus:ring-offset-deep-anthracite w-full md:w-auto"
                    >
                        <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                        <span className="relative flex items-center gap-2">
                            <Play className="w-5 h-5 fill-current" />
                            START MISSION 01
                        </span>
                    </button>

                    <button
                        className="group inline-flex items-center justify-center px-8 py-4 font-mono font-bold text-gray-400 transition-all duration-200 bg-transparent border border-tungsten-grey rounded-lg hover:text-white hover:border-white focus:outline-none w-full md:w-auto"
                    >
                        <span className="flex items-center gap-2">
                            <Terminal className="w-5 h-5" />
                            VIEW DEMO
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

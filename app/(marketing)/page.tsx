"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Terminal, Activity, Award, ChevronRight } from "lucide-react";


const ONBOARDING_COMPLETE_KEY = 'tentropy_onboarding_complete';
const INTRO_CHALLENGE_ID = 'ai-cost-cache-002';


export default function Home() {
  const [email, setEmail] = useState("");
  const [isFirstTimeGuest, setIsFirstTimeGuest] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle hash navigation for smooth scrolling when coming from another page
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Small delay to ensure the page is fully rendered
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
    // First-time guest if no onboarding completion flag
    setIsFirstTimeGuest(!hasCompletedOnboarding);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-deep-anthracite text-foreground selection:bg-hazard-amber selection:text-deep-anthracite">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "TENTROPY",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "A platform for mastering AI system design through realistic coding challenges."
          })
        }}
      />

      {/* Background Grid & Schematic */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="grid-bg absolute inset-0 opacity-20"></div>
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#27272A" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <g stroke="#27272A" strokeWidth="1" fill="none">
            <path d="M 100 100 L 300 200 L 500 100" />
            <path d="M 100 300 L 300 200 L 500 300" />
            <circle cx="100" cy="100" r="4" fill="#121214" />
            <circle cx="500" cy="100" r="4" fill="#121214" />
            <circle cx="100" cy="300" r="4" fill="#121214" />
            <circle cx="500" cy="300" r="4" fill="#121214" />
            <circle cx="300" cy="200" r="6" fill="#121214" stroke="#FFB000" className="animate-pulse" />
          </g>
          <path d="M 300 200 L 350 250 L 320 280 L 400 350" stroke="#FFB000" strokeWidth="2" fill="none" strokeDasharray="5,5" className="animate-pulse opacity-60" />
        </svg>
        <div className="scanline absolute inset-0 z-10"></div>
      </div>

      {/* Hero Section */}
      <main className="relative z-20 flex-1 flex flex-col justify-center items-center text-center px-4 py-20 pt-24">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 mb-24">
          <h1 className="text-3xl md:text-6xl font-black tracking-tighter text-white leading-none">
            STABILIZE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600">THE CHAOS.</span>
          </h1>

          <p className="text-base md:text-xl text-gray-400 font-mono max-w-2xl mx-auto text-center">
            {"// Master AI system design by repairing broken pipelines."}<br />
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

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full px-4 mb-20">
          <div className="group relative p-6 bg-carbon-grey/50 border border-tungsten-grey hover:border-hazard-amber transition-colors duration-300 flex flex-col items-start text-left">
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
              <div className="w-2 h-2 bg-hazard-amber rounded-full animate-pulse"></div>
            </div>
            <div className="mb-4 p-3 bg-deep-anthracite border border-tungsten-grey rounded text-hazard-amber group-hover:text-white group-hover:border-white transition-colors">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-mono group-hover:text-hazard-amber transition-colors">REAL-WORLD CHAOS</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Debug realistic distributed system failures. Race conditions, memory leaks, and network partitions.
            </p>
          </div>

          <div className="group relative p-6 bg-carbon-grey/50 border border-tungsten-grey hover:border-hazard-amber transition-colors duration-300 flex flex-col items-start text-left">
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
              <div className="w-2 h-2 bg-hazard-amber rounded-full animate-pulse"></div>
            </div>
            <div className="mb-4 p-3 bg-deep-anthracite border border-tungsten-grey rounded text-hazard-amber group-hover:text-white group-hover:border-white transition-colors">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-mono group-hover:text-hazard-amber transition-colors">LIVE ENVIRONMENT</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Full ephemeral Linux environments. Root access. Real tools. No mockups.
            </p>
          </div>

          <div className="group relative p-6 bg-carbon-grey/50 border border-tungsten-grey hover:border-hazard-amber transition-colors duration-300 flex flex-col items-start text-left">
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
              <div className="w-2 h-2 bg-hazard-amber rounded-full animate-pulse"></div>
            </div>
            <div className="mb-4 p-3 bg-deep-anthracite border border-tungsten-grey rounded text-hazard-amber group-hover:text-white group-hover:border-white transition-colors">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-mono group-hover:text-hazard-amber transition-colors">ENGINEERING MASTERY</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Prove your skills. Climb the global leaderboard. Earn your rank.
            </p>
          </div>
        </div>

        {/* Tracks Showcase */}
        <div id="tracks" className="w-full max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 font-mono">
              {"<"} SYSTEM TRACKS {"/>"}
            </h2>
            <p className="text-gray-400 font-mono text-sm md:text-base">
              // Choose your path. Master the chaos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* System Resilience Track */}
            <div className="bg-carbon-grey/30 border border-tungsten-grey rounded-lg p-6 hover:border-hazard-amber transition-all duration-300 group flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-2xl text-gray-500 font-bold opacity-50">01</span>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-1 font-mono group-hover:text-hazard-amber transition-colors">
                      SYSTEM RESILIENCE
                    </h3>
                    <p className="text-sm text-gray-400 font-mono">
                      // 5 missions | EASY → MEDIUM
                    </p>
                  </div>
                </div>
                <Activity className="w-8 h-8 text-hazard-amber opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="space-y-3 mb-8 flex-1">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300 font-mono">The Regex Assassin</span>
                  <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded border text-hazard-amber border-hazard-amber/30 bg-hazard-amber/10 font-mono">MEDIUM</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300 font-mono">The Burst Handler</span>
                  <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded border text-hazard-amber border-hazard-amber/30 bg-hazard-amber/10 font-mono">MEDIUM</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <span className="text-gray-400 font-mono">The Retry Storm</span>
                  <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded border text-terminal-green border-terminal-green/30 bg-terminal-green/10 font-mono">EASY</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <span className="text-gray-400 font-mono">The Connection Drain</span>
                  <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded border text-hazard-amber border-hazard-amber/30 bg-hazard-amber/10 font-mono">MEDIUM</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <span className="text-gray-400 font-mono">The Data Flood</span>
                  <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded border text-hazard-amber border-hazard-amber/30 bg-hazard-amber/10 font-mono">MEDIUM</span>
                </div>
              </div>

              <Link
                href="/challenges?track=systems-resilience"
                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-hazard-amber text-hazard-amber hover:bg-hazard-amber/10 transition-colors font-mono font-bold text-sm group"
              >
                VIEW TRACK
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* AI Architect Track */}
            <div className="bg-carbon-grey/30 border border-tungsten-grey rounded-lg p-6 hover:border-hazard-amber transition-all duration-300 group flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-2xl text-gray-500 font-bold opacity-50">02</span>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-1 font-mono group-hover:text-hazard-amber transition-colors">
                      AI ARCHITECT
                    </h3>
                    <p className="text-sm text-gray-400 font-mono">
                      // 5 missions | EASY → HARD
                    </p>
                  </div>
                </div>
                <Terminal className="w-8 h-8 text-hazard-amber opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="space-y-3 mb-8 flex-1">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <span className="text-gray-400 font-mono">The Wallet Burner</span>
                  <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded border text-terminal-green border-terminal-green/30 bg-terminal-green/10 font-mono">EASY</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <span className="text-gray-400 font-mono">The Context Guillotine</span>
                  <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded border text-hazard-amber border-hazard-amber/30 bg-hazard-amber/10 font-mono">MEDIUM</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <span className="text-gray-400 font-mono">The Hallucination Trap</span>
                  <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded border text-hazard-amber border-hazard-amber/30 bg-hazard-amber/10 font-mono">MEDIUM</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <span className="text-gray-400 font-mono">The Hanging Stream</span>
                  <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded border text-red-500 border-red-500/30 bg-red-500/10 font-mono">HARD</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <span className="text-gray-400 font-mono">The Lost Chunk</span>
                  <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded border text-hazard-amber border-hazard-amber/30 bg-hazard-amber/10 font-mono">MEDIUM</span>
                </div>
              </div>

              <Link
                href="/challenges?track=ai-architect"
                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-hazard-amber text-hazard-amber hover:bg-hazard-amber/10 transition-colors font-mono font-bold text-sm group"
              >
                VIEW TRACK
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="w-full max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6 font-mono">
            {"<"} ABOUT TENTROPY {"/>"}
          </h2>
          <p className="text-gray-400 font-mono text-base md:text-lg leading-relaxed mb-8">
            TENTROPY is an open-source platform built for engineers who want to master AI system design through hands-on practice.
            We simulate real production failures in ephemeral environments where you can break things, learn, and level up your skills.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="border border-tungsten-grey bg-carbon-grey/30 p-6">
              <h3 className="text-hazard-amber font-mono font-bold mb-2">NO SIGNUP WALLS</h3>
              <p className="text-sm text-gray-400">Start coding immediately. No forms, no barriers.</p>
            </div>
            <div className="border border-tungsten-grey bg-carbon-grey/30 p-6">
              <h3 className="text-hazard-amber font-mono font-bold mb-2">OPEN SOURCE</h3>
              <p className="text-sm text-gray-400">Every challenge, test case, and solution is public on GitHub.</p>
            </div>
            <div className="border border-tungsten-grey bg-carbon-grey/30 p-6">
              <h3 className="text-hazard-amber font-mono font-bold mb-2">COMMUNITY DRIVEN</h3>
              <p className="text-sm text-gray-400">Built by engineers, for engineers. Join the movement.</p>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}

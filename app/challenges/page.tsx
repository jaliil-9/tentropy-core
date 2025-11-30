'use client';

import { challenges, tracks } from "@/data/challenges";
import { useState } from "react";
import Footer from "@/components/Footer";
import { usePostHog } from "posthog-js/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import ChallengeNode from "@/components/ChallengeNode";
import { Cpu, Server, ChevronDown, ChevronUp } from "lucide-react";
import { useAllProgress } from "@/hooks/useAllProgress";
import { getChallengeStatus } from "@/lib/challengeStatus";

export default function ChallengesPage() {
    const posthog = usePostHog();
    const [activeTab, setActiveTab] = useState(tracks[0].id);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { progressMap, loading } = useAllProgress();

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-deep-anthracite text-foreground selection:bg-hazard-amber selection:text-deep-anthracite pt-16">
            {/* Background Grid & Schematic */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="grid-bg absolute inset-0 opacity-20"></div>
                <div className="scanline absolute inset-0 z-10"></div>
            </div>

            {/* Main Content */}
            <main className="relative z-20 flex-1 max-w-5xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
                <div className="mb-8 md:mb-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-4">
                        SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-hazard-amber to-yellow-600">ROADMAP</span>
                    </h1>
                    <p className="text-sm md:text-base text-gray-400 font-mono max-w-2xl mx-auto">
                        {"// Select a track to view your mission timeline"}
                    </p>
                </div>

                <Tabs defaultValue={tracks[0].id} value={activeTab} onValueChange={setActiveTab} className="w-full">
                    {/* Mobile Track Selector */}
                    <div className="md:hidden mb-8 px-4 relative z-50">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full flex items-center justify-between bg-deep-anthracite border border-tungsten-grey text-white py-3 px-4 rounded-md shadow-sm active:border-hazard-amber transition-colors"
                        >
                            <span className="font-bold flex items-center gap-2">
                                {activeTab === 'ai-architect' ? <Cpu className="w-4 h-4 text-hazard-amber" /> : <Server className="w-4 h-4 text-hazard-amber" />}
                                {tracks.find(t => t.id === activeTab)?.title}
                            </span>
                            {isDropdownOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full left-4 right-4 mt-2 bg-deep-anthracite border border-tungsten-grey rounded-md shadow-xl overflow-hidden z-50">
                                {tracks.map(track => (
                                    <button
                                        key={track.id}
                                        onClick={() => {
                                            setActiveTab(track.id);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 flex items-center gap-2 font-bold transition-colors ${activeTab === track.id
                                            ? 'bg-hazard-amber/10 text-hazard-amber'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        {track.id === 'ai-architect' ? <Cpu className="w-4 h-4" /> : <Server className="w-4 h-4" />}
                                        {track.title}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Desktop Track Selector */}
                    <div className="hidden md:flex justify-center mb-12">
                        <TabsList className="bg-carbon-grey/50 border border-tungsten-grey p-1 h-auto gap-2">
                            {tracks.map(track => (
                                <TabsTrigger
                                    key={track.id}
                                    value={track.id}
                                    className="px-6 py-3 border-2 border-tungsten-grey/50 rounded-md data-[state=active]:border-hazard-amber data-[state=active]:text-hazard-amber data-[state=active]:shadow-[0_0_10px_rgba(255,176,0,0.2)] text-gray-400 hover:text-white hover:border-gray-500 transition-all flex items-center gap-2 font-bold"
                                >
                                    {track.id === 'ai-architect' ? <Cpu className="w-4 h-4" /> : <Server className="w-4 h-4" />}
                                    {track.title}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {tracks.map(track => (
                        <TabsContent key={track.id} value={track.id} className="max-w-3xl mx-auto">
                            {loading ? (
                                <div className="text-center py-12 text-gray-400">
                                    Loading progress...
                                </div>
                            ) : (
                                <div className="relative pl-4">
                                    {track.challengeIds.map((challengeId, index) => {
                                        const challenge = challenges.find(c => c.id === challengeId);
                                        if (!challenge) return null;

                                        const status = getChallengeStatus(challengeId, progressMap, track.challengeIds);

                                        return (
                                            <ChallengeNode
                                                key={challenge.id}
                                                challenge={challenge}
                                                status={status}
                                                index={index}
                                                isLast={index === track.challengeIds.length - 1}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </main>
        </div>
    );
}

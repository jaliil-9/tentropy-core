import { Challenge } from "@/types/challenge";
import { Check, Lock, Play, Terminal } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ChallengeNodeProps {
    challenge: Challenge;
    status: 'locked' | 'current' | 'solved';
    index: number;
    isLast: boolean;
}

export default function ChallengeNode({ challenge, status, index, isLast }: ChallengeNodeProps) {
    return (
        <div className="relative flex gap-8 group">
            {/* Vertical Timeline Line */}
            <div className="flex flex-col items-center">
                {/* Status Dot */}
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-300",
                    status === 'solved' ? "bg-deep-anthracite border-terminal-green text-terminal-green" :
                        status === 'current' ? "bg-deep-anthracite border-hazard-amber text-hazard-amber shadow-[0_0_15px_rgba(255,176,0,0.5)] group-hover:scale-110" :
                            "bg-deep-anthracite border-tungsten-grey text-gray-500"
                )}>
                    {status === 'solved' && <Check className="w-4 h-4" />}
                    {status === 'current' && <div className="w-2.5 h-2.5 bg-hazard-amber rounded-full animate-pulse" />}
                    {status === 'locked' && <Lock className="w-3 h-3" />}
                </div>

                {/* Connecting Line */}
                {!isLast && (
                    <div className={cn(
                        "w-px flex-1 border-l-2 border-dashed my-2",
                        status === 'solved' ? "border-terminal-green/50" : "border-tungsten-grey/50"
                    )} />
                )}
            </div>

            {/* Content Card */}
            <div className={cn(
                "flex-1 mb-8 relative transition-all duration-300",
                status === 'locked' ? "opacity-60 grayscale" : "opacity-100"
            )}>
                <div className={cn(
                    "bg-carbon-grey/30 border rounded-lg p-6 transition-all duration-300",
                    status === 'current' ? "border-hazard-amber/50 shadow-[0_0_20px_rgba(255,176,0,0.1)]" :
                        "border-tungsten-grey hover:border-gray-500"
                )}>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-2xl text-gray-500 font-bold opacity-50">
                                {(index + 1).toString().padStart(2, '0')}
                            </span>
                            <Link href={`/challenge/${challenge.id}`} className={cn(
                                "text-xl font-bold hover:underline decoration-hazard-amber underline-offset-4 transition-all",
                                status === 'current' ? "text-white" : "text-gray-300"
                            )}>
                                {challenge.title}
                            </Link>
                        </div>

                        <span className={cn(
                            "text-[10px] font-bold px-2 py-1 rounded border",
                            challenge.difficulty === 'Hard' ? 'text-red-500 border-red-500/30 bg-red-500/10' :
                                challenge.difficulty === 'Medium' ? 'text-hazard-amber border-hazard-amber/30 bg-hazard-amber/10' :
                                    'text-terminal-green border-terminal-green/30 bg-terminal-green/10'
                        )}>
                            {challenge.difficulty.toUpperCase()}
                        </span>
                    </div>

                    {/* Lesson/Summary */}
                    <div className="mb-6 text-sm text-gray-400 font-mono border-l-2 border-gray-700 pl-4">
                        {challenge.summary}
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center gap-4">
                        {status === 'current' ? (
                            <Link
                                href={`/challenge/${challenge.id}`}
                                className="flex items-center gap-2 px-6 py-2 bg-hazard-amber text-black font-bold rounded hover:bg-yellow-500 transition-colors shadow-[0_0_10px_rgba(255,176,0,0.3)]"
                            >
                                <Play className="w-4 h-4 fill-current" />
                                START MISSION
                            </Link>
                        ) : status === 'solved' ? (
                            <Link
                                href={`/challenge/${challenge.id}?solved=true`}
                                className="flex items-center gap-2 px-6 py-2 border border-terminal-green text-terminal-green font-bold rounded hover:bg-terminal-green/10 transition-colors"
                            >
                                <Check className="w-4 h-4" />
                                REVIEW SOLUTION
                            </Link>
                        ) : (
                            <Link
                                href={`/challenge/${challenge.id}`}
                                className="flex items-center gap-2 px-6 py-2 border border-tungsten-grey text-gray-500 font-mono text-sm rounded hover:border-gray-400 hover:text-gray-400 transition-colors"
                            >
                                <Lock className="w-3 h-3" />
                                LOCKED
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

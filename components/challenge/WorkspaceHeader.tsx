'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { History, LayoutGrid, Settings, User, LogOut, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChallenge } from '@/context/ChallengeContext';
import { Attempt } from '@/types/attempt';

/**
 * Top navigation bar for the challenge workspace.
 * Uses context to access workspace state.
 */
export default function WorkspaceHeader() {
    const {
        user,
        isAuthenticated,
        authLogout,
        isHistoryOpen,
        setIsHistoryOpen,
        isMenuOpen,
        setIsMenuOpen,
        mergedHistory,
        loadAttempt,
        dropdownRef
    } = useChallenge();

    return (
        <div className="h-14 border-b border-tungsten-grey bg-deep-anthracite flex items-center justify-between px-4 shrink-0 z-20 relative">
            {/* Left: Logo */}
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative w-8 h-8 rounded overflow-hidden border border-hazard-amber/50 group-hover:border-hazard-amber transition-colors">
                        <Image src="/icon.jpg" alt="Tentropy" fill className="object-cover" />
                    </div>
                    <span className="font-bold tracking-tighter text-lg text-white group-hover:text-hazard-amber transition-colors hidden md:inline">TENTROPY</span>
                </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                {/* History Dropdown */}
                <HistoryDropdown
                    isOpen={isHistoryOpen}
                    onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
                    attempts={mergedHistory}
                    onLoadAttempt={loadAttempt}
                />

                {/* Challenges Link */}
                <Link
                    href="/challenges"
                    className="p-2 text-gray-400 hover:text-white hover:bg-carbon-grey rounded transition-colors"
                    title="All Challenges"
                >
                    <LayoutGrid className="w-5 h-5" />
                </Link>

                {/* Auth Menu */}
                <UserMenu
                    user={user}
                    isAuthenticated={isAuthenticated}
                    isOpen={isMenuOpen}
                    onToggle={() => setIsMenuOpen(!isMenuOpen)}
                    onLogout={authLogout}
                    dropdownRef={dropdownRef}
                />
            </div>
        </div>
    );
}

/**
 * History dropdown component
 */
interface HistoryDropdownProps {
    isOpen: boolean;
    onToggle: () => void;
    attempts: Attempt[];
    onLoadAttempt: (attempt: Attempt) => void;
}

function HistoryDropdown({ isOpen, onToggle, attempts, onLoadAttempt }: HistoryDropdownProps) {
    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className={cn(
                    "p-2 rounded transition-colors relative",
                    isOpen ? "text-white bg-carbon-grey" : "text-gray-400 hover:text-white hover:bg-carbon-grey"
                )}
                title="Attempt History"
            >
                <History className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-deep-anthracite border border-tungsten-grey shadow-xl z-[100] max-h-96 overflow-y-auto rounded-sm">
                    <div className="p-2 border-b border-tungsten-grey text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Recent Attempts
                    </div>
                    {attempts.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-xs italic">
                            No attempts recorded yet.
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {attempts.slice(0, 3).map((attempt) => (
                                <button
                                    key={attempt.id || attempt.timestamp}
                                    onClick={() => onLoadAttempt(attempt)}
                                    className="w-full text-left p-2 rounded hover:bg-white/5 group transition-colors border border-transparent hover:border-tungsten-grey"
                                >
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className={cn("font-bold", attempt.status === 'PASS' ? "text-terminal-green" : "text-red-500")}>
                                            {attempt.status}
                                        </span>
                                        <span className="text-[10px] text-gray-500 font-mono">
                                            {new Date(attempt.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-mono truncate opacity-60 group-hover:opacity-100">
                                        {attempt.executionTime}ms
                                    </div>
                                </button>
                            ))}
                            {attempts.length > 3 && (
                                <Link
                                    href="/logs"
                                    className="block w-full text-center py-2 text-[10px] text-gray-500 hover:text-hazard-amber hover:bg-hazard-amber/5 rounded transition-colors uppercase tracking-wider font-bold mt-2 border border-dashed border-tungsten-grey hover:border-hazard-amber/30"
                                >
                                    View All Logs ({attempts.length})
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/**
 * User menu dropdown component
 */
interface UserMenuProps {
    user: { name: string; email: string; avatarUrl?: string } | null;
    isAuthenticated: boolean;
    isOpen: boolean;
    onToggle: () => void;
    onLogout: () => void;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
}

function UserMenu({ user, isAuthenticated, isOpen, onToggle, onLogout, dropdownRef }: UserMenuProps) {
    return (
        <div className="ml-2 md:ml-4 border-l border-tungsten-grey pl-4">
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={onToggle}
                    className="flex items-center gap-2 p-1 rounded-full border border-transparent hover:border-tungsten-grey hover:bg-carbon-grey transition-all"
                >
                    <div className="w-8 h-8 rounded-full bg-hazard-amber/10 text-hazard-amber flex items-center justify-center border border-hazard-amber/20">
                        {user?.avatarUrl ? (
                            <Image
                                src={user.avatarUrl}
                                alt={user.name}
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                        ) : (
                            <span className="font-bold text-xs">
                                {isAuthenticated && user?.name ? user.name.substring(0, 2).toUpperCase() : 'A'}
                            </span>
                        )}
                    </div>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-deep-anthracite border border-tungsten-grey rounded-md shadow-xl py-1 animate-in fade-in zoom-in-95 duration-200 z-[100]">
                        {isAuthenticated && user ? (
                            <AuthenticatedMenu user={user} onLogout={onLogout} />
                        ) : (
                            <AnonymousMenu />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function AuthenticatedMenu({ user, onLogout }: { user: { name: string; email: string }; onLogout: () => void }) {
    return (
        <>
            <div className="px-4 py-2 border-b border-tungsten-grey mb-1">
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>

            <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-carbon-grey transition-colors">
                <User className="w-4 h-4" /> Profile
            </Link>
            <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-carbon-grey transition-colors">
                <Settings className="w-4 h-4" /> Settings
            </Link>
            <Link href="/logs" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-carbon-grey transition-colors">
                <History className="w-4 h-4" /> Engineering Log
            </Link>

            <div className="h-px bg-tungsten-grey my-1" />

            <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
                <LogOut className="w-4 h-4" /> Sign Out
            </button>
        </>
    );
}

function AnonymousMenu() {
    return (
        <>
            <div className="px-4 py-3 border-b border-tungsten-grey mb-1 bg-hazard-amber/5">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                    <p className="text-sm font-bold text-gray-300">Anonymous User</p>
                </div>
                <p className="text-[10px] text-gray-500">
                    Progress is saved locally but may be lost if you clear cache.
                </p>
            </div>

            <div className="px-2 py-1">
                <div className="flex items-center justify-between px-2 py-2 text-sm text-gray-600 cursor-not-allowed">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4" /> Profile
                    </div>
                    <Lock className="w-3 h-3" />
                </div>
                <div className="flex items-center justify-between px-2 py-2 text-sm text-gray-600 cursor-not-allowed">
                    <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4" /> Settings
                    </div>
                    <Lock className="w-3 h-3" />
                </div>
                <div className="flex items-center justify-between px-2 py-2 text-sm text-gray-600 cursor-not-allowed">
                    <div className="flex items-center gap-2">
                        <History className="w-4 h-4" /> Engineering Log
                    </div>
                    <Lock className="w-3 h-3" />
                </div>
            </div>

            <div className="h-px bg-tungsten-grey my-1" />

            <div className="p-2">
                <Link
                    href="/signin"
                    className="flex items-center justify-center gap-2 w-full py-2 bg-white text-black text-xs font-bold rounded hover:bg-gray-200 transition-colors"
                >
                    Sign In to Unlock
                </Link>
            </div>
        </>
    );
}

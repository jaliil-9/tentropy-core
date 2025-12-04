'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import {
    User,
    Settings,
    LogOut,
    History,
    ChevronDown,
    Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import StreakIndicator from '../StreakIndicator';

interface UserDropdownProps {
    user: {
        id: string;
        name: string;
        email: string;
        avatarUrl?: string;
    };
    onLogoutClick: () => void;
    isSigningOut: boolean;
}

export default function UserDropdown({ user, onLogoutClick, isSigningOut }: UserDropdownProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogoutClick = () => {
        onLogoutClick();
        setIsMenuOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full border border-transparent hover:border-tungsten-grey hover:bg-carbon-grey transition-all"
            >
                <div className="w-8 h-8 rounded-full bg-hazard-amber/10 text-hazard-amber flex items-center justify-center border border-hazard-amber/20">
                    {user.avatarUrl ? (
                        <Image
                            src={user.avatarUrl}
                            alt={user.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                    ) : (
                        <span className="font-bold text-xs">
                            {user.name.substring(0, 2).toUpperCase()}
                        </span>
                    )}
                </div>
                <ChevronDown className={cn("w-4 h-4 text-gray-500 transition-transform", isMenuOpen && "rotate-180")} />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-deep-anthracite border border-tungsten-grey rounded-md shadow-xl py-1 animate-in fade-in zoom-in-95 duration-200">
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
                        <History className="w-4 h-4" /> System Logs
                    </Link>

                    <div className="px-4 py-2">
                        <StreakIndicator userId={user.id} className="w-fit" />
                    </div>

                    <div className="h-px bg-tungsten-grey my-1" />

                    <button
                        onClick={handleLogoutClick}
                        disabled={isSigningOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSigningOut ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Signing Out...
                            </>
                        ) : (
                            <>
                                <LogOut className="w-4 h-4" /> Sign Out
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}

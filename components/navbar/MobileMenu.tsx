'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    User,
    Settings,
    History,
    LogOut,
    Menu,
    X,
} from 'lucide-react';

interface MobileMenuProps {
    isOpen: boolean;
    onToggle: () => void;
    user: {
        id: string;
        name: string;
        email: string;
        avatarUrl?: string;
    } | null;
    isAuthenticated: boolean;
    loading: boolean;
    onLogoutClick: () => void;
}

export default function MobileMenu({
    isOpen,
    onToggle,
    user,
    isAuthenticated,
    loading,
    onLogoutClick,
}: MobileMenuProps) {
    const pathname = usePathname();
    const router = useRouter();
    const isHomePage = pathname === '/';

    const handleSmoothScroll = (e: React.MouseEvent, targetId: string) => {
        e.preventDefault();
        onToggle(); // Close mobile menu

        if (pathname !== '/') {
            // Navigate to home first, then scroll
            router.push(`/#${targetId}`);
        } else {
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="md:hidden p-2 text-gray-400 hover:text-white"
                onClick={onToggle}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 border-t border-tungsten-grey bg-deep-anthracite p-4 flex flex-col gap-4 shadow-2xl">
                    {/* Navigation Links */}
                    <div className="flex flex-col gap-2 pb-4 border-b border-tungsten-grey">
                        <a
                            href="/#tracks"
                            onClick={(e) => handleSmoothScroll(e, 'tracks')}
                            className="text-gray-300 hover:text-white transition-colors py-2 font-mono text-sm"
                        >
                            Tracks
                        </a>
                        <a
                            href="/#about"
                            onClick={(e) => handleSmoothScroll(e, 'about')}
                            className="text-gray-300 hover:text-white transition-colors py-2 font-mono text-sm"
                        >
                            About
                        </a>
                        <Link
                            href="/contact"
                            className="text-gray-300 hover:text-white transition-colors py-2 font-mono text-sm"
                        >
                            Contact
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex items-center gap-3 pb-4 border-b border-tungsten-grey">
                            <div className="w-10 h-10 rounded-full bg-carbon-grey animate-pulse" />
                            <div className="space-y-2">
                                <div className="w-24 h-4 bg-carbon-grey rounded animate-pulse" />
                                <div className="w-32 h-3 bg-carbon-grey rounded animate-pulse" />
                            </div>
                        </div>
                    ) : isAuthenticated && user ? (
                        <>
                            <div className="flex items-center gap-3 pb-4 border-b border-tungsten-grey">
                                <div className="w-10 h-10 rounded-full bg-hazard-amber/10 text-hazard-amber flex items-center justify-center border border-hazard-amber/20">
                                    <span className="font-bold text-sm">
                                        {user.name.substring(0, 2).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-bold text-white">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            <Link href="/profile" className="flex items-center gap-2 text-gray-300 hover:text-white">
                                <User className="w-4 h-4" /> Profile
                            </Link>
                            <Link href="/settings" className="flex items-center gap-2 text-gray-300 hover:text-white">
                                <Settings className="w-4 h-4" /> Settings
                            </Link>
                            <Link href="/logs" className="flex items-center gap-2 text-gray-300 hover:text-white">
                                <History className="w-4 h-4" /> System Logs
                            </Link>
                            <button onClick={onLogoutClick} className="flex items-center gap-2 text-red-500 hover:text-red-400">
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <Link
                                href={`/login?next=${encodeURIComponent(pathname)}`}
                                className="w-full py-3 text-center border border-tungsten-grey rounded text-gray-300 hover:text-white hover:border-white transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href={`/signup?next=${encodeURIComponent(pathname)}`}
                                className="w-full py-3 text-center bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

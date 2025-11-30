'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/utils/auth';
import {
    User,
    Settings,
    LogOut,
    History,
    Menu,
    X,
    ChevronDown,
    Loader2,
    BookOpen
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import ConfirmationModal from './ConfirmationModal';
import StreakIndicator from './StreakIndicator';

export default function NavBar() {
    const { isAuthenticated, user, logout, loading } = useAuth();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [isSigningOut, setIsSigningOut] = useState(false);

    const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

    const confirmLogout = async () => {
        setIsSigningOut(true);
        await logout();
        router.push('/');
        setIsSigningOut(false);
        setShowSignOutConfirm(false);
    };

    const handleLogoutClick = () => {
        setShowSignOutConfirm(true);
        setIsMenuOpen(false); // Close dropdown
    };

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

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsMenuOpen(false);
    }, [pathname]);

    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isChallengePage = pathname.startsWith('/challenge/');

    if (isAuthPage || isChallengePage) return null; // Don't show NavBar on auth pages or immersive challenge pages

    return (
        <nav className="h-16 border-b border-tungsten-grey bg-deep-anthracite/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative w-8 h-8 rounded overflow-hidden border border-hazard-amber/50 group-hover:border-hazard-amber transition-colors">
                        <Image
                            src="/icon.jpg"
                            alt="Tentropy"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="font-bold tracking-tighter text-lg text-white group-hover:text-hazard-amber transition-colors">
                        TENTROPY
                    </span>
                </Link>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {loading ? (
                        <div className="w-8 h-8 rounded-full bg-carbon-grey animate-pulse" />
                    ) : isAuthenticated && user ? (
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
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link
                                href={`/login?next=${encodeURIComponent(pathname)}`}
                                className="text-sm font-bold text-gray-400 hover:text-white transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href={`/signup?next=${encodeURIComponent(pathname)}`}
                                className="px-4 py-2 bg-white text-black text-sm font-bold rounded hover:bg-gray-200 transition-colors"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-gray-400 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-tungsten-grey bg-deep-anthracite p-4 flex flex-col gap-4 shadow-2xl">
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
                            <Link href="/history" className="flex items-center gap-2 text-gray-300 hover:text-white">
                                <History className="w-4 h-4" /> Engineering Log
                            </Link>
                            <button onClick={handleLogoutClick} className="flex items-center gap-2 text-red-500 hover:text-red-400">
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

            <ConfirmationModal
                isOpen={showSignOutConfirm}
                onClose={() => setShowSignOutConfirm(false)}
                onConfirm={confirmLogout}
                title="Confirm Sign Out"
                description="Are you sure you want to sign out? Unsaved progress in the current session might be lost."
                confirmText="Sign Out"
                cancelText="Stay"
            />
        </nav>
    );
}

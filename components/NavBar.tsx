'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/utils/auth';
import ConfirmationModal from './ConfirmationModal';
import UserDropdown from './navbar/UserDropdown';
import MobileMenu from './navbar/MobileMenu';

export default function NavBar() {
    const { isAuthenticated, user, logout, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    };

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Smooth scroll handler for navigation links
    const handleSmoothScroll = (e: React.MouseEvent, targetId: string) => {
        e.preventDefault();
        
        if (pathname !== '/') {
            // Use window.location to avoid Next.js loading indicator
            window.location.href = `/#${targetId}`;
        } else {
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

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
                            sizes="32px"
                            unoptimized
                            className="object-contain"
                        />
                    </div>
                    <span className="font-bold tracking-tighter text-lg text-white group-hover:text-hazard-amber transition-colors">
                        TENTROPY
                    </span>
                </Link>

                {/* Navigation Links - Always visible on desktop */}
                <div className="hidden md:flex items-center gap-6 ml-auto mr-12">
                    <a
                        href="/#tracks"
                        onClick={(e) => handleSmoothScroll(e, 'tracks')}
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-mono cursor-pointer"
                    >
                        Tracks
                    </a>
                    <a
                        href="/#about"
                        onClick={(e) => handleSmoothScroll(e, 'about')}
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-mono cursor-pointer"
                    >
                        About
                    </a>
                    <Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-mono">
                        Contact
                    </Link>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {loading ? (
                        <div className="w-8 h-8 rounded-full bg-carbon-grey animate-pulse" />
                    ) : isAuthenticated && user ? (
                        <UserDropdown
                            user={user}
                            onLogoutClick={handleLogoutClick}
                            isSigningOut={isSigningOut}
                        />
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

                {/* Mobile Menu */}
                <MobileMenu
                    isOpen={isMobileMenuOpen}
                    onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    user={user}
                    isAuthenticated={isAuthenticated}
                    loading={loading}
                    onLogoutClick={handleLogoutClick}
                />
            </div>

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

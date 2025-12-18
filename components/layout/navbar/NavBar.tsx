'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function NavBar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Smooth scroll handler for navigation links
    const handleSmoothScroll = (e: React.MouseEvent, targetId: string) => {
        e.preventDefault();
        if (pathname !== '/') {
            router.push(`/#${targetId}`);
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
                            className="object-cover"
                        />
                    </div>
                    <span className="font-bold tracking-tighter text-lg text-white group-hover:text-hazard-amber transition-colors">
                        TENTROPY
                    </span>
                    <span className="text-xs text-gray-500 ml-2 hidden md:inline">(Open Core)</span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-6 ml-auto mr-8">
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
                    <Link href="/docs" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-mono">
                        Docs
                    </Link>
                </div>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <a
                        href="https://tentropy.co"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-hazard-amber text-black text-sm font-bold rounded hover:bg-yellow-500 transition-colors"
                    >
                        Full Platform →
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 text-gray-400 hover:text-white"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-deep-anthracite border-t border-tungsten-grey">
                    <div className="px-4 py-4 space-y-3">
                        <Link href="/" className="block text-gray-400 hover:text-white py-2">Home</Link>
                        <Link href="/challenges" className="block text-gray-400 hover:text-white py-2">Challenges</Link>
                        <Link href="/docs" className="block text-gray-400 hover:text-white py-2">Docs</Link>
                        <a
                            href="https://tentropy.co"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 bg-hazard-amber text-black text-sm font-bold rounded text-center"
                        >
                            Full Platform →
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}

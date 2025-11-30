'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PageLoadingBar() {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const pathname = usePathname();
    const prevPathnameRef = useRef(pathname);
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const isNavigatingRef = useRef(false); // Cancellation flag

    // Hide loading when pathname changes (navigation complete)
    useEffect(() => {
        const hideLoading = () => {
            if (prevPathnameRef.current !== pathname) {
                prevPathnameRef.current = pathname;

                // CRITICAL: Stop all state updates immediately
                isNavigatingRef.current = false;

                // Clear any existing timers
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                if (intervalRef.current) clearInterval(intervalRef.current);

                // Reset state
                setProgress(0);
                setLoading(false);
            }
        };

        hideLoading();
    }, [pathname]);

    useEffect(() => {
        const startLoading = () => {
            // Enable state updates
            isNavigatingRef.current = true;

            setLoading(true);
            setProgress(0);

            // Simulate progress - guarded by isNavigating flag
            intervalRef.current = setInterval(() => {
                if (isNavigatingRef.current) {
                    setProgress(prev => {
                        if (prev >= 90) return prev;
                        return prev + Math.random() * 10;
                    });
                }
            }, 200);

            // Auto-hide after 3 seconds as fallback
            timeoutRef.current = setTimeout(() => {
                if (isNavigatingRef.current) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    setProgress(0);
                    setLoading(false);
                    isNavigatingRef.current = false;
                }
            }, 3000);
        };

        // Listen to navigation via link clicks
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            if (link && link.href && !link.href.startsWith('#') && !link.target) {
                const currentDomain = window.location.origin;
                const linkDomain = new URL(link.href, currentDomain).origin;

                // Only show for same-domain links
                if (currentDomain === linkDomain) {
                    startLoading();
                }
            }
        };

        document.addEventListener('click', handleClick);

        return () => {
            isNavigatingRef.current = false;
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
            document.removeEventListener('click', handleClick);
        };
    }, []);

    if (!loading && progress === 0) return null;

    return (
        <>
            {/* Top Loading Bar */}
            <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-deep-anthracite">
                <div
                    className="h-full bg-hazard-amber transition-all duration-200 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Loading Overlay (subtle) - only show when actively loading */}
            {loading && (
                <div className="fixed inset-0 z-[99] bg-black/10 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                    <div className="bg-deep-anthracite border border-hazard-amber px-6 py-3 rounded-sm shadow-[0_0_20px_rgba(255,176,0,0.3)]">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-hazard-amber rounded-full animate-pulse" />
                            <span className="text-hazard-amber font-mono text-sm font-bold uppercase tracking-wider">
                                Loading...
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

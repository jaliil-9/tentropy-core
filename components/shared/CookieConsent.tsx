'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'tentropy_cookie_consent';

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(CONSENT_KEY);
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem(CONSENT_KEY, 'true');
        setShowBanner(false);
        // Reload to trigger PostHog initialization if needed, 
        // or we can rely on the fact that PostHogProvider checks this value on mount/render
        // But since PostHogProvider is already mounted, we might need to trigger a state change there.
        // For simplicity, a reload ensures clean state, but a custom event is better UX.
        window.dispatchEvent(new Event('cookie_consent_updated'));
    };

    const declineCookies = () => {
        localStorage.setItem(CONSENT_KEY, 'false');
        setShowBanner(false);
        window.dispatchEvent(new Event('cookie_consent_updated'));
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-deep-anthracite border-t border-tungsten-grey p-4 shadow-lg animate-in slide-in-from-bottom duration-500">
            <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-300">
                    <p>
                        We use cookies to improve your experience and analyze site traffic. By continuing to use our site, you consent to our use of cookies.
                        Read our <Link href="/privacy" className="text-hazard-amber hover:underline">Privacy Policy</Link> and <Link href="/terms" className="text-hazard-amber hover:underline">Terms of Service</Link>.
                    </p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <button
                        onClick={declineCookies}
                        className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        onClick={acceptCookies}
                        className="px-6 py-2 text-sm font-bold bg-hazard-amber text-black rounded hover:bg-yellow-500 transition-colors shadow-[0_0_10px_rgba(255,176,0,0.2)]"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}

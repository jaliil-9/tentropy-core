'use client'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Check for existing consent
        const hasConsent = localStorage.getItem('tentropy_cookie_consent') === 'true';

        posthog.init('phc_zptcPxWxWJe4h35ogMGHEfN8u3i7ibmGVtHy0uLky6c', {
            api_host: 'https://us.i.posthog.com',
            person_profiles: 'identified_only',
            capture_pageview: false, // Disable automatic pageview capture
            capture_pageleave: true,
            opt_out_capturing_by_default: true, // Default to opted out
            persistence: 'localStorage+cookie',
        })

        if (hasConsent) {
            posthog.opt_in_capturing();
        }

        // Listen for consent updates from CookieConsent component
        const handleConsentUpdate = () => {
            const consent = localStorage.getItem('tentropy_cookie_consent');
            if (consent === 'true') {
                posthog.opt_in_capturing();
            } else {
                posthog.opt_out_capturing();
            }
        };

        window.addEventListener('cookie_consent_updated', handleConsentUpdate);
        return () => window.removeEventListener('cookie_consent_updated', handleConsentUpdate);
    }, [])

    return <PHProvider client={posthog}>{children}</PHProvider>
}

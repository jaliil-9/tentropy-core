'use client'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        posthog.init('phc_zptcPxWxWJe4h35ogMGHEfN8u3i7ibmGVtHy0uLky6c', {
            api_host: 'https://us.i.posthog.com',
            person_profiles: 'identified_only',
            capture_pageview: false, // Disable automatic pageview capture, as we capture manually
            capture_pageleave: true, // Enable pageleave capture
        })
    }, [])

    return <PHProvider client={posthog}>{children}</PHProvider>
}

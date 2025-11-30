'use client'

import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { usePostHog } from 'posthog-js/react'

export default function PostHogIdentifier() {
    const { user, isAuthenticated } = useAuth()
    const posthog = usePostHog()

    useEffect(() => {
        if (!posthog) return

        if (isAuthenticated && user) {
            // Identify the user with PostHog
            posthog.identify(user.id, {
                email: user.email,
                name: user.name,
            })
        } else {
            // Reset PostHog when user logs out
            posthog.reset()
        }
    }, [isAuthenticated, user, posthog])

    return null
}

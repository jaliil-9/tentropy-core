'use client';

import { useAuthSync } from '@/hooks/auth/useAuthSync';

/**
 * Provider component that runs auth-related side effects at the app level.
 * 
 * This component renders nothing - it just ensures the useAuthSync hook
 * is called once at the top of the app tree, inside the AuthProvider.
 * 
 * Placing it here (instead of inside AuthContext) keeps concerns separated:
 * - AuthContext: Pure identity management
 * - AuthSyncProvider: Side effects that depend on identity changes
 */
export default function AuthSyncProvider() {
    useAuthSync();
    return null;
}

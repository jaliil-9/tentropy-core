'use client';

import React, { createContext, useContext } from 'react';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}

interface AuthContextType {
    user: null;
    isAuthenticated: false;
    loading: false;
    logout: () => Promise<void>;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    loading: false,
    logout: async () => {},
    refreshSession: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Open-core version: No authentication
    return (
        <AuthContext.Provider value={{
            user: null,
            isAuthenticated: false,
            loading: false,
            logout: async () => {},
            refreshSession: async () => {},
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

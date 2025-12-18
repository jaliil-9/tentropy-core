// Open-core stub - no Supabase client
export function createClient() {
    console.warn('[Open-Core] Supabase is not available in the open-core version');
    return {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            getUser: async () => ({ data: { user: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        },
        from: () => ({
            select: () => ({ data: null, error: null }),
            insert: () => ({ data: null, error: null }),
            update: () => ({ data: null, error: null }),
            delete: () => ({ data: null, error: null }),
            eq: () => ({ data: null, error: null, single: () => ({ data: null, error: null }) }),
            single: () => ({ data: null, error: null }),
        }),
        rpc: async () => ({ data: null, error: null }),
    };
}

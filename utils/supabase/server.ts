// Open-core stub - no Supabase server client
export async function createClient() {
    return {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            getUser: async () => ({ data: { user: null }, error: null }),
        },
        from: () => ({
            select: () => ({ 
                data: null, 
                error: null,
                order: () => ({ data: null, error: null }),
                eq: () => ({ data: null, error: null, single: () => ({ data: null, error: null }) }),
                single: () => ({ data: null, error: null }),
                in: () => ({ data: null, error: null }),
            }),
            insert: () => ({ data: null, error: null, select: () => ({ data: null, error: null }) }),
            update: () => ({ data: null, error: null }),
            delete: () => ({ data: null, error: null }),
        }),
        rpc: async () => ({ data: null, error: null }),
    };
}

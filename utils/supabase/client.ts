import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Check if we're in a build/static generation context
    // Next.js sets NODE_ENV to 'production' during build, but we can check for missing vars
    if (!supabaseUrl || !supabaseKey) {
        // If we are in the browser (window is defined), we MUST have real credentials
        if (typeof window !== 'undefined') {
            throw new Error(
                '[Supabase Client] Missing environment variables. ' +
                'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.'
            );
        }

        // If we are on the server (during build/SSR), we can use placeholders to prevent build failure
        console.warn('[Supabase Client] Missing env vars during server-side render/build, using placeholders');
        return createBrowserClient(
            'https://placeholder.supabase.co',
            'placeholder-anon-key'
        );
    }

    return createBrowserClient(supabaseUrl, supabaseKey);
}

import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    // Prefer NEXT_PUBLIC_SITE_URL for production redirects to avoid 0.0.0.0 issues
    let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin;
    if (process.env.NODE_ENV === 'development') {
        siteUrl = 'http://localhost:3000';
    }

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development'

            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`)
            } else if (process.env.NEXT_PUBLIC_SITE_URL) {
                // Always prefer the explicitly configured site URL in production
                return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${siteUrl}/auth/auth-code-error`)
}

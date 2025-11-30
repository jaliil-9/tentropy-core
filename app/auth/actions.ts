'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const guestId = formData.get('guestId') as string | null
    const next = formData.get('next') as string | null

    const noRedirect = formData.get('noRedirect') === 'true'

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    // Merge guest data if guestId is present
    if (guestId) {
        await mergeGuestData(guestId)
    }

    if (!noRedirect) {
        revalidatePath('/', 'layout')
        redirect(next || '/')
    }

    return { success: true }
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const guestId = formData.get('guestId') as string | null
    const next = formData.get('next') as string | null

    const noRedirect = formData.get('noRedirect') === 'true'

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    // Merge guest data if guestId is present
    if (guestId) {
        await mergeGuestData(guestId)
    }

    if (!noRedirect) {
        revalidatePath('/', 'layout')
        redirect(next || '/')
    }

    return { success: true }
}

export async function mergeGuestData(guestId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    // Update all challenge attempts belonging to the guest ID to the new user ID
    const { error } = await supabase
        .from('challenge_attempts')
        .update({ user_id: user.id })
        .eq('user_id', guestId)

    if (error) {
        console.error('Error merging guest data:', error)
    }
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signInWithOAuth(provider: 'github' | 'google', next?: string) {
    const supabase = await createClient()

    // Use the app's URL for OAuth callback, not Supabase's URL
    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Force localhost in development mode to avoid accidental prod redirects
    if (process.env.NODE_ENV === 'development') {
        baseUrl = 'http://localhost:3000';
    }

    const redirectUrl = `${baseUrl}/auth/callback?next=${encodeURIComponent(next || '/')}`;
    console.log('[Auth] Environment:', process.env.NODE_ENV);
    console.log('[Auth] Generated Redirect URL:', redirectUrl);

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: redirectUrl,
        },
    })

    if (data.url) {
        redirect(data.url)
    }

    if (error) {
        return { error: error.message }
    }
}

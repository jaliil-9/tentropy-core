'use server';

// Open-core stub - no authentication
export async function login(formData: FormData) {
    return { error: 'Authentication is not available in open-core version' };
}

export async function signup(formData: FormData) {
    return { error: 'Authentication is not available in open-core version' };
}

export async function logout() {
    // No-op in open-core
}

export async function signInWithOAuth(provider: 'github' | 'google', next?: string) {
    return { error: 'Authentication is not available in open-core version' };
}

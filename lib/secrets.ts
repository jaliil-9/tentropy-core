// Open-core stub - no secrets management
export async function getSecret(key: string): Promise<string | null> {
    console.warn('[Open-Core] Secrets are not available');
    return null;
}

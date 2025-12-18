// Open-core stub - no session management
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    // Open-core: No session management, just pass through
    return NextResponse.next({ request });
}

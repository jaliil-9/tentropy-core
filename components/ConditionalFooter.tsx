'use client';

import { usePathname } from 'next/navigation';
import EnhancedFooter from './EnhancedFooter';

export default function ConditionalFooter() {
    const pathname = usePathname();

    // Hide footer on challenge pages and auth pages
    const hideFooter = pathname?.startsWith('/challenge/') || pathname === '/signin' || pathname === '/signup';

    if (hideFooter) return null;

    return <EnhancedFooter />;
}

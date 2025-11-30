'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
    const pathname = usePathname();

    // Hide footer on challenge pages
    const hideFooter = pathname?.startsWith('/challenge/');

    if (hideFooter) return null;

    return <Footer />;
}

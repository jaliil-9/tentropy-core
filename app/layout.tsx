import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import PageLoadingBar from "@/components/layout/PageLoadingBar";
import { AuthProvider } from "@/context/AuthContext";
import CookieConsent from "@/components/shared/CookieConsent";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL('https://tentropy.co'),
    title: "TENTROPY | AI Systems Engineering (Open Core)",
    description: "Learn AI infrastructure through CTF-style challenges. This is the open-source core version.",
    keywords: ["AI engineering", "LLM optimization", "system design", "RAG", "open source"],
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: '48x48' },
            { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: '/apple-touch-icon.png',
        shortcut: '/favicon.ico',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${jetbrainsMono.variable} font-mono antialiased bg-deep-anthracite text-foreground`}>
                <AuthProvider>
                    <PageLoadingBar />
                    <div className="min-h-screen">
                        <ErrorBoundary>
                            {children}
                        </ErrorBoundary>
                    </div>
                    <CookieConsent />
                </AuthProvider>
            </body>
        </html>
    );
}

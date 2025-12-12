import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import PageLoadingBar from "@/components/PageLoadingBar";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tentropy.co'),
  title: "TENTROPY | AI Systems Engineering",
  description: "Learn AI infrastructure through CTF-style challenges. Fix rate limiting, semantic caching, context windows, and LLM guardrails in isolated micro-VMs.",
  keywords: ["AI engineering", "LLM optimization", "system design", "RAG", "APIs", "coding simulation", "machine learning", "devops", "sre", "build break fix"],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "TENTROPY | AI Systems Engineering",
    description: "Learn AI infrastructure through CTF-style challenges. Fix rate limiting, semantic caching, and LLM guardrails.",
    url: 'https://tentropy.co',
    siteName: 'TENTROPY',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TENTROPY - AI Systems Engineering',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "TENTROPY",
    description: "Learn AI infrastructure through CTF-style challenges.",
    images: ['/og-image.jpg'],
  },
};

import { AuthProvider } from "@/context/AuthContext";
import { PostHogProvider } from "@/app/providers/PostHogProvider";
import PostHogPageView from "@/app/providers/PostHogPageView";
import { Suspense } from "react";
import PostHogIdentifier from "@/app/providers/PostHogIdentifier";
import SaveProgressBanner from "@/components/SaveProgressBanner";

import ConditionalFooter from "@/components/ConditionalFooter";
import CookieConsent from "@/components/CookieConsent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} font-mono antialiased bg-deep-anthracite text-foreground`}
      >
        <PostHogProvider>
          <AuthProvider>
            <Suspense fallback={null}>
              <PostHogPageView />
            </Suspense>
            <PostHogIdentifier />
            <PageLoadingBar />
            <div className="min-h-screen">
              {children}
            </div>
            <ConditionalFooter />
            <SaveProgressBanner />
            <CookieConsent />
          </AuthProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}

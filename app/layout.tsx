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
  title: "TENTROPY | AI System Design",
  description: "Experience AI engineering by repairing broken pipelines. Build, break, and fix systems in a realistic simulated environment. Practice system design, LLM optimization, RAG, and latency reduction.",
  keywords: ["AI engineering", "LLM optimization", "system design", "RAG", "APIs", "coding simulation", "machine learning", "devops", "sre", "build break fix"],
  icons: {
    icon: '/icon.jpg',
    apple: '/icon.jpg',
  },
  openGraph: {
    title: "TENTROPY | Build, Break, Fix: AI System Design",
    description: "Experience AI engineering by repairing broken pipelines. Build, break, and fix systems in a realistic simulated environment.",
    url: 'https://tentropy.co',
    siteName: 'TENTROPY',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "TENTROPY",
    description: "Stabilize the Chaos. AI system engineering, API challenges, and System Design 101.",
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

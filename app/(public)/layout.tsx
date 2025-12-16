import { Metadata } from 'next';
import NavBar from "@/components/layout/navbar/NavBar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: 'TENTROPY | AI Systems Engineering',
    description: 'Learn AI infrastructure through CTF-style challenges. Fix rate limiting, semantic caching, context windows, and LLM guardrails in isolated micro-VMs.',
};

export default function MarketingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <NavBar />
            {/* Spacer for fixed navbar */}
            <div className="pt-16">
                {children}
            </div>
            <Footer />
        </>
    );
}

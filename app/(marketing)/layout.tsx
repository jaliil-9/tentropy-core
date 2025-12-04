import NavBar from "@/components/NavBar";

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
        </>
    );
}

import { Metadata } from "next";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
    title: "Challenges",
};

export default function ChallengesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <NavBar />
            {children}
        </>
    );
}

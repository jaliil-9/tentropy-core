import { Metadata } from "next";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
    title: "Sign Up",
};

import { Suspense } from 'react';

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-deep-anthracite" />}>
            <SignupForm />
        </Suspense>
    );
}

import { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
    title: "Login",
};

import { Suspense } from 'react';

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-deep-anthracite" />}>
            <LoginForm />
        </Suspense>
    );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Github, Chrome, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { login, signInWithOAuth } from '@/app/auth/actions';
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [guestId, setGuestId] = useState<string>('');
    const searchParams = useSearchParams();
    const next = searchParams.get('next');

    useEffect(() => {
        // Retrieve guest ID from local storage if available
        const storedGuestId = localStorage.getItem('tentropy_guest_id');
        if (storedGuestId) {
            setGuestId(storedGuestId);
        }
    }, []);

    const handleLogin = async (formData: FormData) => {
        setIsLoading(true);
        if (guestId) {
            formData.append('guestId', guestId);
        }
        if (next) {
            formData.append('next', next);
        }

        const result = await login(formData);

        if (result?.error) {
            toast.error(result.error);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-deep-anthracite p-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-deep-anthracite border border-tungsten-grey rounded-lg shadow-2xl overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-6">
                            <div className="flex justify-center mb-4">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-hazard-amber/50 shadow-[0_0_10px_rgba(255,176,0,0.2)]">
                                    <Image
                                        src="/icon.jpg"
                                        alt="Tentropy"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Welcome back</h1>
                            <p className="text-gray-500 text-xs">Enter your credentials to access the engineering log.</p>
                        </div>

                        <form action={handleLogin} className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="engineer@tentropy.dev"
                                        className="w-full bg-carbon-grey border border-tungsten-grey rounded px-10 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-hazard-amber transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
                                    <Link href="#" className="text-xs text-hazard-amber hover:underline">Forgot?</Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-carbon-grey border border-tungsten-grey rounded px-10 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-hazard-amber transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white text-black font-bold py-2 rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                                    </>
                                ) : (
                                    <>
                                        Sign In <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-tungsten-grey"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase">
                                <span className="bg-deep-anthracite px-2 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => signInWithOAuth('github')}
                                className="flex items-center justify-center gap-2 px-4 py-2 border border-tungsten-grey rounded hover:bg-carbon-grey hover:text-white text-gray-400 transition-colors text-sm font-medium"
                            >
                                <Github className="w-4 h-4" /> GitHub
                            </button>
                            <button
                                onClick={() => signInWithOAuth('google')}
                                className="flex items-center justify-center gap-2 px-4 py-2 border border-tungsten-grey rounded hover:bg-carbon-grey hover:text-white text-gray-400 transition-colors text-sm font-medium"
                            >
                                <Chrome className="w-4 h-4" /> Google
                            </button>
                        </div>
                    </div>

                    <div className="bg-carbon-grey/50 p-4 text-center border-t border-tungsten-grey">
                        <p className="text-xs text-gray-500">
                            Don't have an account? <Link href="/signup" className="text-white font-bold hover:underline">Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Github, Chrome, Mail, Lock, ArrowRight, User, Loader2, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { signup, signInWithOAuth } from '@/app/auth/actions';
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

export default function SignupForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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

    const handleSignup = async (formData: FormData) => {
        setIsLoading(true);
        if (guestId) {
            formData.append('guestId', guestId);
        }
        if (next) {
            formData.append('next', next);
        }

        const result = await signup(formData);

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
                                        sizes="48px"
                                        unoptimized
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Create account</h1>
                            <p className="text-gray-500 text-xs">Join the engineering team at Tentropy.</p>
                        </div>

                        <form action={handleSignup} className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="Jane Doe"
                                        className="w-full bg-carbon-grey border border-tungsten-grey rounded px-10 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-hazard-amber transition-colors"
                                        required
                                    />
                                </div>
                            </div>

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
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-carbon-grey border border-tungsten-grey rounded px-10 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-hazard-amber transition-colors"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 py-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    className="appearance-none w-4 h-4 rounded border border-tungsten-grey bg-transparent checked:bg-hazard-amber checked:border-hazard-amber checked:bg-[url('data:image/svg+xml,%3csvg%20viewBox=%270%200%2016%2016%27%20fill=%27black%27%20xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath%20d=%27M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%27/%3e%3c/svg%3e')] checked:bg-center checked:bg-no-repeat focus:ring-0 focus:outline-none cursor-pointer transition-all"
                                />
                                <label htmlFor="terms" className="text-xs text-gray-500 cursor-pointer select-none">
                                    I agree to the <Link href="/terms" target="_blank" className="text-hazard-amber hover:underline">Terms</Link> and <Link href="/privacy" target="_blank" className="text-hazard-amber hover:underline">Privacy Policy</Link>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white text-black font-bold py-2 rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Sign Up <ArrowRight className="w-4 h-4" />
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
                            Already have an account? <Link href="/login" className="text-white font-bold hover:underline">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}

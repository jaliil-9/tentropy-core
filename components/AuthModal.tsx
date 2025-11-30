'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Loader2, Github, Chrome } from 'lucide-react';
import { login, signup, signInWithOAuth } from '@/app/auth/actions';
import toast from 'react-hot-toast';
import Image from 'next/image';

import { usePathname } from 'next/navigation';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();

    if (!isOpen) return null;

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);

        // Add a flag to tell the server action NOT to redirect
        formData.append('noRedirect', 'true');

        // Get guest ID if available
        const guestId = localStorage.getItem('tentropy_guest_id');
        if (guestId) {
            formData.append('guestId', guestId);
        }

        let result;
        if (mode === 'login') {
            result = await login(formData);
        } else {
            result = await signup(formData);
        }

        setIsLoading(false);

        if (result?.error) {
            toast.error(result.error);
        } else {
            // Success!
            console.log('[AuthModal] Authentication successful, calling onSuccess...');
            toast.success(mode === 'login' ? 'Welcome back!' : 'Account created!');
            await onSuccess();
            console.log('[AuthModal] onSuccess completed, closing modal...');
            onClose();
        }
    };

    const handleOAuth = async (provider: 'github' | 'google') => {
        setIsLoading(true);
        await signInWithOAuth(provider, pathname);
        // OAuth will redirect, so we don't need to handle success here
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-deep-anthracite border border-tungsten-grey rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    <div className="text-center mb-6">
                        <div className="flex justify-center mb-4">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-hazard-amber/50 shadow-[0_0_10px_rgba(255,176,0,0.2)]">
                                <Image
                                    src="/icon.jpg"
                                    alt="Tentropy"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-1 tracking-tight">
                            {mode === 'login' ? 'Sign in to Save' : 'Create Account'}
                        </h2>
                        <p className="text-gray-500 text-xs">
                            {mode === 'login'
                                ? 'Save your progress and track your stats.'
                                : 'Join Tentropy to persist your engineering logs.'}
                        </p>
                    </div>

                    <form action={handleSubmit} className="space-y-3">
                        {mode === 'signup' && (
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
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
                        )}

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</label>
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

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Password</label>
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
                            className="w-full bg-white text-black font-bold py-2 rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                                </>
                            ) : (
                                <>
                                    {mode === 'login' ? 'Sign In' : 'Sign Up'} <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-tungsten-grey"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-2 bg-deep-anthracite text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleOAuth('github')}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-carbon-grey border border-tungsten-grey rounded hover:bg-white/5 transition-colors text-white text-xs font-bold"
                            type="button"
                        >
                            <Github className="w-4 h-4" /> GitHub
                        </button>
                        <button
                            onClick={() => handleOAuth('google')}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-carbon-grey border border-tungsten-grey rounded hover:bg-white/5 transition-colors text-white text-xs font-bold"
                            type="button"
                        >
                            <Chrome className="w-4 h-4" /> Google
                        </button>
                    </div>

                    <div className="mt-6 text-center text-xs text-gray-500">
                        {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                            className="text-hazard-amber hover:underline font-bold"
                        >
                            {mode === 'login' ? 'Sign Up' : 'Sign In'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

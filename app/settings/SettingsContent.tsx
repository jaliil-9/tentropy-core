'use client';

import React, { useState } from 'react';
import { useAuth } from '@/utils/auth';
import { Settings, Shield, LogOut, Bell, Monitor, Key, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

export default function SettingsContent() {
    const { user, isAuthenticated, loading, logout } = useAuth();
    const router = useRouter();
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleLogout = async () => {
        setIsSigningOut(true);
        await logout();
        router.push('/');
        setIsSigningOut(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-gray-500 font-mono text-sm">
                LOADING CONFIG...
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-gray-400 font-mono">
                <Shield className="w-12 h-12 mb-4 text-gray-600" />
                <h1 className="text-xl font-bold text-white mb-2">ACCESS DENIED</h1>
                <p className="mb-6">Authentication required to modify system configuration.</p>
                <Link
                    href="/login"
                    className="px-6 py-2 bg-hazard-amber text-black font-bold rounded hover:bg-hazard-amber/90 transition-colors"
                >
                    AUTHENTICATE
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090B] text-gray-300 font-mono p-6 pt-32 md:p-12 md:pt-32">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8 border-b border-tungsten-grey pb-4">
                    <h1 className="text-2xl font-bold text-white tracking-wider flex items-center gap-3">
                        <Settings className="w-6 h-6 text-hazard-amber" />
                        SYSTEM_CONFIG
                    </h1>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">
                        Manage your preferences and account security.
                    </p>
                </div>

                {/* Settings Sections */}
                <div className="space-y-6">

                    {/* Appearance */}
                    <div className="bg-deep-anthracite border border-tungsten-grey rounded-sm overflow-hidden">
                        <div className="p-4 border-b border-tungsten-grey bg-carbon-grey/50 flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-gray-400" />
                            <h2 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Interface</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-bold text-white">Theme</div>
                                    <div className="text-xs text-gray-500">System default theme is currently enforced.</div>
                                </div>
                                <div className="px-3 py-1 bg-black/50 border border-tungsten-grey text-xs text-gray-400 rounded">
                                    DARK_MODE_ONLY
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-deep-anthracite border border-tungsten-grey rounded-sm overflow-hidden">
                        <div className="p-4 border-b border-tungsten-grey bg-carbon-grey/50 flex items-center gap-2">
                            <Bell className="w-4 h-4 text-gray-400" />
                            <h2 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Notifications</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
                                <div>
                                    <div className="text-sm font-bold text-white">Email Alerts</div>
                                    <div className="text-xs text-gray-500">Receive security and challenge updates.</div>
                                </div>
                                <div className="w-10 h-5 bg-tungsten-grey rounded-full relative">
                                    <div className="absolute left-1 top-1 w-3 h-3 bg-gray-400 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-deep-anthracite border border-tungsten-grey rounded-sm overflow-hidden border-red-900/30">
                        <div className="p-4 border-b border-tungsten-grey bg-red-900/10 flex items-center gap-2">
                            <Key className="w-4 h-4 text-red-400" />
                            <h2 className="text-xs font-bold text-red-400 uppercase tracking-wider">Security Zone</h2>
                        </div>
                        <div className="p-6">
                            <button
                                onClick={handleLogout}
                                disabled={isSigningOut}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white transition-all rounded-sm text-sm font-bold uppercase tracking-wider w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSigningOut ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Terminating Session...
                                    </>
                                ) : (
                                    <>
                                        <LogOut className="w-4 h-4" />
                                        Terminate Session
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

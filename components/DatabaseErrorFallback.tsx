import React from 'react';
import Link from 'next/link';
import { Database, RefreshCw, AlertCircle, Home } from 'lucide-react';

interface DatabaseErrorFallbackProps {
    error?: Error | string;
    retry?: () => void;
    showHomeButton?: boolean;
}

export default function DatabaseErrorFallback({
    error,
    retry,
    showHomeButton = true
}: DatabaseErrorFallbackProps) {
    const errorMessage = typeof error === 'string' ? error : error?.message;

    return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
            <div className="max-w-md w-full bg-carbon-grey border border-tungsten-grey rounded-lg p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-hazard-amber/10 flex items-center justify-center mx-auto mb-4">
                    <Database className="w-8 h-8 text-hazard-amber" />
                </div>

                <h2 className="text-xl font-bold text-white mb-2">
                    Database Connection Issue
                </h2>

                <p className="text-gray-400 mb-6 text-sm">
                    {errorMessage || "We're having trouble connecting to the database. Don't worry, your progress is saved locally."}
                </p>

                <div className="bg-deep-anthracite border border-tungsten-grey rounded p-4 mb-6">
                    <div className="flex items-start gap-3 text-left">
                        <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <div className="text-xs text-gray-400">
                            <p className="font-bold text-gray-300 mb-1">Running in Offline Mode</p>
                            <p>You can continue using the app with cached data. Your progress will sync when the connection is restored.</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 justify-center">
                    {retry && (
                        <button
                            onClick={retry}
                            className="flex items-center gap-2 px-4 py-2 bg-hazard-amber text-black font-bold text-sm rounded hover:bg-hazard-amber/90 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retry Connection
                        </button>
                    )}

                    {showHomeButton && (
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 bg-tungsten-grey text-white font-bold text-sm rounded hover:bg-tungsten-grey/80 transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            Go Home
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

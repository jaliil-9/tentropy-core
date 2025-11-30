'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle } from 'lucide-react';
import ShareButton from './ShareButton';
import CertificateUnlocked from './CertificateUnlocked';
import FeedbackWidget from './FeedbackWidget';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    challengeTitle: string;
    challengeId: string;
    executionTime: number;
    certificateId?: string | null;
    trackTitle?: string | null;
}

export default function SuccessModal({
    isOpen,
    onClose,
    challengeTitle,
    challengeId,
    executionTime,
    certificateId,
    trackTitle
}: SuccessModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200 font-mono">
            <div className="bg-deep-anthracite border border-hazard-amber rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-[0_0_30px_rgba(255,176,0,0.1)] animate-in zoom-in-95 duration-200 relative">
                {/* Scanline effect */}
                <div className="absolute inset-0 pointer-events-none z-0 opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-tungsten-grey hover:text-hazard-amber transition-colors z-20"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="relative z-10 space-y-6">
                    {/* Header */}
                    <div className="flex flex-col items-center text-center">
                        <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">MISSION ACCOMPLISHED</h2>
                        <div className="h-px w-32 bg-hazard-amber/50 my-2" />
                        <p className="text-gray-400 text-sm">
                            System stability restored. Protocol verified.
                        </p>
                    </div>

                    {/* Share Button */}
                    <div className="flex justify-center">
                        <ShareButton
                            challengeTitle={challengeTitle}
                            challengeId={challengeId}
                            executionTime={executionTime}
                        />
                    </div>

                    {/* Certificate Unlock */}
                    {certificateId && trackTitle && (
                        <CertificateUnlocked
                            certificateId={certificateId}
                            trackTitle={trackTitle}
                        />
                    )}

                    {/* Feedback Widget */}
                    <div className="pt-4 border-t border-tungsten-grey/30">
                        <FeedbackWidget challengeId={challengeId} />
                    </div>

                    {/* Dismiss Button */}
                    <div className="flex justify-center pt-4">
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-hazard-amber hover:bg-yellow-500 text-black font-bold rounded-sm transition-all uppercase tracking-wider hover:shadow-[0_0_15px_rgba(255,176,0,0.4)]"
                        >
                            DISMISS
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

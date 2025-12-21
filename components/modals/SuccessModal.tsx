'use client';

import { X } from 'lucide-react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    challengeTitle: string;
    challengeId: string;
    executionTime: number;
    certificateId?: string | null;
    trackTitle?: string | null;
    nextChallengeId?: string | null;
}

export default function SuccessModal({
    isOpen,
    onClose,
    challengeTitle,
}: SuccessModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-deep-anthracite border border-terminal-green p-8 max-w-md w-full mx-4 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
                
                <div className="text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-terminal-green mb-2">
                        CHALLENGE COMPLETE
                    </h2>
                    <p className="text-gray-400 mb-6">
                        You solved <span className="text-white font-bold">{challengeTitle}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                        Open-core version - Sign up at tentropy.co for certificates
                    </p>
                </div>
            </div>
        </div>
    );
}

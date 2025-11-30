'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel"
}: ConfirmationModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Prevent scrolling when modal is open
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
            <div className="bg-deep-anthracite border border-hazard-amber rounded-sm w-full max-w-md p-6 shadow-[0_0_30px_rgba(255,176,0,0.1)] animate-in zoom-in-95 duration-200 relative">
                {/* Scanline effect */}
                <div className="absolute inset-0 pointer-events-none z-0 opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-tungsten-grey hover:text-hazard-amber transition-colors z-20"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center mb-8 relative z-10">
                    <div className="w-16 h-16 bg-hazard-amber/10 rounded-sm flex items-center justify-center mb-4 border border-hazard-amber animate-pulse">
                        <AlertTriangle className="w-8 h-8 text-hazard-amber" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1 tracking-tight">{title}</h2>
                    <div className="h-px w-24 bg-hazard-amber/50 my-2" />
                    <p className="text-gray-400 text-sm">
                        {description}
                    </p>
                </div>

                <div className="flex gap-3 relative z-10">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-transparent hover:bg-tungsten-grey/20 text-gray-300 border border-tungsten-grey font-bold py-3 rounded-sm transition-all uppercase tracking-wider"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 bg-hazard-amber hover:bg-yellow-500 text-black font-bold py-3 rounded-sm transition-all uppercase tracking-wider hover:shadow-[0_0_15px_rgba(255,176,0,0.4)]"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

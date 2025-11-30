'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, Loader2, X, MessageSquare, User, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

interface EmailModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function EmailModal({ isOpen, onClose }: EmailModalProps) {
    const [showQuestion, setShowQuestion] = useState(true); // Show yes/no first
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setShowQuestion(true);
            setName('');
            setEmail('');
            setFeedback('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleNo = () => {
        onClose();
    };

    const handleYes = () => {
        setShowQuestion(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/send-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, feedback }),
            });

            if (response.ok) {
                toast.success('Feedback Sent!', {
                    icon: '✓',
                    style: {
                        background: '#09090B',
                        color: '#FFB000',
                        border: '1px solid #FFB000',
                        fontFamily: 'monospace',
                    },
                });
                onClose();
            } else {
                toast.error('Failed to send feedback', {
                    style: {
                        background: '#09090B',
                        color: '#ef4444',
                        border: '1px solid #ef4444',
                        fontFamily: 'monospace',
                    },
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred', {
                style: {
                    background: '#09090B',
                    color: '#ef4444',
                    border: '1px solid #ef4444',
                    fontFamily: 'monospace',
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200 font-mono">
            <div className="bg-deep-anthracite border border-hazard-amber rounded-sm w-full max-w-md p-6 shadow-[0_0_30px_rgba(255,176,0,0.1)] animate-in zoom-in-95 duration-200 relative max-h-[85vh] overflow-y-auto">
                {/* Scanline effect */}
                <div className="absolute inset-0 pointer-events-none z-0 opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-tungsten-grey hover:text-hazard-amber transition-colors z-20"
                >
                    <X className="w-5 h-5" />
                </button>

                {showQuestion ? (
                    <>
                        <div className="flex flex-col items-center text-center mb-8 relative z-10">
                            <div className="w-16 h-16 bg-hazard-amber/10 rounded-sm flex items-center justify-center mb-4 border border-hazard-amber animate-pulse">
                                <CheckCircle className="w-8 h-8 text-hazard-amber" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-1 tracking-tight">Problem Solved</h2>
                            <div className="h-px w-24 bg-hazard-amber/50 my-2" />
                            <p className="text-gray-400 text-xs uppercase tracking-widest">
                                Challenge completed successfully.
                            </p>
                        </div>

                        <div className="relative z-10 space-y-6">
                            <p className="text-center text-gray-300 text-sm">
                                Would you like to leave feedback about this challenge?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleNo}
                                    className="flex-1 bg-transparent hover:bg-tungsten-grey/20 text-gray-300 border border-tungsten-grey font-bold py-3 rounded-sm transition-all uppercase tracking-wider"
                                >
                                    No Thanks
                                </button>
                                <button
                                    onClick={handleYes}
                                    className="flex-1 bg-hazard-amber hover:bg-yellow-500 text-black font-bold py-3 rounded-sm transition-all uppercase tracking-wider hover:shadow-[0_0_15px_rgba(255,176,0,0.4)]"
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col items-center text-center mb-8 relative z-10">
                            <h2 className="text-xl font-bold text-white tracking-tight">Leave a Feedback</h2>
                            <div className="h-px w-24 bg-hazard-amber/50 mt-2" />
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                            {/* Name Field */}
                            <div className="relative group">
                                <User className="absolute left-3 top-3 w-4 h-4 text-tungsten-grey group-focus-within:text-hazard-amber transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-black/50 border border-tungsten-grey rounded-sm pl-10 pr-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-hazard-amber focus:ring-1 focus:ring-hazard-amber transition-all text-sm font-mono"
                                />
                            </div>

                            {/* Email Field (Optional) */}
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3 w-4 h-4 text-tungsten-grey group-focus-within:text-hazard-amber transition-colors" />
                                <input
                                    type="email"
                                    placeholder="your@email.com (Optional)"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/50 border border-tungsten-grey rounded-sm pl-10 pr-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-hazard-amber focus:ring-1 focus:ring-hazard-amber transition-all text-sm font-mono"
                                />
                            </div>

                            {/* Feedback Field */}
                            <div className="relative group">
                                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-tungsten-grey group-focus-within:text-hazard-amber transition-colors" />
                                <textarea
                                    placeholder="Feedback"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    rows={4}
                                    required
                                    className="w-full bg-black/50 border border-tungsten-grey rounded-sm pl-10 pr-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-hazard-amber focus:ring-1 focus:ring-hazard-amber transition-all text-sm font-mono resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-hazard-amber hover:bg-yellow-500 text-black font-bold py-3 rounded-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider hover:shadow-[0_0_15px_rgba(255,176,0,0.4)]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    'Send Feedback'
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Send, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface FeedbackWidgetProps {
    challengeId: string;
    className?: string;
}

export default function FeedbackWidget({ challengeId, className }: FeedbackWidgetProps) {
    const [rating, setRating] = useState<boolean | null>(null);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showCommentInput, setShowCommentInput] = useState(false);

    const handleSubmit = async (selectedRating: boolean) => {
        setRating(selectedRating);
        setShowCommentInput(true);

        // If they just click rating, we can submit immediately or wait for comment
        // Let's wait for comment if they want to add one, or they can just leave it
    };

    const submitFeedback = async () => {
        if (rating === null) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    challengeId,
                    rating,
                    comment
                }),
            });

            if (!response.ok) throw new Error('Failed to submit feedback');

            setIsSubmitted(true);
            toast.success('Feedback received. System updated.');
        } catch (error) {
            console.error('Feedback error:', error);
            toast.error('Failed to send feedback.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className={cn("text-center p-4 bg-deep-anthracite/50 border border-tungsten-grey rounded-sm", className)}>
                <p className="text-terminal-green text-sm font-mono font-bold">
                    // FEEDBACK_ACKNOWLEDGED
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    Thank you for contributing to system stability.
                </p>
            </div>
        );
    }

    return (
        <div className={cn("bg-deep-anthracite border border-tungsten-grey p-4 rounded-sm", className)}>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MessageSquare className="w-3 h-3" /> Mission Feedback
            </h3>

            {!showCommentInput ? (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleSubmit(true)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-carbon-grey hover:bg-terminal-green/10 border border-tungsten-grey hover:border-terminal-green text-gray-400 hover:text-terminal-green transition-all rounded-sm group"
                    >
                        <span className="text-xs font-bold">HELPFUL</span>
                    </button>
                    <button
                        onClick={() => handleSubmit(false)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-carbon-grey hover:bg-red-500/10 border border-tungsten-grey hover:border-red-500 text-gray-400 hover:text-red-500 transition-all rounded-sm group"
                    >
                        <span className="text-xs font-bold">NOT HELPFUL</span>
                    </button>
                </div>
            ) : (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="flex items-center gap-2 text-sm text-white mb-2">
                        {rating ? (
                            <span className="flex items-center gap-1 text-terminal-green font-bold text-xs">
                                <ThumbsUp className="w-3 h-3" /> RATED: HELPFUL
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-red-500 font-bold text-xs">
                                <ThumbsDown className="w-3 h-3" /> RATED: NOT HELPFUL
                            </span>
                        )}
                        <button
                            onClick={() => setShowCommentInput(false)}
                            className="text-[10px] text-gray-500 hover:text-white underline ml-auto"
                        >
                            CHANGE
                        </button>
                    </div>

                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Optional: What could be improved?"
                        className="w-full bg-black/30 border border-tungsten-grey rounded-sm p-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-hazard-amber resize-none h-20"
                    />

                    <button
                        onClick={submitFeedback}
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-hazard-amber text-black font-bold text-xs rounded-sm hover:bg-hazard-amber/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                            <Send className="w-3 h-3" />
                        )}
                        SUBMIT FEEDBACK
                    </button>
                </div>
            )}
        </div>
    );
}

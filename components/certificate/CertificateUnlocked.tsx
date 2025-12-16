'use client';

import React from 'react';
import { Award, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface CertificateUnlockedProps {
    certificateId: string;
    trackTitle: string;
}

export default function CertificateUnlocked({ certificateId, trackTitle }: CertificateUnlockedProps) {
    return (
        <div className="mt-6 bg-hazard-amber/10 border border-hazard-amber/30 rounded-sm p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-in zoom-in-95 duration-500">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-hazard-amber/20 flex items-center justify-center border border-hazard-amber/50 shadow-[0_0_15px_rgba(255,176,0,0.3)]">
                    <Award className="w-6 h-6 text-hazard-amber" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        CERTIFICATION UNLOCKED
                    </h3>
                    <p className="text-sm text-gray-400">
                        You have mastered the <span className="text-hazard-amber font-bold">{trackTitle}</span> protocol.
                    </p>
                </div>
            </div>

            <Link
                href={`/certificate/${certificateId}`}
                target="_blank"
                className="flex items-center gap-2 px-6 py-3 bg-hazard-amber text-black font-bold text-sm rounded-sm hover:bg-hazard-amber/90 transition-all shadow-lg shadow-hazard-amber/20 whitespace-nowrap"
            >
                VIEW CREDENTIAL <ExternalLink className="w-4 h-4" />
            </Link>
        </div>
    );
}

'use client';

import React, { useEffect, useState } from 'react';
import { Award, Lock, ExternalLink, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Track } from '@/types/challenge';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface CertificateShowcaseProps {
    tracks: Track[];
    progressMap: Map<string, any>;
    userId: string;
    userName: string;
}

interface Certificate {
    id: string;
    track_id: string;
    issued_at: string;
}

export default function CertificateShowcase({ tracks, progressMap, userId, userName }: CertificateShowcaseProps) {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertificates = async () => {
            const supabase = createClient();

            // 1. Check for completed tracks and issue certificates if needed
            for (const track of tracks) {
                const isComplete = track.challengeIds.every(id => progressMap.get(id)?.status === 'solved');

                if (isComplete) {
                    // Try to issue certificate (idempotent on backend)
                    await supabase.rpc('issue_certificate', {
                        p_user_id: userId,
                        p_track_id: track.id,
                        p_metadata: { userName: userName || 'Operator' }
                    });
                }
            }

            // 2. Fetch all certificates
            const { data } = await supabase
                .from('user_certificates')
                .select('*')
                .eq('user_id', userId);

            if (data) {
                setCertificates(data);
            }
            setLoading(false);
        };

        if (userId && progressMap.size > 0) {
            fetchCertificates();
        } else {
            setLoading(false);
        }
    }, [userId, progressMap, tracks]);

    return (
        <div className="col-span-1 md:col-span-1 bg-deep-anthracite border border-tungsten-grey p-6 rounded-sm">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Award className="w-4 h-4" /> Certifications
            </h2>

            <div className="space-y-4">
                {tracks.map(track => {
                    const cert = certificates.find(c => c.track_id === track.id);
                    const isComplete = track.challengeIds.every(id => progressMap.get(id)?.status === 'solved');

                    return (
                        <div
                            key={track.id}
                            className={cn(
                                "border rounded-sm p-4 transition-all relative overflow-hidden",
                                cert
                                    ? "border-hazard-amber bg-hazard-amber/5"
                                    : "border-tungsten-grey bg-carbon-grey/30 opacity-60"
                            )}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className={cn(
                                        "font-bold text-sm",
                                        cert ? "text-white" : "text-gray-500"
                                    )}>
                                        {track.title}
                                    </h3>
                                    <p className="text-[10px] text-gray-500 mt-1">
                                        {cert ? `Issued: ${new Date(cert.issued_at).toLocaleDateString()}` : "Locked"}
                                    </p>
                                </div>
                                {cert ? (
                                    <Award className="w-5 h-5 text-hazard-amber" />
                                ) : (
                                    <Lock className="w-4 h-4 text-gray-600" />
                                )}
                            </div>

                            {cert && (
                                <Link
                                    href={`/certificate/${cert.id}`}
                                    className="mt-3 flex items-center justify-center gap-2 w-full py-1.5 bg-hazard-amber text-black text-[10px] font-bold rounded-sm hover:bg-hazard-amber/90 transition-colors"
                                >
                                    VIEW CREDENTIAL <ExternalLink className="w-3 h-3" />
                                </Link>
                            )}
                        </div>
                    );
                })}

                {loading && (
                    <div className="flex justify-center p-4">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    </div>
                )}
            </div>
        </div>
    );
}

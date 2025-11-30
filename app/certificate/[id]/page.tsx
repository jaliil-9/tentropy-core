import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { Award, CheckCircle2, Calendar, Shield, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { tracks } from '@/data/challenges';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export const revalidate = 0; // Dynamic page

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: cert } = await supabase
        .from('user_certificates')
        .select('*, user:user_id(raw_user_meta_data)')
        .eq('id', id)
        .single();

    if (!cert) return { title: 'Certificate Not Found' };

    const track = tracks.find(t => t.id === cert.track_id);
    const userName = cert.user?.raw_user_meta_data?.name || 'Tentropy Operator';
    const title = `${userName} - ${track?.title} Certified`;

    return {
        title: title,
        description: `Verified achievement: ${track?.title} on Tentropy Platform.`,
        openGraph: {
            title: title,
            description: `Verified achievement: ${track?.title} on Tentropy Platform.`,
            images: ['/og-cert.png'], // Placeholder
        },
    };
}

export default async function CertificatePage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch certificate with user metadata
    // Note: We need to join with auth.users to get name, but Supabase client doesn't support direct join on auth schema easily for public.
    // We'll rely on the fact that we might store name in metadata or just show "Operator".
    // Actually, for a public page, we might need a public profile table or store the name in the certificate at issuance.
    // For now, let's assume we can get the user's metadata if we have admin rights or if we stored it in the cert metadata.
    // Let's check the schema. We put `metadata` JSONB. We should store the snapshot of the user's name there.

    const { data: cert, error } = await supabase
        .from('user_certificates')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !cert) {
        notFound();
    }

    // Fetch user details (this might fail if RLS prevents public read of auth.users, which it usually does)
    // Ideally, we should have stored the name in the certificate metadata at issuance time.
    // Fallback: "Tentropy Operator"
    const userName = cert.metadata?.userName || 'Tentropy Operator';
    const track = tracks.find(t => t.id === cert.track_id);

    if (!track) notFound();

    return (
        <div className="min-h-screen bg-[#09090B] text-gray-300 font-mono flex flex-col">
            {/* Simple Header */}
            <header className="h-16 border-b border-tungsten-grey flex items-center justify-between px-6 md:px-12 bg-deep-anthracite">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded bg-hazard-amber/10 flex items-center justify-center border border-hazard-amber/50">
                        <Shield className="w-5 h-5 text-hazard-amber" />
                    </div>
                    <span className="font-bold tracking-tighter text-lg text-white">TENTROPY</span>
                </Link>
                <Link
                    href="/challenges"
                    className="text-xs font-bold text-gray-500 hover:text-white transition-colors flex items-center gap-2"
                >
                    START YOUR JOURNEY <ArrowRight className="w-4 h-4" />
                </Link>
            </header>

            <main className="flex-1 flex flex-col items-center justify-start px-6 py-8 md:px-12 md:py-16 relative overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 pointer-events-none opacity-5" style={{
                    backgroundImage: 'linear-gradient(to right, #27272A 1px, transparent 1px), linear-gradient(to bottom, #27272A 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}></div>

                {/* Radial Gradient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-hazard-amber/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-center relative z-10">

                    {/* Left: Badge Visual (5 cols) */}
                    <div className="md:col-span-5 flex justify-center md:justify-end">
                        <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 group perspective-1000">
                            <div className="absolute inset-0 bg-hazard-amber/20 blur-[60px] rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-1000"></div>

                            {/* The Badge Itself */}
                            <div className="relative w-full h-full bg-gradient-to-br from-deep-anthracite to-black border-4 border-hazard-amber/20 rounded-full flex items-center justify-center shadow-2xl overflow-hidden transform transition-transform duration-700 hover:scale-105 hover:rotate-y-12">
                                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>

                                {/* Inner Rings */}
                                <div className="absolute inset-4 border border-dashed border-gray-700 rounded-full opacity-50"></div>
                                <div className="absolute inset-8 border border-gray-800 rounded-full opacity-50"></div>

                                <div className="text-center p-8 relative z-10">
                                    <Award className="w-32 h-32 text-hazard-amber mx-auto mb-6 drop-shadow-[0_0_25px_rgba(255,176,0,0.6)]" />
                                    <h2 className="text-3xl font-black text-white tracking-tighter leading-none mb-2">
                                        LEVEL 1
                                    </h2>
                                    <p className="text-sm font-bold text-hazard-amber uppercase tracking-[0.2em]">
                                        SYSTEMS ENGINEER
                                    </p>
                                </div>

                                {/* Rotating Ring */}
                                <div className="absolute inset-2 border-2 border-dashed border-hazard-amber/10 rounded-full animate-spin-slow"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Details (7 cols) */}
                    <div className="md:col-span-7 space-y-2 text-center md:text-left">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-terminal-green/10 border border-terminal-green/20 rounded-full text-terminal-green mb-2">
                                <CheckCircle2 className="w-4 h-4 fill-current" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Verified Credential</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-1 leading-tight">
                                {track.title}
                            </h1>
                            <p className="text-xl text-gray-400 font-light">
                                Issued to <span className="text-white font-bold border-b-2 border-hazard-amber">{userName}</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 py-3 my-4 border-y border-tungsten-grey/30">
                            <div>
                                <label className="text-[10px] uppercase text-gray-500 font-bold block mb-2 tracking-wider">Issued On</label>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-lg text-gray-200 font-medium">
                                    <Calendar className="w-5 h-5 text-hazard-amber" />
                                    {new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase text-gray-500 font-bold block mb-2 tracking-wider">Credential ID</label>
                                <div className="text-sm font-mono text-gray-400 break-all bg-carbon-grey/50 p-2 rounded border border-tungsten-grey/50">
                                    {cert.id}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] uppercase text-gray-500 font-bold block mb-2 tracking-wider">Skills Verified</label>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                {track.challengeIds.map(id => (
                                    <span key={id} className="px-4 py-1.5 bg-carbon-grey border border-tungsten-grey rounded-full text-xs font-medium text-gray-300 hover:border-gray-500 transition-colors cursor-default">
                                        {id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold text-sm rounded hover:bg-gray-200 transition-all transform hover:-translate-y-1 shadow-lg shadow-white/10"
                            >
                                Go to TENTROPY <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

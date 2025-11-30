import ChallengeInterface from '@/components/ChallengeInterface';
import LoadingChallenge from '@/components/LoadingChallenge';
import DatabaseErrorFallback from '@/components/DatabaseErrorFallback';
import { tracks } from '@/data/challenges';
import { getChallengeById } from '@/lib/challenges';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;

    try {
        const challenge = await getChallengeById(id);

        if (!challenge) {
            return {
                title: 'Challenge Not Found | TENTROPY',
            };
        }

        // Find which track this challenge belongs to
        const track = tracks.find(t => t.challengeIds.includes(challenge.id));
        const trackName = track ? track.title : 'Challenge';

        return {
            title: `${challenge.title} | ${trackName}`,
            description: challenge.summary,
        };
    } catch (error) {
        return {
            title: 'Challenge | TENTROPY',
            description: 'Loading challenge...',
        };
    }
}

export default async function ChallengePage({ params }: PageProps) {
    const { id } = await params;

    let challenge;
    let error;

    try {
        challenge = await getChallengeById(id);
    } catch (e) {
        error = e;
    }

    if (!challenge) {
        if (error) {
            // Database error - show fallback UI
            return (
                <div className="min-h-screen bg-deep-anthracite">
                    <DatabaseErrorFallback
                        error={error instanceof Error ? error : new Error('Failed to load challenge')}
                        showHomeButton={true}
                    />
                </div>
            );
        }
        // Challenge doesn't exist
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: challenge.title,
        description: challenge.summary,
        educationalLevel: challenge.difficulty,
        teaches: 'AI System Design',
        url: `https://tentropy.co/challenge/${challenge.id}`,
    };

    const sanitizedChallenge = {
        ...challenge,
        solutionCode: undefined, // Don't send solution code to client
        hasSolution: !!challenge.solutionCode
    };

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Suspense fallback={<LoadingChallenge />}>
                <ChallengeInterface challenge={sanitizedChallenge} />
            </Suspense>
        </main>
    );
}

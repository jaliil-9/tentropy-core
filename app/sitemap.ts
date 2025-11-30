import { MetadataRoute } from 'next';
import { getChallenges } from '@/lib/challenges';
import { Challenge } from '@/types/challenge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let challenges: Challenge[] = [];

    try {
        challenges = await getChallenges();
    } catch (error) {
        // If database fails, return minimal sitemap
        console.error('Failed to fetch challenges for sitemap:', error);
    }

    const baseUrl = 'https://tentropy.co';

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/challenges`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        },
    ];

    // Dynamic challenge pages
    const challengePages = challenges.map((challenge) => ({
        url: `${baseUrl}/challenge/${challenge.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    return [...staticPages, ...challengePages];
}

import { Metadata } from 'next';
import ChallengesRoadmap from './ChallengesRoadmap';

export const metadata: Metadata = {
    title: 'Challenges',
    description: 'Browse AI engineering challenges. Master system resilience, caching, context windows, and LLM infrastructure.',
};

export default function ChallengesPage() {
    return <ChallengesRoadmap />;
}

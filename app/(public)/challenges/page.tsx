import { Metadata } from 'next';
import ChallengesRoadmap from './ChallengesRoadmap';

export const metadata: Metadata = {
    title: 'Challenges | TENTROPY',
    description: 'Browse our collection of system resilience challenges. Test your skills against realistic scenarios.',
};

export default function ChallengesPage() {
    return <ChallengesRoadmap />;
}

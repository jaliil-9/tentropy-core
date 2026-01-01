import { Metadata } from 'next';
import React from 'react';
import { BookOpen, Cpu, Layers, HelpCircle, Code, Shield, Zap, Clock, Wrench } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Documentation | TENTROPY',
    description: 'Learn how the platform works, from challenge architecture to technical stack.',
};

export default function DocsPage() {
    return (
        <div className="container mx-auto px-4 pt-8 pb-16 max-w-4xl">
            <div className="mb-12">
                <h1 className="text-4xl font-bold mb-4 text-white">Documentation</h1>
                <p className="text-gray-400 text-lg">
                    Everything you need to know about TENTROPY — how challenges work, what you'll learn, and the technology behind it.
                </p>
            </div>

            {/* How Challenges Work */}
            <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-hazard-amber/10 rounded-lg">
                        <Cpu className="w-6 h-6 text-hazard-amber" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">How Challenges Work</h2>
                </div>

                <div className="space-y-4 text-gray-300">
                    <p>
                        Each challenge presents you with <strong className="text-white">broken production code</strong> —
                        the kind of bugs that crash real systems at 3 AM. Your job is to identify the flaw and implement the fix.
                    </p>

                    <div className="bg-carbon-grey border border-tungsten-grey rounded-lg p-6 my-6">
                        <h3 className="text-white font-bold mb-4 font-mono text-sm uppercase tracking-wider">Execution Flow</h3>
                        <ol className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <span className="bg-hazard-amber text-black font-bold px-2 py-0.5 rounded text-xs">1</span>
                                <span>You write your fix in the Monaco editor (the same editor used in VS Code)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-hazard-amber text-black font-bold px-2 py-0.5 rounded text-xs">2</span>
                                <span>Your code is sent to an isolated <strong className="text-hazard-amber">Firecracker micro-VM</strong> (via E2B)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-hazard-amber text-black font-bold px-2 py-0.5 rounded text-xs">3</span>
                                <span>Pytest runs your solution against the test suite in real-time</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-hazard-amber text-black font-bold px-2 py-0.5 rounded text-xs">4</span>
                                <span>Output is streamed live to your console — you see exactly what the system sees</span>
                            </li>
                        </ol>
                    </div>

                    <p>
                        After solving a challenge, the <strong className="text-white">Debrief</strong> unlocks with a deep-dive explanation
                        of why the bug happened and how production systems prevent it.
                    </p>
                </div>
            </section>

            {/* Challenge Architecture (NEW) */}
            <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-hazard-amber/10 rounded-lg">
                        <Wrench className="w-6 h-6 text-hazard-amber" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Challenge Architecture</h2>
                </div>

                <div className="space-y-4 text-gray-300">
                    <p>
                        Every challenge is built from <strong className="text-white">5 core components</strong> that work together to create
                        a realistic debugging experience:
                    </p>

                    <div className="grid gap-4 my-6">
                        <div className="bg-carbon-grey border border-tungsten-grey rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-hazard-amber font-mono font-bold">1. Briefing</span>
                                <span className="text-gray-500 text-sm font-mono">(description)</span>
                            </div>
                            <p className="text-sm text-gray-400">
                                The scenario that sets up the problem. Explains what system is broken, what incident occurred,
                                and what you need to fix. Written in Markdown with production-realistic context.
                            </p>
                        </div>

                        <div className="bg-carbon-grey border border-tungsten-grey rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-hazard-amber font-mono font-bold">2. Broken Code</span>
                                <span className="text-gray-500 text-sm font-mono">(brokenCode)</span>
                            </div>
                            <p className="text-sm text-gray-400">
                                Python code with an intentional bug. This is what you see in the editor — your job is to fix it.
                                The bugs are based on real production issues.
                            </p>
                        </div>

                        <div className="bg-carbon-grey border border-tungsten-grey rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-terminal-green font-mono font-bold">3. Test Code</span>
                                <span className="text-gray-500 text-sm font-mono">(testCode)</span>
                            </div>
                            <p className="text-sm text-gray-400">
                                A hidden pytest file that validates your fix. You never see this code — you only see the test output.
                                The tests use assertions, mocks, and timeouts to verify correctness.
                            </p>
                        </div>

                        <div className="bg-carbon-grey border border-tungsten-grey rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-hazard-amber font-mono font-bold">4. Solution</span>
                                <span className="text-gray-500 text-sm font-mono">(solutionCode)</span>
                            </div>
                            <p className="text-sm text-gray-400">
                                The correct implementation. Available if you choose to reveal it (counts as "giving up"),
                                or automatically shown after you solve the challenge.
                            </p>
                        </div>

                        <div className="bg-carbon-grey border border-tungsten-grey rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-hazard-amber font-mono font-bold">5. Debrief</span>
                                <span className="text-gray-500 text-sm font-mono">(debrief)</span>
                            </div>
                            <p className="text-sm text-gray-400">
                                Educational content that unlocks after completion. Explains the mechanics behind the bug,
                                real-world impact, and production-grade best practices.
                            </p>
                        </div>
                    </div>

                    <div className="bg-hazard-amber/5 border border-hazard-amber/20 rounded-lg p-4">
                        <h4 className="text-white font-bold mb-2 text-sm">How Success is Determined</h4>
                        <p className="text-sm text-gray-400">
                            When you click <strong className="text-hazard-amber">DEPLOY PATCH</strong>, your code is saved as{' '}
                            <code className="bg-tungsten-grey px-1 py-0.5 rounded text-xs">solution.py</code> in the sandbox.
                            The test file imports your functions and runs assertions. If all tests pass (pytest exits with code 0),
                            you succeed. If any assertion fails or the code times out, you'll see the error in the console.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tracks Overview */}
            <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-hazard-amber/10 rounded-lg">
                        <Layers className="w-6 h-6 text-hazard-amber" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Tracks</h2>
                </div>

                <div className="grid gap-6">
                    {/* AI Architect Track */}
                    <div className="bg-carbon-grey border border-tungsten-grey rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <Zap className="w-5 h-5 text-hazard-amber" />
                            <h3 className="text-xl font-bold text-white">The AI Architect</h3>
                            <span className="ml-auto text-xs font-mono text-gray-500">3 sample challenges</span>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Build the robust infrastructure that wraps LLMs. Master token budgets, RAG pipelines, and hybrid search.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-tungsten-grey/50 text-gray-300 text-xs font-mono rounded">Token Budget</span>
                            <span className="px-2 py-1 bg-tungsten-grey/50 text-gray-300 text-xs font-mono rounded">RAG Chunking</span>
                            <span className="px-2 py-1 bg-tungsten-grey/50 text-gray-300 text-xs font-mono rounded">Hybrid Search</span>
                        </div>
                    </div>

                    {/* Full Platform CTA */}
                    <div className="bg-hazard-amber/5 border border-hazard-amber/20 rounded-lg p-4 text-center">
                        <p className="text-gray-400 text-sm">
                            This open-core version includes 3 sample challenges.{' '}
                            <a
                                href="https://tentropy.co"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-hazard-amber hover:underline font-bold"
                            >
                                Visit tentropy.co
                            </a>{' '}
                            for the full experience with 17+ challenges, progress tracking, and certificates.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-hazard-amber/10 rounded-lg">
                        <Code className="w-6 h-6 text-hazard-amber" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Tech Stack</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-carbon-grey border border-tungsten-grey rounded-lg p-4">
                        <h4 className="text-white font-bold mb-2">Frontend</h4>
                        <ul className="text-gray-400 text-sm space-y-1">
                            <li>• Next.js 15 (App Router)</li>
                            <li>• React 19</li>
                            <li>• Monaco Editor</li>
                            <li>• Tailwind CSS</li>
                        </ul>
                    </div>
                    <div className="bg-carbon-grey border border-tungsten-grey rounded-lg p-4">
                        <h4 className="text-white font-bold mb-2">Backend</h4>
                        <ul className="text-gray-400 text-sm space-y-1">
                            <li>• Supabase (PostgreSQL + Auth)</li>
                            <li>• Upstash Redis (Rate Limiting)</li>
                            <li>• E2B (Sandboxed Execution)</li>
                            <li>• PostHog (Analytics)</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-hazard-amber/5 border border-hazard-amber/20 rounded-lg">
                    <p className="text-sm text-gray-300">
                        <strong className="text-hazard-amber">Open Source:</strong> The platform core is available on{' '}
                        <a
                            href="https://github.com/jaliil-9/tentropy-core"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-hazard-amber hover:underline"
                        >
                            GitHub
                        </a>.
                        You can run your own instance with custom challenges.
                    </p>
                </div>
            </section>

            {/* FAQ */}
            <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-hazard-amber/10 rounded-lg">
                        <HelpCircle className="w-6 h-6 text-hazard-amber" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">FAQ</h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            What are the rate limits?
                        </h3>
                        <p className="text-gray-400 text-sm pl-6">
                            You can submit up to <strong className="text-white">5 solutions every 20 minutes</strong>.
                            This applies to both anonymous and authenticated users. The limit resets on a sliding window.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-gray-500" />
                            Is my code safe?
                        </h3>
                        <p className="text-gray-400 text-sm pl-6">
                            Yes. Your code runs in an <strong className="text-white">isolated Firecracker micro-VM</strong> that
                            is destroyed after execution. Each sandbox has a 60-second timeout and limited resources.
                            We never store your submitted code beyond the session.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-gray-500" />
                            Can I use this without an account?
                        </h3>
                        <p className="text-gray-400 text-sm pl-6">
                            Yes! You can solve challenges as a guest. However, your progress is stored locally and may be lost
                            if you clear your browser data. <strong className="text-white">Sign in to sync your progress</strong> across devices
                            and earn certificates.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                            <Code className="w-4 h-4 text-gray-500" />
                            What language are challenges in?
                        </h3>
                        <p className="text-gray-400 text-sm pl-6">
                            All challenges are currently in <strong className="text-white">Python</strong>.
                            We chose Python because it's the dominant language for AI/ML infrastructure.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-gray-500" />
                            How do I contribute?
                        </h3>
                        <p className="text-gray-400 text-sm pl-6">
                            We welcome contributions! Check out our{' '}
                            <a
                                href="https://github.com/jaliil-9/tentropy-core/blob/master/CONTRIBUTING.md"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-hazard-amber hover:underline"
                            >
                                Contributing Guide
                            </a>{' '}
                            for details on adding new challenges or improving the platform.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}


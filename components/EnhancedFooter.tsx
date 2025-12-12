'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Github, X, Linkedin, Mail, Send } from "lucide-react";

export default function EnhancedFooter() {
    const [email, setEmail] = useState("");

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Newsletter signup:", email);
        setEmail("");
    };

    return (
        <footer id="contact" className="relative z-20 border-t border-tungsten-grey bg-deep-anthracite/95 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="relative w-6 h-6 rounded overflow-hidden border border-hazard-amber/50">
                                <Image
                                    src="/icon.jpg"
                                    alt="TENTROPY"
                                    fill
                                    sizes="24px"
                                    unoptimized
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xl font-black tracking-tight text-white font-mono">TENTROPY</span>
                        </div>
                        <p className="text-sm text-gray-400 font-mono leading-relaxed">
                            AI system design real-world challenges.
                        </p>
                        <div className="flex items-center gap-4 mt-6">
                            <a
                                href="https://github.com/jaliil-9/tentropy-core"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-hazard-amber transition-colors"
                                aria-label="GitHub"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://x.com/jalilbzn_"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-hazard-amber transition-colors"
                                aria-label="X"
                            >
                                <X className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-mono font-bold mb-4 text-sm uppercase tracking-wider">Platform</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/challenges" className="text-sm text-gray-400 hover:text-hazard-amber transition-colors font-mono">
                                    Challenges
                                </Link>
                            </li>
                            <li>
                                <Link href="/#tracks" className="text-sm text-gray-400 hover:text-hazard-amber transition-colors font-mono">
                                    Tracks
                                </Link>
                            </li>
                            <li>
                                <Link href="/docs" className="text-sm text-gray-400 hover:text-hazard-amber transition-colors font-mono">
                                    Documentation
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Community */}
                    <div>
                        <h3 className="text-white font-mono font-bold mb-4 text-sm uppercase tracking-wider">Community</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/#about" className="text-sm text-gray-400 hover:text-hazard-amber transition-colors font-mono">
                                    About
                                </Link>
                            </li>
                            <li>
                                <a href="https://github.com/jaliil-9/tentropy-core" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-hazard-amber transition-colors font-mono">
                                    GitHub
                                </a>
                            </li>
                            <li>
                                <a href="mailto:contact@tentropy.co" className="text-sm text-gray-400 hover:text-hazard-amber transition-colors font-mono">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-white font-mono font-bold mb-4 text-sm uppercase tracking-wider">Newsletter</h3>
                        <p className="text-sm text-gray-400 font-mono mb-4">
                            Get notified about new challenges and features.
                        </p>
                        <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="mail@example.com"
                                    required
                                    className="w-full pl-10 pr-4 py-2 bg-carbon-grey border border-tungsten-grey text-white placeholder-gray-500 focus:outline-none focus:border-hazard-amber transition-colors font-mono text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-hazard-amber text-deep-anthracite font-mono font-bold text-sm hover:bg-hazard-amber/90 transition-colors"
                            >
                                Subscribe
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-tungsten-grey">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-400 font-mono">
                            © {new Date().getFullYear()} TENTROPY. Open source under Apache 2.0 License.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="/privacy" className="text-sm text-gray-400 hover:text-hazard-amber transition-colors font-mono">
                                Privacy
                            </Link>
                            <Link href="/terms" className="text-sm text-gray-400 hover:text-hazard-amber transition-colors font-mono">
                                Terms
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

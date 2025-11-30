import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-deep-anthracite text-foreground selection:bg-hazard-amber selection:text-deep-anthracite pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "TENTROPY",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "A platform for mastering AI system design through realistic coding challenges."
          })
        }}
      />
      {/* Background Grid & Schematic */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="grid-bg absolute inset-0 opacity-20"></div>
        {/* Schematic Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#27272A" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Neural Network Schematic */}
          <g stroke="#27272A" strokeWidth="1" fill="none">
            <path d="M 100 100 L 300 200 L 500 100" />
            <path d="M 100 300 L 300 200 L 500 300" />
            <circle cx="100" cy="100" r="4" fill="#121214" />
            <circle cx="500" cy="100" r="4" fill="#121214" />
            <circle cx="100" cy="300" r="4" fill="#121214" />
            <circle cx="500" cy="300" r="4" fill="#121214" />
            <circle cx="300" cy="200" r="6" fill="#121214" stroke="#FFB000" className="animate-pulse" />
          </g>

          {/* Jagged Failure Lines */}
          <path d="M 300 200 L 350 250 L 320 280 L 400 350" stroke="#FFB000" strokeWidth="2" fill="none" strokeDasharray="5,5" className="animate-pulse opacity-60" />
        </svg>
        <div className="scanline absolute inset-0 z-10"></div>
      </div>



      {/* Hero Section */}
      <main className="relative z-20 flex-1 flex flex-col justify-center items-center text-center px-4">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          <h1 className="text-3xl md:text-6xl font-black tracking-tighter text-white leading-none">
            STABILIZE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600">THE CHAOS.</span>
          </h1>

          <p className="text-base md:text-xl text-gray-400 font-mono max-w-2xl mx-auto text-center">
            {"// Master AI system design by repairing broken pipelines."}<br />
            <span className="text-hazard-amber">Latency. Hallucinations. Cost.</span>
          </p>

          <div className="pt-4 md:pt-8 flex flex-col md:flex-row gap-4 items-center justify-center">
            <Link
              href="/challenges"
              className="group relative inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 font-mono font-bold text-white transition-all duration-200 bg-transparent border-2 border-hazard-amber hover:bg-hazard-amber/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hazard-amber focus:ring-offset-deep-anthracite text-sm md:text-base"
            >
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
              <span className="relative flex items-center gap-3 text-hazard-amber group-hover:text-white transition-colors text-glow">
                [ INITIALIZE ]
              </span>
            </Link>

            <a
              href="https://github.com/jaliil-9/tentropy-platform"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 font-mono font-bold text-gray-400 transition-all duration-200 bg-transparent border-2 border-gray-700 hover:border-white hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-deep-anthracite text-sm md:text-base"
            >
              <span className="relative flex items-center gap-3">
                [ SOURCE CODE ]
              </span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

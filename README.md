# TENTROPY

**CTF-Style Challenges for AI Systems Engineering**

> *The skills that make AI systems production-ready aren't taught in ML courses.*  
> *TENTROPY teaches through real-world failure scenarios.*

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

---

## What is TENTROPY?

TENTROPY is a **CTF learning platform** for AI/ML engineers who want to master the **infrastructure and reliability patterns** that make LLM applications production-ready.

Most AI education focuses on model training. TENTROPY focuses on what happens after the engineering that determines whether your AI system survives contact with real users.

### The Problem We Solve

| What ML Courses Teach | What Production AI Needs |
|-----------------------|--------------------------|
| Fine-tuning models | Context window management |
| Prompt engineering | Rate limiting & caching |
| Dataset curation | Hallucination guardrails |
| Evaluation metrics | Streaming & timeout handling |


**TENTROPY bridges this gap** through hands-on challenges inspired by real production incidents.

---

## How It Works

```
┌──────────────────────────────────────────────────────────────────────┐
│  BRIEFING: "Your chatbot is crashing with context_length_exceeded"   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────┐    ┌─────────────────────────────────┐  │
│  │    BROKEN CODE          │    │         CONSOLE                 │  │
│  │    (Monaco Editor)      │ -> │    pytest output + system logs  │  │
│  │                         │    │                                 │  │
│  └─────────────────────────┘    └─────────────────────────────────┘  │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  DEBRIEF: Production patterns + code samples (unlocks on solve)     │
└──────────────────────────────────────────────────────────────────────┘
```

1. **Read the Incident**: Each challenge presents a realistic failure scenario
2. **Fix the Code**: Debug and patch the broken Python in an embedded editor
3. **Run Tests**: Code executes in an isolated sandbox with instant feedback
4. **Learn the Pattern**: Unlock debriefs with production-grade solutions

---

## Learning Tracks

### Systems Resilience
*The fundamentals that every backend engineer needs*

- ReDoS attacks and catastrophic backtracking
- Rate limiting with Token Bucket algorithms
- Retry storms and exponential backoff with jitter
- Connection pooling and resource management
- N+1 query detection and batch optimization

### The AI Architect  
*The patterns that wrap LLMs for production*

- Semantic caching to cut API costs by 90%
- Context window management (sliding window, summarization)
- Structured output validation and guardrails
- Streaming responses to prevent gateway timeouts
- RAG pipeline optimization with re-ranking

### Observability & Debugging
- Distributed tracing to find the root cause of a failure in a microservice chain.
- Sliding window error rate calculation to trigger alerts.
- Structured JSON logging to make debugging queryable.
  
---

## Open Source Core

This repository contains the **open-source core** of TENTROPY.

### What's Included

- Complete platform architecture (Next.js 15 + App Router)
- Challenge execution engine (E2B sandboxed environments)
- Monaco editor integration with syntax highlighting
- User progress tracking and certificate system
- **2 sample challenges per track** to understand the format

### What's Not Included

- Full challenge library (protected content)
- Production challenge database seeds

> **Want the full experience?** Visit [tentropy.co](https://tentropy.co) for all challenges.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Language** | TypeScript 5 |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL + Auth) |
| **KV Store** | [Upstash Redis](https://upstash.com/) (Rate limiting) |
| **Sandbox** | [E2B](https://e2b.dev/) (Isolated code execution) |
| **Editor** | Monaco Editor (VS Code engine) |
| **Styling** | Tailwind CSS + Lucide Icons |
| **Analytics** | PostHog |

---

## Quick Start

### Prerequisites

- Node.js 18+
- Bun
- E2B API key ([get one free](https://e2b.dev/))
- Upstash Redis (optional, for rate limiting)

### Installation

```bash
# Clone the repository
git clone https://github.com/jaliil-9/tentropy-core.git
cd tentropy-core

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
E2B_API_KEY=your_e2b_api_key

# Optional (for rate limiting)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Optional (for analytics)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
```

### Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start solving challenges.

---

## Project Structure

```
tentropy-core/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (submit, rate-limit)
│   ├── challenge/         # Challenge interface pages
│   ├── challenges/        # Challenge list/roadmap
│   └── (marketing)/       # Landing, login, profile pages
├── components/            # React components
│   ├── challenge/         # Editor, Console panels
│   └── ui/               # Shared UI components
├── data/
│   └── challenges/       # Challenge definitions (sample)
├── hooks/                # React hooks (runner, progress)
├── lib/                  # Utilities (Supabase, analytics)
└── types/                # TypeScript types
```

---

## Creating a Challenge

Challenges follow a consistent structure:

```typescript
{
  id: 'unique-challenge-id',
  title: 'The Challenge Title',
  difficulty: 'Easy' | 'Medium' | 'Hard',
  summary: 'One-line description for the card.',
  
  description: `
    # The Scenario (what broke)
    # The Problem (why it matters)
    # The Goal (what to fix)
  `,
  
  brokenCode: `# Python code with the bug`,
  testCode: `# pytest code that verifies the fix`,
  solutionCode: `# The correct implementation`,
  successMessage: 'Displayed on solve',
  
  debrief: `
    # Production patterns
    # Code examples
    # Warning callouts
  `
}
```

See `data/challenges/systems.ts` for full examples.

---

## Contributing

We welcome contributions! Whether it's:

- Bug fixes
- Documentation improvements
- New features
- Challenge submissions

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `bun run test`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## License

Distributed under the **Apache 2.0 License**. See [LICENSE](LICENSE) for details.

---

## Links

- **Platform**: [tentropy.dev](https://tentropy.dev)
- **Contact**: contact@tentropy.co
- **X/Twitter**: [@jalilbzn_](https://x.com/jalilbzn_)

---

<p align="center">
  <strong>Built for engineers who ship AI to production.</strong>
</p>

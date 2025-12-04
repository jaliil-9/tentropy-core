# TENTROPY

**Engineering Platform for AI Systems.**

TENTROPY is a reliability and evaluation platform designed to stress-test LLM workflows, agents, and RAG pipelines logics. It provides isolated, micro-VM environments to simulate real-world failures, ensuring deep understanding of designing AI systems that are robust, predictable, and production-ready.

---

## Mission

We offer a curated suite of engineering challenges ("Missions") designed to train AI Architects in the fundamental patterns of reliable LLM system design. From context window management to hallucination guardrails required for the next generation of AI engineering.

---

## Key Features

- **Isolated Execution Environments**: Every challenge runs in a secure, ephemeral micro-VM (powered by E2B), ensuring safe and reproducible code execution.
- **Real-World Engineering Missions**: Solve practical problems like "Regex Catastrophic Backtracking", "Token Bucket Rate Limiting", and "RAG Hallucination Traps".
- **Automated Evaluation**: Instant feedback on correctness, performance, and system behavior.
- **Tech Stack**: Built with Next.js 15, React 19, Supabase, and Tailwind CSS.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **KV Store**: [Upstash Redis](https://upstash.com/) (Rate limiting & caching)
- **Execution Engine**: [E2B](https://e2b.dev/) (Sandboxed Cloud Environments)
- **Editor**: Monaco Editor (VS Code experience)
- **Styling**: Tailwind CSS + Lucide Icons
- **Analytics**: PostHog

<<<<<<< HEAD
[Add your license here]
=======
---

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jaliil-9/tentropy-core.git
    cd tentropy
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add your credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
    E2B_API_KEY=your_e2b_api_key
    UPSTASH_REDIS_REST_URL=your_redis_url
    UPSTASH_REDIS_REST_TOKEN=your_redis_token
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```


## Contributing

We welcome contributions from the community! Whether it's adding a new challenge, fixing a bug, or improving documentation, your help is appreciated.

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## License

Distributed under the Apache 2.0 License. See [LICENSE](LICENSE) for more information.

---
>>>>>>> 6b31300d5ea319d4263d84c2302cc01fda4754e6

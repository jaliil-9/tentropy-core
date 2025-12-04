# TENTROPY (Open Core)

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![E2B](https://img.shields.io/badge/E2B-Sandboxed-orange)](https://e2b.dev/)

**The Engineering Platform for AI Systems.**

Tentropy is a platform for mastering AI system design through realistic, hands-on coding challenges. This repository contains the **Open Source Core** of the platform, allowing you to run the execution engine and solve challenges locally.

[**🌐 Try the Hosted Platform (Free)**](https://tentropy.co) | [**📚 Documentation**](https://tentropy.co/docs)

---

## 🚀 Features

- **Real Simulation**: Challenges run in isolated **Firecracker micro-VMs** (via E2B), not just browser mocks.
- **System Design Focus**: Debug race conditions, memory leaks, and distributed system failures.
- **Modern Stack**: Built with Next.js 15, React 19, Supabase, and TailwindCSS.

## ⚖️ Open Core vs Hosted

| Feature | Open Core (This Repo) | Hosted Platform (tentropy.co) |
|---------|----------------------|-------------------------------|
| **Engine** | ✅ Full Execution Engine | ✅ Full Execution Engine |
| **Challenges** | ⚠️ 4 Sample Challenges | ✅ All Challenges (10+) |
| **Setup** | 🛠️ Self-Hosted (Bring your keys) | ⚡ Instant (Zero Config) |
| **Progress** | ❌ Local Only | ✅ Cloud Sync & History |
| **Certificates** | ❌ Not Included | ✅ Verified Certificates |

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- Supabase Account (for Auth/DB)
- E2B Account (for Sandboxes)
- Upstash Redis (for Rate Limiting)

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/jaliil-9/tentropy-core.git
   cd tentropy-core
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment**
   Copy the template and fill in your API keys:
   ```bash
   cp .env.example .env.local
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to start solving.

## 🏗️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Execution**: [E2B](https://e2b.dev/) (Firecracker micro-VMs)
- **Rate Limiting**: [Upstash Redis](https://upstash.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

We welcome contributions! Whether it's adding a new challenge, fixing a bug, or improving documentation.
Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

Distributed under the Apache 2.0 License. See [LICENSE](LICENSE) for more information.

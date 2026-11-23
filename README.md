# Software Hub (`software-hub`)

**Official Software Releases, Standalone Executables, CLI Toolchains & Open-Source Distribution Portal**  
Engineered and maintained by **[Shamodha Sahan](https://shamodha.com)** ([github.com/shamodhas](https://github.com/shamodhas)).

---

## 1. Overview

**Software Hub** (`software-hub`) is a full-stack release engineering and software distribution platform built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and **PostgreSQL**. It serves as the central catalog for standalone desktop tools, CLI utilities, and backend libraries, paired with a secure **Admin Release Console** (`/admin`).

### Key Capabilities
- **Public Software Catalog**: Live search, category pills, platform filters, and flagship release spotlight.
- **Strictly Categorized Artifact Matrix**: Every version release organizes downloadable assets into explicit categories:
  - `EXECUTABLE` — Compiled standalone binaries (`.exe`, `.msi`, `.apk`, `.dmg`, `.deb`) with one-click SHA-256 verification.
  - `PORTABLE_ZIP` — Pre-built portable binary ZIP archives.
  - `SOURCE_ARCHIVE` — Immutable release source code snapshots (`.zip`, `.tar.gz`).
  - `GITHUB_SOURCE` — Direct repository trees and GitHub release tag links.
  - `PACKAGE_REGISTRY` — Published package links for NPM, Maven Central, and PyPI.
- **Atomic Download Telemetry**: `/api/download/[artifactId]` atomically increments PostgreSQL download counters before redirecting to the target binary or registry.
- **SEO & Structured Metadata**: Dynamic OpenGraph/Twitter metadata, `sitemap.xml`, `robots.txt`, and `schema.org/SoftwareApplication` JSON-LD on every software detail page.
- **Protected Admin Management Console (`/admin`)**:
  - HTTP-only JWT authentication (`jose`) guarded by `middleware.ts`.
  - Full CRUD for Categories, Software Packages, Tagged Releases, and Categorized Artifacts.
  - Supports both external URLs (GitHub Releases / Registries) and direct file uploads (`multipart/form-data`) with automated file-size formatting and SHA-256 hash calculation.

---

## 2. Git Branching & Release Workflow

This repository follows a clean two-branch production workflow:

| Branch / Tag | Purpose |
| :--- | :--- |
| `main` | **Production Branch** — Always deployable. Protected and synced directly with production deployments (`releases.shamodha.com`). |
| `develop` | **Active Integration Branch** — Default working branch for new features, admin enhancements, schema updates, and UI refinements. |
| `v*.*.*` | **Semantic Version Tags** — Created on `main` (e.g., `v0.1.0`, `v1.0.0`) to mark audited production milestones. |

### Standard Development Flow
```bash
# Work on develop
git checkout develop
git add .
git commit -m "feat(releases): add new release capability"
git push origin develop

# Promote to main for production release
git checkout main
git merge develop
git tag -a v0.1.0 -m "Release v0.1.0"
git push origin main --tags
```

---

## 3. Local Development Setup (Docker PostgreSQL)

### Prerequisites
- **Node.js** v20+ and `npm`
- **Docker Desktop** (for local PostgreSQL 16 container)

### Step-by-Step Bootstrap
1. **Clone the repository & install dependencies**:
   ```bash
   git clone https://github.com/shamodhas/software-hub.git
   cd software-hub
   npm install
   ```

2. **Configure environment variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. **Start PostgreSQL, push Prisma schema & seed initial catalog**:
   ```bash
   # Option A: All-in-one setup script
   npm run setup

   # Option B: Individual commands
   docker compose up -d --wait
   npx prisma generate
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   - **Public Portal**: `http://localhost:4000`
   - **Admin Console**: `http://localhost:4000/admin`

---

## 4. Production Deployment Architecture (Vercel + Neon PostgreSQL)

Software Hub is architected for zero-downtime serverless deployment:

1. **Source Control**: Hosted on GitHub at [`shamodhas/software-hub`](https://github.com/shamodhas/software-hub).
2. **Managed PostgreSQL (Neon)**:
   - Provision a serverless PostgreSQL database on **Neon**.
   - Set `DATABASE_URL` in production to the Neon connection string (`postgresql://...neon.tech/neondb?sslmode=require`).
3. **Hosting & Custom Domain (Vercel)**:
   - Import `shamodhas/software-hub` into **Vercel** tracking the `main` branch.
   - Configure custom subdomain **`releases.shamodha.com`**.
   - Set production environment variables in Vercel:
     - `DATABASE_URL` — Neon PostgreSQL connection string
     - `NEXT_PUBLIC_SITE_URL` — `https://releases.shamodha.com`
     - `ADMIN_USERNAME` — Production admin username
     - `ADMIN_PASSWORD` — Strong production admin password
     - `AUTH_SECRET` — 32+ byte cryptographic JWT signing secret

---

## 5. License

Released under the [MIT License](./LICENSE).  
Copyright © 2026 [Shamodha Sahan](https://shamodha.com).

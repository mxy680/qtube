# Contributing to QTube

Thanks for your interest in contributing! This document covers everything you need to get started.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

---

## Getting Started

1. **Fork** the repository and clone your fork:
   ```bash
   git clone https://github.com/<your-username>/qtube.git
   cd qtube
   ```

2. **Install dependencies** (requires Node.js 18+ and pnpm):
   ```bash
   pnpm install
   ```

3. **Set up environment variables** — copy `.env.local.example` or refer to the README for required keys:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
   - `YOUTUBE_API_KEY`
   - `OPENAI_API_KEY`

4. **Run migrations and start the dev server:**
   ```bash
   npx prisma migrate dev
   pnpm dev
   ```

---

## Development Workflow

- **Branch off `main`** for all changes:
  ```bash
  git checkout -b feat/my-feature
  # or
  git checkout -b fix/my-bugfix
  ```

- **Branch naming conventions:**
  | Prefix | Use for |
  |--------|---------|
  | `feat/` | New features |
  | `fix/` | Bug fixes |
  | `chore/` | Tooling, deps, refactors |
  | `docs/` | Documentation only |

- Keep commits focused and atomic. Prefer one logical change per commit.

- **Run lint before pushing:**
  ```bash
  pnpm lint
  ```

---

## Code Style

- **Language:** TypeScript — no `any` types without justification.
- **Formatting:** Follow the existing ESLint config. If in doubt, match the surrounding code.
- **Components:** Use the `components/` directory for reusable UI. Keep page-specific logic in `app/`.
- **API routes:** Live in `app/api/`. Keep handlers thin — move business logic to `lib/` or `utils/`.
- **Database:** Schema changes go through Prisma migrations (`npx prisma migrate dev --name <name>`). Never edit migration files manually.
- **Styling:** Tailwind CSS + shadcn/ui. Avoid inline styles.

---

## Submitting Changes

1. Push your branch to your fork.
2. Open a **Pull Request** against `main` on this repo.
3. Fill out the PR description with:
   - What changed and why
   - Screenshots or recordings for UI changes
   - Any migration steps needed
4. Address any review feedback promptly.

PRs should be focused — avoid bundling unrelated changes together.

---

## Reporting Issues

When filing a bug report, please include:

- A clear description of the problem
- Steps to reproduce
- Expected vs. actual behavior
- Your environment (OS, Node version, browser)
- Any relevant error messages or screenshots

For feature requests, describe the use case and why it would benefit the project.

---

## Questions?

Open a GitHub Discussion or drop a comment on an existing issue. Happy to help.

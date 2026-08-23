# React Next Basic

A **token-efficient, provider-agnostic foundation** for building React/Next apps.
Common building blocks (UI components, auth, database, storage, notifications,
state) are already defined, so building a feature means _assembling from a known
catalog_ — which keeps AI agents (even small/cheap models) consistent and cheap.

## Quick start

```bash
pnpm install
pnpm dev          # runs apps/web at http://localhost:3000
pnpm typecheck    # type-check everything
```

Demo login: `demo@example.com` / `password`. The default backend is in-memory
(zero config); switch to Firebase or Supabase by editing one file
(`apps/web/src/lib/backend.ts`).

## For AI agents

**Read [`AGENTS.md`](./AGENTS.md) first, then [`MAP.md`](./MAP.md).** Everything an
agent needs is mapped there and in [`docs/`](./docs). Don't load the whole repo —
see [`docs/AI-WORKFLOW.md`](./docs/AI-WORKFLOW.md) for the minimal context per task.

## Structure

```
apps/web        Next.js (App Router) — dashboard + SEO reference app
apps/native     (planned) Vite + React + Capacitor for the App-Store app
packages/core   provider-neutral backend (auth, db, storage, notifications) + entities
packages/ui     design system: components + hooks + tokens
packages/config  shared tsconfig / eslint presets
docs/           architecture, conventions, component catalog, recipes, workflow
```

## Key docs

| Doc | What |
| --- | --- |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | layers & dependency rules |
| [docs/COMPONENTS.md](./docs/COMPONENTS.md) | the UI catalog (pick from here) |
| [docs/RECIPES.md](./docs/RECIPES.md) | step-by-step to build common things |
| [docs/STATE-MANAGEMENT.md](./docs/STATE-MANAGEMENT.md) | server vs client state |
| [docs/DATA-LAYER.md](./docs/DATA-LAYER.md) | entities, repositories, normalization |
| [docs/BACKEND-PROVIDERS.md](./docs/BACKEND-PROVIDERS.md) | Firebase ↔ Supabase swap |
| [docs/AI-WORKFLOW.md](./docs/AI-WORKFLOW.md) | work with any model, spend few tokens |

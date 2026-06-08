# Conventions

Predictable naming = the agent finds and places files without searching = fewer
tokens. Follow these exactly.

## Files & folders

- Folders & files: `kebab-case` → `login-form.tsx`, `use-auth.ts`, `auth.api.ts`.
- React components: `PascalCase` export in a `kebab-case` file.
- Hooks: `useXxx` in `use-xxx.ts`.
- Zod entity: `singular.ts` in `entities/` (e.g. `user.ts`), schema named
  `xxxSchema`, type `Xxx`, parser `parseXxx`.
- Repository: `xxx.repository.ts`, class `XxxRepository`.
- Feature API: `xxx.api.ts`, exported object `xxxApi`.

## Feature folder shape (copy `features/auth`)

```
features/<feature>/
├── api/<feature>.api.ts      # thin calls to repositories / backend services
├── hooks/use-<feature>.ts    # TanStack Query + Zustand orchestration
├── components/                # feature UI (uses @repo/ui)
└── schema.ts                  # Zod schemas for this feature's forms/inputs
```

## Imports

- Cross-package: import from the package root only — `@repo/ui`, `@repo/core`.
  Never deep-import (`@repo/core/src/...`) except provider adapters, which are
  documented exceptions.
- Inside the app: use the `@/` alias → `@/lib/backend`, `@/features/auth/...`.
- Order: external → `@repo/*` → `@/*` → relative.

## Components

- Reuse from `@repo/ui`. If a primitive is missing, add it **to `@repo/ui`**, not
  to the app, so every app benefits.
- Client components need `'use client'` at the top (anything with hooks, state,
  events, browser APIs). Pure presentational/server components don't.

## TypeScript

- `strict` is on. No `any` — prefer `unknown` + narrowing.
- Types come from Zod (`z.infer`). Don't duplicate a model as an interface.

## Git

- Branch per task. Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`,
  `chore:`. Keep messages short and factual.

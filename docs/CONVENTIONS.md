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
├── context.md                 # SHORT memory: purpose, app↔dashboard counterpart, reasons
├── api/<feature>.api.ts      # thin calls to repositories / backend services
├── hooks/use-<feature>.ts    # TanStack Query + Zustand orchestration
├── components/                # feature UI (shared primitives + local compositions)
└── schema.ts                  # Zod schemas for this feature's forms/inputs
```

Every feature starts with a `context.md` (copy `docs/_templates/feature-context.md`).
It is read first and updated last — the memory that survives long breaks and model
resets. Cross-app relationships live in `docs/PRODUCTS.md`.

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

## File size & modularity (no monster files)

- **One file, one job.** A row, a form, a card, a dialog → each its own file.
- **Split at ~150 lines.** Past that, extract sub-components and move logic into a
  hook. Pages must stay thin (compose, don't implement).
- **One feature folder per dashboard tab / app screen**, each with its own
  `components/`. A "tab" is a directory of small files, never one screen file.
- Full structure for large surfaces (tabs, sub-tabs, dialogs, settings):
  `docs/SCALING.md`.

## TypeScript

- `strict` is on. No `any` — prefer `unknown` + narrowing.
- Types come from Zod (`z.infer`). Don't duplicate a model as an interface.

## Git

- Branch per task. Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`,
  `chore:`. Keep messages short and factual.

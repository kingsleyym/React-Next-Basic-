# apps/web — agent notes

Next.js (App Router) reference app. Read root `AGENTS.md` first.

## Layout

- `src/app/` — routes only. Pages stay THIN: they render a feature component.
- `src/features/<feature>/` — feature modules: `context.md`, `api/`, `hooks/`,
  `components/`, `schema.ts`. **`features/auth` is the reference** — copy its shape.
  Protected pages: `useRequireAuth()` from features/auth, then compose feature
  components (see `app/dashboard/page.tsx` for the thin-page pattern).
- `src/shared/` — app-wide: `providers.tsx`, `stores/` (Zustand).
- `src/lib/` — singletons: `backend.ts` (the ONE backend instance + repositories),
  `query-client.ts`.

## Rules specific to this app

- Server state → TanStack Query (`useQuery`/`useMutation`). UI/auth state → Zustand
  (`src/shared/stores`). Never mix.
- Data access ONLY through repositories from `@/lib/backend` (which wrap
  `@repo/core`). Never import a provider SDK in a feature or page.
- Use components/hooks from `@repo/ui`. Check `docs/COMPONENTS.md` before building UI.
- To switch backend provider, edit ONLY `src/lib/backend.ts`. See
  `docs/BACKEND-PROVIDERS.md`.
- New feature → follow `docs/RECIPES.md` ("New CRUD feature").

## Commands

```bash
pnpm --filter web dev        # run this app
pnpm --filter web typecheck  # type-check this app
```

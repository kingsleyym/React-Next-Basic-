---
name: feature-builder
description: Scaffolds a complete feature (entity, repository, feature folder, page) following the repo conventions. Use when asked to add a new CRUD feature or screen.
---

You build features in this monorepo. Be fast and conventional — assemble from the
catalog, do not invent.

Before doing anything, read `AGENTS.md`, `MAP.md`, `docs/RECIPES.md` (the
"New CRUD feature" recipe), and the reference feature `apps/web/src/features/auth`.

Steps for a new feature `<name>`:

1. Entity: `packages/core/src/entities/<name>.ts` (Zod schema + inferred type +
   `parse<Name>`), exported from `entities/index.ts`.
2. Repository: `packages/core/src/repositories/<name>.repository.ts` extending
   `BaseRepository`, exported from `core/src/index.ts`.
3. Instance in `apps/web/src/lib/backend.ts`.
4. Feature folder `apps/web/src/features/<name>/` with `context.md` (from
   `docs/_templates/feature-context.md`), `api/`, `hooks/`, `components/`,
   `schema.ts` — mirror `features/auth` exactly.
5. Thin page in `apps/web/src/app/<name>/page.tsx`.
6. Update `docs/PRODUCTS.md` if the feature has a cross-surface counterpart.

Rules: UI only from `@repo/ui`; data only through repositories/`@repo/core`;
server state in TanStack Query; UI state in Zustand. Finish by running
`pnpm typecheck` and fixing any errors. Report the files you created.

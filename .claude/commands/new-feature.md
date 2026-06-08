---
description: Scaffold a complete CRUD feature following the repo recipe
---

Create a new feature named `$ARGUMENTS` by following `docs/RECIPES.md` →
"New CRUD feature", using `apps/web/src/features/auth` as the template.

Produce, in order:

1. Zod entity in `packages/core/src/entities/` (+ export).
2. Repository in `packages/core/src/repositories/` (+ export from core index).
3. Repository instance in `apps/web/src/lib/backend.ts`.
4. Feature folder `apps/web/src/features/$ARGUMENTS/` with `api/`, `hooks/`,
   `components/` (list + form), `schema.ts`.
5. Thin page in `apps/web/src/app/$ARGUMENTS/page.tsx`.

Use only `@repo/ui` components and `@repo/core` for data. Run `pnpm typecheck`
when done and fix any errors. List the created files.

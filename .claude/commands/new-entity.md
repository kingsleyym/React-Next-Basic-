---
description: Add a new data model (Zod entity + repository) wired into the app
---

Add a new entity named `$ARGUMENTS` following `docs/DATA-LAYER.md`:

1. `packages/core/src/entities/$ARGUMENTS.ts` — Zod schema, inferred type,
   `parse<Name>`. Export from `entities/index.ts`.
2. `packages/core/src/repositories/$ARGUMENTS.repository.ts` extending
   `BaseRepository`. Export from `core/src/index.ts`.
3. Instantiate it in `apps/web/src/lib/backend.ts`.

Mirror `entities/user.ts` and `repositories/user.repository.ts`. Keep the schema
flat; reference other entities by id. Run `pnpm typecheck`.

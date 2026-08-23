---
description: Switch the backend provider (memory / firebase / supabase)
---

Switch the active backend provider to `$ARGUMENTS` (one of: memory, firebase,
supabase) by following `docs/BACKEND-PROVIDERS.md`.

Edit ONLY `apps/web/src/lib/backend.ts`:

1. If firebase/supabase: ensure the SDK is installed in the app
   (`pnpm --filter web add firebase` or `@supabase/supabase-js`).
2. Build the `Backend` bundle from the matching adapters under
   `packages/core/src/**/adapters/`, reading config from env vars.
3. Keep the `userRepository` (and any other repositories) instantiation.

Do not change any feature, page or component. Confirm `pnpm typecheck` passes and
list the env vars the user must set.

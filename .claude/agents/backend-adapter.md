---
name: backend-adapter
description: Implements or swaps backend provider adapters (Firebase/Supabase) behind the @repo/core interfaces. Use for provider setup or switching providers.
---

You work on the provider-neutral backend. Read `docs/BACKEND-PROVIDERS.md`,
`docs/DATA-LAYER.md`, and the interfaces in `packages/core/src/{auth,db,storage,notifications}`.

Rules:

- The ONLY files allowed to import a provider SDK are the adapters under
  `packages/core/src/**/adapters/`. Never import a provider in a feature/page.
- Switching providers must touch only `apps/web/src/lib/backend.ts`.
- Each adapter maps the provider's user/row → our entity (Zod) and provider errors
  → `AppError`. Match the existing `firebase.*`/`supabase.*` adapters' shape.
- Keep the four interfaces (`AuthService`, `DbService`, `StorageService`,
  `NotificationService`) stable; implement them fully.

When adding a provider: install its SDK in the app, fill in the adapter, wire the
bundle in `backend.ts`, then verify the app still typechecks and runs.

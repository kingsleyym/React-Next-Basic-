# Architecture

A small set of layers with a strict one-way dependency rule. If you respect the
arrow direction, you cannot create a mess.

```
 apps/web (UI: routes, features)
        │  depends on
        ▼
 @repo/ui (components, hooks)        @repo/core (auth, db, storage, notifications)
        │                                   │
        └───────────────┬───────────────────┘
                        ▼
                 entities (Zod schemas)
```

## The layers (top calls down, never up)

1. **Pages** (`apps/web/src/app`) — routing only. Thin. Render a feature.
2. **Features** (`apps/web/src/features/<name>`) — the actual screens & logic for
   one capability. Split into `components/`, `hooks/`, `api/`, `schema.ts`.
3. **Hooks** — orchestrate state. Server state via TanStack Query; UI state via
   Zustand. Components call hooks, not APIs directly.
4. **Feature API** (`api/*.ts`) — thin functions over repositories / backend
   services. The only place that touches `@/lib/backend`.
5. **Repositories** (`@repo/core`) — data access for one entity. Validate through
   the Zod schema. Call the `DbService`, never a provider SDK.
6. **Services / Adapters** (`@repo/core`) — `AuthService`, `DbService`,
   `StorageService`, `NotificationService` interfaces + Firebase/Supabase/memory
   implementations. The ONLY place a provider SDK is imported.
7. **Entities** (`@repo/core/entities`) — Zod schemas = single source of truth for
   every model. Types are inferred, never hand-written twice.

## Hard rules (these keep it clean for any model)

- A feature/page **never** imports `firebase` or `@supabase/*`. It goes through
  `@/lib/backend` → `@repo/core` interfaces.
- Server data **never** lives in Zustand or `useState`. It lives in TanStack Query.
- A model/type is **never** declared twice. Define the Zod schema, infer the type.
- UI is **never** hand-rolled when a `@repo/ui` component exists.
- Swapping the backend touches **one file**: `apps/web/src/lib/backend.ts`.

## UI layering: primitives shared, compositions local

Different surfaces (a data dashboard vs. a consumer mobile app) need different
UI, so we don't force shared components on them. Three tiers:

- **Tokens** (`@repo/ui` `tokens.css`) — brand language. Shared, but a surface can
  override them locally for a different feel.
- **Primitives** (`@repo/ui`) — surface-neutral: Button, Input, Dialog, Toast,
  Skeleton, FormField, … Shared. A button is a button everywhere.
- **Compositions** — surface-specific: tables/sidebars (dashboard), bottom-nav/
  cards (app). These live **in the app**, not in `@repo/ui`. Promote one to a
  shared package only when a **second** app needs it.

Sharing a package never forces usage: unused exports are tree-shaken, so an app
pays nothing for primitives it doesn't import.

## Where the example apps fit

- **web** (this repo): SEO site + dashboard. Next.js App Router for SSR/SEO.
- **native** (planned): the App-Store app. Vite + React + Capacitor — wraps the
  same React UI in a native shell, reuses `@repo/core` and `@repo/ui` unchanged.
  Only the rendering host differs; the architecture above is identical.

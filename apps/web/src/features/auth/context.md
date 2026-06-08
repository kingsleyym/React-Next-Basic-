# Feature: auth

**What it does:** Email/password sign-in + the current-user state for the app.

**Where it lives:** `apps/web/src/features/auth`

**Counterpart:** Standalone (no second surface yet). Uses the shared
`AuthService` from `@repo/core`, so it is provider-neutral (memory/Firebase/Supabase).

**Why it's built this way:** Client auth state lives in the Zustand store
(`shared/stores/auth.store.ts`) and is kept in sync by `AuthListener` — components
read `useAuth()`, they never call the provider. Server data stays in TanStack Query.

**Key files:** `api/auth.api.ts`, `hooks/use-auth.ts`,
`components/login-form.tsx`, `components/auth-listener.tsx`, `schema.ts`.

**Gotchas:** This is the reference feature — other features copy its shape. The
client `isAdmin`/route guards are UX only; real security is in provider rules.

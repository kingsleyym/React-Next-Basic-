# Auth

Provider-neutral. The app talks to `AuthService` (in `@repo/core`); the active
implementation (memory / Firebase / Supabase) is chosen in
`apps/web/src/lib/backend.ts`.

## The pieces

- **`AuthService`** (`@repo/core`) — `signInWithEmail`, `signUpWithEmail`,
  `signOut`, `getCurrentUser`, `onAuthStateChanged`, `sendPasswordReset`.
- **`AuthListener`** (`features/auth/components/auth-listener.tsx`) — subscribes
  once and pushes the user into the Zustand store.
- **`useAuthStore`** (`shared/stores/auth.store.ts`) — `user`, `status`.
- **`useAuth`** (`features/auth/hooks/use-auth.ts`) — what components use. Returns
  `user`, `status`, `isAuthenticated`, `isAdmin`, and `login`/`signup`/`logout`
  mutations.

## Flow

```
sign in  → AuthService.signInWithEmail
         → provider fires onAuthStateChanged
         → AuthListener → useAuthStore.setUser
         → useAuth() everywhere sees the new user
```

## Protecting a page (client)

```tsx
const { status } = useAuth();
useEffect(() => {
  if (status === 'unauthenticated') router.replace('/login');
}, [status]);
```

See `app/dashboard/page.tsx`. For SSR/SEO-critical pages, also gate in Next
middleware reading the provider session cookie (Firebase/Supabase SSR helpers).

## Roles / RBAC

The `User` entity has a `role` (`user` | `admin`). Gate admin features with
`useAuth().isAdmin`. Map the provider's role claim → our `role` inside the auth
adapter (`toUser`), so the rest of the app is provider-agnostic. Enforce the real
security in backend rules (Firestore rules / Supabase RLS) — the client check is
UX only.

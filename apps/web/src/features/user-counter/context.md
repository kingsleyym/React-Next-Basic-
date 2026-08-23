# Feature: user-counter

**What it does:** Displays the total number of registered users on the dashboard.

**Where it lives:** `apps/web/src/features/user-counter`

**Counterpart:** Standalone. Reads the same `User` entity the auth/members features
use — one shared entity in `@repo/core`, no duplicate model.

**Why it's built this way:** Thin feature that reuses the existing `userRepository`
and TanStack Query cache key `['users']` (same as members), so no duplicate
network requests. The component is a simple `Card` from `@repo/ui`.

**Key files:** `api/user-counter.api.ts`, `hooks/use-user-count.ts`,
`components/user-counter-card.tsx`.

**Gotchas:** Shares the `['users']` query key with the members feature — TanStack
Query deduplicates automatically. No separate repository or entity needed.

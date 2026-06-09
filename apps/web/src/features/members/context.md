# Feature: members

**What it does:** Lists members on the dashboard; lets an admin add a (demo) member.

**Where it lives:** `apps/web/src/features/members`

**Counterpart:** Standalone. Reads the same `User` entity the auth feature
creates — one shared entity in `@repo/core`, no duplicate model.

**Why it's built this way:** Extracted from the dashboard page so the page stays
thin (the page only composes `UserHeader` + `MembersCard` behind `useRequireAuth`).
The table is the dashboard-local `DataTable` composition, not a `@repo/ui` primitive.

**Key files:** `api/members.api.ts`, `hooks/use-members.ts`,
`components/members-card.tsx`.

**Gotchas:** The members query is mounted only behind the auth guard (the page
renders it only when `isReady`), so no `enabled` flag is needed in the hook.

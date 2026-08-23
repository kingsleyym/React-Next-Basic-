# Feature: gallery

**What it does:** Shows images (placeholder gradients) the user can like; plus a
mobile stats view of like totals.

**Where it lives:** `apps/web/src/features/gallery`

**Counterpart:** Standalone demo. The `/stats` page (management view) and the
`/gallery` page (user view) read the **same** cached image list — `/stats` is the
management counterpart of the user gallery, derived from one query, no extra fetch.

**Why it's built this way:** Likes use an **optimistic** mutation (the heart bumps
instantly, rolls back on error) so the UI feels instant. `ImageCard` and
`StatsOverview` are app-local compositions (not in `@repo/ui`). Placeholders are
deterministic gradients so it works fully offline.

**Key files:** `api/gallery.api.ts`, `hooks/use-gallery.ts`,
`components/{image-grid,image-card,stats-overview,gradient}.*`.

**Gotchas:** Stats are derived from the `['images']` query — don't add a parallel
fetch; reuse the cache.

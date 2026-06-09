# Analytics / Tracking

Provider-neutral, same pattern as Auth/Db/Storage. Features call an
`AnalyticsService`; the active provider (no-op / Google) is chosen in one file.

## The pieces

- **`AnalyticsService`** (`@repo/core`): `pageView`, `track`, `identify`, `reset`.
- **Default**: `createMemoryAnalytics()` — no-op, logs in dev. Zero config.
- **Google adapter**: `createGoogleAnalytics(measurementId)` (GA4 / gtag) — a
  build-excluded adapter under `analytics/adapters/`, the only file touching `gtag`.
- **App instance**: `apps/web/src/lib/analytics.ts` — the single instance.
- **Auto page views**: `shared/analytics-page-view.tsx`, mounted in Providers.

## Use it

```ts
import { analytics } from '@/lib/analytics';
analytics.track('image_liked', { id });     // anywhere in a feature
analytics.identify(user.id, { role: user.role });
```

Never call `gtag(...)` directly in a feature — go through `analytics`. That keeps
events identical across surfaces (dashboard + app) and the provider swappable.

## Switch to Google Analytics

1. Add your measurement id: `NEXT_PUBLIC_GA_MEASUREMENT_ID` (validated in `lib/env.ts`).
2. Load gtag.js once in `app/layout.tsx` (a `<Script>` tag with the id).
3. In `lib/analytics.ts`, build the instance from the Google adapter instead of
   the memory one (example is in that file). Nothing else changes.

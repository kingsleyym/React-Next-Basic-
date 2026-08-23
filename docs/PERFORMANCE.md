# Performance / Load times

Defaults that keep apps fast. Most are free if you follow the architecture.

## Rendering (Next.js / web)

- Prefer **Server Components**. Only add `'use client'` to components that truly
  need interactivity (state, events, browser APIs). Less client JS = faster load.
- Keep pages thin; push interactivity down to small client leaf components.
- Use **streaming** with `loading.tsx` / `<Suspense>` so content paints early.

## Code splitting

- Lazy-load heavy, below-the-fold or rarely-used pieces:
  `const QrScanner = dynamic(() => import('./qr-scanner'), { ssr: false })`.
- Heavy libs (charts, QR scanner, animation) must never be in the initial bundle.

## Data

- TanStack Query caches and de-duplicates — set sensible `staleTime` (already 60s).
- Prefetch predictable next data (`queryClient.prefetchQuery`) on hover/route
  intent.
- Subscribe (realtime) only where you need live data; otherwise normal queries.

## Images

- Use `next/image` for automatic resizing, lazy-loading and modern formats.
- Uploads go through `StorageService`; store the returned URL, render via
  `next/image`.

## SEO (the marketing site)

- Server-render content pages; set `metadata` per route (see `layout.tsx`).
- Add `generateMetadata`, `sitemap.ts`, `robots.ts` for content/blog routes.

## Bundle hygiene

- Import from package roots; avoid pulling a whole library for one helper.
- `lucide-react` icons are tree-shaken — import only the icons you use.
- Run `pnpm build` and watch the route/bundle sizes Next prints.

---
name: ui-builder
description: Adds or extends reusable components in @repo/ui using design tokens. Use when a needed UI primitive is missing from the catalog.
---

You maintain the design system in `packages/ui`. Read `docs/COMPONENTS.md` and
`docs/DESIGN-SYSTEM.md` first, and match the style of existing components
(`button.tsx`, `dialog.tsx`).

Rules:

- Only **surface-neutral primitives** go in `packages/ui` (Button, Input, Dialog,
  …), exported from `packages/ui/src/index.ts`, documented in `docs/COMPONENTS.md`.
  Surface-specific compositions (tables, sidebars, bottom-nav, cards) belong in the
  app (`apps/<app>/src/shared/components` or a feature) — see docs/ARCHITECTURE.md
  "UI layering". Promote to a shared package only on second use.
- Use semantic Tailwind classes that map to tokens (`bg-primary`,
  `text-muted-foreground`) — never hard-coded colors.
- Use `cn()` for class merging. Add `'use client'` only when the component uses
  hooks/state/events.
- Keep components presentational; no data fetching or provider imports inside
  `@repo/ui`.
- Provide loading/disabled/empty/error states where relevant (like `Button`,
  `DataTable`).

Finish with `pnpm typecheck` and update the catalog doc.

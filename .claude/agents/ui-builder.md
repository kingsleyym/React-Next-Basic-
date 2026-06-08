---
name: ui-builder
description: Adds or extends reusable components in @repo/ui using design tokens. Use when a needed UI primitive is missing from the catalog.
---

You maintain the design system in `packages/ui`. Read `docs/COMPONENTS.md` and
`docs/DESIGN-SYSTEM.md` first, and match the style of existing components
(`button.tsx`, `dialog.tsx`).

Rules:

- New primitives go in `packages/ui/src/components`, exported from
  `packages/ui/src/index.ts`, and documented in `docs/COMPONENTS.md`.
- Use semantic Tailwind classes that map to tokens (`bg-primary`,
  `text-muted-foreground`) — never hard-coded colors.
- Use `cn()` for class merging. Add `'use client'` only when the component uses
  hooks/state/events.
- Keep components presentational; no data fetching or provider imports inside
  `@repo/ui`.
- Provide loading/disabled/empty/error states where relevant (like `Button`,
  `DataTable`).

Finish with `pnpm typecheck` and update the catalog doc.

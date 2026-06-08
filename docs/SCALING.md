# Scaling a surface without sprawl

A real dashboard has many tabs; each tab has a page, maybe a fullscreen dialog,
maybe settings with sub-sections. Done naively that becomes thousands of huge
files. This is how the structure keeps it small and navigable — for you and for a
model that should never load more than a few files.

## The mental model

```
Surface (app)
└── Sections      ← the tabs / nav items     (one feature folder each)
    └── Views     ← a page, a dialog, a panel (one small component each)
        └── Parts ← rows, cards, fields       (tiny, single-purpose)
```

- **One section = one feature folder.** A tab is not a 1000-line file; it's a
  feature with the standard shape (`context.md`, `api/`, `hooks/`, `components/`).
- **Pages stay thin.** A route file just composes the section's components. Real
  markup/logic lives in small feature components.
- **Routing carries the structure**, so you don't hand-build navigation state.

## Folder layout for a big dashboard (App Router)

```
apps/<app>/src/
├── app/
│   └── (dashboard)/                 # route group = shared chrome (sidebar/topbar)
│       ├── layout.tsx               # nav/tabs once, renders <children>
│       ├── overview/page.tsx        # tab → thin page
│       ├── members/
│       │   ├── page.tsx             # list (thin)
│       │   └── [id]/page.tsx        # detail (thin)
│       ├── content/page.tsx
│       └── settings/
│           ├── layout.tsx           # settings sub-nav (tabs within a tab)
│           ├── profile/page.tsx
│           └── billing/page.tsx
└── features/
    ├── members/                     # the "members" tab's real code
    │   ├── components/ (member-table, member-detail, invite-dialog, …)
    │   ├── hooks/  api/  schema.ts  context.md
    ├── content/
    └── settings/
```

Each `page.tsx` is ~10–20 lines: import the feature components, arrange them. The
weight lives in `features/*`, split into many small files.

## Tabs / sections

- Top-level tabs = **route segments** under a shared `(dashboard)/layout.tsx`. The
  layout renders the nav once; switching tabs is just navigation. No giant
  switch-component.
- Sub-tabs (e.g. inside Settings) = a **nested `layout.tsx`** with its own small
  sub-nav. Settings never becomes one file — each sub-section is its own thin page
  + small feature component.
- For non-routed in-page tabs (no deep-link needed), use the `Tabs` primitive from
  `@repo/ui`.

## Fullscreen dialogs — two patterns, pick by need

| Need | Use | Why |
| ---- | --- | --- |
| Deep-linkable / shareable / back-button closes it | a **route** (`…/new/page.tsx` or a parallel/intercepting route) | it's really a screen; routing owns it |
| Transient, in-place (edit, confirm, quick form) | the `Dialog` primitive + `useDisclosure` | no URL needed, cheap |

Either way the dialog's body is a **feature component**, not inline JSX in the page.

## Lazy-load the heavy stuff

A section/dialog that's rarely opened or pulls a heavy lib (charts, QR scanner,
editor) is `dynamic()`-imported so it never bloats the initial load:

```tsx
const ChartsPanel = dynamic(() => import('@/features/analytics/components/charts-panel'));
```

See `docs/PERFORMANCE.md`.

## Mobile app equivalent

Same idea, different chrome: tabs = **bottom nav**, each tab = a screen
(feature), modals = sheets/dialogs. The feature folders are identical in shape —
only the navigation host differs.

## Size discipline (the rule that prevents monster files)

- **One file, one job.** A component that renders a table row, a form, a card —
  each its own file.
- **Split at ~150 lines.** If a component grows past it, extract sub-components
  and move logic into a hook. A page that isn't thin is a smell.
- **Logic in hooks, markup in components.** A 400-line component is almost always
  a hook + several small components waiting to be separated.
- **One feature folder per section**, each with its own `components/` — so "the
  members tab" is a directory of small files, never one screen file.

## Why this also saves tokens

A model edits "the invite dialog" by opening
`features/members/components/invite-dialog.tsx` — one small file — not a
2000-line page. Small, predictable files = small context = cheap, even for weak
models. This is the same thesis as `docs/AI-WORKFLOW.md`, applied to UI size.

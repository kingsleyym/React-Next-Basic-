# Design System (for the later redesign)

Design is fully separated from logic, so you can hand the look to a designer later
without touching a single feature.

Styling uses **Tailwind v4** (CSS-first — no `tailwind.config.js`).

## Two layers of styling

1. **Tokens + theme** (`packages/ui/src/tokens.css`) — one file. The raw HSL values
   in `:root` / `.dark` are the brand tokens; an `@theme inline` block maps them to
   Tailwind utilities (`bg-primary`, `text-muted-foreground`, `rounded-lg`,
   `animate-shimmer`, …). `inline` keeps the `var()` reference so dark mode swaps
   live. **Change the HSL values to re-skin the whole product.**
2. **Components** (`packages/ui`) — structure + behavior. They reference semantic
   classes only, so a token change flows through everything automatically.

Each app's `globals.css` does `@import "tailwindcss"; @import "@repo/ui/tokens.css";`
and an `@source` line so Tailwind scans the linked UI package for class names.

## Re-skinning (what a designer does later)

- Change brand colors → edit the HSL values in `tokens.css`. Done. Every Button,
  Card, Badge updates.
- Change roundness → edit `--radius`.
- Dark mode is wired via `@custom-variant dark` in `globals.css`; toggle the
  `.dark` class on `<html>`.

## Rules that keep design swappable

- Never hard-code a hex color in a component or page. Use semantic classes
  (`bg-primary`, `border-border`) which resolve to tokens.
- Keep **logic in hooks**, **markup in components**. A redesign should only touch
  className/markup, never hooks or data.
- New visual primitive → add it to `@repo/ui` using tokens, so it's themeable.

## Animation (opt-in, performance-safe)

- Small motions use the Tailwind keyframes defined in `tokens.css`
  (`animate-fade-in`, `animate-slide-up`, `animate-shimmer`) — zero JS, no bundle cost.
- For richer animation, add `framer-motion` **per app** and lazy-load the animated
  components so the initial load stays fast (see `docs/PERFORMANCE.md`). Keep
  animation in dedicated components, not mixed into logic.

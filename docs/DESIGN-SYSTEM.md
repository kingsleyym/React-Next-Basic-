# Design System (for the later redesign)

Design is fully separated from logic, so you can hand the look to a designer later
without touching a single feature.

## Three layers of styling

1. **Tokens** (`packages/ui/src/tokens.css`) — colors, radius as CSS variables,
   with a light + `.dark` theme. **Change these to re-skin the whole product.**
2. **Tailwind preset** (`packages/config/tailwind/preset.js`) — maps tokens to
   Tailwind classes (`bg-primary`, `text-muted-foreground`, …). Components use
   these semantic classes, never hard-coded colors.
3. **Components** (`packages/ui`) — structure + behavior. They reference semantic
   classes only, so a token change flows through everything automatically.

## Re-skinning (what a designer does later)

- Change brand colors → edit the HSL values in `tokens.css`. Done. Every Button,
  Card, Badge updates.
- Change roundness → edit `--radius`.
- Dark mode is already wired (`darkMode: 'class'`); toggle the `.dark` class on
  `<html>`.

## Rules that keep design swappable

- Never hard-code a hex color in a component or page. Use semantic classes
  (`bg-primary`, `border-border`) which resolve to tokens.
- Keep **logic in hooks**, **markup in components**. A redesign should only touch
  className/markup, never hooks or data.
- New visual primitive → add it to `@repo/ui` using tokens, so it's themeable.

## Animation (opt-in, performance-safe)

- Small motions use the Tailwind keyframes already in the preset
  (`animate-fade-in`, `animate-slide-up`) — zero JS, no bundle cost.
- For richer animation, add `framer-motion` **per app** and lazy-load the animated
  components so the initial load stays fast (see `docs/PERFORMANCE.md`). Keep
  animation in dedicated components, not mixed into logic.

<!--
TEMPLATE / HANDOFF CONTRACT. Fill this out wherever you brainstorm — Cowork, a
planning Skill, claude.ai on mobile, or Claude Code plan mode — then save the
result as `docs/plans/<name>.md`. It is the bridge between ideation and building:
everything thought through, so the build agents (feature-builder) can execute step
by step. Keep it concrete. See docs/plans/README.md.
-->

# Plan: <name>

## 1. Goal
<one or two sentences: what this is and why it exists>

## 2. Users & roles
<who uses it; which roles (user/admin) and what each may do>

## 3. Surfaces
<which app(s): web dashboard / store app / marketing site — see docs/PRODUCTS.md>

## 4. Core flows
1. <flow, e.g. "User opens gallery → likes an image → like count updates">
2. ...

## 5. Screens
For each screen: route, purpose, widgets (pick from docs/COMPONENTS.md), the
STATES it can be in, data needed, and actions.

### <Screen name> — `/<route>`
- **Purpose:** <…>
- **Widgets:** <Button, DataTable, Dialog, … — reuse the catalog; note new ones>
- **States:** loading (Skeleton/shimmer) · empty (EmptyState) · error (ErrorState) ·
  success (<your component>) · interaction (<e.g. Button loading on submit>)
- **Data:** <which entities/queries>
- **Actions:** <what the user can trigger; which mutations>

## 6. Data model
<entities + key fields + relationships. Each becomes a Zod entity + repository.>

- `<Entity>`: <fields>; relates to <…> by id

## 7. Backend needs
- Auth/roles: <yes/no, which>
- Storage (uploads): <yes/no>
- Notifications: <yes/no>
- Analytics events: <which track() events>

## 8. Open questions / decisions
<things still undecided — resolve before building>

## 9. Build steps (derived — hand these to feature-builder one at a time)
1. Entities: `/new-entity <x>` …
2. Repositories (+ wire in lib/backend.ts)
3. Feature(s): `/new-feature <x>` (creates context.md, api, hook, components, page)
4. Refine each screen's states from the catalog
5. Wire actions/mutations + analytics events
6. Verify: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`, then run it

## 10. Done criteria
<what "finished" means for v1>

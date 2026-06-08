# AGENTS.md — Read this first

> This is the universal entry point for **any** AI agent (Claude, DeepSeek, Cursor,
> Codex, Copilot, …). It exists so you do **not** have to explore the repo to
> understand it. Read this file + `MAP.md`, then go straight to the right file.
> Exploring the codebase wastes tokens — this file is the shortcut.

## What this repo is

A **monorepo foundation** for building React/Next apps. The whole point: common
building blocks (UI, auth, database, storage, notifications) are **already
defined**, so a feature request becomes _assembly from a known catalog_, not
invention. This keeps output consistent even for smaller/cheaper models.

## The golden rules (follow these or you will break conventions)

1. **Never invent a UI component.** Check `docs/COMPONENTS.md` first. If a Button,
   Input, Modal, ImageUpload, Toast, etc. exists in `packages/ui`, use it.
   Primitives live in `packages/ui`; surface-specific compositions (tables,
   bottom-nav, cards) live **in the app**. Don't add app-specific UI to `@repo/ui`.
2. **Never call Firebase/Supabase directly from a feature or page.** Always go
   through the interfaces in `packages/core` (`AuthService`, `DbService`,
   `StorageService`, `NotificationService`). The app must not know which provider
   is active. See `docs/DATA-LAYER.md`.
3. **Server state → TanStack Query. Client/UI state → Zustand.** Never put server
   data in Zustand or React state. See `docs/STATE-MANAGEMENT.md`.
4. **Every entity is a Zod schema** in `packages/core/src/entities`. Types are
   inferred from Zod — one source of truth. Never hand-write a parallel type.
5. **Follow the recipes.** To build a feature, open `docs/RECIPES.md` and follow
   the matching recipe step by step. Do not improvise structure.
6. **Match the existing code.** Same naming, same file layout, same imports as the
   `auth` feature (the reference implementation in `apps/web/src/features/auth`).
7. **Read context before editing a feature; update it after.** Each feature has a
   `context.md` (its purpose, its dashboard↔app counterpart, the reasons behind
   it). Read it first so you don't break a cross-surface decision; update it when
   you change the feature. Cross-app relationships are in `docs/PRODUCTS.md`.

## Where to look (do not grep blindly — use this)

| I need to…                          | Read / edit                                  |
| ----------------------------------- | -------------------------------------------- |
| Understand the layout               | `MAP.md`                                      |
| Know which apps exist & how related | `docs/PRODUCTS.md`                            |
| Work on a feature (context first)   | that feature's `context.md`                   |
| Pick a UI component / hook          | `docs/COMPONENTS.md` → `packages/ui`          |
| Build a new feature                 | `docs/RECIPES.md` → "New CRUD feature"        |
| Add a dashboard tab / keep UI small | `docs/SCALING.md`                             |
| Add/change a data model             | `packages/core/src/entities`                  |
| Read/write data                     | `packages/core/src/repositories`              |
| Switch Firebase ↔ Supabase          | `docs/BACKEND-PROVIDERS.md`                   |
| Auth / login / roles                | `docs/AUTH.md`                                |
| State management rules              | `docs/STATE-MANAGEMENT.md`                    |
| Naming / file conventions           | `docs/CONVENTIONS.md`                         |
| The big picture / layers            | `docs/ARCHITECTURE.md`                        |
| Make it fast                        | `docs/PERFORMANCE.md`                         |
| Work token-efficiently              | `docs/AI-WORKFLOW.md`                         |

## Commands

```bash
pnpm install        # install everything (run once)
pnpm dev            # run all apps in dev
pnpm build          # build everything
pnpm typecheck      # type-check every package (run before you say "done")
pnpm lint           # lint
```

## Definition of done (check before finishing)

- [ ] Used existing components/hooks from `packages/ui` (nothing reinvented)
- [ ] All data access goes through `packages/core` interfaces
- [ ] Server state uses TanStack Query; UI state uses Zustand
- [ ] New/changed entities are Zod schemas
- [ ] `pnpm typecheck` passes
- [ ] Followed the matching recipe in `docs/RECIPES.md`

# AI Workflow — work with any model, spend few tokens

This repo is built so you do **not** load the whole codebase into a model's
context. You give it a few small files and it already knows how to work.

## The core idea

Token cost ≈ how much you put in the context window. A 1M context is possible but
absurdly expensive and slow. You almost never need more than a few thousand
tokens if the project is predictable. This repo makes it predictable.

## Brainstorming happens outside; only the plan comes in

Open-ended ideation/research is cheaper and better in a dedicated tool (Cowork, a
planning Skill, mobile, plan mode) — not by loading this repo. Do it there, produce
a plan in the `docs/_templates/feature-plan.md` shape, drop it in `docs/plans/`, and
the build agents here read that one small file. See `docs/plans/README.md`.

## What to load, per task (the minimum context)

| Task                         | Load ONLY these                                                            |
| ---------------------------- | -------------------------------------------------------------------------- |
| Anything (always)            | `AGENTS.md` + `MAP.md` (~small, the index)                                  |
| Build a UI screen            | + `docs/COMPONENTS.md` + the one feature folder you're editing             |
| Build a new feature          | + `docs/RECIPES.md` ("New CRUD feature") + `features/auth` as the example  |
| Add/change a model           | + `docs/DATA-LAYER.md` + the entity & repository files                     |
| Switch backend provider      | + `docs/BACKEND-PROVIDERS.md` + `apps/web/src/lib/backend.ts`              |
| Auth / login work            | + `docs/AUTH.md` + `features/auth`                                          |

Do **not** paste the whole repo. The "Where to look" table in `AGENTS.md` tells
the model exactly which 1–3 files matter.

## How to start a session in any tool (Claude, DeepSeek, Cursor, Copilot…)

1. Most tools auto-read `AGENTS.md` (and Claude also `CLAUDE.md`). If a tool does
   not, paste this one line:
   > "Read AGENTS.md and MAP.md first, follow the rules and the matching recipe in
   > docs/. Do not load files that aren't listed in the 'Where to look' table."
2. State the task in the project's own words:
   > "New feature `coupons` (list + create form), follow the New CRUD recipe."
3. The model assembles from the catalog + recipe. It should not invent components,
   touch providers directly, or duplicate types.

## Habits that cut tokens hard

- **Point, don't paste.** Reference `docs/RECIPES.md` and `features/auth` by path
  instead of pasting code; capable tools open files on demand.
- **One task per session.** Smaller scope = smaller context = cheaper + better.
- **Reuse the recipe names.** "Follow the Form recipe" is cheaper and clearer than
  re-describing forms every time.
- **Let conventions do the talking.** Because naming/structure are fixed, the
  model doesn't need examples for "where things go" — it's in `MAP.md`.
- **Use a small model for routine** (scaffolding a feature, a form, a table) and a
  bigger model only for genuinely hard design decisions.

## For Claude Code specifically

- Subagents in `.claude/agents/` (feature-builder, backend-adapter, ui-builder,
  reviewer) run with their own focused context — delegate routine work to them so
  your main session stays small.
- Slash commands in `.claude/commands/` (`/new-feature`, `/new-entity`,
  `/swap-provider`) encode the recipes so you type one line instead of explaining.

## Definition of done (any model)

`pnpm typecheck` passes · used existing `@repo/ui` components · data access via
`@repo/core` only · server state in TanStack Query · entities are Zod schemas ·
followed the matching recipe.

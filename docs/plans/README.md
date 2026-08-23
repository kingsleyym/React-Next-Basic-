# Plans

This folder holds one **plan file per app/feature** — the handoff artifact between
*ideation* and *building*. It is the bridge between two tools used for two phases:

```
Brainstorm / research / ideation        Build the code
(Cowork, a planning Skill, mobile,  →   (Claude Code, here)
 or Claude Code plan mode)
        │                                       ▲
        └────────  docs/plans/<name>.md  ───────┘
                   (the plan file = the contract)
```

## Why split it this way

- **Ideation** benefits from a dedicated, research-capable, on-the-go tool
  (**Cowork** loads Skills and plans before executing; strong planning Skills pull
  ideas out of you and can do web research). Claude Code is optimized for building
  in the repo, not open-ended brainstorming.
- **Building** stays in Claude Code, where the foundation and the build agents
  (`feature-builder`, `reviewer`) and verify gates live.
- The only hard requirement: the plan must arrive in the shape of
  `docs/_templates/feature-plan.md`, so the build agents can execute it directly.

## The workflow

1. **Brainstorm** wherever you like. Give the tool `docs/_templates/feature-plan.md`
   as the required output structure, then think through screens, widgets, **states**,
   data and flows with it (let it ask you counter-questions).
2. **Save** the finished plan here as `docs/plans/<name>.md`.
3. **Build** in Claude Code, one step at a time, from the plan's "Build steps":
   `/new-entity …` → `/new-feature …` (the `feature-builder` copies the relevant
   parts into each feature's `context.md`).
4. **Check & verify:** `reviewer` / `/code-review`, then
   `pnpm typecheck && pnpm lint && pnpm test && pnpm build`, then run the app.

## Notes

- A plan is the *source of truth for intent*; a feature's `context.md` is the
  *living memory* once it's built. Keep both honest.
- You can also plan inside Claude Code via plan mode / Ultraplan if you're not in
  Cowork — same output file, same contract.

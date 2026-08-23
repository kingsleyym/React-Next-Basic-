# CLAUDE.md

This project uses a vendor-neutral agent guide. **Read [`AGENTS.md`](./AGENTS.md)
first**, then [`MAP.md`](./MAP.md). All rules, the file map, the component catalog,
and the recipes live there and in `docs/`.

Claude-specific notes:

- Subagents are defined in `.claude/agents/` (feature-builder, backend-adapter,
  ui-builder, reviewer). Delegate routine work to them to save tokens.
- Slash commands are in `.claude/commands/` (`/new-feature`, `/new-entity`,
  `/swap-provider`).
- Before exploring with grep/read, check the "Where to look" table in `AGENTS.md`.
  The answer is almost always already mapped.

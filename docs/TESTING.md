# Testing

Vitest, configured at the root (`vitest.config.ts`). Pure logic runs in the node
environment; the **memory adapters** mean tests need no real backend.

## Run

```bash
pnpm test            # run all *.test.ts once
pnpm exec vitest     # watch mode
```

CI runs `pnpm test` on every push/PR (`.github/workflows/ci.yml`).

## What to test (and the pattern)

Prioritise logic that's easy to get wrong and cheap to test:

- **Repositories** — build one on `createMemoryBackend().db` and assert reads/writes.
  See `packages/core/src/repositories/user.repository.test.ts`.
- **Entities** — `schema.parse(...)` accepts valid / rejects invalid data.
- **Utils / pure functions** — e.g. `packages/ui/src/lib/cn.test.ts`.

Place a test next to its subject as `<name>.test.ts`. Keep tests small and focused
(one behavior per `it`). For component/DOM tests, add `jsdom` + Testing Library to
that package and set the test `environment` to `jsdom`.

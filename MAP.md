# MAP.md — Where everything lives

> The anti-search index. Find the file here instead of grepping the repo.

```
react-next-basic/
├── AGENTS.md            # universal agent guide — READ FIRST
├── CLAUDE.md            # Claude-specific pointer to AGENTS.md
├── MAP.md               # this file
│
├── docs/                # all knowledge (the "why" and "how")
│   ├── ARCHITECTURE.md       # layers, data flow, dependency rules, UI layering
│   ├── PRODUCTS.md           # registry: which apps/surfaces exist & how they relate
│   ├── _templates/           # feature-context.md template
│   ├── SCALING.md            # big dashboards/apps: tabs, pages, dialogs, settings — kept small
│   ├── CONVENTIONS.md        # naming, file layout, imports, git, file-size rules
│   ├── COMPONENTS.md         # CATALOG: every UI component + hook + its props
│   ├── RECIPES.md            # COOKBOOK: step-by-step to build common things
│   ├── STATE-MANAGEMENT.md   # TanStack Query (server) + Zustand (client)
│   ├── AUTH.md               # login flows, sessions, roles/RBAC
│   ├── DATA-LAYER.md         # entities, repositories, adapters, normalization
│   ├── BACKEND-PROVIDERS.md  # Firebase ↔ Supabase swap guide
│   ├── DESIGN-SYSTEM.md      # tokens, theming, animation (for later redesign)
│   ├── PERFORMANCE.md        # load-time playbook
│   └── AI-WORKFLOW.md        # how to work token-efficiently with any agent
│
├── .claude/
│   ├── agents/          # specialized subagents
│   └── commands/        # slash commands for repeated workflows
│
├── packages/            # shared, reused by every app
│   ├── core/            # PROVIDER-NEUTRAL backend (the heart)
│   │   └── src/
│   │       ├── auth/            # AuthService interface + firebase/supabase adapters
│   │       ├── db/             # DbService interface + adapters
│   │       ├── storage/        # StorageService interface + adapters (file/image upload)
│   │       ├── notifications/  # NotificationService interface + adapters (push)
│   │       ├── entities/       # Zod schemas = single source of truth for models
│   │       ├── repositories/   # data access (UserRepository, BaseRepository)
│   │       ├── backend.ts      # createBackend('firebase'|'supabase') factory
│   │       └── index.ts        # public exports
│   ├── ui/              # design system: components + hooks + tokens
│   │   └── src/
│   │       ├── components/     # Button, Input, Modal, ImageUpload, Toast, ...
│   │       ├── hooks/          # useToast, useDisclosure, useUpload, ...
│   │       ├── tokens.css      # design tokens (CSS variables)
│   │       └── index.ts
│   └── config/          # shared eslint / tsconfig / tailwind presets
│
└── apps/
    ├── web/             # Next.js (App Router) — dashboard + SEO reference
    │   ├── CLAUDE.md         # app-specific agent notes
    │   └── src/
    │       ├── app/          # routes (App Router)
    │       ├── features/     # feature modules (auth = reference implementation)
    │       ├── shared/       # app-level shared bits (providers, layout)
    │       └── lib/          # app singletons (backend instance, query client)
    └── native/          # (planned) Vite + React + Capacitor app — see docs/ARCHITECTURE.md
```

## Quick "where do I put…" answers

- A reusable button/input/modal → it already exists in `packages/ui`. Reuse it.
- A new data model → `packages/core/src/entities/<name>.ts` (Zod schema).
- Reading/writing that model → `packages/core/src/repositories/<name>.repository.ts`.
- A screen/page → `apps/web/src/app/<route>/page.tsx` (thin) that renders a feature.
- Feature logic → `apps/web/src/features/<feature>/` (components, hooks, api).
- Something used across features in one app → `apps/web/src/shared/`.
- Something used across multiple apps → a `packages/*` package.

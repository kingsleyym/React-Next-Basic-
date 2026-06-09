# Products & Surfaces

> The registry that survives time. After a long break, read this to remember which
> apps exist, how they relate, and **where each feature's counterpart lives**. A
> model forgets everything between sessions — this file does not. Keep it updated.

A **product** is one business idea. It can have several **surfaces** (apps):
a dashboard, a consumer app, a marketing site. Surfaces are separate apps but
share one **domain** in `packages/core` — that shared domain is what links a
feature in the app to its counterpart in the dashboard.

---

## Product: Starter (the reference app)

| Surface | App | Stack | Purpose |
| ------- | --- | ----- | ------- |
| Web     | `apps/web` | Next.js (App Router) | Reference app: auth (login, guard, header), members (protected dashboard), gallery/stats demo. |

Shared domain in `core`: `User`, `Image`. Single surface for now.

> `apps/web` exists to demonstrate the patterns. Copy it, or strip its
> `features/*` to start a real product. Nothing else depends on its demo content.

---

## Pattern: a multi-surface product (how to add one — not built yet)

When you start a product with a separated dashboard **and** app, create them as
sibling apps that share the same `core` domain. Example layout:

```
apps/<product>-dashboard/   # Next.js — admin
apps/<product>-app/         # Vite + React + Capacitor — store app
packages/core/              # shared entities + repositories + services (the link)
```

Record it here with a **counterpart table** so the app↔dashboard relationship is
never lost:

| Capability   | Dashboard side                  | App side                        | Shared in `core`        |
| ------------ | ------------------------------- | ------------------------------- | ----------------------- |
| _(example)_  | `features/broadcast` (sends)    | `features/inbox` (reads)        | `Notification` entity/service |

> The rule: a feature exists "this way on this surface because it is the
> counterpart of the other surface, joined through the shared domain." Write that
> down here and in the feature's `context.md` the moment you build it.

---

## How to keep this alive

- Add a product/surface here the moment you create it.
- Every feature also has a local `context.md` (see `docs/_templates/feature-context.md`).
- Scaling one surface (many tabs/pages/dialogs/settings) without sprawl is covered
  in `docs/SCALING.md`.

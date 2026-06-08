# Products & Surfaces

> The registry that survives time. After a long break, read this to remember which
> apps exist, how they relate, and **where each feature's counterpart lives**. A
> model forgets everything between sessions — this file does not.

A **product** is one business idea. It can have several **surfaces** (apps):
a dashboard, a consumer app, a marketing site. Surfaces are separate apps but
share one **domain** in `packages/core` — that shared domain is what links a
feature in the app to its counterpart in the dashboard.

---

## Product: Starter (reference)

| Surface | App | Stack | Purpose |
| ------- | --- | ----- | ------- |
| Web     | `apps/web` | Next.js | Marketing/SEO + admin dashboard + gallery demo |

Shared domain in `core`: `User`, `Image`. No second surface yet.

---

## Product: Loyalty (example multi-surface product)

A points/loyalty product with a **separated** dashboard and store app.

| Surface   | App | Stack | Purpose |
| --------- | --- | ----- | ------- |
| Dashboard | `apps/loyalty-dashboard` | Next.js | Admin: send notifications, manage |
| App       | `apps/loyalty-app` | Vite + React + Capacitor | Customer app, goes to the store |

Shared domain in `core`: `Notification` (entity + repository + `NotificationService`).

### Feature counterparts (the app ↔ dashboard map)

| Capability    | Dashboard side                         | App side                            | Shared in `core`            |
| ------------- | -------------------------------------- | ----------------------------------- | --------------------------- |
| Notifications | `features/broadcast` (admin **sends**) | `features/inbox` (customer **reads**) | `Notification`, `NotificationService` |

> Read this table before touching either side. It answers "why is it built this
> way here?" → because it is the counterpart of the other surface, joined through
> the shared domain. Keep it updated when you add a capability.

---

## How to keep this alive

- Add a product/surface here the moment you create it.
- Every feature also has a local `context.md` (see `docs/_templates/feature-context.md`)
  describing its own counterpart relationship and the reasons behind it.

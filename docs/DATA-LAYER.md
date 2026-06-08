# Data Layer

Three concepts: **Entity** (the shape), **Repository** (how to read/write it),
**DbService** (the provider-neutral database). Features only ever touch
repositories.

## 1. Entity = Zod schema (single source of truth)

`packages/core/src/entities/<name>.ts`:

```ts
export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  priceCents: z.number().int().nonnegative(),
  createdAt: z.string().datetime().optional(),
});
export type Product = z.infer<typeof productSchema>;
export const parseProduct = (d: unknown): Product => productSchema.parse(d);
```

The type is **inferred** — never write a separate `interface Product`. Validation,
normalization and types all come from this one schema.

## 2. Repository = read/write for one entity

`packages/core/src/repositories/<name>.repository.ts`:

```ts
export class ProductRepository extends BaseRepository<Product> {
  constructor(db: DbService) {
    super(db, 'products', productSchema);
  }
  // add entity-specific queries here, e.g. findByCategory(...)
}
```

`BaseRepository` already gives `findById`, `findAll`, `create`, `update`,
`remove`, `subscribe`. Every row is `schema.parse`d on the way out → bad data
never reaches the UI. **This is the normalization boundary.**

## 3. DbService = the provider-neutral database

The interface (`get/list/create/update/remove/subscribe`) is implemented by the
memory/Firebase/Supabase adapters. A repository calls `this.db.*` and never knows
which one is active.

## Normalization rules

- Keep entities **flat**. Reference other entities by id (`ownerId`), don't nest
  full objects.
- Map provider rows → your entity **inside the adapter/repository** (via Zod), so
  provider quirks (Firestore Timestamps, Supabase snake_case) never leak.
- The TanStack Query cache holds the normalized result; don't copy it elsewhere.

## Adding a new model (summary)

1. Add the Zod schema in `entities/`.
2. Export it from `entities/index.ts`.
3. Add a repository in `repositories/` and export it from `core/src/index.ts`.
4. Instantiate it in `apps/web/src/lib/backend.ts`.
   (The `/new-entity` command and `feature-builder` agent do all four.)

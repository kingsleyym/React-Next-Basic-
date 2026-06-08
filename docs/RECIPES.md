# Recipes (Cookbook)

Step-by-step assembly from the catalog. Follow the matching recipe instead of
improvising — that's what keeps output consistent across any model. The reference
implementation for all of this is `apps/web/src/features/auth`.

---

## Recipe: New CRUD feature (e.g. "products")

1. **Entity** — `packages/core/src/entities/product.ts`: Zod schema + inferred
   type + `parseProduct`. Export from `entities/index.ts`.
2. **Repository** — `packages/core/src/repositories/product.repository.ts`
   extending `BaseRepository<Product>`. Export from `core/src/index.ts`.
3. **Instance** — in `apps/web/src/lib/backend.ts`:
   `export const productRepository = new ProductRepository(backend.db);`
4. **Feature folder** — `apps/web/src/features/products/`:
   - `api/products.api.ts` — thin calls to `productRepository`.
   - `hooks/use-products.ts` — `useQuery(['products'], ...)` + mutations that
     `invalidateQueries(['products'])`.
   - `components/product-list.tsx` — `DataTable` + `EmptyState` + `Skeleton`.
   - `components/product-form.tsx` — RHF + Zod (see form recipe).
5. **Page** — `apps/web/src/app/products/page.tsx`: thin, renders the feature.

> `/new-feature products` (slash command) or the `feature-builder` agent does all
> of this for you.

---

## Recipe: Add a dashboard section / tab (keep it small)

See `docs/SCALING.md` for the full model. Steps:

1. Add a route segment under the dashboard's route group:
   `apps/<app>/src/app/(dashboard)/<section>/page.tsx` — **thin** (compose only).
2. Create the feature `apps/<app>/src/features/<section>/` (standard shape:
   `context.md`, `api/`, `hooks/`, `components/`). Real code lives here, in small
   files (one component = one job, split at ~150 lines).
3. Add the tab to the shared `(dashboard)/layout.tsx` nav.
4. Sub-tabs (e.g. Settings): add a nested `layout.tsx` with a small sub-nav and one
   thin page per sub-section.
5. Lazy-load heavy panels with `dynamic()`.

## Recipe: Fullscreen dialog

- Deep-linkable (shareable URL, back closes it) → make it a **route**
  (`…/new/page.tsx` or a parallel/intercepting route).
- Transient (edit/confirm/quick form) → `Dialog` primitive + `useDisclosure`.
- Either way the dialog body is a **feature component**, not inline page JSX.

---

## Recipe: Form with validation

1. Schema in the feature's `schema.ts` (Zod).
2. `useForm({ resolver: zodResolver(schema) })`.
3. Each field wrapped in `<FormField label error={errors.x?.message}>` with an
   `<Input invalid={!!errors.x} {...register('x')} />`.
4. Submit button: `<Button loading={mutation.isPending}>`.
5. On error: `toast({ variant: 'error', ... })`. On success: `toast` + navigate.

Copy `features/auth/components/login-form.tsx`.

---

## Recipe: Image upload

```tsx
const [url, setUrl] = useState(entity.imageUrl);
<ImageUpload
  storage={backend.storage}
  pathFor={(file) => `products/${productId}/${file.name}`}
  value={url}
  onUploaded={(uploadedUrl) => {
    setUrl(uploadedUrl);
    updateProduct.mutate({ imageUrl: uploadedUrl });
  }}
/>;
```

Works the same whether storage is memory, Firebase or Supabase.

---

## Recipe: Protected / admin page

```tsx
const { status, isAdmin } = useAuth();
useEffect(() => {
  if (status === 'unauthenticated') router.replace('/login');
  else if (status === 'authenticated' && !isAdmin) router.replace('/');
}, [status, isAdmin]);
```

---

## Recipe: Realtime list (e.g. live POS points)

```tsx
useEffect(() => {
  return pointsRepository.subscribe({ where: [{ field: 'userId', op: 'eq', value: id }] },
    (items) => queryClient.setQueryData(['points', id], items));
}, [id]);
```

The repository's `subscribe` is provider-neutral (Firestore onSnapshot / Supabase
realtime / memory) — your component code is identical for all three.

---

## Recipe: Send a notification (dashboard → app)

```ts
await backend.notifications.send({
  topic: 'all-users',
  title: 'New menu item!',
  body: 'Check out today’s special.',
});
```

Sending real pushes happens in a trusted/server context; wire the provider in
`backend.ts` (FCM for Firebase, web-push/Edge function for Supabase).

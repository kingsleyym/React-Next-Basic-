# State Management

One rule decides everything: **is this data owned by the server or by the UI?**

| Kind of state                  | Tool            | Example                          |
| ------------------------------ | --------------- | -------------------------------- |
| Server data (from the backend) | TanStack Query  | users, points, orders, blog post |
| Client/UI state                | Zustand         | current user, theme, sidebar open |
| Form state                     | React Hook Form | inputs, validation               |
| Pure local state               | `useState`      | a single toggle inside one component |

Never store server data in Zustand or `useState`. Never fetch in `useEffect`.

## Server state — TanStack Query

Read:

```ts
const usersQuery = useQuery({
  queryKey: ['users'],
  queryFn: () => userRepository.findAll(),
});
```

Write + refresh:

```ts
const queryClient = useQueryClient();
const create = useMutation({
  mutationFn: (data) => userRepository.create(data),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
});
```

- `queryKey` is the cache identity. List → `['users']`. One item → `['users', id]`.
- Query keys ARE the normalization: cache once, reuse everywhere. Don't copy data
  into another store.
- Realtime (e.g. the POS points stream): subscribe via the repository and push
  into the cache with `queryClient.setQueryData`.

## Client state — Zustand

Tiny stores in `apps/web/src/shared/stores/`. Example: `auth.store.ts` holds the
current user + status. Keep stores small and UI-focused.

```ts
const user = useAuthStore((s) => s.user); // select only what you need
```

## Forms — React Hook Form + Zod

The Zod schema is the single source of truth for both validation and the form's
TypeScript type. See `features/auth/components/login-form.tsx` and the recipe in
`docs/RECIPES.md`.

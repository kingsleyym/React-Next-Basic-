# Component Catalog (`@repo/ui`)

> The menu. Before building any UI, pick from here. Import everything from
> `@repo/ui`.

## What belongs in `@repo/ui` vs. an app (important)

**Primitives are shared, compositions are local.** `@repo/ui` holds only
surface-neutral primitives + tokens (a button is a button for both a dashboard and
a mobile app). Surface-specific compositions live **in the app that uses them**:

- Dashboard-typical (tables, sidebars, charts) → `apps/<app>/src/shared/components`.
  Example: `apps/web/src/shared/components/data-table.tsx`.
- App-typical (bottom nav, swipe cards, image cards) → that app's `features/`.
  Example: `apps/web/src/features/gallery/components/image-card.tsx`.

Promote a composition into a shared package **only when a second app actually
needs it** ("share on second use", never on spec). See docs/ARCHITECTURE.md.

## Components

| Component                         | Key props                                                       | Use for                                  |
| --------------------------------- | --------------------------------------------------------------- | ---------------------------------------- |
| `Button`                          | `variant` (primary/secondary/outline/ghost/destructive), `size` (sm/md/lg/icon), `loading`, `leftIcon`, `rightIcon` | Any action. Has built-in loading spinner + disabled. |
| `Spinner`                         | `size`, `className`                                             | Inline loading indicator.                |
| `Input`                           | `invalid`, all `<input>` props                                  | Text fields.                             |
| `Textarea`                        | `invalid`                                                       | Multiline text.                          |
| `Label`                           | `<label>` props                                                | Field labels.                            |
| `FormField`                       | `label`, `error`, `hint`, `required`, `htmlFor`                 | Wrap an input with label + error (RHF).  |
| `Card` + `CardHeader/Title/Description/Content/Footer` | —                                          | Content container.                       |
| `Badge`                           | `variant` (default/primary/success/destructive/outline)        | Status pills (role, state).              |
| `Avatar`                          | `src`, `name`, `size`                                           | User picture w/ initials fallback.       |
| `Skeleton`                        | `variant` (pulse/shimmer), `className`                          | Loading placeholders. `shimmer` = sliding-light effect. |
| `EmptyState`                      | `icon`, `title`, `description`, `action`                        | Empty lists/sections.                    |
| `Dialog`                          | `open`, `onClose`, `title`, `description`, `footer`             | Modals. Pair with `useDisclosure`.       |
| `ImageUpload`                     | `storage`, `pathFor`, `onUploaded`, `value`, `maxSizeMb`        | Drag-drop image upload w/ preview + progress. |
| `Pagination`                      | `page`, `pageCount`, `canPrev/Next`, `onPrev/Next`             | Pager. Pair with `usePagination`.        |
| `Tabs` + `TabsList/Trigger/Content` | `defaultValue`, `value`                                       | Tabbed sections.                         |
| `ToastProvider` + `useToast`      | `toast({ title, description?, variant })`                      | Notifications. Provider already mounted. |

> `DataTable` is **not** a shared primitive — it's a dashboard-local composition at
> `apps/web/src/shared/components/data-table.tsx` (built from the shared `Skeleton`
> + `EmptyState`). Copy that pattern in a dashboard; don't put it in `@repo/ui`.

## Hooks

| Hook             | Signature                                                        | Use for                          |
| ---------------- | --------------------------------------------------------------- | -------------------------------- |
| `useToast`       | `{ toast, dismiss }`                                            | Fire toasts from anywhere.       |
| `useDisclosure`  | `(initial?) → { isOpen, open, close, toggle }`                 | Modal/drawer open state.         |
| `useDebounce`    | `(value, delay?) → debouncedValue`                            | Search inputs, expensive effects.|
| `usePagination`  | `({ total, pageSize?, initialPage? }) → { page, offset, ... }` | Client-side paging.              |
| `useUpload`      | `({ storage, pathFor, maxSizeMb?, accept? }) → { upload, progress, uploading, error }` | Custom upload UIs. |

## Examples

```tsx
// Button with loading
<Button loading={mutation.isPending} onClick={save}>Save</Button>

// Modal
const dialog = useDisclosure();
<Button onClick={dialog.open}>Edit</Button>
<Dialog open={dialog.isOpen} onClose={dialog.close} title="Edit" footer={<Button onClick={dialog.close}>Done</Button>}>
  ...
</Dialog>

// Image upload (backend-agnostic)
<ImageUpload
  storage={backend.storage}
  pathFor={(f) => `avatars/${user.id}-${f.name}`}
  value={user.avatarUrl}
  onUploaded={(url) => updateProfile({ avatarUrl: url })}
/>

// Toast
const { toast } = useToast();
toast({ title: 'Saved', variant: 'success' });
```

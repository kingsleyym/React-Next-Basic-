# Backend Providers (Firebase ↔ Supabase ↔ memory)

The whole app depends on four interfaces in `@repo/core`: `AuthService`,
`DbService`, `StorageService`, `NotificationService`. A "backend" is just a bundle
of those four. **Switching providers = building a different bundle in ONE file:**
`apps/web/src/lib/backend.ts`. No feature, page or component changes.

## Default: memory (zero config)

```ts
export const backend = createMemoryBackend({ seedUsers: [...] });
```

Runs everywhere, great for dev/tests. No real persistence.

## Switch to Firebase

1. Install the SDK in the app: `pnpm --filter web add firebase`.
2. Edit `apps/web/src/lib/backend.ts`:

```ts
import { initializeApp } from 'firebase/app';
import { createFirebaseAuth } from '@repo/core/src/auth/adapters/firebase.auth';
import { createFirebaseDb } from '@repo/core/src/db/adapters/firebase.db';
import { createFirebaseStorage } from '@repo/core/src/storage/adapters/firebase.storage';

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  // ...
});

export const backend: Backend = {
  auth: createFirebaseAuth(app),
  db: createFirebaseDb(app),
  storage: createFirebaseStorage(app),
  notifications: /* createFirebaseMessaging(app) — add when needed */ memoryNotifications,
};
```

## Switch to Supabase

1. `pnpm --filter web add @supabase/supabase-js`.
2. Edit `backend.ts`:

```ts
import { createClient } from '@supabase/supabase-js';
import { createSupabaseAuth } from '@repo/core/src/auth/adapters/supabase.auth';
import { createSupabaseDb } from '@repo/core/src/db/adapters/supabase.db';
import { createSupabaseStorage } from '@repo/core/src/storage/adapters/supabase.storage';

const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const backend: Backend = {
  auth: createSupabaseAuth(client),
  db: createSupabaseDb(client),
  storage: createSupabaseStorage(client, 'public'),
  notifications: memoryNotifications,
};
```

## Why the adapters live under `adapters/` and aren't compiled by default

They import a provider SDK that you only install when you actually use that
provider. They're excluded from the default typecheck (`core/tsconfig.json`) so
the repo builds with zero provider dependencies. The moment you install the SDK
and import the adapter in `backend.ts`, it works.

## Mapping notes

- Each adapter maps the provider's user/row → our entity (see `toUser`), and maps
  provider errors → `AppError`. Keep that mapping correct and the rest of the app
  never needs to know which provider is live.
- Enforce real security in the provider (Firestore Rules / Supabase RLS). The
  client interfaces are not a security boundary.

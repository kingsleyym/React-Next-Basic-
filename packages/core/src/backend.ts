import type { AuthService, SignUpInput } from './auth/auth.service';
import type { DbService } from './db/db.service';
import type { StorageService } from './storage/storage.service';
import type { NotificationService } from './notifications/notification.service';
import { createMemoryAuth } from './auth/memory.auth';
import { createMemoryDb } from './db/memory.db';
import { createMemoryStorage } from './storage/memory.storage';
import { createMemoryNotifications } from './notifications/memory.notifications';

/**
 * The backend is a BUNDLE of the four provider-neutral services. The app holds a
 * single `Backend` instance (see apps/web/src/lib/backend.ts) and passes its
 * services into repositories. Nothing else knows which provider is behind it.
 *
 * To use a real provider, build a bundle from the matching adapters instead of
 * the memory ones — the adapters live in `src/<area>/adapters/` and the swap is
 * documented in docs/BACKEND-PROVIDERS.md. Because this is plain dependency
 * injection, swapping providers touches ONLY this assembly, never your features.
 */
export interface Backend {
  auth: AuthService;
  db: DbService;
  storage: StorageService;
  notifications: NotificationService;
}

export interface MemoryBackendOptions {
  seedUsers?: SignUpInput[];
}

/** Zero-config backend that runs everywhere. Default for dev and tests. */
export function createMemoryBackend(options?: MemoryBackendOptions): Backend {
  return {
    auth: createMemoryAuth(options?.seedUsers),
    db: createMemoryDb(),
    storage: createMemoryStorage(),
    notifications: createMemoryNotifications(),
  };
}

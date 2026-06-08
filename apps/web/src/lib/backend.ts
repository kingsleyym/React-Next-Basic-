import { createMemoryBackend, UserRepository, type Backend } from '@repo/core';

/**
 * THE single backend instance for this app. This is the ONE place that decides
 * which provider is active. To switch to Firebase or Supabase, build the bundle
 * from those adapters here instead of `createMemoryBackend` — nothing else in the
 * app changes. See docs/BACKEND-PROVIDERS.md.
 *
 * Example (Firebase):
 *   import { initializeApp } from 'firebase/app';
 *   import { createFirebaseAuth } from '@repo/core/src/auth/adapters/firebase.auth';
 *   const app = initializeApp({ ...env });
 *   export const backend = { auth: createFirebaseAuth(app), db: ..., ... };
 */
export const backend: Backend = createMemoryBackend({
  seedUsers: [{ email: 'demo@example.com', password: 'password', name: 'Demo User' }],
});

// Repositories built on the active backend's db service.
export const userRepository = new UserRepository(backend.db);

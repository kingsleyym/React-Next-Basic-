import {
  createMemoryBackend,
  UserRepository,
  ImageRepository,
  type Backend,
} from '@repo/core';

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
  seedUsers: [
    { email: 'demo@example.com', password: 'password', name: 'Demo User' },
    { email: 'luca@test.com', password: 'passwort', name: 'Luca' },
  ],
});

// Repositories built on the active backend's db service.
// ... rest of code ...

// Repositories built on the active backend's db service.
export const userRepository = new UserRepository(backend.db);
export const imageRepository = new ImageRepository(backend.db);

// Demo seed data so the gallery has content out of the box (memory backend only).
// The memory db writes synchronously, so this is ready before the first query.
const SEED_IMAGES = [
  { title: 'Sunset Pier', authorName: 'Mara', likes: 128 },
  { title: 'Mountain Fog', authorName: 'Jonas', likes: 87 },
  { title: 'City Lights', authorName: 'Aylin', likes: 203 },
  { title: 'Desert Road', authorName: 'Theo', likes: 64 },
  { title: 'Ocean Calm', authorName: 'Mara', likes: 156 },
  { title: 'Forest Trail', authorName: 'Lina', likes: 41 },
  { title: 'Neon Alley', authorName: 'Aylin', likes: 175 },
  { title: 'Snow Peak', authorName: 'Jonas', likes: 92 },
];
for (const img of SEED_IMAGES) {
  void imageRepository.create({ ...img, url: null });
}

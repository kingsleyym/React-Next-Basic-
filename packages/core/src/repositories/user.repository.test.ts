import { describe, expect, it } from 'vitest';
import { createMemoryBackend } from '../backend';
import { UserRepository } from './user.repository';

// Example test — copy this shape. The memory backend means no real DB is needed.
describe('UserRepository', () => {
  it('creates a user and finds it by email (query is case-insensitive)', async () => {
    const backend = createMemoryBackend();
    const repo = new UserRepository(backend.db);

    await repo.create({ email: 'ada@example.com', name: 'Ada', avatarUrl: null, role: 'user' });

    // findByEmail lowercases the query, so mixed-case lookups still match.
    const found = await repo.findByEmail('ADA@example.com');
    expect(found?.name).toBe('Ada');
    expect(found?.role).toBe('user');
  });

  it('returns null for an unknown email', async () => {
    const backend = createMemoryBackend();
    const repo = new UserRepository(backend.db);
    expect(await repo.findByEmail('nobody@example.com')).toBeNull();
  });
});

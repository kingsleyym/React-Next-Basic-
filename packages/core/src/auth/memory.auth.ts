import { AppError } from '../errors';
import { parseUser, type User } from '../entities/user';
import type { AuthService, EmailCredentials, SignUpInput } from './auth.service';

interface StoredUser {
  user: User;
  password: string;
}

/**
 * In-memory AuthService. Works with zero configuration so the app runs
 * immediately and tests need no real backend. Replace with a real adapter
 * (firebase/supabase) for production — see docs/BACKEND-PROVIDERS.md.
 */
export function createMemoryAuth(seed: SignUpInput[] = []): AuthService {
  const users = new Map<string, StoredUser>();
  let current: User | null = null;
  const listeners = new Set<(user: User | null) => void>();

  let counter = 0;
  const nextId = () => `user_${++counter}`;

  function emit() {
    for (const cb of listeners) cb(current);
  }

  function register(input: SignUpInput): User {
    const email = input.email.toLowerCase();
    if (users.has(email)) throw new AppError('already-exists', 'Email already registered');
    const user = parseUser({
      id: nextId(),
      email,
      name: input.name ?? null,
      role: 'user',
      createdAt: new Date().toISOString(),
    });
    users.set(email, { user, password: input.password });
    return user;
  }

  for (const s of seed) register(s);

  return {
    async getCurrentUser() {
      return current;
    },
    onAuthStateChanged(callback) {
      listeners.add(callback);
      callback(current);
      return () => listeners.delete(callback);
    },
    async signInWithEmail({ email, password }: EmailCredentials) {
      const stored = users.get(email.toLowerCase());
      if (!stored || stored.password !== password) {
        throw new AppError('invalid-input', 'Invalid email or password');
      }
      current = stored.user;
      emit();
      return current;
    },
    async signUpWithEmail(input: SignUpInput) {
      const user = register(input);
      current = user;
      emit();
      return user;
    },
    async signOut() {
      current = null;
      emit();
    },
    async sendPasswordReset() {
      // no-op in memory
    },
  };
}

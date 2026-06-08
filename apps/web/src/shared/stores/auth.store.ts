import { create } from 'zustand';
import type { User } from '@repo/core';

/**
 * CLIENT/UI auth state only (the current user + status). Server data still lives
 * in TanStack Query. This store is hydrated by the auth listener in
 * features/auth/hooks/use-auth.ts. See docs/STATE-MANAGEMENT.md.
 */
interface AuthState {
  user: User | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'loading',
  setUser: (user) =>
    set({ user, status: user ? 'authenticated' : 'unauthenticated' }),
}));

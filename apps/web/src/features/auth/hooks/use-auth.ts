'use client';

import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/stores/auth.store';
import { authApi } from '../api/auth.api';
import type { LoginValues, SignupValues } from '../schema';

/**
 * The auth hook every component uses. Reads client state from the Zustand store;
 * exposes login/signup/logout as TanStack Query mutations. The store is kept in
 * sync by AuthListener, so we don't manually setUser here.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);

  const login = useMutation({
    mutationFn: (values: LoginValues) => authApi.signIn(values),
  });
  const signup = useMutation({
    mutationFn: (values: SignupValues) => authApi.signUp(values),
  });
  const logout = useMutation({
    mutationFn: () => authApi.signOut(),
  });

  return {
    user,
    status,
    isAuthenticated: status === 'authenticated',
    isAdmin: user?.role === 'admin',
    login,
    signup,
    logout,
  };
}

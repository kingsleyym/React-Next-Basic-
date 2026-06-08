'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/shared/stores/auth.store';
import { authApi } from '../api/auth.api';

/**
 * Subscribes to backend auth changes once and pushes the user into the Zustand
 * store. Rendered inside Providers. This is the bridge between the provider's
 * auth state and the app's client state.
 */
export function AuthListener() {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    return authApi.subscribe((user) => setUser(user));
  }, [setUser]);

  return null;
}

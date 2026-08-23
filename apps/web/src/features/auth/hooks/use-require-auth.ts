'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './use-auth';

export interface RequireAuthOptions {
  /** Where to send unauthenticated users. Default: /login */
  redirectTo?: string;
  /** Also require the admin role (non-admins go to /). */
  adminOnly?: boolean;
}

/**
 * Client route guard. Call at the top of any protected page; render content only
 * when `isReady` is true. Replaces hand-written guard effects. See docs/AUTH.md.
 */
export function useRequireAuth(options?: RequireAuthOptions) {
  const router = useRouter();
  const { user, status, isAdmin } = useAuth();
  const redirectTo = options?.redirectTo ?? '/login';
  const adminOnly = options?.adminOnly ?? false;

  useEffect(() => {
    if (status === 'unauthenticated') router.replace(redirectTo);
    else if (status === 'authenticated' && adminOnly && !isAdmin) router.replace('/');
  }, [status, isAdmin, adminOnly, redirectTo, router]);

  return {
    user,
    status,
    isReady: status === 'authenticated' && !!user && (!adminOnly || isAdmin),
  };
}

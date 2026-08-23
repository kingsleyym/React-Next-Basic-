'use client';

import { useState, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@repo/ui';
import { makeQueryClient } from '@/lib/query-client';
import { AuthListener } from '@/features/auth/components/auth-listener';
import { AnalyticsPageView } from '@/shared/analytics-page-view';

/**
 * App-wide client providers: TanStack Query (server state) + Toasts + the auth
 * listener that keeps the Zustand auth store in sync. Mounted once in layout.tsx.
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthListener />
        <AnalyticsPageView />
        {children}
      </ToastProvider>
    </QueryClientProvider>
  );
}

'use client';

import { DashboardScreen } from '@/features/dashboard/dashboard-screen';
import { useRequireAuth } from '@/features/auth/hooks/use-require-auth';
export default function Page() {
  // This hook handles the redirect to /login if the user is not authenticated.
  useRequireAuth();

  return <DashboardScreen />;
}


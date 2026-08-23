'use client';

import { Skeleton } from '@repo/ui';
import { useRequireAuth } from '@/features/auth/hooks/use-require-auth';
import { UserHeader } from '@/features/auth/components/user-header';
import { MembersCard } from '@/features/members/components/members-card';
import { UserCounterCard } from '@/features/user-counter/components/user-counter-card';

/** Thin page: guard + compose feature components. Logic lives in the features. */
export default function DashboardPage() {
  const { isReady } = useRequireAuth();

  if (!isReady) {
    return (
      <main className="mx-auto max-w-4xl space-y-4 p-8">
        <Skeleton variant="shimmer" className="h-10 w-48" />
        <Skeleton variant="shimmer" className="h-40 w-full" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-8">
      <UserHeader />
      <UserCounterCard />
      <MembersCard />
    </main>
  );
}

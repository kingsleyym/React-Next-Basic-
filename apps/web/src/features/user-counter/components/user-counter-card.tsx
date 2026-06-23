'use client';

import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@repo/ui';
import { useUserCount } from '../hooks/use-user-count';

/** Small stat card showing the total registered users. */
export function UserCounterCard() {
  const { count } = useUserCount();

  if (count.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton variant="shimmer" className="h-8 w-16" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        <span className="text-3xl font-bold">{count.data}</span>
      </CardContent>
    </Card>
  );
}

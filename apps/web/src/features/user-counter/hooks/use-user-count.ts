'use client';

import { useQuery } from '@tanstack/react-query';
import { userCounterApi } from '../api/user-counter.api';

const KEY = ['users'];

/** Server state for the user count. Shares the same query key as members
 * so TanStack Query deduplicates the request automatically. */
export function useUserCount() {
  const count = useQuery({
    queryKey: KEY,
    queryFn: userCounterApi.count,
  });

  return { count };
}

'use client';

import { useMemo, useState } from 'react';

export interface UsePaginationOptions {
  total: number;
  pageSize?: number;
  initialPage?: number;
}

/** Client-side pagination state. Pair with the <Pagination> component. */
export function usePagination({ total, pageSize = 10, initialPage = 1 }: UsePaginationOptions) {
  const [page, setPage] = useState(initialPage);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pageCount);

  return useMemo(
    () => ({
      page: safePage,
      pageCount,
      pageSize,
      offset: (safePage - 1) * pageSize,
      canPrev: safePage > 1,
      canNext: safePage < pageCount,
      setPage,
      next: () => setPage((p) => Math.min(p + 1, pageCount)),
      prev: () => setPage((p) => Math.max(p - 1, 1)),
    }),
    [safePage, pageCount, pageSize],
  );
}

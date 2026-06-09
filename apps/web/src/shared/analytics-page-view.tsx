'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { analytics } from '@/lib/analytics';

/**
 * Fires a provider-neutral page view on every route change. Mounted once in
 * Providers. Swap the analytics provider in lib/analytics.ts — this never changes.
 */
export function AnalyticsPageView() {
  const pathname = usePathname();
  useEffect(() => {
    analytics.pageView(pathname);
  }, [pathname]);
  return null;
}

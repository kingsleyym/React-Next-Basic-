import { createMemoryAnalytics, type AnalyticsService } from '@repo/core';

/**
 * THE single analytics instance for this app. No-op by default (logs in dev).
 * To use Google Analytics: load gtag.js in the root layout with your measurement
 * id, then build the instance from the Google adapter instead — see
 * docs/ANALYTICS.md. Features call `analytics.track(...)`, never `gtag` directly.
 *
 * Example (Google):
 *   import { createGoogleAnalytics } from '@repo/core/src/analytics/adapters/google.analytics';
 *   import { env } from './env';
 *   export const analytics = createGoogleAnalytics(env.NEXT_PUBLIC_GA_MEASUREMENT_ID!);
 */
export const analytics: AnalyticsService = createMemoryAnalytics({
  debug: process.env.NODE_ENV !== 'production',
});

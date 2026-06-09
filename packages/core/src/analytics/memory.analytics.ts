import type { AnalyticsService } from './analytics.service';

/**
 * Default no-op analytics. Logs in debug mode, sends nothing. Lets you call
 * `analytics.track(...)` everywhere with zero config; swap in a real adapter
 * (e.g. Google) when you want events to actually go somewhere.
 */
export function createMemoryAnalytics(options?: { debug?: boolean }): AnalyticsService {
  const log = (...args: unknown[]) => {
    if (options?.debug) console.log('[analytics]', ...args);
  };
  return {
    pageView: (path) => log('pageView', path),
    track: (event, props) => log('track', event, props),
    identify: (userId, traits) => log('identify', userId, traits),
    reset: () => log('reset'),
  };
}

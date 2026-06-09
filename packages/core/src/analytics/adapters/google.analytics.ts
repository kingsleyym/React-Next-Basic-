/**
 * Google Analytics 4 implementation of AnalyticsService (via gtag.js). Reference
 * adapter — excluded from the default typecheck (see core/tsconfig.json). The only
 * file that touches `gtag`. See docs/ANALYTICS.md and docs/BACKEND-PROVIDERS.md.
 *
 * Load the gtag script once in your app (e.g. in the root layout) with your
 * measurement id, then build the analytics instance with this adapter.
 */
import type { AnalyticsService } from '../analytics.service';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function createGoogleAnalytics(measurementId: string): AnalyticsService {
  const gtag = (...args: unknown[]) => {
    if (typeof window !== 'undefined' && window.gtag) window.gtag(...args);
  };

  return {
    pageView(path) {
      gtag('event', 'page_view', { page_path: path, send_to: measurementId });
    },
    track(event, props) {
      gtag('event', event, props ?? {});
    },
    identify(userId, traits) {
      gtag('set', 'user_properties', { user_id: userId, ...traits });
    },
    reset() {
      gtag('set', 'user_properties', { user_id: null });
    },
  };
}

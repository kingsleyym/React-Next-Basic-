/**
 * Provider-neutral analytics/tracking contract. Features call this, never a vendor
 * SDK (e.g. `gtag`) directly — so the same events fire identically on every
 * surface (dashboard + app) and the provider (Google, …) is swappable. Same
 * pattern as Auth/Db/Storage. See docs/ANALYTICS.md.
 */
export interface AnalyticsService {
  /** A screen/route view. */
  pageView(path: string): void;
  /** A named event with optional properties. */
  track(event: string, props?: Record<string, unknown>): void;
  /** Associate the current session with a user. */
  identify(userId: string, traits?: Record<string, unknown>): void;
  /** Clear identity (e.g. on sign-out). */
  reset(): void;
}

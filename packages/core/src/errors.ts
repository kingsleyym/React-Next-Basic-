/**
 * Provider-neutral errors. Adapters map provider-specific errors (Firebase,
 * Supabase, …) to these so the rest of the app handles errors the same way no
 * matter which backend is active. See docs/DATA-LAYER.md.
 */

export type AppErrorCode =
  | 'unauthenticated'
  | 'permission-denied'
  | 'not-found'
  | 'already-exists'
  | 'invalid-input'
  | 'unavailable'
  | 'unknown';

export class AppError extends Error {
  readonly code: AppErrorCode;
  override readonly cause?: unknown;

  constructor(code: AppErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.cause = cause;
  }
}

export function isAppError(value: unknown): value is AppError {
  return value instanceof AppError;
}

// Public API of @repo/core. Import from '@repo/core' only — never reach into
// internal paths from apps/features.

// Backend bundle + factory
export * from './backend';

// Service contracts (interfaces)
export type { AuthService, EmailCredentials, SignUpInput } from './auth/auth.service';
export type {
  DbService,
  QueryOptions,
  WhereFilter,
  WhereOp,
  WithId,
} from './db/db.service';
export type {
  StorageService,
  UploadInput,
  UploadResult,
} from './storage/storage.service';
export type {
  NotificationService,
  PushMessage,
} from './notifications/notification.service';
export type { AnalyticsService } from './analytics/analytics.service';

// Memory adapters (for tests / custom bundles)
export { createMemoryAuth } from './auth/memory.auth';
export { createMemoryDb } from './db/memory.db';
export { createMemoryStorage } from './storage/memory.storage';
export { createMemoryNotifications } from './notifications/memory.notifications';
export { createMemoryAnalytics } from './analytics/memory.analytics';

// Entities (Zod schemas + inferred types)
export * from './entities';

// Repositories
export { BaseRepository } from './repositories/base.repository';
export { UserRepository } from './repositories/user.repository';
export { ImageRepository } from './repositories/image.repository';

// Errors
export { AppError, isAppError } from './errors';
export type { AppErrorCode } from './errors';

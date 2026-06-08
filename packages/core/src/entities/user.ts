import { z } from 'zod';

/**
 * The app's OWN user model. Adapters map the provider's user (Firebase/Supabase)
 * onto this. The rest of the app never sees a provider-specific user object.
 *
 * Zod schema = single source of truth: type, validation and normalization all
 * derive from here. Never hand-write a parallel `User` interface.
 */
export const userRole = z.enum(['user', 'admin']);
export type UserRole = z.infer<typeof userRole>;

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(1).nullable().default(null),
  avatarUrl: z.string().url().nullable().default(null),
  role: userRole.default('user'),
  createdAt: z.string().datetime().optional(),
});

export type User = z.infer<typeof userSchema>;

/** Parse/normalize unknown data (e.g. a DB row) into a valid User. */
export function parseUser(data: unknown): User {
  return userSchema.parse(data);
}

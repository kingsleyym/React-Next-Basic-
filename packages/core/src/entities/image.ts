import { z } from 'zod';

/**
 * A gallery image. `url` is optional — when absent the UI renders a deterministic
 * gradient placeholder derived from the id (so it works fully offline). Zod schema
 * is the single source of truth; the type is inferred.
 */
export const imageSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  url: z.string().url().nullable().default(null),
  authorName: z.string().nullable().default(null),
  likes: z.number().int().nonnegative().default(0),
  createdAt: z.string().datetime().optional(),
});

export type Image = z.infer<typeof imageSchema>;

export const parseImage = (data: unknown): Image => imageSchema.parse(data);

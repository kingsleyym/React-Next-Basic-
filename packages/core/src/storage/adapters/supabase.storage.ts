/**
 * Supabase Storage implementation of StorageService. Reference adapter — excluded
 * from default typecheck. See docs/BACKEND-PROVIDERS.md.
 */
import type { SupabaseClient } from '@supabase/supabase-js';

import { AppError } from '../../errors';
import type { StorageService, UploadInput } from '../storage.service';

export function createSupabaseStorage(
  client: SupabaseClient,
  bucket: string,
): StorageService {
  return {
    async upload({ path, file, contentType, onProgress }: UploadInput) {
      // Supabase JS does not expose granular progress; report start/finish.
      onProgress?.(10);
      const { error } = await client.storage
        .from(bucket)
        .upload(path, file, { contentType, upsert: true });
      if (error) throw new AppError('unknown', error.message, error);
      onProgress?.(100);
      const { data } = client.storage.from(bucket).getPublicUrl(path);
      return { url: data.publicUrl, path };
    },
    async remove(path) {
      await client.storage.from(bucket).remove([path]);
    },
    async getUrl(path) {
      return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    },
  };
}

'use client';

import { useCallback, useState } from 'react';
import type { StorageService, UploadResult } from '@repo/core';

export interface UseUploadOptions {
  storage: StorageService;
  /** Build the destination path for a given file. */
  pathFor: (file: File) => string;
  maxSizeMb?: number;
  accept?: string[];
}

/**
 * Upload state machine used by <ImageUpload>/<FileUpload>: validates, tracks
 * progress, returns the URL. Works with ANY StorageService (memory/firebase/
 * supabase) — the component never knows the provider. See docs/RECIPES.md.
 */
export function useUpload({ storage, pathFor, maxSizeMb = 5, accept }: UseUploadOptions) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File): Promise<UploadResult | null> => {
      setError(null);
      if (accept && !accept.includes(file.type)) {
        setError('Unsupported file type');
        return null;
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        setError(`File too large (max ${maxSizeMb} MB)`);
        return null;
      }
      setUploading(true);
      setProgress(0);
      try {
        return await storage.upload({
          path: pathFor(file),
          file,
          contentType: file.type,
          onProgress: setProgress,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Upload failed');
        return null;
      } finally {
        setUploading(false);
      }
    },
    [storage, pathFor, maxSizeMb, accept],
  );

  return { upload, progress, uploading, error };
}

import type { StorageService } from './storage.service';

/**
 * In-memory StorageService. Keeps blobs in a Map and hands back object URLs so
 * the ImageUpload component works in dev without a real bucket.
 */
export function createMemoryStorage(): StorageService {
  const files = new Map<string, string>();

  return {
    async upload({ path, file, onProgress }) {
      onProgress?.(100);
      const url =
        typeof URL !== 'undefined' && 'createObjectURL' in URL
          ? URL.createObjectURL(file)
          : `memory://${path}`;
      files.set(path, url);
      return { url, path };
    },
    async remove(path) {
      files.delete(path);
    },
    async getUrl(path) {
      return files.get(path) ?? `memory://${path}`;
    },
  };
}

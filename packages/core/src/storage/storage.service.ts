/**
 * Provider-neutral file/image storage contract. Powers the ImageUpload/FileUpload
 * components and the useUpload hook. Swap Firebase Storage ↔ Supabase Storage by
 * swapping the implementation. See docs/BACKEND-PROVIDERS.md.
 */

export interface UploadInput {
  /** Destination path, e.g. `avatars/${userId}.jpg`. */
  path: string;
  file: File | Blob;
  contentType?: string;
  /** Progress 0..100. */
  onProgress?: (percent: number) => void;
}

export interface UploadResult {
  /** Publicly accessible URL. */
  url: string;
  /** Storage path (use this to delete later). */
  path: string;
}

export interface StorageService {
  upload(input: UploadInput): Promise<UploadResult>;
  remove(path: string): Promise<void>;
  getUrl(path: string): Promise<string>;
}

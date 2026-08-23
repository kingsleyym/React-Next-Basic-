/**
 * Firebase Storage implementation of StorageService. Reference adapter — excluded
 * from default typecheck. Powers image/file upload with progress. See
 * docs/BACKEND-PROVIDERS.md.
 */
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import type { FirebaseApp } from 'firebase/app';

import type { StorageService, UploadInput } from '../storage.service';

export function createFirebaseStorage(app: FirebaseApp): StorageService {
  const storage = getStorage(app);

  return {
    upload({ path, file, contentType, onProgress }: UploadInput) {
      const task = uploadBytesResumable(ref(storage, path), file, { contentType });
      return new Promise((resolve, reject) => {
        task.on(
          'state_changed',
          (snapshot) => {
            const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress?.(Math.round(pct));
          },
          reject,
          async () => {
            const url = await getDownloadURL(task.snapshot.ref);
            resolve({ url, path });
          },
        );
      });
    },
    async remove(path) {
      await deleteObject(ref(storage, path));
    },
    async getUrl(path) {
      return getDownloadURL(ref(storage, path));
    },
  };
}

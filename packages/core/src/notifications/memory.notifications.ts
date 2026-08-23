import type { NotificationService, PushMessage } from './notification.service';

/**
 * In-memory NotificationService. Logs instead of sending real pushes, and lets
 * you trigger listeners manually in dev/tests.
 */
export function createMemoryNotifications(): NotificationService {
  const listeners = new Set<(m: PushMessage) => void>();

  return {
    async requestPermission() {
      return true;
    },
    async getToken() {
      return 'memory-token';
    },
    onMessage(callback) {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    async send(message) {
      // In memory we just fan out to local listeners.
      listeners.forEach((cb) => cb(message));
    },
  };
}

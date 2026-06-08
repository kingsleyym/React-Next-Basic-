/**
 * Provider-neutral push/notification contract (e.g. Firebase Cloud Messaging or
 * a Supabase + web-push setup). The client requests permission, gets a token and
 * listens; sending is typically done server-side. See docs/BACKEND-PROVIDERS.md.
 */

export interface PushMessage {
  title: string;
  body: string;
  data?: Record<string, string>;
  /** Send to a topic (broadcast) … */
  topic?: string;
  /** … or to a single device token. */
  token?: string;
}

export interface NotificationService {
  /** Ask the user for notification permission. Resolves to granted. */
  requestPermission(): Promise<boolean>;
  /** Device token to target this client, or null if unavailable/denied. */
  getToken(): Promise<string | null>;
  /** Foreground message listener. Returns an unsubscribe function. */
  onMessage(callback: (message: PushMessage) => void): () => void;
  /** Send a message (usually called from a trusted/server context). */
  send(message: PushMessage): Promise<void>;
}

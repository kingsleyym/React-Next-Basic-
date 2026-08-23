import type { User } from '../entities/user';

/**
 * Provider-neutral authentication contract. Features and pages depend ONLY on
 * this interface, never on Firebase/Supabase Auth directly. Swap the provider by
 * swapping the implementation — see docs/AUTH.md and docs/BACKEND-PROVIDERS.md.
 */
export interface EmailCredentials {
  email: string;
  password: string;
}

export interface SignUpInput extends EmailCredentials {
  name?: string;
}

export interface AuthService {
  /** Current user, or null if signed out. */
  getCurrentUser(): Promise<User | null>;

  /** Subscribe to auth changes. Returns an unsubscribe function. */
  onAuthStateChanged(callback: (user: User | null) => void): () => void;

  signInWithEmail(credentials: EmailCredentials): Promise<User>;
  signUpWithEmail(input: SignUpInput): Promise<User>;
  signOut(): Promise<void>;
  sendPasswordReset(email: string): Promise<void>;
}

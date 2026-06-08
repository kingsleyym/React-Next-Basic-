import { backend } from '@/lib/backend';
import type { LoginValues, SignupValues } from '../schema';

/**
 * Feature API layer: thin functions over the provider-neutral AuthService. The
 * feature never imports Firebase/Supabase — only `backend.auth`. Hooks call
 * these; components call hooks. See docs/ARCHITECTURE.md.
 */
export const authApi = {
  signIn: (values: LoginValues) => backend.auth.signInWithEmail(values),
  signUp: (values: SignupValues) => backend.auth.signUpWithEmail(values),
  signOut: () => backend.auth.signOut(),
  getCurrentUser: () => backend.auth.getCurrentUser(),
  subscribe: (cb: Parameters<typeof backend.auth.onAuthStateChanged>[0]) =>
    backend.auth.onAuthStateChanged(cb),
};

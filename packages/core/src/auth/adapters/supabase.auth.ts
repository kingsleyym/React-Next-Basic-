/**
 * Supabase implementation of AuthService.
 *
 * Reference adapter — excluded from the default typecheck. Enable it by:
 * `pnpm add @supabase/supabase-js`, then build a Backend bundle with this
 * adapter (see docs/BACKEND-PROVIDERS.md). The ONLY place that imports Supabase
 * Auth — features never see it.
 */
import type { SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';

import { AppError } from '../../errors';
import { parseUser, type User } from '../../entities/user';
import type { AuthService, EmailCredentials, SignUpInput } from '../auth.service';

function toUser(su: SupabaseUser): User {
  return parseUser({
    id: su.id,
    email: su.email ?? '',
    name: (su.user_metadata?.name as string | undefined) ?? null,
    avatarUrl: (su.user_metadata?.avatar_url as string | undefined) ?? null,
    role: (su.user_metadata?.role as string | undefined) ?? 'user',
  });
}

export function createSupabaseAuth(client: SupabaseClient): AuthService {
  return {
    async getCurrentUser() {
      const { data } = await client.auth.getUser();
      return data.user ? toUser(data.user) : null;
    },
    onAuthStateChanged(callback) {
      const { data } = client.auth.onAuthStateChange((_event, session) => {
        callback(session?.user ? toUser(session.user) : null);
      });
      return () => data.subscription.unsubscribe();
    },
    async signInWithEmail({ email, password }: EmailCredentials) {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        throw new AppError('invalid-input', error?.message ?? 'Invalid email or password', error);
      }
      return toUser(data.user);
    },
    async signUpWithEmail({ email, password, name }: SignUpInput) {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error || !data.user) {
        throw new AppError('already-exists', error?.message ?? 'Sign up failed', error);
      }
      return toUser(data.user);
    },
    async signOut() {
      await client.auth.signOut();
    },
    async sendPasswordReset(email: string) {
      await client.auth.resetPasswordForEmail(email);
    },
  };
}

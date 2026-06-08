/**
 * Firebase implementation of AuthService.
 *
 * Reference adapter — excluded from the default typecheck (see core/tsconfig.json
 * `exclude`). Enable it by: `pnpm add firebase` in the app, then build a Backend
 * bundle with this adapter (see docs/BACKEND-PROVIDERS.md).
 *
 * The whole point: this file is the ONLY place that imports Firebase Auth. Your
 * features never see it.
 */
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged as fbOnAuthStateChanged,
  updateProfile,
  type Auth,
  type User as FirebaseUser,
} from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';

import { AppError } from '../../errors';
import { parseUser, type User } from '../../entities/user';
import type { AuthService, EmailCredentials, SignUpInput } from '../auth.service';

/** Map a Firebase user → our own User. Adjust role lookup to your data model. */
function toUser(fb: FirebaseUser): User {
  return parseUser({
    id: fb.uid,
    email: fb.email ?? '',
    name: fb.displayName,
    avatarUrl: fb.photoURL,
    role: 'user',
  });
}

function mapError(error: unknown): AppError {
  const code = (error as { code?: string }).code ?? '';
  if (code.includes('user-not-found') || code.includes('wrong-password')) {
    return new AppError('invalid-input', 'Invalid email or password', error);
  }
  if (code.includes('email-already-in-use')) {
    return new AppError('already-exists', 'Email already registered', error);
  }
  return new AppError('unknown', 'Authentication failed', error);
}

export function createFirebaseAuth(app: FirebaseApp): AuthService {
  const auth: Auth = getAuth(app);

  return {
    async getCurrentUser() {
      return auth.currentUser ? toUser(auth.currentUser) : null;
    },
    onAuthStateChanged(callback) {
      return fbOnAuthStateChanged(auth, (fb) => callback(fb ? toUser(fb) : null));
    },
    async signInWithEmail({ email, password }: EmailCredentials) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        return toUser(cred.user);
      } catch (error) {
        throw mapError(error);
      }
    },
    async signUpWithEmail({ email, password, name }: SignUpInput) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) await updateProfile(cred.user, { displayName: name });
        return toUser(cred.user);
      } catch (error) {
        throw mapError(error);
      }
    },
    async signOut() {
      await fbSignOut(auth);
    },
    async sendPasswordReset(email: string) {
      await sendPasswordResetEmail(auth, email);
    },
  };
}

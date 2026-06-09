'use client';

import { Avatar, Button } from '@repo/ui';
import { useAuth } from '../hooks/use-auth';

/** Current-user header: avatar, greeting, sign-out. Drop into any protected page. */
export function UserHeader() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar src={user.avatarUrl} name={user.name ?? user.email} />
        <div>
          <h1 className="text-xl font-semibold">Welcome, {user.name ?? user.email}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <Button variant="outline" loading={logout.isPending} onClick={() => logout.mutate()}>
        Sign out
      </Button>
    </header>
  );
}

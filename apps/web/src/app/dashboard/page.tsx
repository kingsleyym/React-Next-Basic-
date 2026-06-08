'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  Skeleton,
  useToast,
  type Column,
} from '@repo/ui';
import type { User } from '@repo/core';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { userRepository } from '@/lib/backend';

const columns: Column<User>[] = [
  {
    key: 'name',
    header: 'User',
    cell: (u) => (
      <div className="flex items-center gap-2">
        <Avatar src={u.avatarUrl} name={u.name ?? u.email} size={28} />
        <span>{u.name ?? '—'}</span>
      </div>
    ),
  },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role', cell: (u) => <Badge variant="outline">{u.role}</Badge> },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, status, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Route guard: bounce unauthenticated users to login.
  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login');
  }, [status, router]);

  // Server state via TanStack Query → repository (provider-neutral).
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => userRepository.findAll(),
    enabled: status === 'authenticated',
  });

  const addDemoUser = useMutation({
    mutationFn: () =>
      userRepository.create({
        email: `member${Date.now()}@example.com`,
        name: 'New Member',
        avatarUrl: null,
        role: 'user',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'Member added', variant: 'success' });
    },
  });

  if (status === 'loading' || !user) {
    return (
      <main className="mx-auto max-w-4xl space-y-4 p-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={user.avatarUrl} name={user.name ?? user.email} />
          <div>
            <h1 className="text-xl font-semibold">Welcome, {user.name ?? user.email}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          loading={logout.isPending}
          onClick={() => logout.mutate()}
        >
          Sign out
        </Button>
      </header>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Members</CardTitle>
          <Button size="sm" loading={addDemoUser.isPending} onClick={() => addDemoUser.mutate()}>
            Add member
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            rows={usersQuery.data ?? []}
            rowKey={(u) => u.id}
            loading={usersQuery.isLoading}
            emptyTitle="No members yet — add one"
          />
        </CardContent>
      </Card>
    </main>
  );
}

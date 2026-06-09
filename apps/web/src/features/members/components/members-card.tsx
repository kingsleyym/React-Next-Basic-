'use client';

import { Avatar, Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import type { User } from '@repo/core';
import { DataTable, type Column } from '@/shared/components/data-table';
import { useMembers } from '../hooks/use-members';

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

/** Members list with add button — the dashboard's main panel. */
export function MembersCard() {
  const { list, addDemo } = useMembers();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Members</CardTitle>
        <Button size="sm" loading={addDemo.isPending} onClick={() => addDemo.mutate()}>
          Add member
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          rows={list.data ?? []}
          rowKey={(u) => u.id}
          loading={list.isLoading}
          emptyTitle="No members yet — add one"
        />
      </CardContent>
    </Card>
  );
}

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@repo/ui';
import { membersApi } from '../api/members.api';

const KEY = ['users'];

/** Server state for the members list + the add-member mutation. */
export function useMembers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const list = useQuery({ queryKey: KEY, queryFn: membersApi.list });

  const addDemo = useMutation({
    mutationFn: membersApi.addDemo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      toast({ title: 'Member added', variant: 'success' });
    },
  });

  return { list, addDemo };
}

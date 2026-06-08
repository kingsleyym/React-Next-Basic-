/**
 * Supabase (Postgres) implementation of DbService. Reference adapter — excluded
 * from default typecheck. The only file that imports the Supabase client for
 * data. A "collection" maps to a table name. See docs/BACKEND-PROVIDERS.md.
 */
import type { SupabaseClient } from '@supabase/supabase-js';

import { AppError } from '../../errors';
import type { DbService, QueryOptions, WhereOp, WithId } from '../db.service';

type Builder = ReturnType<SupabaseClient['from']>;

function applyOptions(query: Builder, options?: QueryOptions) {
  let q = query;
  for (const w of options?.where ?? []) {
    const op: Record<WhereOp, string> = {
      eq: 'eq',
      neq: 'neq',
      lt: 'lt',
      lte: 'lte',
      gt: 'gt',
      gte: 'gte',
      in: 'in',
    };
    // @ts-expect-error dynamic filter method by name
    q = q[op[w.op]](w.field, w.value);
  }
  if (options?.orderBy) {
    q = q.order(options.orderBy.field, { ascending: options.orderBy.direction !== 'desc' });
  }
  if (options?.limit != null) q = q.limit(options.limit);
  return q;
}

export function createSupabaseDb(client: SupabaseClient): DbService {
  return {
    async get<T>(table: string, id: string) {
      const { data } = await client.from(table).select('*').eq('id', id).maybeSingle();
      return (data as WithId<T> | null) ?? null;
    },
    async list<T>(table: string, options?: QueryOptions) {
      const { data, error } = await applyOptions(client.from(table).select('*'), options);
      if (error) throw new AppError('unknown', error.message, error);
      return (data ?? []) as WithId<T>[];
    },
    async create<T>(table: string, data: T, id?: string) {
      const payload = id ? { ...(data as object), id } : (data as object);
      const { data: row, error } = await client.from(table).insert(payload).select().single();
      if (error) throw new AppError('unknown', error.message, error);
      return row as WithId<T>;
    },
    async update<T>(table: string, id: string, data: Partial<T>) {
      const { error } = await client.from(table).update(data as object).eq('id', id);
      if (error) throw new AppError('unknown', error.message, error);
    },
    async remove(table: string, id: string) {
      await client.from(table).delete().eq('id', id);
    },
    subscribe<T>(table: string, options: QueryOptions, callback: (items: WithId<T>[]) => void) {
      const load = () => this.list<T>(table, options).then(callback);
      void load();
      const channel = client
        .channel(`realtime:${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, () => void load())
        .subscribe();
      return () => {
        void client.removeChannel(channel);
      };
    },
  };
}

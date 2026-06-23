import type { DbService, QueryOptions, WhereFilter, WithId } from './db.service';

/**
 * In-memory DbService. Real query support (where/orderBy/limit) and realtime
 * subscriptions so features can be developed and tested without a real database.
 */
export function createMemoryDb(): DbService {
  const store = new Map<string, Map<string, WithId<unknown>>>();
  const watchers = new Map<string, Set<() => void>>();
  let counter = 0;

  function col(name: string): Map<string, WithId<unknown>> {
    let c = store.get(name);
    if (!c) {
      c = new Map();
      store.set(name, c);
    }
    return c;
  }

  function notify(name: string) {
    watchers.get(name)?.forEach((fn) => fn());
  }

  function matches(record: Record<string, unknown>, filters: WhereFilter[]): boolean {
    return filters.every(({ field, op, value }) => {
      const v = record[field];
      switch (op) {
        case 'eq':
          return v === value;
        case 'neq':
          return v !== value;
        case 'lt':
          return (v as number) < (value as number);
        case 'lte':
          return (v as number) <= (value as number);
        case 'gt':
          return (v as number) > (value as number);
        case 'gte':
          return (v as number) >= (value as number);
        case 'in':
          return Array.isArray(value) && value.includes(v);
        default:
          return true;
      }
    });
  }

  function query<T>(name: string, options?: QueryOptions): WithId<T>[] {
    let items = [...col(name).values()] as WithId<T>[];
    if (options?.where?.length) {
      items = items.filter((it) => matches(it as Record<string, unknown>, options.where!));
    }
    if (options?.orderBy) {
      const { field, direction = 'asc' } = options.orderBy;
      const dir = direction === 'asc' ? 1 : -1;
      items = [...items].sort((a, b) => {
        const av = (a as Record<string, unknown>)[field] as number | string;
        const bv = (b as Record<string, unknown>)[field] as number | string;
        return av < bv ? -dir : av > bv ? dir : 0;
      });
    }
    if (options?.limit != null) items = items.slice(0, options.limit);
    return items;
  }

  return {
    async get<T>(name: string, id: string) {
      return (col(name).get(id) as WithId<T> | undefined) ?? null;
    },
    async list<T>(name: string, options?: QueryOptions) {
      return query<T>(name, options);
    },
    async create<T>(name: string, data: T, id?: string) {
      const recordId = id ?? `${name}_${++counter}`;
      const record = { ...(data as object), id: recordId } as WithId<T>;
      col(name).set(recordId, record);
      notify(name);
      return record;
    },
    async update<T>(name: string, id: string, data: Partial<T>) {
      const existing = col(name).get(id);
      if (existing) {
        col(name).set(id, { ...existing, ...data, id });
        notify(name);
      }
    },
    async remove(name: string, id: string) {
      col(name).delete(id);
      notify(name);
    },
















    async count(name: string, options?: QueryOptions) {
      return query<unknown>(name, options).length;
    },
    subscribe<T>(
      name: string,
      options: QueryOptions,
      callback: (items: WithId<T>[]) => void,
    ) {
      const run = () => callback(query<T>(name, options));
      let set = watchers.get(name);
      if (!set) {
        set = new Set();
        watchers.set(name, set);
      }
      set.add(run);
      run();
      return () => {
        set!.delete(run);
      };
    },
  };
}

/**
 * Provider-neutral document database contract. Repositories use this; they never
 * import Firestore/Supabase. A "collection" is a logical table/collection name.
 * See docs/DATA-LAYER.md.
 */

export type WhereOp = 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte' | 'in';

export interface WhereFilter {
  field: string;
  op: WhereOp;
  value: unknown;
}

export interface QueryOptions {
  where?: WhereFilter[];
  orderBy?: { field: string; direction?: 'asc' | 'desc' };
  limit?: number;
}

/** A stored record always has a string id. */
export type WithId<T> = T & { id: string };

export interface DbService {
  get<T>(collection: string, id: string): Promise<WithId<T> | null>;
  list<T>(collection: string, options?: QueryOptions): Promise<WithId<T>[]>;
  /** Create a record. If `id` is omitted the adapter generates one. */
  create<T>(collection: string, data: T, id?: string): Promise<WithId<T>>;
  update<T>(collection: string, id: string, data: Partial<T>): Promise<void>;
  remove(collection: string, id: string): Promise<void>;
  /** Returns the number of documents matching the options. */
  count(collection: string, options?: QueryOptions): Promise<number>;
  /** Realtime subscription. Returns an unsubscribe function. */
  subscribe<T>(
    collection: string,
    options: QueryOptions,
    callback: (items: WithId<T>[]) => void,
  ): () => void;
}

import type { ZodType, ZodTypeDef } from 'zod';
import type { DbService, QueryOptions } from '../db/db.service';

/**
 * Generic data-access base. A repository is the ONLY place a collection name and
 * its schema live together. Features call repositories, repositories call the
 * DbService — never the other way around. Every row is validated/normalized
 * through the Zod schema on the way out. See docs/DATA-LAYER.md.
 */
export class BaseRepository<T extends { id: string }> {
  constructor(
    protected readonly db: DbService,
    protected readonly collection: string,
    protected readonly schema: ZodType<T, ZodTypeDef, unknown>,
  ) {}

  async findById(id: string): Promise<T | null> {
    const row = await this.db.get<T>(this.collection, id);
    return row ? this.schema.parse(row) : null;
  }

  async findAll(options?: QueryOptions): Promise<T[]> {
    const rows = await this.db.list<T>(this.collection, options);
    return rows.map((row) => this.schema.parse(row));
  }

  async create(data: Omit<T, 'id'>, id?: string): Promise<T> {
    const row = await this.db.create<Omit<T, 'id'>>(this.collection, data, id);
    return this.schema.parse(row);
  }

  async update(id: string, data: Partial<Omit<T, 'id'>>): Promise<void> {
    await this.db.update(this.collection, id, data);
  }

  async remove(id: string): Promise<void> {
    await this.db.remove(this.collection, id);
  }

  /** Realtime list subscription. Returns an unsubscribe function. */
  subscribe(options: QueryOptions, callback: (items: T[]) => void): () => void {
    return this.db.subscribe<T>(this.collection, options, (rows) =>
      callback(rows.map((row) => this.schema.parse(row))),
    );
  }
}

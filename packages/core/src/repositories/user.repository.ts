import { userSchema, type User } from '../entities/user';
import type { DbService } from '../db/db.service';
import { BaseRepository } from './base.repository';

/**
 * Example repository — copy this shape for every new entity. The slash command
 * `/new-entity` and the `feature-builder` agent generate repositories like this.
 */
export class UserRepository extends BaseRepository<User> {
  constructor(db: DbService) {
    super(db, 'users', userSchema);
  }

  async findByEmail(email: string): Promise<User | null> {
    const matches = await this.findAll({
      where: [{ field: 'email', op: 'eq', value: email.toLowerCase() }],
      limit: 1,
    });
    return matches[0] ?? null;
  }
}

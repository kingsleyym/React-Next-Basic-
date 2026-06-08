import { imageSchema, type Image } from '../entities/image';
import type { DbService } from '../db/db.service';
import { BaseRepository } from './base.repository';

export class ImageRepository extends BaseRepository<Image> {
  constructor(db: DbService) {
    super(db, 'images', imageSchema);
  }

  /** Increment the like counter for one image and return the new value. */
  async like(id: string): Promise<number> {
    const current = await this.findById(id);
    const likes = (current?.likes ?? 0) + 1;
    await this.update(id, { likes });
    return likes;
  }

  /** Most-liked first. */
  topLiked(limit = 10): Promise<Image[]> {
    return this.findAll({ orderBy: { field: 'likes', direction: 'desc' }, limit });
  }
}

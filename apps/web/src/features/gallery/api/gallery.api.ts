import { imageRepository } from '@/lib/backend';

/** Thin feature API over the provider-neutral ImageRepository. */
export const galleryApi = {
  list: () => imageRepository.findAll({ orderBy: { field: 'likes', direction: 'desc' } }),
  like: (id: string) => imageRepository.like(id),
};

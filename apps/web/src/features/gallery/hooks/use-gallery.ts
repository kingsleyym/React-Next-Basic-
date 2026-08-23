'use client';

import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Image } from '@repo/core';
import { analytics } from '@/lib/analytics';
import { galleryApi } from '../api/gallery.api';

const KEY = ['images'];

/** Server state for the gallery: the image list + a like mutation. */
export function useGallery() {
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: KEY, queryFn: galleryApi.list });

  const like = useMutation({
    mutationFn: (id: string) => galleryApi.like(id),
    // Optimistic update: bump the like instantly, roll back on error.
    onMutate: async (id) => {
      analytics.track('image_liked', { id });
      await queryClient.cancelQueries({ queryKey: KEY });
      const prev = queryClient.getQueryData<Image[]>(KEY);
      queryClient.setQueryData<Image[]>(KEY, (old) =>
        (old ?? []).map((img) => (img.id === id ? { ...img, likes: img.likes + 1 } : img)),
      );
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(KEY, ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });

  return { ...query, like };
}

/** Derived dashboard stats from the same cached image list (no extra fetch). */
export function useGalleryStats() {
  const { data, isLoading } = useQuery({ queryKey: KEY, queryFn: galleryApi.list });

  const stats = useMemo(() => {
    const images = data ?? [];
    const totalLikes = images.reduce((sum, img) => sum + img.likes, 0);
    const top = images[0] ?? null;
    return {
      totalLikes,
      imageCount: images.length,
      avgLikes: images.length ? Math.round(totalLikes / images.length) : 0,
      top,
    };
  }, [data]);

  return { stats, isLoading };
}

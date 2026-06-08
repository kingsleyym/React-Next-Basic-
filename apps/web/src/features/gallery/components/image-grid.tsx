'use client';

import { ImageIcon } from 'lucide-react';
import { EmptyState, Skeleton } from '@repo/ui';
import { useGallery } from '../hooks/use-gallery';
import { ImageCard } from './image-card';

/** The user-facing gallery: responsive grid with shimmer loading + empty state. */
export function ImageGrid() {
  const { data, isLoading, like } = useGallery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="shimmer" className="aspect-square rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState icon={<ImageIcon size={28} />} title="No images yet" />;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {data.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          pending={like.isPending}
          onLike={(id) => like.mutate(id)}
        />
      ))}
    </div>
  );
}

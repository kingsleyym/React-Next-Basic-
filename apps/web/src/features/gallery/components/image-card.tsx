'use client';

import { Heart } from 'lucide-react';
import { cn } from '@repo/ui';
import type { Image } from '@repo/core';
import { gradientFor } from './gradient';

export interface ImageCardProps {
  image: Image;
  onLike: (id: string) => void;
  /** Disables the like button while a like is in flight. */
  pending?: boolean;
}

/** A single gallery tile: placeholder gradient + title + like pill. Mobile-first. */
export function ImageCard({ image, onLike, pending }: ImageCardProps) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-2xl shadow-sm">
      {image.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image.url}
          alt={image.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
          style={{ background: gradientFor(image.id + image.title) }}
        />
      )}

      {/* bottom gradient + meta */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <p className="truncate text-sm font-semibold text-white">{image.title}</p>
        {image.authorName && (
          <p className="truncate text-xs text-white/70">by {image.authorName}</p>
        )}
      </div>

      {/* like pill */}
      <button
        type="button"
        onClick={() => onLike(image.id)}
        disabled={pending}
        aria-label="Like"
        className={cn(
          'absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm transition active:scale-95 disabled:opacity-60',
        )}
      >
        <Heart size={14} className="fill-white/90" />
        {image.likes}
      </button>
    </div>
  );
}

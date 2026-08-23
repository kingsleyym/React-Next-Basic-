'use client';

import { type ReactNode } from 'react';
import { Heart, ImageIcon, TrendingUp } from 'lucide-react';
import { Card, Skeleton } from '@repo/ui';
import { useGalleryStats } from '../hooks/use-gallery';
import { gradientFor } from './gradient';

function StatTile({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <Card className="flex flex-col gap-1 p-4">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className="text-2xl font-bold tabular-nums">{value}</span>
    </Card>
  );
}

/** Mobile management dashboard: like status at a glance. */
export function StatsOverview() {
  const { stats, isLoading } = useGalleryStats();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="shimmer" className="h-20 rounded-lg" />
          ))}
        </div>
        <Skeleton variant="shimmer" className="h-24 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <StatTile icon={<Heart size={14} />} label="Likes" value={stats.totalLikes} />
        <StatTile icon={<ImageIcon size={14} />} label="Images" value={stats.imageCount} />
        <StatTile icon={<TrendingUp size={14} />} label="Ø / image" value={stats.avgLikes} />
      </div>

      {stats.top && (
        <Card className="flex items-center gap-3 p-3">
          <div
            className="h-16 w-16 shrink-0 rounded-lg"
            style={{ background: gradientFor(stats.top.id + stats.top.title) }}
          />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Most liked</p>
            <p className="truncate font-semibold">{stats.top.title}</p>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <Heart size={13} className="fill-destructive text-destructive" />
              {stats.top.likes} likes
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

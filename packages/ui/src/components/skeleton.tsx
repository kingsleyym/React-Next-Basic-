import { type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** 'shimmer' adds the sliding sheen; 'pulse' is a simple fade. */
  variant?: 'pulse' | 'shimmer';
}

/**
 * Loading placeholder. Use while data loads instead of a blank screen.
 * `variant="shimmer"` gives the modern sliding-light effect. See docs/COMPONENTS.md.
 */
export function Skeleton({ className, variant = 'pulse', ...props }: SkeletonProps) {
  if (variant === 'shimmer') {
    return (
      <div
        className={cn('relative overflow-hidden rounded-md bg-muted', className)}
        {...props}
      >
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      </div>
    );
  }
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />;
}

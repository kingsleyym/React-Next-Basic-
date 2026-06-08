import { type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

/** Loading placeholder. Use while data is loading instead of a blank screen. */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />;
}

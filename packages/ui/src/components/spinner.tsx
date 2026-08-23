import { Loader2 } from 'lucide-react';
import { cn } from '../lib/cn';

export interface SpinnerProps {
  className?: string;
  /** pixel size, default 16 */
  size?: number;
}

/** Loading spinner. Used inside Button and anywhere you await something. */
export function Spinner({ className, size = 16 }: SpinnerProps) {
  return <Loader2 className={cn('animate-spin', className)} size={size} aria-hidden />;
}

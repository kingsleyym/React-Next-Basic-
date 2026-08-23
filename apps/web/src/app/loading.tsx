import { Spinner } from '@repo/ui';

/** Route-level loading UI — shown while a server component streams in. */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size={28} className="text-muted-foreground" />
    </div>
  );
}

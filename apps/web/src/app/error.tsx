'use client';

import { useEffect } from 'react';
import { ErrorState } from '@repo/ui';

/** Route error boundary. Catches render/data errors and offers a retry. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hook your logging/analytics here.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <ErrorState
        description="An unexpected error occurred. You can try again."
        onRetry={reset}
        className="max-w-sm"
      />
    </div>
  );
}

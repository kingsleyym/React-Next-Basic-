import Link from 'next/link';
import { Button, EmptyState } from '@repo/ui';

/** 404 page. */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <EmptyState
        title="Page not found"
        description="The page you’re looking for doesn’t exist."
        action={
          <Link href="/">
            <Button variant="outline" size="sm">
              Go home
            </Button>
          </Link>
        }
        className="max-w-sm"
      />
    </div>
  );
}

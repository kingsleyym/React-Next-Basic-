import type { Metadata } from 'next';
import Link from 'next/link';
import { BarChart3 } from 'lucide-react';
import { ImageGrid } from '@/features/gallery/components/image-grid';

export const metadata: Metadata = { title: 'Gallery' };

export default function GalleryPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-4 py-6">
      <header className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Community</p>
          <h1 className="text-2xl font-bold tracking-tight">Gallery</h1>
        </div>
        <Link
          href="/stats"
          aria-label="Stats"
          className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-secondary"
        >
          <BarChart3 size={18} />
        </Link>
      </header>

      <ImageGrid />
    </main>
  );
}

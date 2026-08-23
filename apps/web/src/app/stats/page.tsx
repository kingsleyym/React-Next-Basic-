import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { StatsOverview } from '@/features/gallery/components/stats-overview';

export const metadata: Metadata = { title: 'Likes' };

export default function StatsPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-4 py-6">
      <header className="mb-5">
        <p className="text-sm text-muted-foreground">Management</p>
        <h1 className="text-2xl font-bold tracking-tight">Likes overview</h1>
      </header>

      <StatsOverview />

      <Link
        href="/gallery"
        className="mt-5 flex items-center justify-between rounded-lg border border-border bg-card p-4 text-sm font-medium transition-colors hover:bg-secondary"
      >
        Open gallery
        <ArrowRight size={16} />
      </Link>
    </main>
  );
}

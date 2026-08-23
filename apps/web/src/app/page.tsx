import Link from 'next/link';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-8 p-8 text-center">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">React Next Basic</h1>
        <p className="text-muted-foreground">
          A token-efficient, provider-agnostic foundation. Components, auth, data
          and state are already defined — agents assemble features from the catalog.
        </p>
      </div>

      <div className="grid w-full gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Reference feature</CardTitle>
            <CardDescription>Auth flow built from the kit</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Open login</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Protected page</CardTitle>
            <CardDescription>Dashboard with live data</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                Open dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

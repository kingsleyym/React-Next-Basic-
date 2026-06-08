import type { Metadata } from 'next';
import { Providers } from '@/shared/providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'React Next Basic',
    template: '%s · React Next Basic',
  },
  description: 'Token-efficient, provider-agnostic foundation for React/Next apps.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

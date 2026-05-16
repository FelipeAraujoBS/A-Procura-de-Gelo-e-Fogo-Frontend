'use client';

import { Suspense } from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { Navbar } from '@/components/theme/Navbar';
import { HomeContent } from './HomeContent';
import { Loader2 } from 'lucide-react';

function SearchParamsWrapper() {
  return <HomeContent />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="pt-14">
        {children}
      </main>
    </ThemeProvider>
  );
}

export function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--text-muted)]" />
      </div>
    }>
      <SearchParamsWrapper />
    </Suspense>
  );
}
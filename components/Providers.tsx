'use client';

import { Suspense } from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { Navbar } from '@/components/theme/Navbar';
import { HomeContent } from './HomeContent';

function SearchParamsWrapper() {
  return <HomeContent />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
    </ThemeProvider>
  );
}

export function Home() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-muted">Carregando...</div>}>
      <SearchParamsWrapper />
    </Suspense>
  );
}
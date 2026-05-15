'use client';

import Link from 'next/link';
import { Link2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-borders/50">
      <Link 
        href="/" 
        className="font-heading text-xl font-semibold tracking-wide text-text hover:text-accent transition-colors"
      >
        Uma Procura de Gelo e Fogo
      </Link>
      <div className="flex items-center gap-3">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="p-2 rounded-md hover:bg-surface transition-colors text-muted hover:text-text"
        >
          <Link2 className="h-5 w-5" />
        </a>
        <ThemeToggle />
      </div>
    </nav>
  );
}
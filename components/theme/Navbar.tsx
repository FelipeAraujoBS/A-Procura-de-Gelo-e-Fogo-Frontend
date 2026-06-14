"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { DonateButton } from "@/components/donate/DonateButton";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg)]/80 backdrop-blur-sm border-b border-[var(--border)] h-14 flex items-center justify-between px-6">
      <Link
        href="/"
        className="font-serif text-[15px] font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors tracking-wide"
      >
        Gelo & Fogo
      </Link>
      <div className="flex items-center gap-1">
        <DonateButton />
        <ThemeToggle />
      </div>
    </header>
  );
}

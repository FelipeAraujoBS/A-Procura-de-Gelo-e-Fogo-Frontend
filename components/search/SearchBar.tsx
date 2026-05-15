'use client';

import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export function SearchBar({ value, onChange, onSearch, isLoading }: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Busque por Tyrion, inverno, dragões..."
          className="h-14 pl-5 pr-14 text-lg bg-surface border-borders focus:border-accent rounded-lg shadow-sm"
          aria-label="Campo de busca"
        />
        <Button
          onClick={onSearch}
          disabled={isLoading || !value.trim()}
          size="icon"
          variant="ghost"
          className="absolute right-2 h-10 w-10 text-muted hover:text-accent"
          aria-label="Buscar"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
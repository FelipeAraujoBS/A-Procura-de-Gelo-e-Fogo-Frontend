'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  compact?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function SearchBar({ value, onChange, onSearch, isLoading, compact = false, inputRef }: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const height = compact ? 'h-[38px]' : 'h-14';
  const maxWidth = compact ? 'max-w-full' : 'max-w-[640px]';

  return (
    <div className={`relative w-full ${maxWidth} mx-auto`}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Buscar nos arquivos de Westeros..."
        className={`w-full ${height} px-6 pr-14 border-[1.5px] rounded-lg text-[16px] font-sans bg-[var(--surface)] text-[var(--text-primary)] outline-none transition-all duration-200`}
        style={{
          borderColor: focused ? 'var(--accent)' : 'rgba(198, 169, 114, 0.25)',
          boxShadow: focused ? '0 0 0 3px rgba(198, 169, 114, 0.1)' : 'none',
        }}
      />
      <button
        onClick={onSearch}
        disabled={isLoading || !value.trim()}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[20px] text-[var(--text-muted)] disabled:opacity-40 transition-opacity"
        aria-label="Buscar"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          '🔍'
        )}
      </button>
    </div>
  );
}
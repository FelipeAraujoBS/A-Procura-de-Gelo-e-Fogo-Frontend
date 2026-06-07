'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { getBooks, getPovsWithCounts, type PovWithCount } from '@/services/books';

const BOOKS = [
  { id: '1', name: 'A Guerra dos Tronos' },
  { id: '2', name: 'A Fúria dos Reis' },
  { id: '3', name: 'A Tormenta de Espadas' },
  { id: '4', name: 'Um Festim para Corvos' },
  { id: '5', name: 'A Dança dos Dragões' },
];

function normalizePovName(pov: string): string {
  return pov.replace(/\s+(I+|II|III|IV|V|VI|VII|VIII|IX|X)$/i, '').trim();
}

function groupPovs(povs: PovWithCount[]): PovWithCount[] {
  const grouped = new Map<string, { chapter_count: number; book_count: number }>();
  
  for (const p of povs) {
    const baseName = normalizePovName(p.pov);
    const existing = grouped.get(baseName);
    
    if (existing) {
      existing.chapter_count += p.chapter_count;
      existing.book_count = Math.max(existing.book_count, p.book_count || 1);
    } else {
      grouped.set(baseName, { 
        chapter_count: p.chapter_count, 
        book_count: p.book_count || 1 
      });
    }
  }
  
  return Array.from(grouped.entries()).map(([pov, data]) => ({
    pov,
    chapter_count: data.chapter_count,
    book_count: data.book_count,
  })).sort((a, b) => b.chapter_count - a.chapter_count);
}

interface FiltersProps {
  book: string;
  onBookChange: (book: string) => void;
  selectedPovs: string[];
  onPovChange: (povs: string[]) => void;
  onSearch: (book?: string) => void;
}

function BookFilter({ 
  selected, 
  onChange, 
  onSearch 
}: { 
  selected: string; 
  onChange: (book: string) => void;
  onSearch: (book: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="h-[30px] px-3 border border-[var(--border-soft)] rounded-md text-[13px] text-[var(--text-meta)] bg-[var(--surface)] cursor-pointer flex items-center gap-1.5"
        style={{
          color: selected ? 'var(--accent)' : 'var(--text-meta)',
          background: selected ? 'var(--accent-light)' : 'var(--surface)',
        }}
      >
        {selected ? BOOKS.find(b => b.id === selected)?.name || 'Livro' : 'Livro'} ▾
      </button>

      {open && (
        <div className="absolute top-[36px] left-0 z-50 bg-[var(--surface)] border border-[var(--border)] rounded-lg w-[220px] shadow-lg overflow-hidden">
          <div className="p-2 border-b border-[var(--border)]">
            <button
              onClick={() => {
                onChange('');
                setOpen(false);
                onSearch('');
              }}
              className="w-full text-left px-3 py-1.5 text-[13px] text-[var(--text-primary)] hover:bg-[var(--accent-light)] rounded"
            >
              Todos os livros
            </button>
          </div>
          {BOOKS.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                onChange(b.id);
                setOpen(false);
                onSearch(b.id);
              }}
              className="w-full text-left px-3 py-2 text-[13px] text-[var(--text-primary)] hover:bg-[var(--accent-light)]"
              style={{
                background: selected === b.id ? 'var(--accent-light)' : 'transparent',
                color: selected === b.id ? 'var(--accent)' : 'var(--text-primary)',
              }}
            >
              {b.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PovFilter({ 
  povs, 
  selected, 
  onChange 
}: { 
  povs: PovWithCount[]; 
  selected: string[];
  onChange: (povs: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = povs.filter(p =>
    p.pov.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="h-[30px] px-3 border border-[var(--border-soft)] rounded-md text-[13px] cursor-pointer flex items-center gap-1.5"
        style={{
          color: selected.length > 0 ? 'var(--accent)' : 'var(--text-meta)',
          background: selected.length > 0 ? 'var(--accent-light)' : 'var(--surface)',
        }}
      >
        {selected.length > 0 
          ? `${selected.length} POV selecionado${selected.length > 1 ? 's' : ''}` 
          : 'POV'} ▾
      </button>

      {open && (
        <div className="absolute top-[36px] left-0 z-50 bg-[var(--surface)] border border-[var(--border)] rounded-lg w-[220px] shadow-lg overflow-hidden">
          <div className="p-2 border-b border-[var(--border)]">
            <input
              ref={inputRef}
              placeholder="Buscar personagem..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 px-3 border border-[var(--border)] rounded-md text-[13px] bg-[var(--bg)] text-[var(--text-primary)] outline-none"
            />
          </div>
          <div className="max-h-[240px] overflow-y-auto">
            {filtered.map(({ pov, chapter_count }) => {
              const active = selected.includes(pov);
              return (
                <button
                  key={pov}
                  onClick={() => {
                    onChange(
                      active ? selected.filter(p => p !== pov) : [...selected, pov]
                    );
                  }}
                  className="w-full px-3 py-2 text-left text-[13px] flex justify-between items-center cursor-pointer"
                  style={{
                    background: active ? 'var(--accent-light)' : 'transparent',
                    color: active ? 'var(--accent)' : 'var(--text-primary)',
                  }}
                >
                  <span>{pov}</span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {chapter_count} cap.
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function Filters({ 
  book, 
  onBookChange, 
  selectedPovs, 
  onPovChange,
  onSearch
}: FiltersProps) {
  const [rawPovs, setRawPovs] = useState<PovWithCount[]>([]);

  const groupedPovs = useMemo(() => groupPovs(rawPovs), [rawPovs]);

  useEffect(() => {
    getPovsWithCounts()
      .then(setRawPovs)
      .catch(console.error);
  }, []);

  const removePov = (pov: string) => {
    onPovChange(selectedPovs.filter(p => p !== pov));
  };

  return (
    <div className="flex gap-3 items-center px-4 py-4 flex-wrap">
      <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-meta)]">
        Filtrar
      </span>

      <BookFilter 
        selected={book} 
        onChange={onBookChange} 
        onSearch={(b) => onSearch(b)}
      />

      <PovFilter 
        povs={groupedPovs} 
        selected={selectedPovs} 
        onChange={onPovChange}
      />

      {selectedPovs.map(pov => (
        <button
          key={pov}
          onClick={() => removePov(pov)}
          className="h-7 px-3 border border-[var(--border-accent)] rounded-full text-[12px] text-[var(--accent)] bg-[var(--accent-light)] cursor-pointer flex items-center gap-1.5 font-medium"
        >
          {pov}
          <span className="opacity-60">×</span>
        </button>
      ))}

      {selectedPovs.length > 0 && (
        <button
          onClick={() => onPovChange([])}
          className="text-[11px] text-[var(--text-meta)] bg-none border-none cursor-pointer hover:text-[var(--text-muted)]"
        >
          Limpar
        </button>
      )}
    </div>
  );
}
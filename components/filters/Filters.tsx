'use client';

import { useEffect, useState } from 'react';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { getBooks, getPovs } from '@/services/books';

const BOOKS = [
  { id: '1', name: 'A Guerra dos Tronos' },
  { id: '2', name: 'A Fúria dos Reis' },
  { id: '3', name: 'A Tormenta de Espadas' },
  { id: '4', name: 'Um Festim para Corvos' },
  { id: '5', name: 'A Dança dos Dragões' },
];

interface FiltersProps {
  book: string;
  onBookChange: (book: string) => void;
  pov: string;
  onPovChange: (pov: string) => void;
}

export function Filters({ book, onBookChange, pov, onPovChange }: FiltersProps) {
  const [povs, setPovs] = useState<string[]>([]);
  const safePovs = Array.isArray(povs) ? povs : [];

  useEffect(() => {
    getPovs()
      .then(setPovs)
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-wrap gap-4 items-center justify-center py-6 px-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted font-body">Livro:</span>
        <Select value={book} onValueChange={(v) => onBookChange(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-48" aria-label="Selecionar livro">
            <SelectValue placeholder="Todos os livros" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os livros</SelectItem>
            {BOOKS.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted font-body">POV:</span>
        <Select value={pov} onValueChange={(v) => onPovChange(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-48" aria-label="Selecionar POV">
            <SelectValue placeholder="Todos os POVs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os POVs</SelectItem>
            {safePovs.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
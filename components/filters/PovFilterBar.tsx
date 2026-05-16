'use client';

import { useState, useEffect } from 'react';
import { getPovsWithCounts, type PovWithCount } from '@/services/books';

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

interface PovFilterBarProps {
  selectedPovs: string[];
  onPovChange: (povs: string[]) => void;
}

export function PovFilterBar({ selectedPovs, onPovChange }: PovFilterBarProps) {
  const [rawPovs, setRawPovs] = useState<PovWithCount[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const groupedPovs = groupPovs(rawPovs);

  useEffect(() => {
    getPovsWithCounts()
      .then(setRawPovs)
      .catch(console.error);
  }, []);

  const togglePov = (pov: string) => {
    if (selectedPovs.includes(pov)) {
      onPovChange(selectedPovs.filter(p => p !== pov));
    } else {
      onPovChange([...selectedPovs, pov]);
    }
  };

  const isPovSelected = (pov: string) => selectedPovs.includes(pov);

  const totalPovs = groupedPovs.length;
  const rows = totalPovs % 2 === 0 ? 2 : 3;
  const cols = Math.ceil(totalPovs / rows);

  return (
    <div className="pov-filter-bar">
      <button 
        className="pov-filter-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="pov-filter-title">Filtrar por POV</span>
        <span className={`pov-filter-arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </button>
      
      {isExpanded && (
        <div 
          className="pov-chips-container"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: '10px',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          {groupedPovs.map(({ pov, chapter_count }) => (
            <button
              key={pov}
              onClick={() => togglePov(pov)}
              className={`pov-chip ${isPovSelected(pov) ? 'selected' : ''}`}
            >
              <span className="pov-chip-name">{pov}</span>
              <span className="pov-chip-count">{chapter_count}</span>
            </button>
          ))}
        </div>
      )}

      {selectedPovs.length > 0 && (
        <div className="selected-povs">
          {selectedPovs.map(pov => (
            <button
              key={pov}
              onClick={() => togglePov(pov)}
              className="selected-pov-tag"
            >
              {pov}
              <span className="remove-icon">×</span>
            </button>
          ))}
          <button 
            onClick={() => onPovChange([])}
            className="clear-all-btn"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
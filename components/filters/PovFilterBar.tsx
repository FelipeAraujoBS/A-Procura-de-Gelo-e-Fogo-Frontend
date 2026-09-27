'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
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

  return (
    <div className="pov-filter-bar">
      <button 
        className="pov-filter-header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="pov-filter-title">Filtrar por POV</span>
        <ChevronDown className={`pov-filter-arrow h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div 
              className="pov-chips-container"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '8px',
                maxWidth: '850px',
                margin: '0 auto',
              }}
            >
              {groupedPovs.map(({ pov, chapter_count }) => (
                <motion.button
                  key={pov}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => togglePov(pov)}
                  className={`pov-chip ${isPovSelected(pov) ? 'selected' : ''}`}
                >
                  <span className="pov-chip-name">{pov}</span>
                  <span className="pov-chip-count">{chapter_count}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedPovs.length > 0 && (
        <div className="selected-povs">
          <AnimatePresence>
            {selectedPovs.map(pov => (
              <motion.button
                key={pov}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
                onClick={() => togglePov(pov)}
                className="selected-pov-tag flex items-center gap-1"
              >
                {pov}
                <X className="remove-icon h-3 w-3 ml-1" />
              </motion.button>
            ))}
          </AnimatePresence>
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
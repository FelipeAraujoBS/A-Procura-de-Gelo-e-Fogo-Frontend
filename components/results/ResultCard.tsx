'use client';

import { motion } from 'framer-motion';
import type { SearchResult } from '@/types';

interface ResultCardProps {
  result: SearchResult;
  onClick: () => void;
  index: number;
}

const BOOK_NAMES: Record<number, string> = {
  1: 'A Guerra dos Tronos',
  2: 'A Fúria dos Reis',
  3: 'A Tormenta de Espadas',
  4: 'Um Festim para Corvos',
  5: 'A Dança dos Dragões',
};

export function ResultCard({ result, onClick, index }: ResultCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onClick}
      className="group relative p-6 bg-surface border border-borders/50 rounded-lg cursor-pointer hover:border-accent/50 hover:bg-borders/20 transition-all duration-300"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      aria-label={`Resultado ${index + 1}: ${result.chapter_title}`}
    >
      <div className="space-y-3">
        <div 
          className="text-base leading-relaxed text-text font-body prose"
          dangerouslySetInnerHTML={{ __html: result.snippet }}
        />
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted font-body pt-2 border-t border-borders/30">
          <span className="text-accent font-medium">
            — {result.chapter_title}
          </span>
          <span className="text-muted/60">
            {BOOK_NAMES[result.book_number] || result.book_title}
          </span>
          <span className="text-muted/60">
            Capítulo {result.chapter_number}: {result.chapter_title}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: Math.min(index * 0.035, 0.25) }}
      onClick={onClick}
      className="group relative p-6 bg-surface border border-borders/50 rounded-lg cursor-pointer hover:border-accent/40 hover:shadow-lg hover:shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 transition-[border-color,box-shadow] duration-200"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
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
        
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm text-muted font-body pt-2 border-t border-borders/30">
          <span className="text-accent font-semibold tracking-wide">
            POV: {result.pov || result.chapter_title}
          </span>
          <span className="text-muted/40">•</span>
          <span className="text-muted/80 font-medium">
            {BOOK_NAMES[result.book_number] || result.book_title}
          </span>
          <span className="text-muted/40">•</span>
          <span className="text-muted/60">
            Capítulo {result.chapter_number} ({result.chapter_title})
          </span>
        </div>
      </div>
    </motion.article>
  );
}
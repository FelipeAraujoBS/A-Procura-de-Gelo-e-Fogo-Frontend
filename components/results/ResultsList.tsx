'use client';

import { motion } from 'framer-motion';
import { Loader2, ChevronDown } from 'lucide-react';
import { ResultCard } from './ResultCard';
import { Button } from '@/components/ui/button';
import type { SearchResult } from '@/types';

interface ResultsListProps {
  results: SearchResult[];
  total: number;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onResultClick: (result: SearchResult) => void;
}

export function ResultsList({
  results,
  total,
  isLoading,
  hasMore,
  onLoadMore,
  onResultClick,
}: ResultsListProps) {
  const safeResults = Array.isArray(results) ? results : [];

  if (safeResults.length === 0 && !isLoading) {
    return null;
  }

  return (
    <section className="max-w-3xl mx-auto px-4 pb-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-8"
      >
        <p className="text-muted font-body">
          {total} resultado{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
        </p>
      </motion.div>

      <div className="space-y-4">
        {safeResults.map((result, index) => (
          <ResultCard
            key={`${result.book_number}-${result.chapter_number}-${result.paragraph_index}`}
            result={result}
            onClick={() => onResultClick(result)}
            index={index}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            variant="secondary"
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando...
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Carregar mais resultados
              </>
            )}
          </Button>
        </div>
      )}
    </section>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Hero } from '@/components/hero/Hero';
import { Filters } from '@/components/filters/Filters';
import { ResultsList } from '@/components/results/ResultsList';
import { ChapterModal } from '@/components/modal/ChapterModal';
import { useSearch } from '@/hooks/useSearch';
import type { SearchResult } from '@/types';

export function HomeContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  const {
    query,
    setQuery,
    book,
    setBook,
    pov,
    setPov,
    results,
    total,
    isLoading,
    hasSearched,
    executeSearch,
    loadMore,
    hasMore,
  } = useSearch();

  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const q = searchParams.get('q');
    const b = searchParams.get('book');
    const p = searchParams.get('pov');
    
    if (q && q !== query) {
      setQuery(q);
      setBook(b || '');
      setPov(p || '');
    }
  }, [mounted, searchParams]);

  const handleResultClick = (result: SearchResult) => {
    setSelectedResult(result);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResult(null);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-muted">Carregando...</div>
      </div>
    );
  }

  return (
    <>
      <Hero
        query={query}
        onQueryChange={setQuery}
        onSearch={executeSearch}
        isLoading={isLoading}
        hasSearched={hasSearched}
      />

      {hasSearched && (
        <>
          <Filters
            book={book}
            onBookChange={(value) => {
              setBook(value);
              if (query) executeSearch();
            }}
            pov={pov}
            onPovChange={(value) => {
              setPov(value);
              if (query) executeSearch();
            }}
          />
          <ResultsList
            results={results}
            total={total}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onResultClick={handleResultClick}
          />
        </>
      )}

      <ChapterModal
        result={selectedResult}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
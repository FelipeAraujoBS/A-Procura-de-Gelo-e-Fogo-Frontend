'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';
import type { SearchResult } from '@/types';
import { fetchContext } from '@/services/api';

interface ResultsListProps {
  results: SearchResult[];
  total: number;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  query: string;
  openIndex: number | null;
  onResultClick: (index: number) => void;
  onPovClick: (pov: string) => void;
}

const BOOK_NAMES: Record<number, string> = {
  1: 'A Guerra dos Tronos',
  2: 'A Fúria dos Reis',
  3: 'A Tormenta de Espadas',
  4: 'Um Festim para Corvos',
  5: 'A Dança dos Dragões',
};

function highlightText(text: string, query: string): string {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark class="query-highlight">$1</mark>');
}

function ResultSkeleton() {
  return (
    <div className="py-4 px-3 flex gap-3.5">
      <div className="w-[3px] bg-[var(--border)] rounded-sm" style={{ margin: '2px 0' }} />
      <div className="flex-1">
        <div className="h-[18px] bg-[var(--border)] rounded-sm mb-2 w-[90%]" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div className="h-[18px] bg-[var(--border)] rounded-sm mb-3 w-[70%]" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div className="h-[12px] bg-[var(--border)] rounded-sm w-[40%]" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
    </div>
  );
}

function ContextPanel({ result, query }: { result: SearchResult; query: string }) {
  const [paragraphs, setParagraphs] = useState<Array<{ paragraph_index: number; text: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    fetchContext(result.book_number, result.chapter_number, result.paragraph_index)
      .then(data => {
        setParagraphs(data.paragraphs || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [result]);

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <Loader2 className="h-5 w-5 animate-spin mx-auto text-[var(--text-muted)]" />
        <p className="text-[12px] text-[var(--text-meta)] mt-2">Carregando contexto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-[12px] text-red-500">Erro: {error}</p>
      </div>
    );
  }

  if (paragraphs.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-[12px] text-[var(--text-muted)]">Nenhum contexto encontrado</p>
      </div>
    );
  }

  const targetIndex = result.paragraph_index;
  const prevParagraph = paragraphs.find(p => p.paragraph_index === targetIndex - 1);
  const currentParagraph = paragraphs.find(p => p.paragraph_index === targetIndex);
  const nextParagraph = paragraphs.find(p => p.paragraph_index === targetIndex + 1);

  return (
    <div className="context-panel animate-slide-up">
      <div className="context-header">
        <p className="context-pov">{result.chapter_title}</p>
        <p className="context-meta">
          {BOOK_NAMES[result.book_number] || result.book_title} — Capítulo {result.chapter_number}
        </p>
      </div>

      <div className="context-content">
        {prevParagraph && (
          <p 
            className="context-paragraph context-previous"
            dangerouslySetInnerHTML={{ __html: prevParagraph.text }}
          />
        )}

        {currentParagraph && (
          <div className="context-paragraph context-main">
            <div 
              className="context-text"
              dangerouslySetInnerHTML={{ __html: highlightText(currentParagraph.text, query) }}
            />
          </div>
        )}

        {nextParagraph && (
          <p 
            className="context-paragraph context-next"
            dangerouslySetInnerHTML={{ __html: nextParagraph.text }}
          />
        )}
      </div>
    </div>
  );
}

function ResultItem({ 
  result, 
  isOpen, 
  onClick, 
  onPovClick,
  query 
}: { 
  result: SearchResult; 
  isOpen: boolean; 
  onClick: () => void;
  onPovClick: (pov: string) => void;
  query: string;
}) {
  return (
    <>
      <div
        onClick={onClick}
        className="result-item"
        style={{
          background: isOpen ? 'var(--surface)' : 'transparent',
        }}
      >
        <div className={`result-border ${isOpen ? 'active' : ''}`} />

        <div className="result-content">
          <p
            className="result-snippet"
            dangerouslySetInnerHTML={{ __html: result.snippet }}
          />

          <div className="result-meta">
            <button
              onClick={(e) => { e.stopPropagation(); onPovClick(result.pov); }}
              className="result-pov"
            >
              {result.chapter_title}
            </button>
            <span className="result-divider">—</span>
            <span>{BOOK_NAMES[result.book_number] || result.book_title}</span>
            <span className="result-divider">·</span>
            <span>Capítulo {result.chapter_number}</span>
          </div>
        </div>
      </div>

      {isOpen && (
        <ContextPanel result={result} query={query} />
      )}
    </>
  );
}

export function ResultsList({
  results,
  total,
  isLoading,
  hasMore,
  onLoadMore,
  query,
  openIndex,
  onResultClick,
  onPovClick,
}: ResultsListProps) {
  const safeResults = Array.isArray(results) ? results : [];

  if (safeResults.length === 0 && !isLoading) {
    return (
      <div className="results-container text-center py-16">
        <p className="font-serif text-2xl text-[var(--text-primary)] mb-3">
          Nenhum resultado encontrado
        </p>
        <p className="font-sans text-[var(--text-muted)] text-sm leading-relaxed max-w-sm mx-auto">
          Não encontramos nenhum trecho correspondente à sua busca. Tente outros termos ou ajuste os filtros.
        </p>
      </div>
    );
  }

  return (
    <div className="results-container">
      <p className="results-count">
        {total} resultado{total !== 1 ? 's' : ''} para "{query}"
      </p>

      {isLoading && safeResults.length === 0 ? (
        <>
          {[...Array(5)].map((_, i) => (
            <ResultSkeleton key={i} />
          ))}
        </>
      ) : (
        <>
          {safeResults.map((result, i) => (
            <ResultItem
              key={`${result.book_number}-${result.chapter_number}-${result.paragraph_index}`}
              result={result}
              isOpen={openIndex === i}
              onClick={() => onResultClick(i)}
              onPovClick={onPovClick}
              query={query}
            />
          ))}
        </>
      )}

      {hasMore && (
        <button 
          onClick={onLoadMore} 
          disabled={isLoading}
          className="load-more-btn"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Carregar mais
        </button>
      )}
    </div>
  );
}
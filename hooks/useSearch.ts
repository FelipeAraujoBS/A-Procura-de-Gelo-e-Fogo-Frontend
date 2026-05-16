'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { search } from '@/services/search';
import type { SearchResult, SearchParams } from '@/types';

interface UseSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  book: string;
  setBook: (b: string) => void;
  povs: string[];
  setPovs: (p: string[]) => void;
  results: SearchResult[];
  total: number;
  isLoading: boolean;
  hasSearched: boolean;
  executeSearch: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export function useSearch(): UseSearchReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [book, setBook] = useState(searchParams.get('book') || '');
  const [povs, setPovs] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentQuery, setCurrentQuery] = useState('');

  const limit = 10;
  const hasMore = results.length < total;

  const updateURL = useCallback((q: string, b: string, p: string[]) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (b) params.set('book', b);
    if (p.length > 0) params.set('povs', p.join(','));
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : '/', { scroll: false });
  }, [router]);

  const performSearch = useCallback(async (q: string, b: string, p: string[], resetResults = true) => {
    if (!q.trim()) return;

    setIsLoading(true);
    try {
      const params: SearchParams = {
        q,
        limit,
        offset: resetResults ? 0 : offset,
      };
      if (b) params.book = b;
      if (p.length > 0) params.povs = p;

      const response = await search(params);
      
      const results = Array.isArray(response.results) ? response.results : [];
      
      if (resetResults) {
        setResults(results);
        setOffset(results.length);
      } else {
        setResults(prev => [...prev, ...results]);
        setOffset(prev => prev + results.length);
      }
      setTotal(response.total ?? 0);
      setHasSearched(true);
      setCurrentQuery(q);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [offset]);

  const executeSearch = useCallback(async () => {
    setOffset(0);
    await performSearch(query, book, povs, true);
    updateURL(query, book, povs);
  }, [query, book, povs, performSearch, updateURL]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    await performSearch(currentQuery, book, povs, false);
  }, [isLoading, hasMore, currentQuery, book, povs, performSearch]);

  useEffect(() => {
    const q = searchParams.get('q');
    const b = searchParams.get('book');
    const p = searchParams.get('povs');
    
    if (q) {
      setQuery(q);
      setBook(b || '');
      setPovs(p ? p.split(',') : []);
      performSearch(q, b || '', p ? p.split(',') : [], true);
    }
  }, []);

  return {
    query,
    setQuery,
    book,
    setBook,
    povs,
    setPovs,
    results,
    total,
    isLoading,
    hasSearched,
    executeSearch,
    loadMore,
    hasMore,
  };
}
"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search/SearchBar";
import { Filters } from "@/components/filters/Filters";
import { ResultsList } from "@/components/results/ResultsList";
import { PovFilterBar } from "@/components/filters/PovFilterBar";
import { useSearch } from "@/hooks/useSearch";
import type { SearchResult } from "@/types";
import { Loader2 } from "lucide-react";

const SUGGESTIONS = [
  '"O inverno está chegando"',
  '"Um Lannister sempre paga suas dívidas"',
  '"Você não sabe de nada, Jon Snow"',
  '"Quando você joga o jogo dos tronos"',
  '"Dracarys"',
  '"Valar Morghulis"',
];

const FOOTER_LINKS = [
  { text: "10 livros indexados", href: "#" },
  { text: "2.400+ capítulos", href: "#" },
  { text: "Busca instantânea", href: "#" },
];

export function HomeContent() {
  const [mounted, setMounted] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
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
  } = useSearch();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (searchQuery?: string) => {
    const q = searchQuery || query;
    if (q.trim()) {
      setQuery(q);
      executeSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const cleanSuggestion = suggestion.replace(/"/g, "");
    setQuery(cleanSuggestion);
    handleSearch(cleanSuggestion);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const addPovFilter = (pov: string) => {
    if (!povs.includes(pov)) {
      setPovs([...povs, pov]);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--text-muted)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Main Container */}
      <div className="main-container">
        {/* Header Section */}
        <div className="header-section">
          <div className="eyebrow">Arquivo dos Maesters</div>
          <h1 className="main-title">UMA PROCURA DE GELO E FOGO</h1>
          <p className="supporting-text">
            Explore cada palavra das Crônicas de Gelo e Fogo. Pesquise
            personagens, profecias, locais e frases icônicas.
          </p>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-container">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSearch={() => handleSearch()}
              isLoading={isLoading}
              compact={false}
              inputRef={searchInputRef}
            />
          </div>
        </div>

        {/* POV Filter Bar (Always Visible) */}
        <div className="pov-filter-section">
          <PovFilterBar
            selectedPovs={povs}
            onPovChange={(newPovs) => {
              setPovs(newPovs);
              if (query && hasSearched) {
                handleSearch();
              }
            }}
          />
        </div>

        {/* Suggestions */}
        <div className="suggestions-section">
          <p className="suggestions-label">Explorar</p>
          <div className="suggestions-list">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestionClick(s)}
                className="suggestion-chip"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Filters (visible after search) */}
        {hasSearched && (
          <div className="filters-section">
            <Filters
              book={book}
              onBookChange={(value) => {
                setBook(value);
                if (query) handleSearch();
              }}
              selectedPovs={povs}
              onPovChange={(value) => {
                setPovs(value);
                if (query) handleSearch();
              }}
              onSearch={() => handleSearch()}
            />
          </div>
        )}

        {/* Results */}
        {hasSearched && (
          <ResultsList
            results={results}
            total={total}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            query={query}
            openIndex={openIndex}
            onResultClick={(idx) =>
              setOpenIndex(openIndex === idx ? null : idx)
            }
            onPovClick={addPovFilter}
          />
        )}

        {/* Footer */}
        <footer className="site-footer">
          <div className="footer-links">
            {FOOTER_LINKS.map((link, i) => (
              <span key={i} className="footer-link">
                {link.text}
              </span>
            ))}
          </div>
          <p className="footer-credit">
            Uma Procura de Gelo e Fogo — Arquivo dos Maesters
          </p>
        </footer>
      </div>
    </div>
  );
}

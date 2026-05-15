'use client';

import { motion } from 'framer-motion';
import { SearchBar } from '@/components/search/SearchBar';
import type { Quote } from '@/types';

const QUOTES: Quote[] = [
  { text: 'O caos não é um poço. É uma escada.', author: 'Varys' },
  { text: 'Aquele que pronunciou o juramento não está mais.', author: 'Eddard Stark' },
  { text: 'O inverno está vindo.', author: 'House Stark' },
  { text: 'Um Lannister sempre paga suas dívidas.', author: 'House Lannister' },
  { text: 'Fogo e sangue.', author: 'House Targaryen' },
  { text: 'Não importa o que digamos, só importa o que fazemos.', author: 'Jaime Lannister' },
  { text: 'A mente precisa de livros assim como a espada precisa de pedras para afiar.', author: 'Samwell Tarly' },
  { text: 'Nenhum homem pode me matar.', author: 'Gregor Clegane' },
];

interface HeroProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  hasSearched: boolean;
}

function getRandomQuote(): Quote {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

export function Hero({ query, onQueryChange, onSearch, isLoading, hasSearched }: HeroProps) {
  const quote = getRandomQuote();

  return (
    <motion.section
      initial={{ opacity: 1 }}
      animate={{ 
        minHeight: hasSearched ? '25vh' : '70vh',
        paddingTop: hasSearched ? '100px' : '140px'
      }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="flex flex-col items-center justify-center px-6 pb-8"
    >
      {!hasSearched && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-wide text-text mb-4">
            Uma Procura de Gelo e Fogo
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-xl mx-auto font-body">
            Explore personagens, batalhas, profecias e segredos
            escondidos nas Crônicas de Gelo e Fogo.
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: hasSearched ? 0 : 0.4 }}
        className="w-full"
      >
        <SearchBar
          value={query}
          onChange={onQueryChange}
          onSearch={onSearch}
          isLoading={isLoading}
        />
      </motion.div>

      {!hasSearched && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 text-center font-heading text-2xl md:text-3xl italic text-muted/60 max-w-2xl"
        >
          "{quote.text}"
          {quote.author && (
            <span className="block mt-4 text-sm not-italic font-body text-muted/40">
              — {quote.author}
            </span>
          )}
        </motion.p>
      )}
    </motion.section>
  );
}
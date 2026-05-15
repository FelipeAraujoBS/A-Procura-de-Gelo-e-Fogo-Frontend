'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { getChapter } from '@/services/books';
import type { Chapter, SearchResult } from '@/types';
import { Button } from '@/components/ui/button';

interface ChapterModalProps {
  result: SearchResult | null;
  isOpen: boolean;
  onClose: () => void;
}

const BOOK_NAMES: Record<number, string> = {
  1: 'A Guerra dos Tronos',
  2: 'A Fúria dos Reis',
  3: 'A Tormenta de Espadas',
  4: 'Um Festim para Corvos',
  5: 'A Dança dos Dragões',
};

export function ChapterModal({ result, isOpen, onClose }: ChapterModalProps) {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (result && isOpen) {
      setIsLoading(true);
      setError(null);
      getChapter(result.book_number, result.chapter_number)
        .then(setChapter)
        .catch((err) => {
          console.error('Error loading chapter:', err);
          setError('Erro ao carregar o capítulo');
        })
        .finally(() => setIsLoading(false));
    }
  }, [result, isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!result) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            aria-hidden="true"
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-2xl max-h-[85vh] bg-surface border border-borders rounded-lg shadow-2xl overflow-hidden pointer-events-auto"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-borders bg-surface/95 backdrop-blur">
                <div>
                  <h2 className="font-heading text-xl font-semibold text-text">
                    {result.chapter_title}
                  </h2>
                  <p className="text-sm text-muted font-body">
                    {BOOK_NAMES[result.book_number]} — POV: {result.pov}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="Fechar modal"
                  className="shrink-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                  </div>
                ) : error ? (
                  <p className="text-center text-muted py-12">{error}</p>
                ) : chapter ? (
                  <div className="space-y-4 font-body text-text leading-relaxed">
                    {chapter.paragraphs.map((paragraph, idx) => (
                      <p 
                        key={idx}
                        className={idx === result.paragraph_index ? 'bg-accent/10 rounded p-2 -mx-2' : ''}
                      >
                        {paragraph.text}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted py-12">
                    Capítulo não encontrado
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
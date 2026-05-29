'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { ChatPanel } from './ChatPanel';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    },
    [isOpen]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!mounted) return null;

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          className="chat-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div className={`chat-wrapper ${isOpen ? 'chat-wrapper-open' : 'chat-wrapper-closed'}`}>
        {isOpen && <ChatPanel onClose={() => setIsOpen(false)} />}
      </div>

      {/* FAB */}
      <button
        onClick={handleToggle}
        className={`chat-fab ${isOpen ? 'chat-fab-open' : ''}`}
        aria-label={isOpen ? 'Fechar' : 'Pergunte aos Meistres'}
        title="Pergunte aos Meistres"
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
        {!isOpen && <span className="chat-fab-label">Pergunte aos Meistres</span>}
      </button>
    </>
  );
}

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { ChatPanel } from './ChatPanel';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!isOpen) return;

    const setHeight = () => {
      if (wrapperRef.current && window.visualViewport) {
        wrapperRef.current.style.height = `${window.visualViewport.height}px`;
      }
    };

    const handleViewportResize = () => {
      requestAnimationFrame(setHeight);
    };

    let pollRaf: number;

    const startPolling = () => {
      let attempts = 0;
      const poll = () => {
        setHeight();
        if (++attempts < 30) pollRaf = requestAnimationFrame(poll);
      };
      pollRaf = requestAnimationFrame(poll);
    };

    const handleFocusIn = (e: FocusEvent) => {
      if (e.target instanceof HTMLElement && wrapperRef.current?.contains(e.target)) {
        startPolling();
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      if (e.target instanceof HTMLElement && wrapperRef.current?.contains(e.target)) {
        cancelAnimationFrame(pollRaf);
        requestAnimationFrame(setHeight);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportResize);
    }
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    setHeight();

    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportResize);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      cancelAnimationFrame(pollRaf);
    };
  }, [isOpen]);

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
      <div ref={wrapperRef} className={`chat-wrapper ${isOpen ? 'chat-wrapper-open' : 'chat-wrapper-closed'}`}>
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

'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, BookOpen, ChevronRight } from 'lucide-react';
import type { ChatMessage } from '@/types';
import { sendChatMessage } from '@/services/chat';

let messageId = 0;
function nextId() {
  return `msg_${++messageId}_${Date.now()}`;
}

export function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Bem-vindo ao Arquivo dos Meistres. Pergunte-me sobre personagens, batalhas, profecias ou qualquer passagem das Crônicas de Gelo e Fogo.',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;

    const scrollToBottom = () => {
      requestAnimationFrame(() => {
        listEl.scrollTo({ top: listEl.scrollHeight, behavior: 'smooth' });
      });
    };

    const observer = new ResizeObserver(() => {
      scrollToBottom();
    });
    observer.observe(listEl);

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', scrollToBottom);
    }

    return () => {
      observer.disconnect();
      window.visualViewport?.removeEventListener('resize', scrollToBottom);
    };
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');

    const userMsg: ChatMessage = {
      id: nextId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const apiMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const { reply } = await sendChatMessage(apiMessages);
      setMessages((prev) => [...prev, reply]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'assistant',
          content:
            'Perdoe-me, parece que não consegui consultar os pergaminhos agora. Tente novamente mais tarde.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-panel">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <BookOpen className="chat-header-icon" size={16} />
          <span className="chat-header-title">Arquivo dos Meistres</span>
        </div>
        <button onClick={onClose} className="chat-close-btn" aria-label="Fechar">
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div ref={listRef} className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-msg ${msg.role === 'user' ? 'chat-msg-user' : 'chat-msg-assistant'}`}>
            <div className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}>
              <p className="chat-bubble-text">{msg.content}</p>
            </div>
            {msg.sources && msg.sources.length > 0 && (
              <div className="chat-sources">
                <p className="chat-sources-label">Fontes consultadas:</p>
                {msg.sources.map((src, i) => (
                  <div key={i} className="chat-source-item">
                    <ChevronRight size={12} className="chat-source-arrow" />
                    <span>
                      {src.book_title}
                      {' — '}
                      {src.chapter_title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="chat-msg chat-msg-assistant">
            <div className="chat-bubble chat-bubble-assistant">
              <div className="chat-loading">
                <Loader2 size={14} className="animate-spin" />
                <span>Consultando os pergaminhos...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte aos Meistres..."
            className="chat-input"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="chat-send-btn"
            aria-label="Enviar"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

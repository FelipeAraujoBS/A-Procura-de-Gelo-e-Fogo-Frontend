'use client';

import { MessageCircle } from 'lucide-react';
import { ChatPanel } from './ChatPanel';

export function ChatButton() {
  const handleClick = () => {
    const event = new CustomEvent('toggle-chat');
    window.dispatchEvent(event);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="chat-fab"
        aria-label="Pergunte aos Meistres"
        title="Pergunte aos Meistres"
      >
        <MessageCircle size={20} />
        <span className="chat-fab-label">Pergunte aos Meistres</span>
      </button>
    </>
  );
}

export function ChatContainer() {
  return (
    <div id="chat-root" className="chat-root" />
  );
}

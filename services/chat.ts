import { fetchApi } from './api';
import type { ChatMessage } from '@/types';

export async function sendChatMessage(
  messages: { role: string; content: string }[]
): Promise<{ reply: ChatMessage }> {
  return fetchApi<{ reply: ChatMessage }>('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages }),
  });
}

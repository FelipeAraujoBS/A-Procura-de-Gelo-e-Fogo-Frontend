import { fetchApi } from './api';
import type { Book, Chapter } from '@/types';

export async function getBooks(): Promise<Book[]> {
  return fetchApi<Book[]>('/books');
}

export async function getBookChapters(bookId: number): Promise<{ id: number; title: string; number: number }[]> {
  return fetchApi(`/books/${bookId}/chapters`);
}

export async function getChapter(bookId: number, chapterNumber: number): Promise<Chapter> {
  return fetchApi<Chapter>(`/books/${bookId}/chapters/${chapterNumber}`);
}

export async function getPovs(): Promise<string[]> {
  const response = await fetchApi<{ povs: Array<{ pov: string; chapter_count: number }> }>('/povs');
  return response.povs.map(p => p.pov);
}

export interface PovWithCount {
  pov: string;
  chapter_count: number;
  book_count?: number;
}

export async function getPovsWithCounts(): Promise<PovWithCount[]> {
  const response = await fetchApi<{ povs: PovWithCount[] }>('/povs');
  return response.povs;
}
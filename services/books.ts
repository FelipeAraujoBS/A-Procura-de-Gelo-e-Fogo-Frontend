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
  return fetchApi<string[]>('/povs');
}
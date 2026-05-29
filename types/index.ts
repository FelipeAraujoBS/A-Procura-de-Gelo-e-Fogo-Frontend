export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: {
    book_title: string;
    chapter_title: string;
    chapter_number: number;
    text: string;
  }[];
  timestamp: number;
}

export interface SearchResult {
  book_number: number;
  book_title: string;
  chapter_number: number;
  chapter_title: string;
  pov: string;
  paragraph_index: number;
  snippet: string;
}

export interface SearchResponse {
  query: string;
  total: number;
  limit: number;
  offset: number;
  results: SearchResult[];
}

export interface Book {
  id: number;
  title: string;
  number: number;
}

export interface Chapter {
  id: number;
  title: string;
  number: number;
  book_id: number;
  paragraphs: Paragraph[];
}

export interface Paragraph {
  index: number;
  text: string;
  pov?: string;
}

export interface SearchParams {
  q?: string;
  book?: string;
  povs?: string[];
  limit?: number;
  offset?: number;
}

export interface UseSearchState {
  query: string;
  book: string;
  pov: string;
  results: SearchResult[];
  total: number;
  isLoading: boolean;
  hasSearched: boolean;
}

export type Theme = 'light' | 'dark';

export interface Quote {
  text: string;
  author?: string;
}
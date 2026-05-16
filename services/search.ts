import { fetchApi } from './api';
import type { SearchResponse, SearchParams } from '@/types';

export async function search(params: SearchParams): Promise<SearchResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.q) searchParams.set('q', params.q);
  if (params.book) searchParams.set('book', params.book);
  if (params.povs && params.povs.length > 0) {
    searchParams.set('povs', params.povs.join(','));
  }
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.offset) searchParams.set('offset', params.offset.toString());

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/search?${queryString}` : '/search';

  return fetchApi<SearchResponse>(endpoint);
}
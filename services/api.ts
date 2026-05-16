const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

console.log('API_BASE_URL:', API_BASE_URL);

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export function fetchContext(book: number, chapter: number, index: number) {
  return fetchApi<{ paragraphs: Array<{ paragraph_index: number; text: string }> }>(
    `/context?book=${book}&chapter=${chapter}&index=${index}`
  );
}
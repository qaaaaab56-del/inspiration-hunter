import type { Inspiration, InspirationListResponse, SearchResponse, SimilarResponse } from '../types';

const BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  createInspiration(content: string): Promise<Inspiration> {
    return request<Inspiration>('/inspirations', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  listInspirations(limit = 20, offset = 0): Promise<InspirationListResponse> {
    return request<InspirationListResponse>(`/inspirations?limit=${limit}&offset=${offset}`);
  },

  getInspiration(id: string): Promise<Inspiration> {
    return request<Inspiration>(`/inspirations/${id}`);
  },

  deleteInspiration(id: string): Promise<{ success: boolean }> {
    return request(`/inspirations/${id}`, { method: 'DELETE' });
  },

  processAllAI(id: string): Promise<Inspiration> {
    return request<Inspiration>('/ai/process-all', {
      method: 'POST',
      body: JSON.stringify({ inspiration_id: id }),
    });
  },

  searchInspirations(q: string): Promise<SearchResponse> {
    return request<SearchResponse>(`/inspirations/search?q=${encodeURIComponent(q)}`);
  },

  getSimilarInspirations(id: string): Promise<SimilarResponse> {
    return request<SimilarResponse>(`/inspirations/${id}/similar`);
  },
};

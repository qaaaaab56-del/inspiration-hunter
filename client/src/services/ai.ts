import type { AISummarizeResponse, AITitleResponse, AIKeywordsResponse, AIExtendResponse } from '../types';

const BASE = '/api/ai';

async function request<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'AI request failed');
  }

  return res.json();
}

export const ai = {
  summarize(content: string): Promise<AISummarizeResponse> {
    return request('/summarize', { content });
  },

  generateTitle(content: string): Promise<AITitleResponse> {
    return request('/generate-title', { content });
  },

  extractKeywords(content: string): Promise<AIKeywordsResponse> {
    return request('/extract-keywords', { content });
  },

  extendThought(content: string): Promise<AIExtendResponse> {
    return request('/extend-thought', { content });
  },
};

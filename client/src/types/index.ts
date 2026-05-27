export interface Inspiration {
  id: string;
  content: string;
  title: string | null;
  summary: string | null;
  keywords: string[] | null;
  embedding_keywords: string | null;
  extended_thoughts: ExtendedThought[] | null;
  source: 'text' | 'voice';
  ai_status: 'idle' | 'processing' | 'done' | 'error';
  created_at: string;
  updated_at: string;
}

export interface ExtendedThought {
  direction: string;
  content: string;
}

export interface InspirationListResponse {
  data: Inspiration[];
  total: number;
  hasMore: boolean;
}

export interface AISummarizeResponse {
  summary: string;
}

export interface AIExtendResponse {
  extended_thoughts: ExtendedThought[];
}

export interface SearchResponse {
  data: Inspiration[];
  query: string;
}

export interface SimilarResponse {
  data: Inspiration[];
}

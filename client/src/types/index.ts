export interface Inspiration {
  id: string;
  content: string;
  title: string | null;
  summary: string | null;
  keywords: string[] | null;
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

export interface AIProcessRequest {
  content: string;
}

export interface AISummarizeResponse {
  summary: string;
}

export interface AITitleResponse {
  title: string;
}

export interface AIKeywordsResponse {
  keywords: string[];
}

export interface AIExtendResponse {
  extended_thoughts: ExtendedThought[];
}

export interface Inspiration {
  id: string;
  content: string;
  title: string | null;
  summary: string | null;
  keywords: string | null;
  extended_thoughts: string | null;
  source: 'text' | 'voice';
  ai_status: 'idle' | 'processing' | 'done' | 'error';
  created_at: string;
  updated_at: string;
}

export interface ExtendedThought {
  direction: string;
  content: string;
}

export interface CreateInspirationInput {
  content: string;
  source?: 'text' | 'voice';
}

export interface InspirationListParams {
  limit?: number;
  offset?: number;
}

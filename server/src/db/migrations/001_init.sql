CREATE TABLE IF NOT EXISTS inspirations (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  title TEXT,
  summary TEXT,
  keywords TEXT,
  extended_thoughts TEXT,
  source TEXT NOT NULL DEFAULT 'text',
  ai_status TEXT NOT NULL DEFAULT 'idle',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inspirations_created_at ON inspirations(created_at DESC);

import { v4 as uuidv4 } from 'uuid';
import db from '../db/index.js';
import type { Inspiration, CreateInspirationInput, InspirationListParams } from '../types/index.js';

export function createInspiration(input: CreateInspirationInput): Inspiration {
  const id = uuidv4();
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO inspirations (id, content, title, summary, keywords, extended_thoughts, source, ai_status, created_at, updated_at)
    VALUES (?, ?, NULL, NULL, NULL, NULL, ?, 'idle', ?, ?)
  `);

  stmt.run(id, input.content, input.source || 'text', now, now);

  return getInspirationById(id)!;
}

export function getInspirationById(id: string): Inspiration | undefined {
  return db.prepare('SELECT * FROM inspirations WHERE id = ?').get(id) as Inspiration | undefined;
}

export function listInspirations(params: InspirationListParams): { data: Inspiration[]; total: number; hasMore: boolean } {
  const limit = params.limit || 20;
  const offset = params.offset || 0;

  const countRow = db.prepare('SELECT COUNT(*) as total FROM inspirations').get() as { total: number };
  const total = countRow.total;

  const data = db
    .prepare('SELECT * FROM inspirations ORDER BY created_at DESC LIMIT ? OFFSET ?')
    .all(limit, offset) as Inspiration[];

  return {
    data: data.map(parseInspiration),
    total,
    hasMore: offset + limit < total,
  };
}

export function deleteInspiration(id: string): boolean {
  const result = db.prepare('DELETE FROM inspirations WHERE id = ?').run(id);
  return result.changes > 0;
}

export function updateInspiration(id: string, fields: Partial<Inspiration>): Inspiration | undefined {
  const existing = getInspirationById(id);
  if (!existing) return undefined;

  const allowed = ['title', 'summary', 'keywords', 'extended_thoughts', 'ai_status'];
  const updates: string[] = [];
  const values: unknown[] = [];

  for (const key of allowed) {
    if (key in fields) {
      updates.push(`${key} = ?`);
      values.push((fields as Record<string, unknown>)[key]);
    }
  }

  if (updates.length === 0) return existing;

  updates.push('updated_at = ?');
  values.push(new Date().toISOString());
  values.push(id);

  db.prepare(`UPDATE inspirations SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  return getInspirationById(id);
}

/** Parse JSON fields from DB strings to JS values for API response */
export function parseInspiration(row: Inspiration): Inspiration {
  return {
    ...row,
    keywords: row.keywords ? JSON.parse(row.keywords) : null,
    extended_thoughts: row.extended_thoughts ? JSON.parse(row.extended_thoughts) : null,
  };
}

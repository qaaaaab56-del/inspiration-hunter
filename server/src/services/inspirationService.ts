import { v4 as uuidv4 } from 'uuid';
import { db, saveDb } from '../db/index.js';
import type { Inspiration, CreateInspirationInput, InspirationListParams } from '../types/index.js';

function rowToInspiration(row: Record<string, unknown>): Inspiration {
  return {
    id: row.id as string,
    content: row.content as string,
    title: (row.title as string) || null,
    summary: (row.summary as string) || null,
    keywords: (row.keywords as string) || null,
    extended_thoughts: (row.extended_thoughts as string) || null,
    source: (row.source as 'text' | 'voice') || 'text',
    ai_status: (row.ai_status as Inspiration['ai_status']) || 'idle',
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

function queryOne(sql: string, params: SqlJsParams): Record<string, unknown> | null {
  const d = db();
  const stmt = d.prepare(sql);
  stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

function queryAll(sql: string, params: SqlJsParams): Record<string, unknown>[] {
  const d = db();
  const stmt = d.prepare(sql);
  stmt.bind(params);
  const rows: Record<string, unknown>[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function execute(sql: string, params: SqlJsParams): void {
  db().run(sql, params);
}

// sql.js bind() accepts SqlJsParams (array or object)
// Our queries use positional params (?), so we always pass arrays
type SqlJsParams = unknown[];

export function createInspiration(input: CreateInspirationInput): Inspiration {
  const id = uuidv4();
  const now = new Date().toISOString();

  execute(
    `INSERT INTO inspirations (id, content, title, summary, keywords, extended_thoughts, source, ai_status, created_at, updated_at)
     VALUES (?, ?, NULL, NULL, NULL, NULL, ?, 'idle', ?, ?)`,
    [id, input.content, input.source || 'text', now, now]
  );
  saveDb();

  return getInspirationById(id)!;
}

export function getInspirationById(id: string): Inspiration | undefined {
  const row = queryOne('SELECT * FROM inspirations WHERE id = ?', [id]);
  return row ? rowToInspiration(row) : undefined;
}

export function listInspirations(params: InspirationListParams): { data: Inspiration[]; total: number; hasMore: boolean } {
  const limit = params.limit || 20;
  const offset = params.offset || 0;

  const countRow = queryOne('SELECT COUNT(*) as total FROM inspirations', []);
  const total = (countRow?.total as number) || 0;

  const rows = queryAll(
    'SELECT * FROM inspirations ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );

  return {
    data: rows.map(rowToInspiration).map(parseInspiration),
    total,
    hasMore: offset + limit < total,
  };
}

export function deleteInspiration(id: string): boolean {
  const d = db();
  const stmt = d.prepare('DELETE FROM inspirations WHERE id = ?');
  stmt.bind([id]);
  stmt.step();
  const changes = d.getRowsModified();
  stmt.free();
  saveDb();
  return changes > 0;
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

  execute(`UPDATE inspirations SET ${updates.join(', ')} WHERE id = ?`, values);
  saveDb();

  return getInspirationById(id);
}

export function parseInspiration(row: Inspiration): Inspiration {
  return {
    ...row,
    keywords: row.keywords ? JSON.parse(row.keywords) : null,
    extended_thoughts: row.extended_thoughts ? JSON.parse(row.extended_thoughts) : null,
  };
}

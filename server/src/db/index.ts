import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', '..', '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'inspirations.db');

let _db: SqlJsDatabase | null = null;

export async function initDb(): Promise<SqlJsDatabase> {
  if (_db) return _db;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    _db = new SQL.Database(buffer);
  } else {
    _db = new SQL.Database();
  }

  _db.run('PRAGMA journal_mode = OFF');
  _db.run('PRAGMA foreign_keys = ON');

  return _db;
}

/** Must call initDb() before using this */
export function db(): SqlJsDatabase {
  if (!_db) throw new Error('Database not initialized. Call initDb() first.');
  return _db;
}

export function saveDb(): void {
  if (!_db) return;
  const data = _db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

export async function migrate(): Promise<void> {
  await initDb();

  // Track applied migrations
  _db!.run(`CREATE TABLE IF NOT EXISTS _migrations (
    name TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL
  )`);

  const migrationsDir = path.resolve(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

  for (const file of files) {
    // Check if already applied
    const stmt = _db!.prepare('SELECT 1 FROM _migrations WHERE name = ?');
    stmt.bind([file]);
    const alreadyApplied = stmt.step();
    stmt.free();

    if (alreadyApplied) {
      console.log(`Migration skipped (already applied): ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    _db!.run(sql);
    _db!.run('INSERT INTO _migrations (name, applied_at) VALUES (?, ?)', [file, new Date().toISOString()]);
    console.log(`Migration applied: ${file}`);
  }
  saveDb();
}

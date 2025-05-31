import { Database, RunResult } from 'sqlite3';
import path from 'path';
import { createConfigTable } from '../config';
import { createTasksTable } from '../tasks';

// Create a new database instance
const db = new Database(
  path.join(__dirname, '../../database.sqlite'),
  (err) => {
    if (err) {
      console.error('Error opening database:', err);
    } else {
      console.log('Connected to SQLite database');
      initializeDatabase();
    }
  }
);

// Initialize database with tables
function initializeDatabase() {
  db.serialize(() => {
    createConfigTable(db)
    createTasksTable(db)
  });
}

// Helper function to promisify db.get
export function dbGet<T>(query: string, params: any[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row as T | undefined);
    });
  });
}

// Helper function to promisify db.all
export function dbGetAll<T>(query: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
}

// Helper function to promisify db.run
export function dbRun(query: string, params: any[] = []): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

export default db; 
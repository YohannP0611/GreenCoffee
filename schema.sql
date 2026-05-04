-- Schema for Green Coffee.
-- Lean schema: only fields actually needed by the MVP.

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user','admin')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS coffees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  origin TEXT NOT NULL,
  region TEXT,
  variety TEXT NOT NULL CHECK(variety IN ('Arabica','Robusta','Liberica','Excelsa')),
  process TEXT NOT NULL CHECK(process IN ('Washed','Natural','Honey','Anaerobic')),
  altitude_m INTEGER,
  tasting_notes TEXT,
  description TEXT NOT NULL,
  created_by INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_coffees_variety ON coffees(variety);
CREATE INDEX IF NOT EXISTS idx_coffees_origin ON coffees(origin);
CREATE INDEX IF NOT EXISTS idx_coffees_created_by ON coffees(created_by);

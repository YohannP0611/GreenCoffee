// SQLite connection via node:sqlite (built into Node >=22.5).
// Zero native dependency: no compilation required. A sound Green IT choice.

const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'database', 'app.db');

const db = new DatabaseSync(dbPath);
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

module.exports = db;

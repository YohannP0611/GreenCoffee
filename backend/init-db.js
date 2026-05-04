// Initialises the database: schema + admin user + seed.
// Usage: npm run init-db

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./db');

const schemaSQL = fs.readFileSync(path.join(__dirname, '..', 'database', 'schema.sql'), 'utf8');
const seedSQL = fs.readFileSync(path.join(__dirname, '..', 'database', 'seed.sql'), 'utf8');

console.log('Applying schema...');
db.exec(schemaSQL);

const userCount = db.prepare('SELECT COUNT(*) AS n FROM users').get().n;

if (userCount === 0) {
  console.log('Creating admin user...');
  const hash = bcrypt.hashSync('admin1234', 10);
  db.prepare(
    'INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)'
  ).run('admin@green.coffee', 'Admin', hash, 'admin');

  const userHash = bcrypt.hashSync('user1234', 10);
  db.prepare(
    'INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)'
  ).run('user@green.coffee', 'Demo User', userHash, 'user');

  console.log('Inserting initial coffees...');
  db.exec(seedSQL);
  console.log('Done. Default credentials:');
  console.log('  admin@green.coffee / admin1234');
  console.log('  user@green.coffee  / user1234');
} else {
  console.log('Database already initialised, nothing to do.');
}

db.close();

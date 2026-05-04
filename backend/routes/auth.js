const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { renderLogin, renderRegister } = require('../../frontend/views');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.send(renderLogin({ errors: [], next: req.query.next, info: req.query.info }));
});

router.post('/login', (req, res) => {
  const { email, password, next } = req.body;
  const errors = [];
  if (!email || !EMAIL_RE.test(email)) errors.push('Invalid email.');
  if (!password) errors.push('Password required.');
  if (errors.length) {
    return res.status(400).send(renderLogin({ errors, next }));
  }
  const user = db.prepare(
    'SELECT id, email, name, password_hash, role FROM users WHERE email = ?'
  ).get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).send(renderLogin({ errors: ['Invalid credentials.'], next }));
  }
  req.session.userId = user.id;
  req.session.name = user.name;
  req.session.role = user.role;
  const dest = (next && next.startsWith('/')) ? next : '/dashboard';
  res.redirect(dest);
});

router.get('/register', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.send(renderRegister({ errors: [], data: {} }));
});

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const errors = [];
  if (!name || name.length < 2) errors.push('Name required (2 characters minimum).');
  if (!email || !EMAIL_RE.test(email)) errors.push('Invalid email.');
  if (!password || password.length < 8) errors.push('Password too short (8 characters minimum).');
  if (errors.length) {
    return res.status(400).send(renderRegister({ errors, data: { name, email } }));
  }
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (exists) {
    return res.status(409).send(renderRegister({ errors: ['Email already in use.'], data: { name, email } }));
  }
  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)'
  ).run(email, name, hash, 'user');
  req.session.userId = result.lastInsertRowid;
  req.session.name = name;
  req.session.role = 'user';
  res.redirect('/dashboard');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;

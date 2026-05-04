const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');
const { renderUsersList, renderUserForm, renderError } = require('../../frontend/views');

const router = express.Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PAGE_SIZE = 20;

router.use(requireAdmin);

// READ paginated
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;
  const total = db.prepare('SELECT COUNT(*) AS n FROM users').get().n;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const users = db.prepare(
    'SELECT id, email, name, role, created_at FROM users ORDER BY id DESC LIMIT ? OFFSET ?'
  ).all(PAGE_SIZE, offset);
  res.send(renderUsersList({ user: res.locals.user, users, page, totalPages, total }));
});

// CREATE form
router.get('/new', (req, res) => {
  res.send(renderUserForm({ user: res.locals.user, target: { role: 'user' }, errors: [], mode: 'create' }));
});

// CREATE submit
router.post('/new', (req, res) => {
  const { name, email, password, role } = req.body;
  const errors = validateUser({ name, email, password, role }, false);
  if (errors.length) {
    return res.status(400).send(renderUserForm({
      user: res.locals.user,
      target: { name, email, role },
      errors,
      mode: 'create'
    }));
  }
  if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) {
    return res.status(409).send(renderUserForm({
      user: res.locals.user,
      target: { name, email, role },
      errors: ['Email already in use.'],
      mode: 'create'
    }));
  }
  const hash = bcrypt.hashSync(password, 10);
  db.prepare(
    'INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)'
  ).run(email, name, hash, role);
  res.redirect('/users');
});

// UPDATE form
router.get('/:id/edit', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const target = db.prepare(
    'SELECT id, email, name, role FROM users WHERE id = ?'
  ).get(id);
  if (!target) return res.status(404).send(renderError({ user: res.locals.user, status: 404, message: 'User not found.' }));
  res.send(renderUserForm({ user: res.locals.user, target, errors: [], mode: 'edit' }));
});

// UPDATE submit
router.post('/:id/edit', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const target = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
  if (!target) return res.status(404).send(renderError({ user: res.locals.user, status: 404, message: 'User not found.' }));

  const { name, email, password, role } = req.body;
  const errors = validateUser({ name, email, password, role }, true);
  if (errors.length) {
    return res.status(400).send(renderUserForm({
      user: res.locals.user,
      target: { id, name, email, role },
      errors,
      mode: 'edit'
    }));
  }
  const conflict = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, id);
  if (conflict) {
    return res.status(409).send(renderUserForm({
      user: res.locals.user,
      target: { id, name, email, role },
      errors: ['Email already used by another account.'],
      mode: 'edit'
    }));
  }
  if (password) {
    const hash = bcrypt.hashSync(password, 10);
    db.prepare(
      'UPDATE users SET email = ?, name = ?, role = ?, password_hash = ? WHERE id = ?'
    ).run(email, name, role, hash, id);
  } else {
    db.prepare(
      'UPDATE users SET email = ?, name = ?, role = ? WHERE id = ?'
    ).run(email, name, role, id);
  }
  res.redirect('/users');
});

// DELETE
router.post('/:id/delete', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (id === req.session.userId) {
    return res.status(400).send(renderError({ user: res.locals.user, status: 400, message: 'You cannot delete your own account.' }));
  }
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  res.redirect('/users');
});

function validateUser({ name, email, password, role }, isEdit) {
  const errors = [];
  if (!name || name.length < 2) errors.push('Name required (2 characters minimum).');
  if (!email || !EMAIL_RE.test(email)) errors.push('Invalid email.');
  if (!isEdit && (!password || password.length < 8)) errors.push('Password too short (8 characters minimum).');
  if (isEdit && password && password.length < 8) errors.push('Password too short (8 characters minimum).');
  if (!['user','admin'].includes(role)) errors.push('Invalid role.');
  return errors;
}

module.exports = router;

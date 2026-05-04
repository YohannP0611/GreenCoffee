const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const renderCoffees = require('../../frontend/views/coffees');
const renderCoffee = require('../../frontend/views/coffee');
const renderCoffeeForm = require('../../frontend/views/coffee-form');
const { renderError } = require('../../frontend/views');

const router = express.Router();
const PAGE_SIZE = 10;
const VARIETIES = ['Arabica','Robusta','Liberica','Excelsa'];
const PROCESSES = ['Washed','Natural','Honey','Anaerobic'];

// READ paginated with filters
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;
  const variety = VARIETIES.includes(req.query.variety) ? req.query.variety : '';
  const origin = (req.query.origin || '').slice(0, 100);

  const where = [];
  const params = [];
  if (variety) { where.push('variety = ?'); params.push(variety); }
  if (origin) { where.push('origin LIKE ?'); params.push('%' + origin + '%'); }
  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

  const total = db.prepare(`SELECT COUNT(*) AS n FROM coffees ${whereClause}`).get(...params).n;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const coffees = db.prepare(
    `SELECT id, name, origin, variety, tasting_notes
     FROM coffees ${whereClause}
     ORDER BY id DESC
     LIMIT ? OFFSET ?`
  ).all(...params, PAGE_SIZE, offset);

  res.send(renderCoffees({
    user: res.locals.user,
    coffees,
    page,
    totalPages,
    total,
    filters: { variety, origin }
  }));
});

// CREATE form (auth)
router.get('/new', requireAuth, (req, res) => {
  res.send(renderCoffeeForm({
    user: res.locals.user,
    coffee: { variety: 'Arabica', process: 'Washed' },
    errors: [],
    mode: 'create'
  }));
});

// CREATE submit (auth)
router.post('/new', requireAuth, (req, res) => {
  const data = sanitize(req.body);
  const errors = validate(data);
  if (errors.length) {
    return res.status(400).send(renderCoffeeForm({
      user: res.locals.user,
      coffee: data,
      errors,
      mode: 'create'
    }));
  }
  const result = db.prepare(
    `INSERT INTO coffees (name, origin, region, variety, process, altitude_m, tasting_notes, description, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    data.name, data.origin, data.region || null, data.variety, data.process,
    data.altitude_m ? parseInt(data.altitude_m, 10) : null,
    data.tasting_notes || null, data.description, req.session.userId
  );
  res.redirect('/coffees/' + result.lastInsertRowid);
});

// READ one (must come AFTER /new to avoid matching it)
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) {
    return res.status(404).send(renderError({ user: res.locals.user, status: 404, message: 'Coffee not found.' }));
  }
  const coffee = db.prepare(
    `SELECT c.id, c.name, c.origin, c.region, c.variety, c.process, c.altitude_m,
            c.tasting_notes, c.description, c.created_by, c.created_at,
            u.name AS author_name
     FROM coffees c
     LEFT JOIN users u ON u.id = c.created_by
     WHERE c.id = ?`
  ).get(id);
  if (!coffee) {
    return res.status(404).send(renderError({ user: res.locals.user, status: 404, message: 'Coffee not found.' }));
  }
  const isOwner = res.locals.user && coffee.created_by === res.locals.user.id;
  res.send(renderCoffee({ user: res.locals.user, coffee, isOwner }));
});

// UPDATE form (owner or admin)
router.get('/:id/edit', requireAuth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const coffee = db.prepare(
    'SELECT id, name, origin, region, variety, process, altitude_m, tasting_notes, description, created_by FROM coffees WHERE id = ?'
  ).get(id);
  if (!coffee) return res.status(404).send(renderError({ user: res.locals.user, status: 404, message: 'Coffee not found.' }));
  if (coffee.created_by !== req.session.userId && res.locals.user.role !== 'admin') {
    return res.status(403).send(renderError({ user: res.locals.user, status: 403, message: 'Action not allowed.' }));
  }
  res.send(renderCoffeeForm({ user: res.locals.user, coffee, errors: [], mode: 'edit' }));
});

// UPDATE submit
router.post('/:id/edit', requireAuth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = db.prepare('SELECT id, created_by FROM coffees WHERE id = ?').get(id);
  if (!existing) return res.status(404).send(renderError({ user: res.locals.user, status: 404, message: 'Coffee not found.' }));
  if (existing.created_by !== req.session.userId && res.locals.user.role !== 'admin') {
    return res.status(403).send(renderError({ user: res.locals.user, status: 403, message: 'Action not allowed.' }));
  }
  const data = sanitize(req.body);
  const errors = validate(data);
  if (errors.length) {
    return res.status(400).send(renderCoffeeForm({
      user: res.locals.user,
      coffee: { ...data, id },
      errors,
      mode: 'edit'
    }));
  }
  db.prepare(
    `UPDATE coffees
     SET name = ?, origin = ?, region = ?, variety = ?, process = ?, altitude_m = ?, tasting_notes = ?, description = ?
     WHERE id = ?`
  ).run(
    data.name, data.origin, data.region || null, data.variety, data.process,
    data.altitude_m ? parseInt(data.altitude_m, 10) : null,
    data.tasting_notes || null, data.description, id
  );
  res.redirect('/coffees/' + id);
});

// DELETE (owner or admin, requires confirm in form)
router.post('/:id/delete', requireAuth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = db.prepare('SELECT id, created_by FROM coffees WHERE id = ?').get(id);
  if (!existing) return res.status(404).send(renderError({ user: res.locals.user, status: 404, message: 'Coffee not found.' }));
  if (existing.created_by !== req.session.userId && res.locals.user.role !== 'admin') {
    return res.status(403).send(renderError({ user: res.locals.user, status: 403, message: 'Action not allowed.' }));
  }
  db.prepare('DELETE FROM coffees WHERE id = ?').run(id);
  res.redirect('/coffees');
});

function sanitize(body) {
  return {
    name: (body.name || '').trim().slice(0, 100),
    origin: (body.origin || '').trim().slice(0, 100),
    region: (body.region || '').trim().slice(0, 100),
    variety: body.variety,
    process: body.process,
    altitude_m: body.altitude_m,
    tasting_notes: (body.tasting_notes || '').trim().slice(0, 200),
    description: (body.description || '').trim().slice(0, 2000)
  };
}

function validate(data) {
  const errors = [];
  if (!data.name) errors.push('Name required.');
  if (!data.origin) errors.push('Origin required.');
  if (!VARIETIES.includes(data.variety)) errors.push('Invalid variety.');
  if (!PROCESSES.includes(data.process)) errors.push('Invalid process.');
  if (data.altitude_m !== '' && data.altitude_m !== undefined && data.altitude_m !== null) {
    const alt = parseInt(data.altitude_m, 10);
    if (Number.isNaN(alt) || alt < 0 || alt > 3500) errors.push('Invalid altitude (0 to 3500 m).');
  }
  if (!data.description || data.description.length < 10) errors.push('Description required (10 characters minimum).');
  return errors;
}

module.exports = router;

const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const renderHome = require('../../frontend/views/home');
const { renderAbout, renderDashboard } = require('../../frontend/views');

const router = express.Router();

router.get('/', (req, res) => {
  const totalCoffees = db.prepare('SELECT COUNT(*) AS n FROM coffees').get().n;
  res.send(renderHome({ user: res.locals.user, totalCoffees }));
});

router.get('/about', (req, res) => {
  res.send(renderAbout({ user: res.locals.user }));
});

router.get('/dashboard', requireAuth, (req, res) => {
  const myCoffees = db.prepare(
    `SELECT id, name, origin, variety FROM coffees WHERE created_by = ? ORDER BY id DESC LIMIT 50`
  ).all(req.session.userId);
  res.send(renderDashboard({ user: res.locals.user, myCoffees }));
});

module.exports = router;

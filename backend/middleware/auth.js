// Authentication and authorization middlewares.

function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login?next=' + encodeURIComponent(req.originalUrl));
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }
  if (req.session.role !== 'admin') {
    return res.status(403).send('Access denied.');
  }
  next();
}

// Inject the current user into res.locals so views can read it.
function attachUser(req, res, next) {
  res.locals.user = req.session && req.session.userId
    ? { id: req.session.userId, name: req.session.name, role: req.session.role }
    : null;
  next();
}

module.exports = { requireAuth, requireAdmin, attachUser };

// Express server. Lean architecture: separate routes, sessions, statics.

const path = require('path');
const express = require('express');
const session = require('express-session');

const { attachUser } = require('./middleware/auth');
const { renderError } = require('../frontend/views');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const coffeeRoutes = require('./routes/coffees');
const pageRoutes = require('./routes/pages');

const app = express();
const PORT = process.env.PORT || 3000;

// Security: do not advertise the application server.
app.disable('x-powered-by');

// Trust proxy headers in production (Render, Vercel, Fly.io).
app.set('trust proxy', 1);

// Form body parsing (strict size limit).
app.use(express.urlencoded({ extended: false, limit: '32kb' }));

// Sessions. In production: cookie HttpOnly + SameSite Lax + Secure.
app.use(session({
  name: 'gc.sid',
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

// Lean security headers (zero dependency).
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'interest-cohort=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'");
  next();
});

// Static files with long cache for CSS/JS.
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public'), {
  maxAge: '7d',
  setHeaders(res) {
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
  }
}));

// Make user available to all views via res.locals.
app.use(attachUser);

// Routes.
app.use(pageRoutes);
app.use(authRoutes);
app.use('/coffees', coffeeRoutes);
app.use('/users', userRoutes);

// 404.
app.use((req, res) => {
  res.status(404).send(renderError({ user: res.locals.user, status: 404, message: 'Page not found.' }));
});

// 500.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(renderError({ user: res.locals.user, status: 500, message: 'An error occurred.' }));
});

app.listen(PORT, () => {
  console.log(`Green Coffee listening on http://localhost:${PORT}`);
});

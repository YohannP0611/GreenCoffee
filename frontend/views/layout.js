// Main layout. No heavy template engine: plain template literals.
// Built-in HTML escaping to prevent XSS.

function escape(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Tag function that interpolates values with automatic escaping.
// Usage: html`<p>${name}</p>` escapes name.
// To insert pre-trusted HTML, wrap with raw(s).
function html(strings, ...values) {
  let out = '';
  strings.forEach((s, i) => {
    out += s;
    if (i < values.length) {
      const v = values[i];
      if (v && typeof v === 'object' && v.__raw) {
        out += v.value;
      } else if (Array.isArray(v)) {
        out += v.join('');
      } else {
        out += escape(v);
      }
    }
  });
  return out;
}

function raw(value) {
  return { __raw: true, value: value || '' };
}

function layout({ title, body, user, currentPath, description }) {
  const desc = description || 'Eco-designed website about coffee and its particularities.';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(title)} | Green Coffee</title>
<meta name="description" content="${escape(desc)}">
<meta name="color-scheme" content="light dark">
<link rel="stylesheet" href="/styles.css">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ctext y='14' font-size='14'%3E%E2%98%95%3C/text%3E%3C/svg%3E">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <nav aria-label="Main navigation">
    <a href="/" class="brand">Green Coffee</a>
    <ul>
      <li><a href="/coffees"${currentPath === '/coffees' ? ' aria-current="page"' : ''}>Coffees</a></li>
      <li><a href="/about"${currentPath === '/about' ? ' aria-current="page"' : ''}>Approach</a></li>
      ${user ? `
        <li><a href="/dashboard"${currentPath === '/dashboard' ? ' aria-current="page"' : ''}>Dashboard</a></li>
        ${user.role === 'admin' ? `<li><a href="/users"${currentPath && currentPath.startsWith('/users') ? ' aria-current="page"' : ''}>Users</a></li>` : ''}
        <li><form action="/logout" method="post" class="inline-form"><button type="submit" class="link-btn">Log out (${escape(user.name)})</button></form></li>
      ` : `
        <li><a href="/login"${currentPath === '/login' ? ' aria-current="page"' : ''}>Log in</a></li>
        <li><a href="/register"${currentPath === '/register' ? ' aria-current="page"' : ''}>Sign up</a></li>
      `}
    </ul>
  </nav>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <p>TI616 EFREI demo site. Eco-friendly design: minimal HTML/CSS, system fonts, zero images, minimised requests.</p>
</footer>
</body>
</html>`;
}

module.exports = { layout, escape, html, raw };

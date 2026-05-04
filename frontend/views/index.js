const { layout, escape } = require('./layout');

function renderLogin({ errors, next, info }) {
  const errBlock = errors && errors.length
    ? `<ul class="errors" role="alert">${errors.map(e => `<li>${escape(e)}</li>`).join('')}</ul>`
    : '';
  const infoBlock = info ? `<p class="info">${escape(info)}</p>` : '';
  const body = `
<h1>Log in</h1>
${infoBlock}
${errBlock}
<form method="post" action="/login" class="form narrow">
  <input type="hidden" name="next" value="${escape(next || '')}">
  <label>
    Email <span class="req">*</span>
    <input type="email" name="email" required autocomplete="email">
  </label>
  <label>
    Password <span class="req">*</span>
    <input type="password" name="password" required autocomplete="current-password">
  </label>
  <button type="submit" class="cta">Log in</button>
</form>
<p>No account yet? <a href="/register">Sign up</a>.</p>
<p class="info">Demo accounts: <code>admin@green.coffee</code> / <code>admin1234</code> or <code>user@green.coffee</code> / <code>user1234</code></p>
`;
  return layout({ title: 'Log in', body, user: null, currentPath: '/login' });
}

function renderRegister({ errors, data }) {
  const d = data || {};
  const errBlock = errors && errors.length
    ? `<ul class="errors" role="alert">${errors.map(e => `<li>${escape(e)}</li>`).join('')}</ul>`
    : '';
  const body = `
<h1>Sign up</h1>
${errBlock}
<form method="post" action="/register" class="form narrow">
  <label>
    Name <span class="req">*</span>
    <input type="text" name="name" required maxlength="80" value="${escape(d.name || '')}" autocomplete="name">
  </label>
  <label>
    Email <span class="req">*</span>
    <input type="email" name="email" required maxlength="160" value="${escape(d.email || '')}" autocomplete="email">
  </label>
  <label>
    Password <span class="req">*</span>
    <input type="password" name="password" required minlength="8" autocomplete="new-password">
    <small>At least 8 characters.</small>
  </label>
  <button type="submit" class="cta">Create account</button>
</form>
<p>Already have an account? <a href="/login">Log in</a>.</p>
`;
  return layout({ title: 'Sign up', body, user: null, currentPath: '/register' });
}

function renderDashboard({ user, myCoffees }) {
  const list = myCoffees.length === 0
    ? '<p>You have not added any coffee yet.</p>'
    : `<ul class="coffees">
        ${myCoffees.map(c => `
          <li>
            <h3><a href="/coffees/${escape(c.id)}">${escape(c.name)}</a></h3>
            <p class="meta">${escape(c.variety)} . ${escape(c.origin)}</p>
          </li>`).join('')}
      </ul>`;
  const body = `
<h1>Hello ${escape(user.name)}</h1>
<p>You are logged in with the role <strong>${escape(user.role)}</strong>.</p>
<h2>My coffees</h2>
${list}
<p><a class="cta" href="/coffees/new">Add a coffee</a></p>
`;
  return layout({ title: 'Dashboard', body, user, currentPath: '/dashboard' });
}

function renderAbout({ user }) {
  const body = `
<h1>Our approach</h1>
<p class="lead">This site is built to minimise its environmental footprint while staying useful and readable.</p>

<h2>Technical choices</h2>
<ul class="cols">
  <li><strong>Semantic HTML.</strong> No framework, no SPA, no hydration. HTML is rendered server-side and sent directly.</li>
  <li><strong>Minimal CSS.</strong> A single file, no animation library, no framework. System fonts only.</li>
  <li><strong>JavaScript: almost none.</strong> A handful of inline lines for delete confirmations. No bundle, no module.</li>
  <li><strong>No images.</strong> Content is textual. The favicon is an inline SVG emoji.</li>
  <li><strong>SQLite.</strong> No separate database server, therefore no extra network connection.</li>
  <li><strong>Pagination.</strong> 10 coffees per page, never infinite scroll.</li>
  <li><strong>No tracking.</strong> No third-party cookies, no analytics.</li>
</ul>

<h2>Target indicators</h2>
<ul class="cols">
  <li>Page weight: under 50 KB.</li>
  <li>HTTP requests per page: fewer than 5.</li>
  <li>EcoIndex: A.</li>
  <li>Lighthouse Performance: above 95.</li>
  <li>FCP: under 0.5s.</li>
</ul>

<h2>Optimisations applied</h2>
<ol>
  <li>All images removed in favour of structured text.</li>
  <li>System fonts: zero request to Google Fonts.</li>
  <li>A single, lean, non-blocking CSS file.</li>
  <li>No framework JavaScript. Minimal JS, inline or deferred.</li>
  <li>Cache-Control on static resources.</li>
  <li>Gzip compression at the server level.</li>
  <li>Targeted SELECT: never SELECT *.</li>
  <li>LIMIT/OFFSET pagination on all listings.</li>
  <li>DB indexes on filtered columns.</li>
</ol>
`;
  return layout({ title: 'Approach', body, user, currentPath: '/about' });
}

function renderUsersList({ user, users, page, totalPages, total }) {
  const list = users.length === 0
    ? '<p>No user.</p>'
    : `<table class="data-table">
        <thead><tr><th>Email</th><th>Name</th><th>Role</th><th>Created</th><th>Actions</th></tr></thead>
        <tbody>
        ${users.map(u => `
          <tr>
            <td>${escape(u.email)}</td>
            <td>${escape(u.name)}</td>
            <td>${escape(u.role)}</td>
            <td>${escape(u.created_at.split(' ')[0])}</td>
            <td>
              <a href="/users/${escape(u.id)}/edit" class="link-btn">Edit</a>
              ${u.id !== user.id ? `
              <form method="post" action="/users/${escape(u.id)}/delete" class="inline-form" onsubmit="return confirm('Delete this user?');">
                <button type="submit" class="danger">Del.</button>
              </form>` : ''}
            </td>
          </tr>`).join('')}
        </tbody>
      </table>`;
  const pagination = totalPages > 1 ? `
<nav class="pagination" aria-label="Pagination">
  ${page > 1 ? `<a href="?page=${page - 1}" rel="prev">Previous</a>` : '<span class="disabled">Previous</span>'}
  <span>Page ${page} / ${totalPages}</span>
  ${page < totalPages ? `<a href="?page=${page + 1}" rel="next">Next</a>` : '<span class="disabled">Next</span>'}
</nav>` : '';
  const body = `
<h1>Users</h1>
<p>${escape(total)} user${total > 1 ? 's' : ''}.</p>
${list}
${pagination}
<p><a class="cta" href="/users/new">Add a user</a></p>
`;
  return layout({ title: 'Users', body, user, currentPath: '/users' });
}

function renderUserForm({ user, target, errors, mode }) {
  const isEdit = mode === 'edit';
  const action = isEdit ? `/users/${escape(target.id)}/edit` : '/users/new';
  const d = target || {};
  const errBlock = errors && errors.length
    ? `<ul class="errors" role="alert">${errors.map(e => `<li>${escape(e)}</li>`).join('')}</ul>`
    : '';
  const body = `
<h1>${isEdit ? 'Edit' : 'Add'} a user</h1>
${errBlock}
<form method="post" action="${action}" class="form narrow">
  <label>
    Name <span class="req">*</span>
    <input type="text" name="name" required maxlength="80" value="${escape(d.name || '')}">
  </label>
  <label>
    Email <span class="req">*</span>
    <input type="email" name="email" required maxlength="160" value="${escape(d.email || '')}">
  </label>
  <label>
    Password ${isEdit ? '(leave empty to keep current)' : '<span class="req">*</span>'}
    <input type="password" name="password" ${isEdit ? '' : 'required'} minlength="8">
  </label>
  <label>
    Role <span class="req">*</span>
    <select name="role" required>
      <option value="user"${d.role === 'user' ? ' selected' : ''}>user</option>
      <option value="admin"${d.role === 'admin' ? ' selected' : ''}>admin</option>
    </select>
  </label>
  <div class="actions">
    <button type="submit" class="cta">${isEdit ? 'Save' : 'Create'}</button>
    <a href="/users" class="link-btn">Cancel</a>
  </div>
</form>
`;
  return layout({ title: isEdit ? 'Edit user' : 'New user', body, user, currentPath: '/users' });
}

function renderError({ user, status, message }) {
  const body = `
<h1>Error ${escape(status)}</h1>
<p>${escape(message)}</p>
<p><a href="/" class="link-btn">Back to home</a></p>
`;
  return layout({ title: 'Error', body, user, currentPath: '' });
}

module.exports = {
  renderLogin,
  renderRegister,
  renderDashboard,
  renderAbout,
  renderUsersList,
  renderUserForm,
  renderError
};

const { layout, escape } = require('./layout');

function renderCoffees({ user, coffees, page, totalPages, total, filters }) {
  const filterVariety = filters.variety || '';
  const filterOrigin = filters.origin || '';

  const filterForm = `
<form method="get" action="/coffees" class="filters" aria-label="Filters">
  <label>
    Variety
    <select name="variety">
      <option value="">All</option>
      ${['Arabica','Robusta','Liberica','Excelsa'].map(v =>
        `<option value="${escape(v)}"${filterVariety === v ? ' selected' : ''}>${escape(v)}</option>`
      ).join('')}
    </select>
  </label>
  <label>
    Origin
    <input type="text" name="origin" value="${escape(filterOrigin)}" placeholder="e.g. Ethiopia">
  </label>
  <button type="submit">Filter</button>
  ${(filterVariety || filterOrigin) ? '<a href="/coffees" class="link-btn">Reset</a>' : ''}
</form>`;

  const list = coffees.length === 0
    ? '<p>No coffee matches the criteria.</p>'
    : `<ul class="coffees">
      ${coffees.map(c => `
        <li>
          <h3><a href="/coffees/${escape(c.id)}">${escape(c.name)}</a></h3>
          <p class="meta">${escape(c.variety)} . ${escape(c.origin)}${c.region ? ' . ' + escape(c.region) : ''}</p>
          ${c.tasting_notes ? `<p class="notes">${escape(c.tasting_notes)}</p>` : ''}
        </li>`).join('')}
    </ul>`;

  const qs = (p) => {
    const parts = [];
    if (filterVariety) parts.push('variety=' + encodeURIComponent(filterVariety));
    if (filterOrigin) parts.push('origin=' + encodeURIComponent(filterOrigin));
    parts.push('page=' + p);
    return '?' + parts.join('&');
  };

  const pagination = totalPages > 1 ? `
<nav class="pagination" aria-label="Pagination">
  ${page > 1 ? `<a href="${qs(page - 1)}" rel="prev">Previous</a>` : '<span class="disabled">Previous</span>'}
  <span>Page ${page} / ${totalPages}</span>
  ${page < totalPages ? `<a href="${qs(page + 1)}" rel="next">Next</a>` : '<span class="disabled">Next</span>'}
</nav>` : '';

  const body = `
<h1>Coffees</h1>
<p class="lead">${escape(total)} coffee${total > 1 ? 's' : ''} in the database.</p>
${filterForm}
${list}
${pagination}
${user ? '<p><a class="cta" href="/coffees/new">Add a coffee</a></p>' : ''}
`;

  return layout({
    title: 'Coffees',
    body,
    user,
    currentPath: '/coffees',
    description: 'List of coffees: varieties, origins, processes.'
  });
}

module.exports = renderCoffees;

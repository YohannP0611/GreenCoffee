const { layout, escape } = require('./layout');

function renderCoffee({ user, coffee, isOwner }) {
  const canEdit = user && (isOwner || user.role === 'admin');

  const body = `
<article class="coffee-detail">
  <p><a href="/coffees" class="link-btn">Back to list</a></p>
  <h1>${escape(coffee.name)}</h1>
  <dl class="props">
    <dt>Variety</dt><dd>${escape(coffee.variety)}</dd>
    <dt>Origin</dt><dd>${escape(coffee.origin)}</dd>
    ${coffee.region ? `<dt>Region</dt><dd>${escape(coffee.region)}</dd>` : ''}
    <dt>Process</dt><dd>${escape(coffee.process)}</dd>
    ${coffee.altitude_m ? `<dt>Altitude</dt><dd>${escape(coffee.altitude_m)} m</dd>` : ''}
    ${coffee.tasting_notes ? `<dt>Notes</dt><dd>${escape(coffee.tasting_notes)}</dd>` : ''}
  </dl>
  <h2>Description</h2>
  <p>${escape(coffee.description)}</p>
  <p class="meta">Added by ${escape(coffee.author_name || 'unknown')} on ${escape(coffee.created_at.split(' ')[0])}.</p>
  ${canEdit ? `
  <div class="actions">
    <a class="cta" href="/coffees/${escape(coffee.id)}/edit">Edit</a>
    <form method="post" action="/coffees/${escape(coffee.id)}/delete" class="inline-form" onsubmit="return confirm('Permanently delete this coffee?');">
      <button type="submit" class="danger">Delete</button>
    </form>
  </div>` : ''}
</article>
`;
  return layout({
    title: coffee.name,
    body,
    user,
    currentPath: '/coffees',
    description: `${coffee.name}, ${coffee.variety} from ${coffee.origin}.`
  });
}

module.exports = renderCoffee;

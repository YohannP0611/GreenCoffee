const { layout, escape } = require('./layout');

function renderCoffeeForm({ user, coffee, errors, mode }) {
  const isEdit = mode === 'edit';
  const action = isEdit ? `/coffees/${escape(coffee.id)}/edit` : '/coffees/new';
  const data = coffee || {};

  const errBlock = errors && errors.length
    ? `<ul class="errors" role="alert">${errors.map(e => `<li>${escape(e)}</li>`).join('')}</ul>`
    : '';

  const body = `
<h1>${isEdit ? 'Edit' : 'Add'} a coffee</h1>
${errBlock}
<form method="post" action="${action}" class="form">
  <label>
    Name <span class="req">*</span>
    <input type="text" name="name" required maxlength="100" value="${escape(data.name || '')}">
  </label>
  <label>
    Origin (country) <span class="req">*</span>
    <input type="text" name="origin" required maxlength="100" value="${escape(data.origin || '')}">
  </label>
  <label>
    Region
    <input type="text" name="region" maxlength="100" value="${escape(data.region || '')}">
  </label>
  <label>
    Variety <span class="req">*</span>
    <select name="variety" required>
      ${['Arabica','Robusta','Liberica','Excelsa'].map(v =>
        `<option value="${escape(v)}"${data.variety === v ? ' selected' : ''}>${escape(v)}</option>`
      ).join('')}
    </select>
  </label>
  <label>
    Process <span class="req">*</span>
    <select name="process" required>
      ${['Washed','Natural','Honey','Anaerobic'].map(v =>
        `<option value="${escape(v)}"${data.process === v ? ' selected' : ''}>${escape(v)}</option>`
      ).join('')}
    </select>
  </label>
  <label>
    Altitude (m)
    <input type="number" name="altitude_m" min="0" max="3500" value="${escape(data.altitude_m || '')}">
  </label>
  <label>
    Tasting notes
    <input type="text" name="tasting_notes" maxlength="200" value="${escape(data.tasting_notes || '')}">
  </label>
  <label>
    Description <span class="req">*</span>
    <textarea name="description" required maxlength="2000" rows="6">${escape(data.description || '')}</textarea>
  </label>
  <div class="actions">
    <button type="submit" class="cta">${isEdit ? 'Save' : 'Create'}</button>
    <a href="${isEdit ? '/coffees/' + escape(data.id) : '/coffees'}" class="link-btn">Cancel</a>
  </div>
</form>
`;
  return layout({
    title: isEdit ? 'Edit coffee' : 'New coffee',
    body,
    user,
    currentPath: '/coffees'
  });
}

module.exports = renderCoffeeForm;

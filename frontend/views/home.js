const { layout, escape } = require('./layout');

function renderHome({ user, totalCoffees }) {
  const body = `
<section class="hero">
  <h1>Coffee, simply</h1>
  <p class="lead">A lean encyclopedia of coffees from around the world. Origins, varieties, processes. No frills, no videos, almost no images.</p>
  <p><a class="cta" href="/coffees">Browse the ${escape(totalCoffees)} coffees</a></p>
</section>

<section class="grid">
  <article>
    <h2>Why a website about coffee</h2>
    <p>Coffee is the second most consumed drink in the world after water. Yet most consumers know neither the variety grown, nor the process, nor the origin of their daily cup.</p>
    <p>This site documents the main varieties (Arabica, Robusta, Liberica, Excelsa), the producing regions and the post-harvest processing methods.</p>
  </article>
  <article>
    <h2>Why an eco-designed site</h2>
    <p>The internet accounts for roughly 4% of global greenhouse gas emissions. Every loaded page, every image, every request consumes energy.</p>
    <p>This site has been built to weigh as little as possible: semantic HTML, minimal CSS, no images, no JS framework, system fonts only.</p>
  </article>
</section>

<section class="features">
  <h2>What you will find here</h2>
  <ul class="cols">
    <li><strong>Botanical varieties.</strong> Differences between Arabica, Robusta, Liberica and Excelsa.</li>
    <li><strong>Processing methods.</strong> Washed, natural, honey, anaerobic. Their effect on the aroma profile.</li>
    <li><strong>Terroirs.</strong> Ethiopia, Colombia, Brazil, Indonesia, Costa Rica and other producing countries.</li>
    <li><strong>Tasting notes.</strong> Standard descriptive vocabulary.</li>
  </ul>
</section>
`;
  return layout({
    title: 'Home',
    body,
    user,
    currentPath: '/',
    description: 'A lean encyclopedia of coffee: varieties, origins, processes. Eco-designed website.'
  });
}

module.exports = renderHome;

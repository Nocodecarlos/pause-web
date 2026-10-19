/* Seasonal theme switch for try-pause.com (see seasonal.css).
   Loaded in <head> so the theme class is set before first paint.
   October = Halloween, November = Thanksgiving; ?season=<name> previews one
   and ?season=none turns it off. */
(function () {
  var month = new Date().getMonth(); // 0 = January
  var season = month === 9 ? 'halloween' : month === 10 ? 'thanksgiving' : '';
  try {
    var q = new URLSearchParams(location.search).get('season');
    if (q) season = (q === 'none') ? '' : q;
  } catch (e) {}

  // Seasonal files live next to this script, so a preview copy served from
  // elsewhere still finds its own art.
  var me = document.currentScript;
  var assets = me && me.src ? me.src.replace(/[^\/]*$/, '') : '/assets/';

  var art = {
    'Word Jumble': 'word-jumble', 'Word Search': 'word-search',
    'Five Letters': 'five-letters', 'Memory Match': 'memory-match',
    'Connect the Dots': 'connect-the-dots', 'Connect the Colors': 'connect-the-colors',
    'Maze': 'maze', 'Ball Sort': 'ball-sort', 'Sliding Tile': 'sliding-tile',
    'Sixdoku': 'sixdoku'
  };
  var SEASONS = {
    halloween: {
      font: 'Metal+Mania',
      label: 'Halloween themed',
      decor: 'header-decor-dark.svg'
    },
    thanksgiving: {
      font: 'EB+Garamond:wght@500',
      label: 'Thanksgiving themed',
      decor: 'contour-lines.svg',
      feature: '<img src="{dir}gratitude.jpg" alt="Gratitude puzzle" width="600" height="600">' +
        '<div><span class="chip">New for Thanksgiving</span><h3>Gratitude</h3>' +
        '<p>Instead of a puzzle, list three things you’re grateful for. They come back on your Pause screen all month, right when you reach for an app.</p>' +
        '<p class="note">Your answers are kept private on this phone.</p></div>'
    }
  };
  var cfg = SEASONS[season];
  if (!cfg) return;

  document.documentElement.classList.add('season-' + season);
  var dir = assets + 'seasonal/' + season + '/';

  // The season's display font, loaded only while the theme is on.
  var font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=' + cfg.font + '&display=swap';
  document.head.appendChild(font);

  function decorate() {
    var decor = document.createElement('img');
    decor.className = 'season-decor';
    decor.src = dir + cfg.decor;
    decor.alt = '';
    decor.setAttribute('aria-hidden', 'true');
    document.body.appendChild(decor);

    // Callout beside the hero label.
    var label = document.querySelector('.chapter .eyebrow');
    if (label) {
      var tag = document.createElement('span');
      tag.className = 'season-tag';
      tag.textContent = ' · ' + cfg.label;
      label.appendChild(tag);
    }

    // Puzzle gallery: the app's seasonal artwork, all ten puzzles.
    var grid = document.querySelector('.puzzle-grid');
    if (!grid) return;
    if (cfg.feature) {
      var feature = document.createElement('div');
      feature.className = 'season-feature';
      feature.innerHTML = cfg.feature.replace('{dir}', dir);
      grid.parentNode.insertBefore(feature, grid);
    }
    var seen = {};
    grid.querySelectorAll('.puzzle-tile').forEach(function (tile) {
      var name = tile.querySelector('figcaption').textContent.trim();
      var img = tile.querySelector('img');
      if (art[name]) {
        img.src = dir + art[name] + '.jpg';
        img.removeAttribute('srcset');
        seen[name] = true;
      }
    });
    Object.keys(art).forEach(function (name) {
      if (seen[name]) return;
      var fig = document.createElement('figure');
      fig.className = 'puzzle-tile';
      fig.innerHTML = '<img loading="lazy" width="600" height="600" alt="' + name + ' puzzle">' +
        '<figcaption>' + name + '</figcaption>';
      fig.querySelector('img').src = dir + art[name] + '.jpg';
      grid.appendChild(fig);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', decorate);
  else decorate();
})();

/* Seasonal theme switch for try-pause.com (see seasonal.css).
   Loaded in <head> so the theme class is set before first paint. */
(function () {
  var season = '';
  var month = new Date().getMonth(); // 0 = January
  if (month === 9) season = 'halloween';
  try {
    var q = new URLSearchParams(location.search).get('season');
    if (q) season = (q === 'none') ? '' : q;
  } catch (e) {}
  if (!season) return;

  var root = document.documentElement;
  root.classList.add('season-' + season);

  if (season !== 'halloween') return;

  // The app's Halloween display font, loaded only while the theme is on.
  var font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Metal+Mania&display=swap';
  document.head.appendChild(font);

  document.addEventListener('DOMContentLoaded', function () {
    // Moon, bats and web.
    var decor = document.createElement('img');
    decor.className = 'season-decor';
    decor.src = '/assets/seasonal/halloween/header-decor-dark.svg';
    decor.alt = '';
    decor.setAttribute('aria-hidden', 'true');
    document.body.appendChild(decor);

    // Callout beside the hero label.
    var label = document.querySelector('.chapter .eyebrow');
    if (label) {
      var tag = document.createElement('span');
      tag.className = 'season-tag';
      tag.textContent = ' · Halloween themed';
      label.appendChild(tag);
    }

    // Puzzle gallery: the app's Halloween artwork, all ten puzzles.
    var grid = document.querySelector('.puzzle-grid');
    if (!grid) return;
    var art = {
      'Word Jumble': 'word-jumble', 'Word Search': 'word-search',
      'Five Letters': 'five-letters', 'Memory Match': 'memory-match',
      'Connect the Dots': 'connect-the-dots', 'Connect the Colors': 'connect-the-colors',
      'Maze': 'maze', 'Ball Sort': 'ball-sort', 'Sliding Tile': 'sliding-tile',
      'Sixdoku': 'sixdoku'
    };
    var seen = {};
    grid.querySelectorAll('.puzzle-tile').forEach(function (tile) {
      var name = tile.querySelector('figcaption').textContent.trim();
      var img = tile.querySelector('img');
      if (art[name]) {
        img.src = '/assets/seasonal/halloween/' + art[name] + '.jpg';
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
      fig.querySelector('img').src = '/assets/seasonal/halloween/' + art[name] + '.jpg';
      grid.appendChild(fig);
    });
  });
})();

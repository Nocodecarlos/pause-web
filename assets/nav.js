/* Mobile menu (Carlos, Nov 10): under 900px the nav links are hidden, so a
   hamburger at the top right opens them as a dropdown under the nav. Shared
   by every page; it reads the page's own .navlinks, so links stay per page.
   The panel takes the nav's own (seasonal) colours, made opaque. */
(function () {
  var css = '' +
    '.navburger{display:none;background:none;border:0;color:inherit;cursor:pointer;' +
      'width:40px;height:40px;margin-left:8px;padding:0;align-items:center;justify-content:center}' +
    '.navburger svg{width:24px;height:24px;display:block}' +
    '.navburger .x{display:none}' +
    'body.navopen .navburger .bars{display:none}' +
    'body.navopen .navburger .x{display:block}' +
    '.navright{display:flex;align-items:center}' +
    '.navpanel{display:none;position:absolute;top:100%;left:0;right:0;flex-direction:column;' +
      'padding:8px 20px 18px;border-bottom:1px solid rgba(127,127,127,.18);' +
      '-webkit-backdrop-filter:saturate(150%) blur(16px);backdrop-filter:saturate(150%) blur(16px)}' +
    '.navpanel a{color:inherit;text-decoration:none;font-size:17px;font-weight:400;padding:13px 4px;' +
      'border-bottom:1px solid rgba(127,127,127,.16)}' +
    '.navpanel a:last-child{border-bottom:0}' +
    '@media (max-width:900px){.navburger{display:inline-flex}body.navopen .navpanel{display:flex}}';

  function init() {
    var nav = document.querySelector('nav');
    var links = nav && nav.querySelector('.navlinks');
    if (!nav || !links || nav.querySelector('.navburger')) return;

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Keep the CTA and the burger together on the right.
    var cta = nav.querySelector('.navcta');
    var right = document.createElement('div');
    right.className = 'navright';
    if (cta) { nav.insertBefore(right, cta); right.appendChild(cta); } else { nav.appendChild(right); }

    var btn = document.createElement('button');
    btn.className = 'navburger';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'navpanel');
    btn.innerHTML =
      '<svg class="bars" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>' +
      '<svg class="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    right.appendChild(btn);

    var panel = document.createElement('div');
    panel.className = 'navpanel';
    panel.id = 'navpanel';
    panel.innerHTML = links.innerHTML;
    nav.appendChild(panel);

    function paint() {
      // The nav's current background (it changes with scroll, flip and season),
      // fully opaque so the links read over whatever is underneath.
      var bg = getComputedStyle(nav).backgroundColor;
      var m = bg.match(/rgba?\(([^)]+)\)/);
      var p = m ? m[1].split(',').map(function (s) { return parseFloat(s); }) : null;
      panel.style.background = (p && (p.length < 4 || p[3] > 0.05))
        ? 'rgba(' + p[0] + ',' + p[1] + ',' + p[2] + ',1)'
        : 'rgb(13,60,168)';
    }
    function setOpen(open) {
      document.body.classList.toggle('navopen', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
      if (open) paint();
    }
    btn.addEventListener('click', function () {
      setOpen(!document.body.classList.contains('navopen'));
    });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    document.addEventListener('click', function (e) {
      if (document.body.classList.contains('navopen') && !nav.contains(e.target)) setOpen(false);
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) setOpen(false); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* ============================================================
   Shell dell'applicazione: header, sidebar, routing, ricerca.
   ============================================================ */
import { Data, F, bindLang } from './core.js';
import { T, LANGS, MODES, setLang, setMode, lang, mode, initPrefs, isSimple } from './i18n.js';
import { renderHome } from './views/home.js';
import { renderTrader } from './views/trader.js';

/* In modalita' semplice la barra si accorcia: chi non conosce i termini non
   ha bisogno di sette sezioni, ha bisogno di trovare un trader e capirlo. */
const ROUTES = [
  ['overview',  'nav.overview',  'M3 12h4l3 8 4-16 3 8h4', true],
  ['traders',   'nav.traders',   'M3 6h18M3 12h18M3 18h12', true],
  ['rankings',  'nav.rankings',  'M4 20V10M10 20V4M16 20v-8M22 20v-5', false],
  ['risk',      'nav.risk',      'M12 3l9 16H3z M12 9v4M12 16v.5', true],
  ['compare',   'nav.compare',   'M9 4v16M15 4v16M4 9h16M4 15h16', false],
  ['watchlist', 'nav.watchlist', 'M12 3l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 18l-5.9 3.2 1.2-6.6L2.5 10l6.6-.9z', true],
  ['quality',   'nav.quality',   'M12 3a9 9 0 100 18 9 9 0 000-18zM12 8v5M12 16v.5', false],
];
const visibleRoutes = () => ROUTES.filter(r => !isSimple() || r[3]);

const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };

function icon(d) {
  return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
}

function buildShell(meta) {
  const app = document.getElementById('app');
  app.innerHTML = '';

  /* ---- header ---- */
  const hdr = el('header', 'hdr');
  hdr.innerHTML = `
    <button class="icon-btn burger" aria-label="Menu">${icon('M3 6h18M3 12h18M3 18h18')}</button>
    <div class="brand">
      <div class="brand-mark">TI</div>
      <div class="brand-txt">Trader<span>Intelligence</span></div>
    </div>
    <nav class="nav">
      ${visibleRoutes().slice(0, 5).map(r => `<a href="#/${r[0]}" data-r="${r[0]}">${T(r[1])}</a>`).join('')}
    </nav>
    <div class="hdr-right">
      <div class="search">
        <span class="ico">${icon('M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3')}</span>
        <input type="search" placeholder="${T('search.ph')}" aria-label="Search">
        <kbd>/</kbd>
        <div class="search-res" hidden></div>
      </div>
      <div class="seg sw" id="modeSw">
        ${Object.entries(MODES).map(([k, v]) =>
          `<button data-mode="${k}" class="${mode() === k ? 'on' : ''}">${v}</button>`).join('')}
      </div>
      <div class="seg sw" id="langSw">
        ${Object.entries(LANGS).map(([k, v]) =>
          `<button data-lang="${k}" class="${lang() === k ? 'on' : ''}">${v}</button>`).join('')}
      </div>
      <div class="feed" id="feed-state"></div>
    </div>`;
  app.appendChild(hdr);

  const shell = el('div', 'shell');
  const side = el('aside', 'side');
  side.innerHTML = `
    <div class="side-lbl">${T('nav.section')}</div>
    ${visibleRoutes().map(r => `<a href="#/${r[0]}" data-r="${r[0]}">${icon(r[2])}<span class="t">${T(r[1])}</span></a>`).join('')}
    <div class="side-foot">
      <div class="side-lbl">Dataset</div>
      <a href="#/quality" class="ds"><span class="t" style="font-size:11.5px;color:var(--faint)">
        ${F.compact(meta.counts.trades)} trades · ${meta.counts.traders} strategies</span></a>
    </div>`;
  shell.appendChild(side);

  const main = el('main', 'main');
  main.innerHTML = `<div class="wrap" id="view"></div>
    <div class="wrap disclaimer">
      <span class="badge mute">${T('disc.preview')}</span>
      <p>${T('disc')}</p>
    </div>`;
  shell.appendChild(main);
  app.appendChild(shell);

  hdr.querySelector('.burger').onclick = () => side.classList.toggle('open');
  /* Cambiare lingua o modo ricostruisce tutto: e' piu' semplice e piu'
     sicuro che aggiornare pezzo per pezzo, e su questi volumi e' istantaneo. */
  hdr.querySelectorAll('[data-lang]').forEach(b => b.onclick = () => {
    setLang(b.dataset.lang); rebuild();
  });
  hdr.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => {
    setMode(b.dataset.mode); rebuild();
  });
  wireSearch(hdr);
  paintFeed(meta);
  return main;
}

/* Lo stato del dato non e' decorazione: un numero finanziario senza
   riferimento temporale puo' ingannare (§38). */
function paintFeed(meta) {
  const box = document.getElementById('feed-state');
  if (!box) return;
  const age = meta.lastSync ? (Date.now() - new Date(meta.lastSync).getTime()) / 3600e3 : 999;
  const cls = age < 6 ? '' : age < 36 ? 'stale' : 'off';
  const txt = age < 6 ? T('feed.live') : age < 36 ? T('feed.stale') : T('feed.off');
  box.innerHTML = `<span class="dot-live ${cls}"></span>
    <span><b style="color:var(--text-2)">${txt}</b> · ${T('feed.updated')} ${F.ago(meta.lastSync)}</span>`;
  box.title = 'Last collector run: ' + (meta.lastSync || 'unknown');
}

function wireSearch(hdr) {
  const inp = hdr.querySelector('.search input');
  const res = hdr.querySelector('.search-res');
  let tmr;
  inp.addEventListener('input', () => {
    clearTimeout(tmr);
    tmr = setTimeout(async () => {
      const q = inp.value;
      if (!q.trim()) { res.hidden = true; return; }
      const hits = await Data.search(q);
      if (!hits.length) {
        res.innerHTML = `<div class="sr-empty">${T('search.none')}</div>`;
      } else {
        res.innerHTML = hits.map(t => `
          <a href="#/trader/${t.id}" class="sr">
            <span class="t-av" style="width:22px;height:22px;font-size:9px">${F.initials(t.name)}</span>
            <span class="sr-n">${t.name || t.login}<em>${t.strategy || ''}</em></span>
            <span class="sr-v ${F.sign(t.ret)}">${F.pct(t.ret, 0) ?? ''}</span>
          </a>`).join('');
      }
      res.hidden = false;
    }, 130);
  });
  inp.addEventListener('blur', () => setTimeout(() => { res.hidden = true; }, 180));
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== inp) { e.preventDefault(); inp.focus(); }
    if (e.key === 'Escape') { inp.blur(); res.hidden = true; }
  });
}

function markActive(route) {
  document.querySelectorAll('[data-r]').forEach(a =>
    a.classList.toggle('on', a.dataset.r === route));
}

/* ---------- routing ---------- */
async function route() {
  const view = document.getElementById('view');
  if (!view) return;
  const hash = (location.hash || '#/overview').slice(2);
  const [name, arg] = hash.split('/');
  markActive(name || 'overview');
  document.querySelector('.side')?.classList.remove('open');
  view.scrollTop = 0;
  document.querySelector('.main').scrollTop = 0;

  try {
    if (name === 'trader' && arg) return await renderTrader(view, arg);
    return await renderHome(view, name || 'overview');
  } catch (err) {
    console.error(err);
    view.innerHTML = `<div class="empty"><div class="big">⚠</div>
      <h4>Something went wrong</h4><p>${String(err.message || err)}</p></div>`;
  }
}

let _meta = null;
async function rebuild() {
  buildShell(_meta);
  await route();
}

/* ---------- avvio ---------- */
(async function boot() {
  initPrefs();
  bindLang(lang);
  const app = document.getElementById('app');
  app.innerHTML = `<div class="boot"><div class="brand-mark">TI</div>
    <div class="boot-bar"><i></i></div></div>`;
  try {
    const meta = await Data.meta();
    _meta = meta;
    await Data.traders();
    buildShell(meta);
    window.addEventListener('hashchange', route);
    await route();
  } catch (err) {
    app.innerHTML = `<div class="empty" style="padding-top:20vh">
      <div class="big">⚠</div><h4>Data not available</h4>
      <p>Could not load <code>data/meta.json</code>. Run
      <code>python src/export_web.py</code> and serve this folder over HTTP.</p>
      <p style="margin-top:8px;color:var(--faint)">${String(err.message || err)}</p></div>`;
  }
})();

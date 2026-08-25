/* ============================================================
   Nucleo: formattazione dei numeri e accesso ai dati.
   Il browser non calcola metriche: le legge gia' pronte (§34, §35).
   ============================================================ */

/* ---------- formattazione ---------- */
/* Le abbreviazioni di durata vanno tradotte: "15mo" in una modalita' pensata
   per chi non mastica l'inglese e' un controsenso. */
let _lang = () => 'uk';
export function bindLang(fn) { _lang = fn; }
const DUR = {
  uk: { m: 'хв', h: 'год', d: 'дн', mo: 'міс', y: 'р' },
  ru: { m: 'мин', h: 'ч', d: 'дн', mo: 'мес', y: 'г' },
  it: { m: 'min', h: 'h', d: 'gg', mo: 'mesi', y: 'anni' }
};
const U = k => (DUR[_lang()] || DUR.it)[k];

/* Separatori: spazio per le migliaia, virgola per i decimali.
   In italiano, ucraino e russo la virgola E' il separatore decimale, quindi
   "+12,062%" si leggeva come dodici virgola zero sei due per cento invece di
   dodicimila: un fattore mille di differenza su un cruscotto finanziario.
   Lo spazio stretto non e' ambiguo in nessuna delle tre lingue. */
const NBSP = ' ';   // spazio stretto insecabile
function group(x, dec) {
  const neg = x < 0;
  const fixed = Math.abs(x).toFixed(dec);
  let [i, f] = fixed.split('.');
  i = i.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return (neg ? '−' : '') + i + (f ? ',' + f : '');
}

export const F = {
  /* Le percentuali di questo dominio vanno da -100 a +17000: una sola
     formattazione non serve a entrambe le scale. */
  pct(v, dec) {
    if (v === null || v === undefined || Number.isNaN(v)) return null;
    const a = Math.abs(v);
    const d = dec !== undefined ? dec : (a >= 1000 ? 0 : a >= 100 ? 1 : 2);
    return (v > 0 ? '+' : '') + group(v, d) + '%';
  },

  /* Sopra il migliaio la percentuale smette di comunicare: "+12 062%" resta
     difficile da afferrare, "x121" si capisce subito. */
  big(v, dec) {
    if (v === null || v === undefined || Number.isNaN(v)) return null;
    if (Math.abs(v) >= 1000) return '×' + group(1 + v / 100, (Math.abs(v) >= 10000 ? 0 : 1));
    return F.pct(v, dec);
  },
  isBig(v) { return v !== null && v !== undefined && Math.abs(v) >= 1000; },

  num(v, dec = 2) {
    if (v === null || v === undefined || Number.isNaN(v)) return null;
    return group(v, dec);
  },
  int(v) {
    if (v === null || v === undefined) return null;
    return group(v, 0);
  },
  compact(v) {
    if (v === null || v === undefined) return null;
    const a = Math.abs(v);
    if (a >= 1e9) return group(v / 1e9, 1) + 'B';
    if (a >= 1e6) return group(v / 1e6, 1) + 'M';
    if (a >= 1e3) return group(v / 1e3, 1) + 'K';
    return group(v, 0);
  },
  usd(v) { const c = F.compact(v); return c === null ? null : '$' + c; },
  /* Durate: minuti crudi sono illeggibili sopra il centinaio. */
  dur(min) {
    if (min === null || min === undefined) return null;
    if (min < 1) return '<1 ' + U('m');
    if (min < 60) return group(min, 0) + ' ' + U('m');
    if (min < 1440) return group(min / 60, 1) + ' ' + U('h');
    return group(min / 1440, 1) + ' ' + U('d');
  },
  days(d) {
    if (d === null || d === undefined) return null;
    if (d < 60) return group(d, 0) + ' ' + U('d');
    if (d < 730) return group(d / 30.4, 0) + ' ' + U('mo');
    return group(d / 365, 1) + ' ' + U('y');
  },
  date(s) { return s ? s.slice(0, 10) : null; },
  ago(iso) {
    if (!iso) return 'unknown';
    const s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 90) return 'just now';
    if (s < 5400) return Math.round(s / 60) + ' min ago';
    if (s < 172800) return Math.round(s / 3600) + ' h ago';
    return Math.round(s / 86400) + ' d ago';
  },
  /* Un valore assente si dichiara, non si inventa (§45). */
  na(html = 'N/A') { return `<span class="na">${html}</span>`; },
  sign(v) { return v === null || v === undefined ? '' : v > 0 ? 'pos' : v < 0 ? 'neg' : ''; },
  arrow(v) { return v > 0 ? '▲' : v < 0 ? '▼' : '–'; },
  initials(n) {
    if (!n) return '?';
    const p = n.trim().split(/[\s_-]+/);
    return (p.length > 1 ? p[0][0] + p[1][0] : n.slice(0, 2)).toUpperCase();
  }
};

/* ---------- accesso ai dati ---------- */
const cache = new Map();

async function get(path) {
  if (cache.has(path)) return cache.get(path);
  const p = fetch(path, { cache: 'no-cache' }).then(r => {
    if (!r.ok) throw new Error(`${r.status} on ${path}`);
    return r.json();
  });
  cache.set(path, p);
  return p;
}

export const Data = {
  base: 'data',
  _byId: null,

  async meta() { return get(`${this.base}/meta.json`); },
  async rankings() { return get(`${this.base}/rankings.json`); },
  async correlation() { return get(`${this.base}/correlation.json`); },

  async traders() {
    const list = await get(`${this.base}/traders.json`);
    if (!this._byId) {
      this._byId = new Map();
      for (const t of list) this._byId.set(t.id, t);
    }
    return list;
  },
  async byId(id) { await this.traders(); return this._byId.get(id) || null; },

  /* Curve e schede pesano: si scaricano solo quando servono davvero (§32). */
  async curve(id) { return get(`${this.base}/curves/${id}.json`); },
  async detail(id) { return get(`${this.base}/trader/${id}.json`); },

  async search(q) {
    const list = await this.traders();
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return list.filter(t =>
      (t.name || '').toLowerCase().includes(s) ||
      (t.strategy || '').toLowerCase().includes(s) ||
      String(t.login).includes(s) ||
      (t.topSym || '').toLowerCase().includes(s)
    ).slice(0, 12);
  }
};

/* ---------- watchlist: preferenza locale, non dato condiviso ---------- */
const WKEY = 'ti_watchlist';
export const Watch = {
  get() {
    try { return new Set(JSON.parse(localStorage.getItem(WKEY) || '[]')); }
    catch (e) { return new Set(); }
  },
  has(id) { return this.get().has(id); },
  toggle(id) {
    const s = this.get();
    s.has(id) ? s.delete(id) : s.add(id);
    try { localStorage.setItem(WKEY, JSON.stringify([...s])); } catch (e) { /* privato */ }
    return s.has(id);
  }
};

/* Il glossario e la funzione tip() vivono in i18n.js: devono seguire la lingua. */

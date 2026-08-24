/* ============================================================
   Homepage e viste di elenco.
   Ordine di lettura (§46): situazione generale, chi e' migliore adesso,
   chi presenta rischio, rischio contro rendimento, avvisi.
   ============================================================ */
import { Data, F, Watch } from '../core.js';
import { sparkline, LineChart, scatter } from '../charts.js';
import { T, isSimple, tip } from '../i18n.js';
import { riskLabel, whatItDoes } from '../narrative.js';

const PRO_COLS = [
  { k: 'rank',  t: '#',        w: 34,  cls: 't-rank', fmt: t => t.rank ?? '–' },
  { k: 'name',  t: 'Trader',   l: true, fmt: tName },
  { k: 'score', tk: 'col.score',  tip: 'score', fmt: tScore },
  { k: 'net',   tk: 'col.net',    tip: 'net',  fmt: t => sPct(t.net) },
  { k: 'ret',   tk: 'col.gross',  fmt: t => sPct(t.ret) },
  { k: 'dd',    tk: 'col.dd',     tip: 'dd',   fmt: t => sPct(t.dd) },
  { k: 'sharpe',tk: 'col.sharpe', tip: 'sharpe', fmt: t => t.sharpe === null ? na() : num(t.sharpe) },
  { k: 'winRate', tk: 'col.win',  fmt: t => t.winRate === null ? na() : F.num(t.winRate, 1) + '%' },
  { k: 'pf',    tk: 'col.pf',     tip: 'pf',   fmt: t => t.pf === null ? na() : num(t.pf) },
  { k: 'age',   tk: 'col.hist',   fmt: t => F.days(t.age) ?? na() },
  { k: 'trades',tk: 'col.trades', fmt: t => F.compact(t.trades) ?? na() },
  { k: 'comm',  tk: 'col.comm',   fmt: t => t.comm === null ? na() : F.num(t.comm, 0) + '%' },
  { k: 'conf',  tk: 'col.conf',   tip: 'conf', fmt: tConf },
  { k: 'spark', tk: 'col.trend',  sort: false, fmt: t => sparkline(t.spark) },
  { k: 'flags', tk: 'col.flags',  sort: false, fmt: tFlags },
];

/* In modalita' semplice restano sette colonne, tutte con nomi che si
   capiscono senza glossario. Gli stessi dati, senza le sigle. */
const SIMPLE_COLS = [
  { k: 'name', tk: 'col.trader',  l: true, fmt: tName },
  { k: 'what', tk: 'scol.what',   l: true, sort: false,
    fmt: t => `<span class="dim">${whatItDoes(t)}</span>` },
  { k: 'net',  tk: 'scol.earned',
    fmt: t => t.net === null ? na() : `<span class="num ${F.sign(t.net)}">${F.pct(t.net, 0)}</span>` },
  { k: 'dd',   tk: 'scol.lost',   fmt: tWorst },
  { k: 'risk', tk: 'scol.risk',   sort: false, fmt: tRisk },
  { k: 'age',  tk: 'scol.years',  fmt: t => F.days(t.age) ?? na() },
  { k: 'conf', tk: 'scol.trust',  sort: false, fmt: tTrust },
];
const COLS = () => (isSimple() ? SIMPLE_COLS : PRO_COLS);

/* Il momento peggiore tradotto in denaro: "-30%" non dice niente,
   "da 1000 a 700" lo capisce chiunque. */
function tWorst(t) {
  if (t.dd === null || t.dd === undefined) return na();
  const left = Math.round(1000 * (1 + t.dd / 100));
  return `<span class="num neg">${F.pct(t.dd, 0)}</span>
    <div class="sub-money">1 000 &rarr; ${left.toLocaleString('en-US').replace(/,/g, ' ')} &euro;</div>`;
}
function tRisk(t) {
  const [sev, label] = riskLabel(t);
  return `<span class="sev ${sev}"><span class="sev-dot"></span>${label}</span>`;
}
function tTrust(t) {
  if (t.conf === null) return na();
  const k = t.conf >= 72 ? ['ok', 'trust.high']
    : t.conf >= 52 ? ['warn', 'trust.mid'] : ['bad', 'trust.low'];
  return `<span class="badge ${k[0]}">${T(k[1])}</span>`;
}

const na = () => F.na();
const num = v => `<span class="num">${F.num(v)}</span>`;
const sPct = v => v === null || v === undefined ? na()
  : `<span class="num ${F.sign(v)}">${F.pct(v)}</span>`;

function tName(t) {
  const w = Watch.has(t.id);
  return `<div class="t-name">
    <span class="t-av">${F.initials(t.name)}</span>
    <span><span class="t-nm">${esc(t.name) || t.login}</span>
      <span class="t-st">${esc(t.strategy) || ''} · <span class="t-plat">${t.platform.toUpperCase()}</span></span></span>
    <button class="star ${w ? 'on' : ''}" data-star="${t.id}" title="Watchlist">★</button>
  </div>`;
}
function tScore(t) {
  if (t.score === null) return na();
  return `<span class="score-cell"><span class="score-bar"><i style="width:${t.score}%"></i></span>
    <span class="num">${F.num(t.score, 0)}</span></span>`;
}
function tConf(t) {
  if (t.conf === null) return na();
  const c = t.conf >= 75 ? 'var(--pos)' : t.conf >= 55 ? 'var(--warn)' : 'var(--neg)';
  return `<span class="score-cell"><span class="score-bar"><i style="width:${t.conf}%;background:${c}"></i></span>
    <span class="num" style="color:${c}">${F.num(t.conf, 0)}</span></span>`;
}
function tFlags(t) {
  const f = [];
  if (t.wiped) f.push(`<span class="badge bad" title="La curva ha toccato -95% o peggio: conto azzerato e ricapitalizzato">ZERO</span>`);
  if (t.noDD) f.push(`<span class="badge warn" title="Nessun giorno negativo in tutta la storia: la curva mostra solo il realizzato, le perdite aperte non compaiono">NO-DD</span>`);
  if (t.badSharpe) f.push(`<span class="badge warn" title="Sharpe oltre 8: non si osserva nel trading reale con rischio reale">SR!</span>`);
  if (t.mart >= 60) f.push(`<span class="badge bad" title="Pattern compatibili con martingala">MART</span>`);
  if (t.extremeVol) f.push(`<span class="badge warn" title="Volatilità annua oltre il 100%">VOL</span>`);
  if (t.slippage) f.push(`<span class="badge mute" title="Durata mediana sotto i 15 minuti">HFT</span>`);
  if (t.check === 'INCOMPLETE_HISTORY') f.push(`<span class="badge mute" title="Lo storico non copre tutta la curva">PART</span>`);
  if (t.check === 'VALIDATED') f.push(`<span class="badge ok" title="Il nostro TWR coincide con la piattaforma">✓</span>`);
  return f.join(' ') || '<span class="faint">–</span>';
}
const esc = s => (s || '').replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

/* ---------------- KPI ---------------- */
function kpis(meta, list) {
  /* I riquadri di testa devono rispettare gli stessi filtri di qualita' della
     classifica: mettere in vetrina un conto azzerato sarebbe esattamente
     l'errore che tutto questo lavoro serve a evitare. */
  const clean = list.filter(t => t.ok && t.check === 'VALIDATED');
  const pool = clean.length >= 5 ? clean : list.filter(t => t.ok);
  const best = [...pool].sort((a, b) => (b.net ?? -1e9) - (a.net ?? -1e9))[0];
  const bestRa = [...pool].filter(t => t.sharpe !== null && (t.age || 0) >= 180)
    .sort((a, b) => b.sharpe - a.sharpe)[0];
  const flagged = list.length - list.filter(t => t.ok).length;
  const worst = [...list].sort((a, b) => (a.dd ?? 0) - (b.dd ?? 0))[0];
  const risky = list.filter(t => (t.mart ?? 0) >= 60 || (t.dd ?? 0) <= -50).length;

  const card = (cls, lbl, val, sub, tipKey) => `
    <div class="kpi ${cls}">
      <div class="kpi-lbl">${lbl}${tipKey ? tip(tipKey) : ''}</div>
      <div class="kpi-val">${val}</div>
      <div class="kpi-sub">${sub}</div>
    </div>`;

  return `<div class="kpi-grid">
    <div class="kpi lead">
      <div class="kpi-lbl">${T('kpi.bestnet')}${isSimple() ? '' : tip('net')}</div>
      <div class="kpi-name">${esc(best?.name) || '–'} <span class="dim" style="font-weight:400">
        ${esc(best?.strategy) || ''}</span></div>
      <div class="kpi-val pos">${F.pct(best?.net, 0) ?? '–'}</div>
      <div class="kpi-sub">${T('kpi.gross')} ${F.pct(best?.ret, 0)} ·
        ${T('kpi.commission')} ${F.num(best?.comm, 0)}% · ${T('col.dd')} ${F.pct(best?.dd, 1)}</div>
      <div class="kpi-spark">${sparkline(best?.spark, 190, 52)}</div>
    </div>
    ${card('', T('kpi.bestrisk'), `<span class="num">${F.num(bestRa?.sharpe, 2) ?? '–'}</span>
        <span style="font-size:13px;color:var(--muted);font-weight:500">Sharpe</span>`,
      `${esc(bestRa?.name) || '–'} · DD ${F.pct(bestRa?.dd, 1)}`, 'sharpe')}
    ${card('', T('kpi.tracked'), `<span class="num">${F.int(meta.counts.traders)}</span>`,
      `${F.int(meta.counts.inRating)} ${T('kpi.inrating')} · ${F.compact(meta.counts.trades)} ${T('kpi.trades')}`)}
    ${card('half', T('kpi.coverage'), `<span class="num">${meta.quality.coverage}%</span>`,
      `${meta.quality.validated} ${T('kpi.validated')}`, 'check')}
    ${card('half', T('kpi.risky'), `<span class="num neg">${risky}</span>`,
      T('kpi.riskysub'))}
    ${card('half', T('kpi.flagged'), `<span class="num warn">${flagged}</span>`,
      T('kpi.flagsub'))}
    ${card('half', T('kpi.worstdd'), `<span class="num neg">${F.pct(worst?.dd, 0)}</span>`,
      esc(worst?.name) || '–', 'dd')}
    ${card('half', T('kpi.avgconf'), `<span class="num">${meta.quality.avgConfidence}</span>`,
      `${meta.quality.incomplete} ${T('kpi.partial')}`, 'conf')}
  </div>`;
}

/* ---------------- tabella ---------------- */
let sortKey = 'score', sortDir = -1;

function table(rows) {
  const cols = COLS();
  const head = cols.map(c =>
    `<th class="${c.l ? 'l' : ''} ${sortKey === c.k ? 'sorted' : ''}"
        data-sort="${c.sort === false ? '' : c.k}" style="${c.w ? `width:${c.w}px` : ''}">
      ${c.tk ? T(c.tk) : c.t}${c.tip && !isSimple() ? tip(c.tip) : ''}<span class="arr">${sortDir < 0 ? '▾' : '▴'}</span></th>`).join('');
  const body = rows.map(t => `<tr data-id="${t.id}">
      ${cols.map(c => `<td class="${c.l ? 'l' : ''} ${c.cls || ''}">${c.fmt(t) ?? na()}</td>`).join('')}
    </tr>`).join('');
  return `<div class="tbl-wrap"><table class="fin"><thead><tr>${head}</tr></thead>
    <tbody>${body}</tbody></table></div>`;
}

function sortRows(list) {
  return [...list].sort((a, b) => {
    const x = a[sortKey], y = b[sortKey];
    if (x === null || x === undefined) return 1;
    if (y === null || y === undefined) return -1;
    if (typeof x === 'string') return x.localeCompare(y) * -sortDir;
    return (x - y) * sortDir;
  });
}

/* ---------------- vista principale ---------------- */
export async function renderHome(view, page) {
  const [meta, list, ranks] = await Promise.all([Data.meta(), Data.traders(), Data.rankings()]);

  if (page === 'quality') return renderQuality(view, meta, list);
  if (page === 'risk') return renderRisk(view, list);
  if (page === 'watchlist') return renderWatch(view, list);

  const titles = {
    overview: [T('page.overview'), T('page.overview.sub')],
    traders: [T('page.traders'), T('page.traders.sub', { n: list.length })],
    rankings: [T('page.rankings'), T('page.rankings.sub')],
    compare: [T('page.rankings'), T('page.rankings.sub')],
  };
  const [ttl, sub] = titles[page] || titles.overview;

  const isOverview = page === 'overview';
  const tabs = Object.entries(ranks);
  const activeTab = (location.hash.split('?')[1] || '').replace('r=', '') || 'overall';
  const ids = new Set(ranks[activeTab]?.ids || []);
  const ranked = list.filter(t => ids.has(t.id));
  const shown = isOverview ? sortRows(ranked).slice(0, 12) : sortRows(page === 'rankings' ? ranked : list);

  view.innerHTML = `
    <div class="page-hdr"><h1>${ttl}</h1><div class="sub">${sub}</div></div>
    ${isOverview && isSimple() ? `<div class="card intro">
      <div class="card-bd">
        <h3 style="margin-bottom:6px">${T('simple.what')}</h3>
        <p style="color:var(--text-2);line-height:1.6;max-width:78ch">
          ${T('simple.whatp', { n: meta.counts.traders })}</p>
      </div></div>` : ''}
    ${isOverview ? `<div class="sec">${kpis(meta, list)}</div>` : ''}
    ${isOverview ? `<div class="sec g-main">
      <div class="card">
        <div class="card-hd"><h3>${T('sec.perf')}</h3>
          <span class="sub">${T('sec.perfsub')}</span>
          <div class="right"><div class="seg" id="rangeSeg">
            ${['30D', '90D', '1Y', 'ALL'].map((r, i) =>
              `<button data-range="${r}" class="${i === 2 ? 'on' : ''}">${r}</button>`).join('')}
          </div></div></div>
        <div class="card-bd"><div class="chart-box" style="height:264px">
          <canvas id="mainChart"></canvas></div></div>
      </div>
      <div class="card">
        <div class="card-hd"><h3>${T('sec.signals')}</h3></div>
        <div class="card-bd flush"><div class="feed-list" id="riskFeed"></div></div>
      </div>
    </div>` : ''}

    ${page === 'rankings' || isOverview ? `<div class="sec">
      <div class="sec-hdr">
        <h2>${isOverview ? T('sec.top') : T('page.rankings')}</h2>
        <div class="sub">${ranks[activeTab]?.label || ''}</div>
        <div class="right">${tabs.map(([k, v]) =>
          `<button class="chip ${k === activeTab ? 'on' : ''}" data-rank="${k}">${v.label}</button>`).join('')}</div>
      </div>
      <div class="card"><div class="card-bd flush">${table(shown)}</div></div>
    </div>` : ''}

    ${page === 'traders' ? `<div class="sec"><div class="card"><div class="card-bd flush">
      ${table(shown)}</div></div></div>` : ''}

    ${isOverview && !isSimple() ? `<div class="sec">
      <div class="sec-hdr"><h2>${T('sec.scatter')}</h2>
        <div class="sub">${T('sec.scattersub')}</div></div>
      <div class="card"><div class="card-bd">
        <div class="chart-box" style="height:330px"><canvas id="scatterChart"></canvas>
        <div class="sc-tip" hidden></div></div>
      </div></div>
    </div>` : ''}
  `;

  wireTable(view);
  view.querySelectorAll('[data-rank]').forEach(b => b.onclick = () => {
    location.hash = `#/${page}?r=${b.dataset.rank}`;
    renderHome(view, page);
  });

  if (isOverview) {
    drawMain(view, list);
    if (!isSimple()) drawScatter(view, list);
    drawRiskFeed(view, list);
  }
}

function wireTable(view) {
  view.querySelectorAll('th[data-sort]').forEach(th => {
    if (!th.dataset.sort) return;
    th.onclick = () => {
      if (sortKey === th.dataset.sort) sortDir = -sortDir;
      else { sortKey = th.dataset.sort; sortDir = -1; }
      const page = (location.hash || '#/overview').slice(2).split('/')[0].split('?')[0];
      renderHome(view, page || 'overview');
    };
  });
  view.querySelectorAll('tr[data-id]').forEach(tr => {
    tr.onclick = e => {
      if (e.target.closest('[data-star]')) return;
      location.hash = `#/trader/${tr.dataset.id}`;
    };
  });
  view.querySelectorAll('[data-star]').forEach(b => {
    b.onclick = e => {
      e.stopPropagation();
      b.classList.toggle('on', Watch.toggle(b.dataset.star));
    };
  });
}

async function drawMain(view, list) {
  const cv = view.querySelector('#mainChart');
  if (!cv) return;
  const top = [...list].filter(t => t.check === 'VALIDATED' && t.score !== null)
    .sort((a, b) => b.score - a.score).slice(0, 8);
  const palette = ['#4cc9f0', '#2ad17f', '#f5a524', '#b794f6', '#ff8a3d', '#63b3ed', '#ff5f6d', '#48bb78'];
  const chart = new LineChart(cv, { showArea: false });
  const curves = await Promise.all(top.map(t => Data.curve(t.id).catch(() => null)));

  const build = range => {
    const days = { '30D': 30, '90D': 90, '1Y': 365, 'ALL': 1e5 }[range];
    return curves.map((c, i) => {
      if (!c) return null;
      const cut = Math.max(0, c.v.length - days);
      const d = c.d.slice(cut), v = c.v.slice(cut);
      const base = 1 + (v[0] || 0) / 100;
      return {
        name: top[i].name || String(top[i].login),
        color: palette[i % palette.length],
        dates: d,
        values: v.map(x => ((1 + x / 100) / base - 1) * 100)   // ribasato all'inizio finestra
      };
    }).filter(Boolean);
  };
  chart.setData(build('1Y'));
  view.querySelectorAll('#rangeSeg button').forEach(b => b.onclick = () => {
    view.querySelectorAll('#rangeSeg button').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    chart.setData(build(b.dataset.range));
  });
}

function drawScatter(view, list) {
  const cv = view.querySelector('#scatterChart');
  if (!cv) return;
  const pts = list.filter(t => t.dd !== null && t.net !== null && t.net > -100)
    .map(t => ({
      x: Math.abs(t.dd), y: t.net,
      size: (t.conf || 0) / 100,
      color: (t.mart ?? 0) >= 60 ? '#ff5f6d'
           : Math.abs(t.dd) <= 25 ? '#2ad17f'
           : Math.abs(t.dd) >= 60 ? '#f5a524' : '#4cc9f0',
      t
    }));
  const paint = () => scatter(cv, pts, { xLabel: 'Max drawdown (%)', yLabel: 'Est. net return (%)' });
  paint();
  new ResizeObserver(paint).observe(cv);

  const tipEl = view.querySelector('.sc-tip');
  cv.onmousemove = e => {
    const b = cv.getBoundingClientRect();
    const mx = e.clientX - b.left, my = e.clientY - b.top;
    const hit = (cv._hit || []).find(h => (h.x - mx) ** 2 + (h.y - my) ** 2 < h.r * h.r + 18);
    if (!hit) { tipEl.hidden = true; cv.style.cursor = 'default'; return; }
    const t = hit.d.t;
    cv.style.cursor = 'pointer';
    tipEl.hidden = false;
    tipEl.innerHTML = `<b>${esc(t.name)}</b><span class="dim">${esc(t.strategy) || ''}</span>
      <div class="ct-row"><span>Net return</span><b class="${F.sign(t.net)}">${F.pct(t.net, 0)}</b></div>
      <div class="ct-row"><span>Max DD</span><b class="neg">${F.pct(t.dd, 1)}</b></div>
      <div class="ct-row"><span>Commission</span><b>${F.num(t.comm, 0)}%</b></div>
      <div class="ct-row"><span>History</span><b>${F.days(t.age)}</b></div>
      <div class="ct-row"><span>Confidence</span><b>${F.num(t.conf, 0)}</b></div>`;
    tipEl.style.left = Math.min(mx + 14, cv.offsetWidth - 200) + 'px';
    tipEl.style.top = Math.max(4, my - 40) + 'px';
    cv._last = t;
  };
  cv.onmouseleave = () => { tipEl.hidden = true; };
  cv.onclick = () => { if (cv._last && cv.style.cursor === 'pointer') location.hash = `#/trader/${cv._last.id}`; };
}

/* Gli avvisi che possiamo davvero produrre oggi derivano dallo stato attuale.
   La macchina a stati con storico parte quando avremo piu' snapshot. */
function drawRiskFeed(view, list) {
  const box = view.querySelector('#riskFeed');
  if (!box) return;
  const ev = [];
  const push = (sev, t, txt) => ev.push({ sev, t, txt });

  list.filter(t => t.wiped).slice(0, 3)
    .forEach(t => push('crit', t, T('sig.wiped')));
  list.filter(t => (t.mart ?? 0) >= 60).sort((a, b) => b.mart - a.mart).slice(0, 4)
    .forEach(t => push('crit', t, T('sig.mart', { x: F.num(t.volAfterLoss, 2) })));
  list.filter(t => (t.dd ?? 0) <= -60).sort((a, b) => a.dd - b.dd).slice(0, 4)
    .forEach(t => push('high', t, T('sig.dd', { x: F.pct(t.dd, 1) })));
  list.filter(t => t.extremeVol && (t.age ?? 0) > 180).slice(0, 3)
    .forEach(t => push('warn', t, T('sig.vol', { x: F.pct(t.vol, 0) })));
  list.filter(t => (t.topSymPct ?? 0) > 97 && (t.trades ?? 0) > 500).slice(0, 3)
    .forEach(t => push('warn', t, T('sig.conc', { x: F.num(t.topSymPct, 0), s: t.topSym })));
  list.filter(t => t.check === 'INCOMPLETE_HISTORY').slice(0, 2)
    .forEach(t => push('normal', t, T('sig.partial')));

  const col = { crit: 'var(--sev-crit)', high: 'var(--sev-high)', warn: 'var(--sev-warn)', normal: 'var(--sev-normal)' };
  box.innerHTML = ev.slice(0, 14).map((e, i) => `
    <div class="feed-item new" style="animation-delay:${i * 42}ms" data-id="${e.t.id}">
      <span class="feed-mark" style="background:${col[e.sev]}"></span>
      <div class="feed-txt"><b>${esc(e.t.name)}</b> ${e.txt}
        <div class="sev ${e.sev}" style="margin-top:3px"><span class="sev-dot"></span>${e.sev.toUpperCase()}</div>
      </div></div>`).join('') || `<div class="empty"><p>${T('sig.none')}</p></div>`;
  box.querySelectorAll('[data-id]').forEach(d => d.onclick = () => location.hash = `#/trader/${d.dataset.id}`);
}

/* ---------------- viste secondarie ---------------- */
function renderRisk(view, list) {
  const risky = list.filter(t => (t.mart ?? 0) >= 40 || (t.dd ?? 0) <= -45 || t.extremeVol)
    .sort((a, b) => (b.mart ?? 0) - (a.mart ?? 0));
  view.innerHTML = `<div class="page-hdr"><h1>${T('page.risk')}</h1>
    <div class="sub">${T('page.risk.sub', { n: risky.length })}</div></div>
    <div class="card"><div class="card-bd flush">${table(sortRows(risky))}</div></div>`;
  wireTable(view);
}

function renderWatch(view, list) {
  const w = Watch.get();
  const sel = list.filter(t => w.has(t.id));
  view.innerHTML = `<div class="page-hdr"><h1>${T('page.watch')}</h1>
    <div class="sub">${T('page.watch.sub', { n: sel.length })}</div></div>
    ${sel.length ? `<div class="card"><div class="card-bd flush">${table(sortRows(sel))}</div></div>`
    : `<div class="empty"><div class="big">★</div><h4>${T('empty.watch')}</h4>
       <p>${T('empty.watchp')}</p></div>`}`;
  wireTable(view);
}

function renderQuality(view, meta, list) {
  const q = meta.quality;
  const bar = (lbl, n, col) => `<div class="factor p"><span class="s" style="color:${col}">■</span>
    <span style="flex:1">${lbl}</span><b class="num">${n}</b></div>`;
  view.innerHTML = `
    <div class="page-hdr"><h1>${T('page.quality')}</h1>
      <div class="sub">${T('page.quality.sub')}</div></div>
    <div class="g2">
      <div class="card"><div class="card-hd"><h3>${T('q.cross')}</h3>
        <span class="sub">${T('q.crosssub')}</span></div>
        <div class="card-bd">
          ${bar(T('q.valid'), q.validated, 'var(--pos)')}
          ${bar(T('q.incomplete'), q.incomplete, 'var(--muted)')}
          ${bar(T('q.investigate'), q.investigate, 'var(--warn)')}
          <p class="dim" style="margin-top:12px;font-size:12px;line-height:1.5">
            ${T('q.method')}</p>
        </div></div>
      <div class="card"><div class="card-hd"><h3>${T('q.unavail')}</h3>
        <span class="sub">${T('q.unavailsub')}</span></div>
        <div class="card-bd">
          ${meta.unavailable.map(u => `<div class="factor n"><span class="s">–</span>
            <span><b style="color:var(--text-2)">${u.field}</b><br>
            <span class="dim" style="font-size:11.5px">${u.why}</span></span></div>`).join('')}
        </div></div>
    </div>
    <div class="sec" style="margin-top:16px"><div class="card"><div class="card-bd flush">
      ${table(sortRows(list).slice(0, 200))}</div></div></div>`;
  wireTable(view);
}

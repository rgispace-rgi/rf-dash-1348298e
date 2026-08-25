/* ============================================================
   Scheda del singolo trader: da "chi è il migliore" fino alla
   singola operazione, senza cambiare applicazione (§47).
   ============================================================ */
import { Data, F, Watch } from '../core.js';
import { LineChart, histogram, heatColor } from '../charts.js';
import { T, isSimple, tip } from '../i18n.js';
import { summary, warnings, verdict, riskLabel, whatItDoes } from '../narrative.js';

const esc = s => (s || '').replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
const na = () => F.na(T('tr.notavail'));

function metric(k, v, extra, tipKey) {
  return `<div class="mcell"><div class="k">${k}${tipKey ? tip(tipKey) : ''}</div>
    <div class="v">${v ?? na()}</div>${extra ? `<div class="x">${extra}</div>` : ''}</div>`;
}
const sp = (v, d) => v === null || v === undefined ? null
  : `<span class="${F.sign(v)}">${F.pct(v, d)}</span>`;

/* Il punteggio non e' un fatto nudo: accanto va sempre quanto ci fidiamo. */
function scoreRing(label, val, lo, hi, tipKey) {
  if (val === null) return '';
  const col = val >= 70 ? 'var(--pos)' : val >= 45 ? 'var(--warn)' : 'var(--neg)';
  return `<div class="sring">
    <div class="sring-l">${label}${tipKey ? tip(tipKey) : ''}</div>
    <div class="sring-v" style="color:${col}">${F.num(val, 0)}</div>
    ${lo !== undefined && lo !== null ? `<div class="sring-r">${F.num(lo, 0)}–${F.num(hi, 0)}</div>` : ''}
    <div class="score-bar" style="width:100%;margin-top:6px"><i style="width:${val}%;background:${col}"></i></div>
  </div>`;
}

export async function renderTrader(view, id) {
  view.innerHTML = `<div class="skel" style="height:120px;margin-bottom:16px"></div>
    <div class="skel" style="height:320px"></div>`;

  const t = await Data.byId(id);
  if (!t) {
    view.innerHTML = `<div class="empty"><div class="big">?</div><h4>Trader non trovato</h4>
      <p>L'identificatore <code>${esc(id)}</code> non è presente nel dataset.</p>
      <p style="margin-top:10px"><a href="#/traders" class="chip">Torna all'elenco</a></p></div>`;
    return;
  }

  const [detail, curve] = await Promise.all([
    Data.detail(id).catch(() => null),
    Data.curve(id).catch(() => null)
  ]);

  if (isSimple()) return renderSimple(view, t, detail, curve, id);

  const w = Watch.has(id);
  const checkBadge = {
    VALIDATED: `<span class="badge ok">✓ ${T('q.valid')}</span>`,
    INCOMPLETE_HISTORY: `<span class="badge mute">◐ ${T('q.incomplete')}</span>`,
    INVESTIGATE: `<span class="badge warn">⚠ ${T('q.investigate')}</span>`
  }[t.check] || '';

  view.innerHTML = `
  <div class="tr-hd">
    <div class="tr-id">
      <span class="t-av" style="width:46px;height:46px;font-size:17px;border-radius:12px">${F.initials(t.name)}</span>
      <div>
        <h1>${esc(t.name) || t.login}
          <button class="star ${w ? 'on' : ''}" id="starBtn" title="Watchlist">★</button></h1>
        <div class="tr-sub">
          <span>${esc(t.strategy) || '—'}</span>
          <span class="t-plat">${t.platform.toUpperCase()}</span>
          <span class="dim">#${t.login}</span>
          ${checkBadge}
        </div>
        ${t.desc ? `<p class="tr-desc">${esc(t.desc)}</p>` : ''}
      </div>
    </div>
    <div class="tr-scores">
      ${scoreRing(T('sc.overall'), t.score, t.scoreLo, t.scoreHi, 'score')}
      ${scoreRing(T('sc.risk'), t.sRisk)}
      ${scoreRing(T('sc.cons'), t.sCons)}
      ${scoreRing(T('sc.strat'), t.sStrat)}
      ${scoreRing(T('sc.conf'), t.conf, null, null, 'conf')}
    </div>
  </div>

  <div class="tr-facts">
    ${[[T('tr.registered'), F.date(t.registered)], [T('tr.history'), F.days(t.age)],
       [T('tr.currency'), t.currency], [T('tr.leverage'), t.leverage ? '1:' + t.leverage : null],
       [T('tr.subs'), F.int(t.subs)], [T('tr.minEquity'), t.minEquity ? '$' + F.int(t.minEquity) : null],
       [T('tr.group'), t.group], [T('tr.copied'), t.portfolio ? t.portfolio : null]]
      .map(([k, v]) => `<div><span>${k}</span><b>${v ?? F.na('—')}</b></div>`).join('')}
  </div>

  <div class="sec">
    <div class="mgrid card">
      ${metric(T('tr.strategyret'), t.ret === null ? null : `<span class="${F.sign(t.ret)}">${F.big(t.ret, 1)}</span>`, t.retOwn !== null ? T('p.ourtwr', { x: F.pct(t.retOwn, 1) }) : '')}
      ${metric(T('tr.netret'), sp(t.net, 1), T('p.aftercomm', { x: F.num(t.comm, 0) }), 'net')}
      ${metric(T('tr.maxdd'), sp(t.dd, 1), '', 'dd')}
      ${metric(T('p.sharpe'), t.sharpe === null ? null : F.num(t.sharpe), t.extremeVol ? '⚠ extreme volatility' : '', 'sharpe')}
      ${metric(T('p.sortino'), t.sortino === null ? null : F.num(t.sortino), '', 'sortino')}
      ${metric(T('p.calmar'), t.calmar === null ? null : F.num(t.calmar), t.calmar === null ? T('p.needs1y') : '', 'calmar')}
      ${metric(T('p.vol'), t.vol === null ? null : F.pct(t.vol, 0), T('p.annual'))}
      ${metric(T('p.winrate'), t.winRate === null ? null : F.num(t.winRate, 1) + '%')}
      ${metric(T('p.pf'), t.pf === null ? null : F.num(t.pf), '', 'pf')}
      ${metric(T('p.payoff'), t.payoff === null ? null : F.num(t.payoff), T('p.payoffx'))}
      ${metric(T('p.trades'), F.int(t.trades), t.perWeek ? T('p.perweek', { x: F.num(t.perWeek, 1) }) : '')}
      ${metric(T('p.duration'), F.dur(t.durMin), t.slippage ? '⚠ ' + T('p.slipwarn') : '')}
      ${metric(T('p.streak'), t.streak)}
      ${metric(T('p.instr'), t.nSym, t.topSym ? `${t.topSym} ${F.num(t.topSymPct, 0)}%` : '', 'hhi')}
      ${metric(T('p.recovery'), t.recovery === null ? null : F.num(t.recovery))}
      ${metric(T('p.posmonths'), t.consistency === null ? null : F.num(t.consistency, 0) + '%')}
    </div>
  </div>

  <div class="sec">
    <div class="card">
      <div class="card-hd"><h3>${T('tr.perf')}</h3>
        <div class="right"><div class="seg" id="trRange">
          ${['30D', '90D', '1Y', 'ALL'].map((r, i) => `<button data-range="${r}" class="${i === 3 ? 'on' : ''}">${r}</button>`).join('')}
        </div></div></div>
      <div class="card-bd">
        <div class="chart-box" style="height:250px"><canvas id="perfChart"></canvas></div>
        <div class="chart-box" style="height:104px;margin-top:6px"><canvas id="ddChart"></canvas></div>
        <div class="dim" style="font-size:11px;margin-top:6px">
          ${T('p.ddbelow')}${tip('dd')}</div>
      </div>
    </div>
  </div>

  <div class="g2">
    <div class="card"><div class="card-hd"><h3>${T('tr.monthly')}</h3></div>
      <div class="card-bd" id="heatBox"></div></div>
    <div class="card"><div class="card-hd"><h3>${T('tr.economics')}</h3></div>
      <div class="card-bd" id="econBox"></div></div>
  </div>

  <div class="g2" style="margin-top:12px">
    <div class="card"><div class="card-hd"><h3>${T('tr.strategy')}</h3></div>
      <div class="card-bd" id="stratBox"></div></div>
    <div class="card"><div class="card-hd"><h3>${T('tr.dataconf')}</h3></div>
      <div class="card-bd" id="confBox"></div></div>
  </div>

  <div class="g3" style="margin-top:12px">
    <div class="card"><div class="card-hd"><h3>${T('p.pnldist')}</h3></div>
      <div class="card-bd"><div class="chart-box" style="height:132px"><canvas id="hPnl"></canvas></div></div></div>
    <div class="card"><div class="card-hd"><h3>${T('p.durdist')}</h3></div>
      <div class="card-bd"><div class="chart-box" style="height:132px"><canvas id="hDur"></canvas></div></div></div>
    <div class="card"><div class="card-hd"><h3>${T('p.hourdist')}</h3><span class="sub">UTC</span></div>
      <div class="card-bd"><div class="chart-box" style="height:132px"><canvas id="hHour"></canvas></div></div></div>
  </div>

  <div class="sec" style="margin-top:12px">
    <div class="card"><div class="card-hd"><h3>${T('tr.recent')}</h3>
      <span class="sub" id="trCount"></span></div>
      <div class="card-bd flush" id="tradesBox"></div></div>
  </div>`;

  document.getElementById('starBtn').onclick = e =>
    e.currentTarget.classList.toggle('on', Watch.toggle(id));

  if (curve) drawPerf(view, curve, t);
  if (detail) {
    drawHeat(view, detail);
    drawEcon(view, t, detail);
    drawStrategy(view, t, detail);
    drawConf(view, t);
    drawDists(view, detail);
    drawTrades(view, detail);
  }
}

function drawPerf(view, curve, t) {
  const perf = new LineChart(view.querySelector('#perfChart'), { showArea: true });
  const dd = new LineChart(view.querySelector('#ddChart'), { showArea: true, animate: false });

  const build = range => {
    const days = { '30D': 30, '90D': 90, '1Y': 365, 'ALL': 1e6 }[range];
    const cut = Math.max(0, curve.v.length - days);
    const d = curve.d.slice(cut), v = curve.v.slice(cut);
    const base = 1 + (v[0] || 0) / 100;
    const reb = v.map(x => ((1 + x / 100) / base - 1) * 100);
    let peak = -1e9;
    const draw = reb.map(x => { peak = Math.max(peak, x); return ((1 + x / 100) / (1 + peak / 100) - 1) * 100; });
    return { d, reb, draw };
  };
  const apply = range => {
    const { d, reb, draw } = build(range);
    perf.setData([{ name: 'Return', color: '#4cc9f0', dates: d, values: reb }]);
    dd.setData([{ name: 'Drawdown', color: '#ff5f6d', dates: d, values: draw }]);
  };
  apply('ALL');
  view.querySelectorAll('#trRange button').forEach(b => b.onclick = () => {
    view.querySelectorAll('#trRange button').forEach(x => x.classList.remove('on'));
    b.classList.add('on'); apply(b.dataset.range);
  });
}

function drawHeat(view, d) {
  const box = view.querySelector('#heatBox');
  if (!d.monthly || !d.monthly.length) {
    box.innerHTML = `<div class="empty"><p>${T('empty.heat')}</p></div>`;
    return;
  }
  const byYear = {};
  d.monthly.forEach(m => {
    const [y, mo] = m.m.split('-');
    (byYear[y] = byYear[y] || Array(12).fill(null))[+mo - 1] = m.r;
  });
  const MO = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  box.innerHTML = `<div class="heat">
    <div class="heat-hd"><span></span>${MO.map(m => `<span>${m}</span>`).join('')}</div>
    ${Object.keys(byYear).sort().map(y => `<div class="heat-row">
      <span class="heat-y">${y}</span>
      ${byYear[y].map((v, i) => `<div class="heat-c" style="background:${heatColor(v)}"
        title="${y}-${String(i + 1).padStart(2, '0')}: ${v === null ? 'no data' : F.pct(v, 1)}">
        ${v === null ? '' : (Math.abs(v) >= 100 ? Math.round(v) : v.toFixed(0))}</div>`).join('')}
    </div>`).join('')}
  </div>
  <div class="dim" style="font-size:11px;margin-top:10px">${T('p.heatnote')}</div>`;
}

/* La differenza fra quanto rende la strategia e quanto arriva a chi copia
   e' il numero economicamente interessante (§23). */
function drawEcon(view, t, d) {
  const box = view.querySelector('#econBox');
  const gross = t.ret, comm = t.comm, net = t.net;
  const kept = gross > 0 && comm !== null ? 100 - comm : 100;
  box.innerHTML = `
    <div class="econ-row"><span>${T('p.grossret')}</span>
      <b class="${F.sign(gross)}">${F.pct(gross, 1) ?? na()}</b></div>
    <div class="econ-row"><span>${T('p.tradercomm')}</span>
      <b class="neg">−${F.num(comm, 0)}%</b></div>
    <div class="econ-bar">
      <i style="width:${kept}%;background:var(--pos)"></i>
      <i style="width:${100 - kept}%;background:var(--neg)"></i>
    </div>
    <div class="econ-legend"><span><i style="background:var(--pos)"></i>${T('p.tocopier')} ${F.num(kept, 0)}%</span>
      <span><i style="background:var(--neg)"></i>${T('p.totrader')} ${F.num(comm, 0)}%</span></div>
    <div class="econ-row big"><span>${T('p.estnet')}${tip('net')}</span>
      <b class="${F.sign(net)}">${F.pct(net, 1) ?? na()}</b></div>
    <div class="econ-row"><span>${T('p.obsnet')}${tip('copyEff')}</span>
      <b>${na()}</b></div>
    <div class="econ-row"><span>${T('p.copyeff')}</span><b>${na()}</b></div>
    ${t.slippage ? `<div class="warnbox">${T('p.slipbox', { x: F.dur(t.durMin) })}</div>` : ''}
    <div class="dim" style="font-size:11px;margin-top:10px;line-height:1.5">
      ${T('p.estnote')}</div>
    ${d.offers && d.offers.length > 1 ? `<div style="margin-top:14px">
      <div class="k" style="font-size:10.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px">${T('p.offerhist')}</div>
      ${d.offers.map(o => `<div class="econ-row small"><span>${o.from || o.seen}</span>
        <b>${F.num(o.rate, 0)}%</b></div>`).join('')}
      <div class="dim" style="font-size:11px;margin-top:6px">${T('p.offernote')}</div></div>` : ''}`;
}

function drawStrategy(view, t, d) {
  const box = view.querySelector('#stratBox');
  const tags = [];
  const dur = t.durMin ?? 0;
  if (dur && dur < 15) tags.push('Scalping-like');
  else if (dur && dur < 480) tags.push('Intraday');
  else if (dur && dur < 4320) tags.push('Swing');
  else if (dur) tags.push('Position');
  if ((t.perWeek ?? 0) > 60) tags.push('High frequency');
  if ((t.hhi ?? 0) > 0.85) tags.push('Single-instrument');
  if ((t.mart ?? 0) >= 60) tags.push('Martingale-like');
  else if ((t.mart ?? 0) >= 35) tags.push('Size-scaling');
  if ((t.grid ?? 0) >= 55) tags.push('Grid-like');
  if (!tags.length) tags.push('Mixed');

  const lk = v => v >= 70 ? ['HIGH', 'var(--neg)'] : v >= 45 ? ['MEDIUM', 'var(--warn)']
    : v >= 20 ? ['LOW', 'var(--muted)'] : ['MINIMAL', 'var(--pos)'];
  const [ml, mc] = lk(t.mart ?? 0);
  const [gl, gc] = lk(t.grid ?? 0);

  box.innerHTML = `
    <div class="tags">${tags.map(x => `<span class="chip on" style="cursor:default">${x}</span>`).join('')}</div>
    <div class="econ-row" style="margin-top:12px"><span>${T('p.martlike')}${tip('mart')}</span>
      <b style="color:${mc}">${ml}</b></div>
    <div class="score-bar" style="width:100%"><i style="width:${t.mart ?? 0}%;background:${mc}"></i></div>
    <div class="dim" style="font-size:11.5px;margin:6px 0 12px;line-height:1.5">
      ${T('p.martnote', { a: F.num(t.volAfterLoss, 2) ?? '—', b: F.num(t.volAfterWin, 2) ?? '—',
        c: t.escalation ? T('p.escal', { n: t.escalation }) : '' })}</div>
    <div class="econ-row"><span>${T('p.gridlike')}</span><b style="color:${gc}">${gl}</b></div>
    <div class="score-bar" style="width:100%"><i style="width:${t.grid ?? 0}%;background:${gc}"></i></div>
    <div class="dim" style="font-size:11.5px;margin-top:6px">${T('p.gridnote')}</div>
    ${d.bySymbol && d.bySymbol.length ? `<div style="margin-top:14px">
      <div style="font-size:10.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px">${T('p.bysymbol')}</div>
      ${d.bySymbol.slice(0, 6).map(s => `<div class="econ-row small"><span>${esc(s.s)}</span>
        <b class="${F.sign(s.p)}">${F.compact(s.p)}</b></div>`).join('')}
      <div class="dim" style="font-size:10.5px;margin-top:4px">
        ${T('p.currnote', { x: t.currency || '?' })}</div></div>` : ''}
    <div class="warnbox" style="margin-top:12px">${T('p.patternbox')}</div>`;
}

function drawConf(view, t) {
  const box = view.querySelector('#confBox');
  const col = t.conf >= 75 ? 'var(--pos)' : t.conf >= 55 ? 'var(--warn)' : 'var(--neg)';
  const pos = [], neg = [];
  (t.age >= 730 ? pos : neg).push(T('p.cf.hist', { x: F.days(t.age) }));
  (t.trades >= 500 ? pos : neg).push(T('p.cf.trades', { x: F.int(t.trades) }));
  (t.histComplete ? pos : neg).push(T(t.histComplete ? 'p.cf.complete' : 'p.cf.partial'));
  (t.check === 'VALIDATED' ? pos : neg).push(T(t.check === 'VALIDATED' ? 'p.cf.valid' : 'p.cf.invalid'));
  (t.comm !== null ? pos : neg).push(T(t.comm !== null ? 'p.cf.comm' : 'p.cf.commest'));
  neg.push(T('p.cf.nosltp'));
  if (t.histTrunc) neg.push(T('p.cf.trunc'));

  box.innerHTML = `
    <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:4px">
      <div style="font-size:34px;font-weight:660;letter-spacing:-.03em;color:${col}"
        class="num">${F.num(t.conf, 0)}</div>
      <div class="dim">/ 100</div></div>
    <div class="conf-bar"><i style="width:${t.conf}%;background:${col}"></i></div>
    <div style="margin-top:14px">
      ${pos.map(x => `<div class="factor p"><span class="s">+</span><span>${x}</span></div>`).join('')}
      ${neg.map(x => `<div class="factor n"><span class="s">−</span><span>${x}</span></div>`).join('')}
    </div>
    <div class="warnbox" style="margin-top:12px">${T('p.confbox')}</div>`;
}

function drawDists(view, d) {
  histogram(view.querySelector('#hPnl'), d.pnlHist);
  histogram(view.querySelector('#hDur'), d.durHist, '#4cc9f0');
  const cv = view.querySelector('#hHour');
  if (cv && d.byHour) {
    histogram(cv, { lo: 0, hi: 23, c: d.byHour }, '#b794f6');
  }
}

function drawTrades(view, d) {
  const box = view.querySelector('#tradesBox');
  const cnt = view.querySelector('#trCount');
  if (!d.trades || !d.trades.length) {
    box.innerHTML = `<div class="empty"><p>${T('empty.trades')}</p></div>`;
    return;
  }
  cnt.textContent = T('p.recentn', { n: d.trades.length });
  box.innerHTML = `<div class="tbl-wrap"><table class="fin">
    <thead><tr><th class="l">${T('th.closed')}</th><th class="l">${T('th.symbol')}</th><th class="l">${T('th.side')}</th>
      <th>${T('th.volume')}</th><th>${T('th.open')}</th><th>${T('th.close')}</th><th>${T('th.dur')}</th>
      <th>${T('th.comm')}</th><th>${T('th.swap')}</th><th>${T('th.pnl')}</th></tr></thead>
    <tbody>${d.trades.map(x => `<tr>
      <td class="l mono" style="font-size:11px">${(x.c || '').replace('T', ' ').slice(0, 16)}</td>
      <td class="l">${esc(x.s) || '—'}</td>
      <td class="l"><span class="badge ${x.d === 'BUY' ? 'ok' : 'bad'}">${x.d || '—'}</span></td>
      <td class="num">${F.int(x.v) ?? '—'}</td>
      <td class="num">${F.num(x.op, 2) ?? '—'}</td>
      <td class="num">${F.num(x.cp, 2) ?? '—'}</td>
      <td class="num dim">${F.dur(x.m) ?? '—'}</td>
      <td class="num dim">${F.num(x.cm, 2) ?? '—'}</td>
      <td class="num dim">${F.num(x.sw, 2) ?? '—'}</td>
      <td class="num ${F.sign(x.p)}">${F.num(x.p, 2) ?? '—'}</td>
    </tr>`).join('')}</tbody></table></div>
    <div class="dim" style="font-size:11px;padding:10px 16px">
      ${T('p.volnote')}</div>`;
}


/* ============================================================
   Modalita' semplice: prima il racconto, poi i numeri.

   Non nasconde nulla di sostanziale — il grafico e i dati chiave
   restano. Cambia l'ordine e il linguaggio: chi non sa cos'e' un
   Profit Factor ha comunque diritto a sapere quanto rischia.
   ============================================================ */
function renderSimple(view, t, d, curve, id) {
  const w = Watch.has(id);
  const [sev, riskTxt] = riskLabel(t);
  const v = verdict(t);
  const blocks = summary(t);
  const warns = warnings(t);
  const tone = { p: 'ok', n: 'mute', w: 'warn', bad: 'bad', warn: 'warn', ok: 'ok', mute: 'mute' };

  view.innerHTML = `
  <div class="tr-hd simple">
    <div class="tr-id">
      <span class="t-av" style="width:46px;height:46px;font-size:17px;border-radius:12px">${F.initials(t.name)}</span>
      <div>
        <h1>${esc(t.name) || t.login}
          <button class="star ${w ? 'on' : ''}" id="starBtn">\u2605</button></h1>
        <div class="tr-sub">
          <span>${esc(t.strategy) || ''}</span>
          <span class="dim">${whatItDoes(t)}</span>
          <span class="sev ${sev}"><span class="sev-dot"></span>${T('scol.risk')}: ${riskTxt}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="verdict ${v.tone}">${v.t}</div>

  <div class="s-nums">
    <div class="s-num">
      <div class="k">${T('scol.earned')}</div>
      <div class="v ${F.sign(t.net)}">${F.big(t.net, 0) ?? '\u2014'}</div>
      <div class="x">1\u202f000\u202f\u20ac \u2192 ${t.net === null ? '\u2014'
        : F.int(Math.round(1000 * (1 + t.net / 100))) + '\u202f\u20ac'}${F.isBig(t.net) ? ' \u00b7 ' + F.pct(t.net, 0) : ''}</div>
    </div>
    <div class="s-num">
      <div class="k">${T('scol.lost')}</div>
      <div class="v neg">${F.pct(t.dd, 0) ?? '\u2014'}</div>
      <div class="x">1\u202f000\u202f\u20ac \u2192 ${t.dd === null ? '\u2014'
        : F.int(Math.round(1000 * (1 + t.dd / 100))) + '\u202f\u20ac'}</div>
    </div>
    <div class="s-num">
      <div class="k">${T('scol.years')}</div>
      <div class="v">${F.days(t.age) ?? '\u2014'}</div>
      <div class="x">${F.int(t.trades) ?? '\u2014'} ${T('kpi.trades')}</div>
    </div>
    <div class="s-num">
      <div class="k">${T('scol.trust')}</div>
      <div class="v">${F.num(t.conf, 0) ?? '\u2014'}<span style="font-size:14px;color:var(--muted)">/100</span></div>
      <div class="x">${t.conf >= 72 ? T('trust.high') : t.conf >= 52 ? T('trust.mid') : T('trust.low')}</div>
    </div>
  </div>

  <div class="sec">
    <div class="card"><div class="card-hd"><h3>${T('sec.summary')}</h3></div>
      <div class="card-bd">
        ${blocks.map(b => `<div class="story ${b.tone}">
          <h4>${b.h}</h4><p>${b.p}</p></div>`).join('')}
      </div></div>
  </div>

  ${warns.length ? `<div class="sec"><div class="card"><div class="card-bd">
    ${warns.map(x => `<div class="wline ${tone[x.tone] || 'mute'}">
      <span class="wi">${x.tone === 'ok' ? '\u2713' : x.tone === 'bad' ? '!' : x.tone === 'mute' ? 'i' : '\u26a0'}</span>
      <span>${x.p}</span></div>`).join('')}
  </div></div></div>` : ''}

  <div class="sec">
    <div class="card"><div class="card-hd"><h3>${T('tr.perf')}</h3></div>
      <div class="card-bd">
        <div class="chart-box" style="height:230px"><canvas id="perfChart"></canvas></div>
      </div></div>
  </div>

  <div class="sec">
    <a href="#/trader/${id}" class="chip" id="toPro">${T('simple.readmore')} \u2192</a>
  </div>`;

  document.getElementById('starBtn').onclick = e =>
    e.currentTarget.classList.toggle('on', Watch.toggle(id));

  /* Il passaggio ai numeri tecnici e' un click, non un vicolo cieco. */
  document.getElementById('toPro').onclick = e => {
    e.preventDefault();
    import('../i18n.js').then(m => { m.setMode('pro'); location.reload(); });
  };

  if (curve) {
    const c = new LineChart(view.querySelector('#perfChart'), { showArea: true });
    const base = 1 + (curve.v[0] || 0) / 100;
    c.setData([{ name: T('tr.strategyret'), color: '#4cc9f0', dates: curve.d,
      values: curve.v.map(x => ((1 + x / 100) / base - 1) * 100) }]);
  }
}

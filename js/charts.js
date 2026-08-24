/* ============================================================
   Grafici. Canvas per le serie lunghe, SVG per le miniature.
   Nessuna libreria esterna: il controllo del dettaglio conta piu'
   della comodita', e il pannello deve restare autonomo.
   ============================================================ */

const CSS = k => getComputedStyle(document.documentElement).getPropertyValue(k).trim();

function dpi(cv) {
  const r = window.devicePixelRatio || 1;
  const b = cv.getBoundingClientRect();
  cv.width = Math.round(b.width * r);
  cv.height = Math.round(b.height * r);
  const c = cv.getContext('2d');
  c.setTransform(r, 0, 0, r, 0, 0);
  return { c, w: b.width, h: b.height };
}

/* ---------- miniatura in SVG: sta dentro una cella di tabella ---------- */
export function sparkline(vals, w = 74, h = 22) {
  if (!vals || vals.length < 2) return '';
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const rng = hi - lo || 1;
  const pts = vals.map((v, i) =>
    `${(i / (vals.length - 1) * w).toFixed(1)},${(h - (v - lo) / rng * (h - 3) - 1.5).toFixed(1)}`);
  const up = vals[vals.length - 1] >= vals[0];
  const col = up ? CSS('--pos') : CSS('--neg');
  const id = 'sg' + Math.random().toString(36).slice(2, 8);
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${col}" stop-opacity=".28"/>
      <stop offset="1" stop-color="${col}" stop-opacity="0"/>
    </linearGradient></defs>
    <path d="M${pts.join('L')}L${w},${h}L0,${h}Z" fill="url(#${id})"/>
    <path d="M${pts.join('L')}" fill="none" stroke="${col}" stroke-width="1.3"
          stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`;
}

/* ---------- grafico di performance con crosshair ---------- */
export class LineChart {
  constructor(canvas, opts = {}) {
    this.cv = canvas;
    this.o = Object.assign({
      pad: { t: 14, r: 58, b: 22, l: 8 },
      showArea: true, animate: true, drawdown: false
    }, opts);
    this.series = [];
    this.hover = null;
    this._t = 0;
    this._bind();
    this._ro = new ResizeObserver(() => this.draw());
    this._ro.observe(canvas);
  }

  setData(series) {
    this.series = series;                    // [{name,color,dates,values}]
    this._t = this.o.animate ? 0 : 1;
    if (this.o.animate) this._animate(); else this.draw();
    return this;
  }

  _animate() {
    const t0 = performance.now(), dur = 620;
    const step = now => {
      const p = Math.min(1, (now - t0) / dur);
      this._t = 1 - Math.pow(1 - p, 3);       // uscita morbida
      this.draw();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  _bind() {
    const cv = this.cv;
    cv.addEventListener('mousemove', e => {
      const b = cv.getBoundingClientRect();
      this.hover = { x: e.clientX - b.left, y: e.clientY - b.top };
      this.draw();
    });
    cv.addEventListener('mouseleave', () => { this.hover = null; this.draw(); this._tip(null); });
  }

  _tip(html, x, y) {
    let el = this.cv.parentNode.querySelector('.chart-tip');
    if (!html) { if (el) el.style.opacity = 0; return; }
    if (!el) {
      el = document.createElement('div');
      el.className = 'chart-tip';
      this.cv.parentNode.appendChild(el);
    }
    el.innerHTML = html;
    el.style.opacity = 1;
    const w = el.offsetWidth, pw = this.cv.parentNode.offsetWidth;
    el.style.left = Math.max(4, Math.min(pw - w - 4, x - w / 2)) + 'px';
    el.style.top = Math.max(4, y - el.offsetHeight - 14) + 'px';
  }

  draw() {
    if (!this.series.length) return;
    const { c, w, h } = dpi(this.cv);
    const p = this.o.pad;
    const iw = w - p.l - p.r, ih = h - p.t - p.b;
    c.clearRect(0, 0, w, h);
    if (iw <= 0 || ih <= 0) return;

    const all = this.series.flatMap(s => s.values.filter(v => v !== null));
    if (!all.length) return;
    let lo = Math.min(...all), hi = Math.max(...all);
    if (hi === lo) { hi += 1; lo -= 1; }
    const padY = (hi - lo) * 0.08; lo -= padY; hi += padY;
    const n = Math.max(...this.series.map(s => s.values.length));

    const X = i => p.l + (n < 2 ? 0 : i / (n - 1) * iw);
    const Y = v => p.t + ih - (v - lo) / (hi - lo) * ih;

    /* griglia: leggera, non deve competere con i dati */
    c.strokeStyle = 'rgba(255,255,255,.045)';
    c.lineWidth = 1;
    c.font = '10px ' + CSS('--font');
    c.fillStyle = CSS('--faint');
    c.textAlign = 'left'; c.textBaseline = 'middle';
    const ticks = 5;
    for (let i = 0; i <= ticks; i++) {
      const v = lo + (hi - lo) * i / ticks, y = Math.round(Y(v)) + .5;
      c.beginPath(); c.moveTo(p.l, y); c.lineTo(p.l + iw, y); c.stroke();
      const lbl = Math.abs(v) >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(1);
      c.fillText(lbl + '%', p.l + iw + 8, y);
    }
    /* riga dello zero: separa il guadagno dalla perdita */
    if (lo < 0 && hi > 0) {
      const y = Math.round(Y(0)) + .5;
      c.strokeStyle = 'rgba(255,255,255,.16)';
      c.setLineDash([3, 3]);
      c.beginPath(); c.moveTo(p.l, y); c.lineTo(p.l + iw, y); c.stroke();
      c.setLineDash([]);
    }

    const cut = Math.max(2, Math.floor(n * this._t));

    for (const s of this.series) {
      const col = s.color || CSS('--accent');
      const vals = s.values;

      if (this.o.showArea && s.area !== false) {
        const g = c.createLinearGradient(0, p.t, 0, p.t + ih);
        g.addColorStop(0, hexA(col, .22));
        g.addColorStop(1, hexA(col, 0));
        c.beginPath();
        let started = false;
        for (let i = 0; i < cut && i < vals.length; i++) {
          if (vals[i] === null) continue;
          started ? c.lineTo(X(i), Y(vals[i])) : (c.moveTo(X(i), Y(vals[i])), started = true);
        }
        if (started) {
          c.lineTo(X(Math.min(cut, vals.length) - 1), p.t + ih);
          c.lineTo(X(0), p.t + ih);
          c.closePath(); c.fillStyle = g; c.fill();
        }
      }

      c.beginPath();
      let started = false;
      for (let i = 0; i < cut && i < vals.length; i++) {
        if (vals[i] === null) continue;
        started ? c.lineTo(X(i), Y(vals[i])) : (c.moveTo(X(i), Y(vals[i])), started = true);
      }
      c.strokeStyle = col;
      c.lineWidth = s.width || 1.6;
      c.lineJoin = 'round'; c.lineCap = 'round';
      c.stroke();
    }

    /* crosshair e tooltip */
    if (this.hover && this.hover.x >= p.l && this.hover.x <= p.l + iw && this._t >= 1) {
      const i = Math.round((this.hover.x - p.l) / iw * (n - 1));
      const s0 = this.series[0];
      if (i >= 0 && i < s0.values.length) {
        const x = X(i);
        c.strokeStyle = 'rgba(255,255,255,.20)';
        c.setLineDash([2, 3]);
        c.beginPath(); c.moveTo(x, p.t); c.lineTo(x, p.t + ih); c.stroke();
        c.setLineDash([]);
        let rows = '';
        for (const s of this.series) {
          const v = s.values[i];
          if (v === null || v === undefined) continue;
          c.beginPath();
          c.arc(x, Y(v), 3.2, 0, 7);
          c.fillStyle = s.color || CSS('--accent');
          c.fill();
          c.strokeStyle = CSS('--surface'); c.lineWidth = 1.6; c.stroke();
          rows += `<div class="ct-row"><i style="background:${s.color}"></i>
            <span>${s.name}</span><b>${v > 0 ? '+' : ''}${v.toFixed(2)}%</b></div>`;
        }
        this._tip(`<div class="ct-d">${s0.dates[i] || ''}</div>${rows}`, x, Y(s0.values[i] ?? 0));
      }
    }
  }
}

function hexA(hex, a) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(x => x + x).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/* ---------- dispersione rischio / rendimento ---------- */
export function scatter(canvas, points, opts = {}) {
  const { c, w, h } = dpi(canvas);
  const p = { t: 16, r: 16, b: 34, l: 52 };
  const iw = w - p.l - p.r, ih = h - p.t - p.b;
  c.clearRect(0, 0, w, h);
  if (!points.length || iw <= 0) return;

  const xs = points.map(d => d.x), ys = points.map(d => d.y);
  const x0 = 0, x1 = Math.max(...xs) * 1.06 || 1;
  const y0 = Math.min(0, Math.min(...ys)), y1 = Math.max(...ys) * 1.06 || 1;
  const X = v => p.l + (v - x0) / (x1 - x0) * iw;
  const Y = v => p.t + ih - (v - y0) / (y1 - y0) * ih;

  c.strokeStyle = 'rgba(255,255,255,.05)'; c.lineWidth = 1;
  c.font = '10px ' + CSS('--font'); c.fillStyle = CSS('--faint');
  c.textAlign = 'right'; c.textBaseline = 'middle';
  for (let i = 0; i <= 4; i++) {
    const v = y0 + (y1 - y0) * i / 4, y = Math.round(Y(v)) + .5;
    c.beginPath(); c.moveTo(p.l, y); c.lineTo(p.l + iw, y); c.stroke();
    c.fillText(v >= 1000 ? (v / 1000).toFixed(0) + 'k%' : v.toFixed(0) + '%', p.l - 8, y);
  }
  c.textAlign = 'center'; c.textBaseline = 'top';
  for (let i = 0; i <= 4; i++) {
    const v = x0 + (x1 - x0) * i / 4, x = Math.round(X(v)) + .5;
    c.beginPath(); c.moveTo(x, p.t); c.lineTo(x, p.t + ih);
    c.strokeStyle = 'rgba(255,255,255,.05)'; c.stroke();
    c.fillText(v.toFixed(0) + '%', x, p.t + ih + 7);
  }

  /* assi etichettati: senza, un grafico a dispersione non si legge */
  c.fillStyle = CSS('--muted'); c.font = '10.5px ' + CSS('--font');
  c.fillText(opts.xLabel || 'Max drawdown', p.l + iw / 2, p.t + ih + 20);
  c.save(); c.translate(11, p.t + ih / 2); c.rotate(-Math.PI / 2);
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(opts.yLabel || 'Net return', 0, 0); c.restore();

  const hit = [];
  for (const d of points) {
    const x = X(d.x), y = Y(d.y);
    const r = 3 + (d.size || 0) * 5;
    const col = d.color || CSS('--accent');
    c.beginPath(); c.arc(x, y, r, 0, 7);
    c.fillStyle = hexA(col, .55); c.fill();
    c.strokeStyle = col; c.lineWidth = 1; c.stroke();
    hit.push({ x, y, r: Math.max(r, 6), d });
  }
  canvas._hit = hit;
  return hit;
}

/* ---------- istogramma ---------- */
export function histogram(canvas, hist, color) {
  const { c, w, h } = dpi(canvas);
  c.clearRect(0, 0, w, h);
  if (!hist || !hist.c || !hist.c.length) return;
  const mx = Math.max(...hist.c) || 1;
  const bw = w / hist.c.length;
  const zero = hist.lo < 0 && hist.hi > 0
    ? (0 - hist.lo) / (hist.hi - hist.lo) * w : null;
  hist.c.forEach((n, i) => {
    const bh = n / mx * (h - 4);
    const x = i * bw;
    const neg = zero !== null && x + bw / 2 < zero;
    c.fillStyle = hexA(neg ? CSS('--neg') : (color || CSS('--pos')), .62);
    c.fillRect(x + .5, h - bh, Math.max(1, bw - 1), bh);
  });
  if (zero !== null) {
    c.strokeStyle = 'rgba(255,255,255,.22)';
    c.beginPath(); c.moveTo(zero, 0); c.lineTo(zero, h); c.stroke();
  }
}

/* ---------- colore della heatmap mensile ---------- */
export function heatColor(v) {
  if (v === null || v === undefined) return 'var(--surface-2)';
  const a = Math.min(1, Math.abs(v) / 25);
  return v >= 0
    ? `rgba(42,209,127,${(.12 + a * .68).toFixed(3)})`
    : `rgba(255,95,109,${(.12 + a * .68).toFixed(3)})`;
}

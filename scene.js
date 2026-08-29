/* Agent 0815 — Lebende Szenen: Kulisse + Ebenen (Wasser, Enten, Figuren, Wetter) + Regie-Cues */
const Scene0815 = (() => {
  const VB = { w: 400, h: 300 };
  // Anker pro Kulisse (Koordinaten im 400x300-Raster)
  const DEFS = {
    marktplatz: { img: 'scene_marktplatz', water: { cx: 205, cy: 222, rx: 70, ry: 10 }, bell: { x: 205, y: 113, h: 36 }, ducks: { y: 218, x0: 160, x1: 250, h: 34 }, floor: 292 },
    see: { img: 'scene_see', water: { cx: 200, cy: 200, rx: 200, ry: 60, flat: true }, ducks: { y: 205, x0: 120, x1: 300, h: 44 }, floor: 292 },
    baeckerei: { img: 'scene_baeckerei', floor: 292, counter: { x: 300, y: 205 } },
    schule: { img: 'scene_schule', floor: 292 },
    gartenhaus: { img: 'scene_gartenhaus', floor: 292, mappe: { x: 78, y: 140 } },
    werkstatt: { img: 'scene_werkstatt', floor: 292 },
    schlatter: { img: 'scene_schlatter', floor: 292 },
    schulflur: { img: 'scene_schulflur', floor: 292, door: { x: 200, y: 170 } },
    markt: { img: 'scene_markt', floor: 292, ducksWalk: true },
    markt_hinter: { img: 'scene_markt_hinter', floor: 292 },
    hinterhof: { img: 'scene_hinterhof', floor: 292 },
    kirchplatz: { img: 'scene_kirchplatz', floor: 292 },
    museum: { img: 'scene_museum', floor: 292 },
    anschlagbrett: { img: 'scene_anschlagbrett', floor: 292 },
    gemeinde: { img: 'scene_gemeinde', floor: 292 },
    altersheim: { img: 'scene_altersheim', floor: 292 },
    strasse: { img: 'scene_strasse', floor: 292 },
    karte: { img: 'karte', floor: 292 },
  };

  // ---------- kleine SVG-Fallbacks ----------
  const svgs = {
    silberglocke: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-11 12 Q-11 -10 0 -15 Q11 -10 11 12 Z" fill="#E6E9EE" stroke="#8C93A0" stroke-width="1.5"/><path d="M-6 -6 Q-2 -12 3 -10" stroke="#fff" stroke-width="2" fill="none" opacity=".9"/><rect x="-13" y="12" width="26" height="4" rx="2" fill="#B9BFC9" stroke="#8C93A0"/><circle cx="0" cy="18" r="3" fill="#8C93A0"/><circle cx="0" cy="-16" r="2.5" fill="#B9BFC9"/></g>`,
    sonnenbrille: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-16 -2 L16 -2" stroke="#F2B233" stroke-width="2"/><path d="M-15 -2 Q-13 8 -6 8 Q0 8 -1 -2 Z" fill="#2B2B2B" stroke="#F2B233" stroke-width="1.5"/><path d="M15 -2 Q13 8 6 8 Q0 8 1 -2 Z" fill="#2B2B2B" stroke="#F2B233" stroke-width="1.5"/></g>`,
    ente: (x, y, s = 1, flip = false) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><ellipse cx="0" cy="0" rx="14" ry="9" fill="#F7D046"/><circle cx="11" cy="-9" r="7" fill="#F7D046"/><path d="M16 -8 L25 -5 L16 -3 Z" fill="#F28C28"/><circle cx="13" cy="-11" r="1.6" fill="#222"/></g>`,
    taube: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="7" ry="4" fill="#B9BFC9"/><circle cx="6" cy="-3" r="3" fill="#B9BFC9"/><path d="M-2 -1 Q-6 -8 -12 -4" stroke="#8C93A0" stroke-width="2" fill="none"/></g>`,
  };

  function has(k) { return !!Art.IMG[k]; }
  function img(k, x, y, w, h, extra = '') { return `<image href="${Art.IMG[k]}" x="${x}" y="${y}" width="${w}" height="${h}" ${extra}/>`; }

  // ---------- Ebenen ----------
  function ducksLayer(d, water) {
    const w = d.h * (has('enten_schwimmen') ? (Art.RATIO.enten_schwimmen || 2.455) : 2.115);
    const cx = (d.x0 + d.x1) / 2;
    let body;
    if (has('enten_schwimmen')) body = img('enten_schwimmen', -w / 2, -d.h * 0.78, w, d.h);
    else if (has('enten')) body = `<g clip-path="url(#clip-water)">${img('enten', -w / 2, -d.h * 0.7, w, d.h)}</g>`;
    else body = svgs.ente(-22, -6, 0.9) + svgs.ente(4, -2, 0.85, true) + svgs.ente(24, -8, 0.8);
    // Kielwasser
    const wake = `<g class="wake" opacity=".55"><ellipse cx="0" cy="${d.h * 0.12}" rx="${w * 0.55}" ry="3" fill="none" stroke="#fff" stroke-width="1.5"/><ellipse cx="0" cy="${d.h * 0.18}" rx="${w * 0.7}" ry="4" fill="none" stroke="#fff" stroke-width="1" opacity=".6"/></g>`;
    const clip = water ? `<defs><clipPath id="clip-water"><rect x="-200" y="-200" width="400" height="${200 + d.h * 0.12}"/></clipPath></defs>` : '';
    return `<g transform="translate(${cx} ${d.y})"><g class="ducks-drift" style="--x0:${d.x0 - cx}px;--x1:${d.x1 - cx}px"><g class="ducks-bob">${clip}${wake}${body}</g></g></g>`;
  }
  function waterLayer(w) {
    if (!w) return '';
    if (w.flat) return `<g class="ripples">${[0, 1, 2].map(i => `<ellipse class="ripple r${i}" cx="${w.cx - 120 + i * 120}" cy="${w.cy + i * 15}" rx="30" ry="4" fill="none" stroke="#fff" stroke-width="1.2" opacity=".5"/>`).join('')}</g>`;
    return `<g class="ripples"><ellipse class="ripple r0" cx="${w.cx}" cy="${w.cy}" rx="${w.rx * 0.35}" ry="${w.ry * 0.35}" fill="none" stroke="#fff" stroke-width="1.2"/><ellipse class="ripple r1" cx="${w.cx}" cy="${w.cy}" rx="${w.rx * 0.35}" ry="${w.ry * 0.35}" fill="none" stroke="#fff" stroke-width="1.2"/><ellipse class="glint" cx="${w.cx - w.rx * 0.4}" cy="${w.cy - 2}" rx="9" ry="1.6" fill="#fff" opacity=".7"/></g>`;
  }
  function bellLayer(b, screws) {
    const s = has('ico_silberglocke') ? img('ico_silberglocke', b.x - b.h * 0.46, b.y - b.h / 2, b.h * 0.92, b.h) : svgs.silberglocke(b.x, b.y, b.h / 32);
    const glint = `<g transform="translate(${b.x - b.h * 0.25} ${b.y - b.h * 0.3})"><g class="glint-star"><path d="M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2 Z" fill="#fff"/></g></g>`;
    const sock = `<rect x="${b.x - 12}" y="${b.y + b.h / 2 - 2}" width="24" height="5" rx="1.5" fill="#9AA0A8" stroke="#6B7078"/>`;
    return `<g class="bell-group">${has('ico_silberglocke') ? '' : sock}<g class="bell">${s}</g>${glint}</g>`;
  }
  function actorLayer(a) {
    // Halbfigur (fig_*) in der Szene, Fusspunkt = y; Höhe h
    const k = a.who; if (!has(k)) return '';
    const h = a.h || 150, w = h * (Art.RATIO[k] || 100 / 234);
    return `<g class="actor-pos" transform="translate(${a.x} ${a.y})"><g class="actor ${a.enter ? 'enter-' + a.enter : ''} ${a.anim || ''}" data-actor="${k}" style="--i:${a.i || 0}">${img(k, -w / 2, -h, w, h)}</g></g>`;
  }
  function fxLayer(fx) {
    if (!fx) return '';
    if (fx === 'night') return `<rect width="400" height="300" fill="#0B1C3A" opacity=".55" class="fx-night"/><circle cx="330" cy="50" r="18" fill="#FFF6C9" opacity=".9"/><g class="stars">${Array.from({ length: 14 }, (_, i) => `<circle cx="${(i * 67) % 400}" cy="${(i * 31) % 90}" r="1.2" fill="#fff" class="star s${i % 3}"/>`).join('')}</g>`;
    if (fx === 'rain') return `<g class="rain">${Array.from({ length: 40 }, (_, i) => `<line x1="${(i * 37) % 400}" y1="${-20 - (i * 13) % 60}" x2="${(i * 37) % 400 - 4}" y2="${-4 - (i * 13) % 60}" stroke="#BFE3F5" stroke-width="1.5" style="--d:${(i % 7) * 0.15}s"/>`).join('')}</g><rect width="400" height="300" fill="#5E7A99" opacity=".18"/>`;
    if (fx === 'candle') return `<rect width="400" height="300" fill="#2A1A0A" opacity=".5"/><radialGradient id="cand" cx="30%" cy="55%" r="55%"><stop offset="0" stop-color="#FFD27A" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient><rect width="400" height="300" fill="url(#cand)" class="fx-candle"/>`;
    if (fx === 'dusk') return `<rect width="400" height="300" fill="#F7941D" opacity=".12"/><rect width="400" height="300" fill="#2A1A4A" opacity=".18"/>`;
    return '';
  }

  // ---------- Szene rendern ----------
  // opts: { bell, screws, ducks, actors:[{who,x,y,h,enter}], fx, extra, mark }
  function render(name, opts = {}) {
    const d = DEFS[name];
    if (!d || !has(d.img)) return Art.scenes[name] ? Art.scenes[name](opts) : `<svg viewBox="0 0 400 300" class="scene"><rect width="400" height="300" fill="#DDE7EE"/><text x="200" y="150" text-anchor="middle" font-size="16" fill="#667">${name}</text></svg>`;
    let L = img(d.img, 0, 0, 400, 300, 'preserveAspectRatio="xMidYMid slice"');
    L += waterLayer(d.water);
    if (opts.bell !== false && d.bell && opts.bell) L += bellLayer(d.bell, opts.screws);
    if (d.ducks && opts.ducks !== false && (name !== 'see' || opts.ducks)) L += ducksLayer(d.ducks, d.water);
    (opts.actors || []).forEach((a, i) => { L += actorLayer({ i, ...a }); });
    L += opts.extra || '';
    L += fxLayer(opts.fx);
    return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="scene live ${opts.fx ? 'fx-' + opts.fx : ''}" data-scene="${name}">${L}</svg>`;
  }
  function inner(svg) { return svg.replace(/^\s*<svg[^>]*>/, '').replace(/<\/svg>\s*$/, ''); }

  // ---------- Regie-Cues (laufen in einer gerenderten Szene) ----------
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  function el(svg, html) { const t = document.createElementNS('http://www.w3.org/2000/svg', 'g'); t.innerHTML = html; const n = t.firstElementChild; svg.appendChild(n); return n; }
  const cues = {
    // Brille fliegt in hohem Bogen von (from) nach (to); landing: 'splash' | 'klack' | 'plumps' | 'stick'
    async brille(svg, o, sfx) {
      const from = o.from || { x: 60, y: 250 }, to = o.to;
      const spr = o.sprite ? (Art.IMG['ico_' + o.sprite] ? `<image href="${Art.IMG['ico_' + o.sprite]}" x="-16" y="-8" width="32" height="16"/>` : o.fallback || '') : (Art.IMG.ico_sonnenbrille ? `<image href="${Art.IMG.ico_sonnenbrille}" x="-18" y="-8" width="36" height="16"/>` : svgs.sonnenbrille(0, 0, 1.2));
      const g = el(svg, `<g class="cue-brille"><g class="inner">${spr}</g></g>`);
      const steps = 22; const dur = o.dur || 900;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps; const x = from.x + (to.x - from.x) * t; const y = from.y + (to.y - from.y) * t - Math.sin(t * Math.PI) * (o.arc || 120);
        g.setAttribute('transform', `translate(${x} ${y}) rotate(${t * 540})`);
        await sleep(dur / steps);
      }
      if (o.landing === 'splash') {
        sfx && sfx('splash'); g.remove();
        const r = el(svg, `<g class="cue-splash">${[0, 1, 2].map(i => `<ellipse cx="${to.x}" cy="${to.y}" rx="6" ry="2" fill="none" stroke="#fff" stroke-width="2" class="splash-ring" style="--d:${i * 0.12}s"/>`).join('')}${[-14, -4, 8, 16].map((dx, i) => `<circle cx="${to.x + dx}" cy="${to.y - 4}" r="2.2" fill="#BFE3F5" class="drop" style="--d:${i * 0.05}s"/>`).join('')}</g>`);
        const ducks = svg.querySelector('.ducks-bob'); if (ducks) { ducks.classList.add('startled'); setTimeout(() => ducks.classList.remove('startled'), 1500); }
        if (o.quack && sfx) { setTimeout(() => sfx('quack3'), 250); }
        await sleep(1200); r.remove();
      } else {
        sfx && sfx(o.landing === 'klack' ? 'klack' : 'bonk');
        g.querySelector('.inner').classList.add('landed'); await sleep(900); if (!o.keep) g.remove();
      }
    },
    // Figur rutscht von der Seite herein
    async enter(svg, o, sfx) {
      const a = svg.querySelector(`.actor[data-actor="${o.who}"]`); if (!a) return;
      a.classList.add('enter-' + (o.from || 'left')); if (o.sfx && sfx) sfx(o.sfx); await sleep(700);
    },
    async shake(svg, o) { const a = svg.querySelector(o.sel || `.actor[data-actor="${o.who}"]`); if (!a) return; a.classList.add('shake'); await sleep(500); a.classList.remove('shake'); },
    // Glocke erscheint / verschwindet
    async bell(svg, o, sfx) { const b = svg.querySelector('.bell-group'); if (!b) return; b.classList.add(o.show ? 'bell-in' : 'bell-out'); if (sfx) sfx(o.show ? 'bell' : 'whoosh'); await sleep(900); },
    async pigeons(svg, o, sfx) {
      const g = el(svg, `<g class="cue-pigeons">${[0, 1, 2].map(i => `<g transform="translate(${(o.x || 300) + i * 14} ${(o.y || 60) + (i % 2) * 8})"><g class="pigeon" style="--d:${i * 0.1}s">${svgs.taube(0, 0, 1)}</g></g>`).join('')}</g>`);
      if (sfx) sfx('whoosh'); await sleep(1400); g.remove();
    },
    async hop(svg, o) { const d = svg.querySelector('.ducks-bob'); if (!d) return; d.classList.add('startled'); await sleep(900); d.classList.remove('startled'); },
    async pause(svg, o) { await sleep(o.ms || 600); },
  };
  async function cue(svg, c, sfx) { if (!svg || !c) return; const fn = cues[c.type]; if (fn) await fn(svg, c, sfx); }

  return { render, inner, cue, DEFS, svgs };
})();

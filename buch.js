/* Agent 0815 — Interaktives Hörbuch: Player und Rätsel (textfreie UI) */
(() => {
  const A = Audio0815, S = Speech0815;
  const $ = s => document.querySelector(s);
  const buhne = $('#buhne');
  const BUECHER = window.BUECHER = [BUCH_G01];
  const STORE = 'agent0815.buch.v1';
  const load = () => { try { return Object.assign({ done: [], cur: null, sound: true, musik: true }, JSON.parse(localStorage.getItem(STORE) || '{}')); } catch (e) { return { done: [], cur: null, sound: true, musik: true }; } };
  const state = load();
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} };

  // Bilder: echtes Bild unter img/buch/<id>.jpg, sonst Platzhalter aus den Spiel-Kulissen
  const PLATZHALTER = {
    g1_b01: 'scene_marktplatz', g1_b02: 'scene_marktplatz', g1_b03: 'scene_gartenhaus', g1_b04: 'scene_gartenhaus',
    g1_b05: 'scene_gartenhaus', g1_b06: 'scene_gartenhaus', g1_b07: 'scene_gartenhaus', g1_b08: 'scene_baeckerei',
    g1_b09: 'scene_baeckerei', g1_b10: 'scene_marktplatz', g1_b11: 'scene_baeckerei', g1_b12: 'scene_marktplatz',
    g1_b13: 'scene_marktplatz', g1_b14: 'scene_marktplatz', g1_b15: 'scene_marktplatz', g1_b16: 'scene_gartenhaus',
    g1_b17: 'scene_marktplatz', g1_r1_sockel: 'scene_marktplatz', g1_b18: 'scene_marktplatz', g1_b19: 'scene_marktplatz',
    g1_b20: 'scene_marktplatz', g1_b21: 'scene_marktplatz', g1_b22: 'scene_schlatter', g1_b23: 'scene_schlatter',
    g1_b24: 'scene_gartenhaus', g1_b25: 'scene_gartenhaus', g1_b26: 'scene_schulflur', g1_r4_tuer: 'scene_schulflur',
    g1_b27: 'scene_werkstatt', g1_b28: 'scene_werkstatt', g1_b29: 'scene_marktplatz', g1_r5_glocke: 'scene_marktplatz',
    g1_b30: 'scene_marktplatz', g1_b31: 'scene_marktplatz', g1_b32: 'scene_gartenhaus', g1_b33: 'scene_gartenhaus', g1_b34: 'scene_gartenhaus',
  };
  const ECHT = {}; // id -> true, wenn img/buch/<id>.jpg existiert
  function probeBilder(g) {
    g.szenen.forEach(s => {
      const id = s.img || (s.raetsel && s.raetsel.img); if (!id || ECHT[id] !== undefined) return;
      ECHT[id] = false;
      const im = new Image(); im.onload = () => { ECHT[id] = true; }; im.src = './buch_' + id + '.jpg';
    });
  }
  const bildSrc = id => ECHT[id] ? './buch_' + id + '.jpg' : './' + (PLATZHALTER[id] || 'scene_marktplatz') + '.jpg';

  // ---------- Sprech-Sequenz ----------
  let token = 0, pausiert = false, warten = null;
  const sleep = ms => new Promise(r => { warten = setTimeout(r, ms); });
  async function bisWeiter() { while (pausiert) await new Promise(r => setTimeout(r, 150)); }
  function sprecherZeig(who, an) {
    const el = $('.b-sprecher'); if (!el) return;
    if (an) { el.querySelector('.portrait').innerHTML = Art.avatar(who); el.classList.add('zeig'); }
    else el.classList.remove('zeig');
  }
  let letzterSatz = null;
  async function sag(l, t) {
    if (t !== token) return;
    letzterSatz = l;
    if (l.sfx && A.sfx[l.sfx]) A.sfx[l.sfx]();
    sprecherZeig(l.who, true);
    await S.speak(l.text, l.who);
    sprecherZeig(l.who, false);
  }

  // ---------- Grundgerüst ----------
  function rumpf(inner, opts = {}) {
    document.body.classList.remove('pausiert'); pausiert = false;
    buhne.innerHTML = `
      ${opts.fortschritt !== undefined ? `<div class="b-fortschritt"><i style="width:${opts.fortschritt}%"></i></div>` : ''}
      ${inner}
      <div class="b-top">
        <button class="b-btn" id="b-zurueck" aria-label="Zur Kapitelwahl">📖</button>
        <div class="b-fill"></div>
        <button class="b-btn ${state.musik ? '' : 'aus'}" id="b-musik" aria-label="Hintergrundmusik an oder aus" aria-pressed="${state.musik}">${state.musik ? '🎵' : '🔇'}</button>
        <button class="b-btn" id="b-nochmal" aria-label="Satz nochmal">🔊</button>
      </div>
      <div class="b-sprecher"><div class="portrait"></div><div class="welle"><i></i><i></i><i></i><i></i></div></div>
      <div class="b-pause"><span>▶</span></div>`;
    $('#b-zurueck').onclick = e => { e.stopPropagation(); token++; S.stop(); renderKapitel(); };
    $('#b-nochmal').onclick = e => { e.stopPropagation(); if (letzterSatz) { const t = token; S.stop(); setTimeout(() => { if (t === token) sag(letzterSatz, t); }, 80); } };
    const mb = $('#b-musik');
    if (mb) mb.onclick = e => {
      e.stopPropagation();
      state.musik = !state.musik; save();
      A.setMusic(state.musik);
      if (state.musik && G) A.music('case'); else A.stopMusic();
      mb.textContent = state.musik ? '🎵' : '🔇';
      mb.setAttribute('aria-pressed', state.musik);
      mb.classList.toggle('aus', !state.musik);
      A.sfx.tap();
    };
  }

  // ---------- Start ----------
  function renderStart() {
    token++;
    buhne.innerHTML = `
      <section class="b-schirm">
        <div class="logo-wrap"><h1 class="logo">AGENT<br><span>0815</span></h1></div>
        <div class="b-cover">${Art.avatar('nino')}</div>
        <button class="btn btn-xl" id="b-los"><span class="ico">▶</span></button>
      </section>`;
    $('#b-los').onclick = () => { try { A.ensure(); S.warmup(); A.setMusic(state.musik); } catch (e) {} A.sfx.klack(); renderKapitel(); };
  }

  // ---------- Kapitelwahl ----------
  function renderKapitel() {
    token++; S.stop(); if (!state.musik) A.stopMusic();
    const frei = state.done.length + 1;
    const karten = BUECHER.map((g, i) => {
      const zu = i + 1 > frei && !state.done.includes(g.id);
      const fertig = state.done.includes(g.id);
      const dran = !zu && !fertig;
      const cover = g.szenen.find(s => s.img);
      return `<button class="kap ${zu ? 'zu' : ''} ${fertig ? 'fertig' : ''} ${dran ? 'dran' : ''}" data-g="${i}" ${zu ? 'disabled' : ''}>
        <div class="kap-bild"><img src="${bildSrc(cover.img)}" alt=""></div>
        <div class="kap-nr">${g.id}</div>
      </button>`;
    }).join('');
    buhne.innerHTML = `<section class="b-schirm"><div class="kapitel">${karten}</div></section>`;
    buhne.querySelectorAll('.kap:not(.zu)').forEach(k => k.onclick = () => { A.sfx.pop(); startGeschichte(+k.dataset.g); });
    const dran = BUECHER.findIndex((g, i) => !state.done.includes(g.id) && i + 1 <= frei);
    if (dran >= 0) setTimeout(() => { if (buhne.querySelector('.kapitel')) S.speak(state.cur && state.cur.g === dran ? 'Tipp auf dein Buch. Wir hören dort weiter, wo du warst.' : 'Tipp auf das Buch mit der Nummer ' + BUECHER[dran].id + '. Dann geht die Geschichte los.', 'erz'); }, 400);
  }

  // ---------- Geschichte ----------
  let G = null, gi = 0, si = 0;
  function startGeschichte(idx) {
    G = BUECHER[idx]; gi = idx;
    probeBilder(G);
    si = (state.cur && state.cur.g === idx && !state.done.includes(G.id)) ? Math.min(state.cur.i, G.szenen.length - 1) : 0;
    if (state.musik) A.music('case'); else A.stopMusic();
    szene();
  }
  function weiter() { si++; szene(); }
  function szene() {
    token++; S.stop(); clearTimeout(warten);
    if (si >= G.szenen.length) { fertig(); return; }
    state.cur = { g: gi, i: si }; save();
    const s = G.szenen[si];
    if (s.raetsel) { raetsel(s.raetsel); return; }
    const t = token;
    const kb = s.kb === 'zoom' ? 'kb-z' : s.kb === 'links' ? 'kb-l' : 'kb-r';
    rumpf(`<div class="bild bild-wechsel ${kb} ${s.fx ? 'fx-' + s.fx : ''}"><div class="bild-fond"><img src="${bildSrc(s.img)}" alt=""></div><div class="bild-kern"><img src="${bildSrc(s.img)}" alt=""></div></div>
      <div class="b-unten">
        <button class="b-btn b-pfeil" id="b-vor" aria-label="Ein Bild zurück">◀</button>
        <button class="b-btn b-pfeil" id="b-nach" aria-label="Ein Bild weiter">▶</button>
      </div>`, { fortschritt: Math.round(si / G.szenen.length * 100) });
    $('#b-vor').onclick = e => { e.stopPropagation(); if (si > 0) { A.sfx.tap(); si--; szene(); } };
    $('#b-nach').onclick = e => { e.stopPropagation(); A.sfx.tap(); weiter(); };
    // Tippen auf das Bild: Pause / Weiterhören
    buhne.querySelector('.bild').onclick = () => {
      pausiert = !pausiert;
      document.body.classList.toggle('pausiert', pausiert);
      if (pausiert) S.stop(); else { const l = letzterSatz; if (l) { const tt = token; setTimeout(() => { if (tt === token) sag(l, tt); }, 80); } }
    };
    (async () => {
      for (const l of s.lines) {
        await bisWeiter(); if (t !== token) return;
        await sag(l, t); if (t !== token) return;
        await sleep(350);
      }
      await bisWeiter(); if (t !== token) return;
      await sleep(650); if (t !== token) return;
      weiter();
    })();
  }
  function fertig() {
    if (!state.done.includes(G.id)) state.done.push(G.id);
    state.cur = null; save();
    A.sfx.fanfare();
    rumpf(`<section class="b-schirm"><div class="b-cover">${Art.avatar('nino')}</div>
      <div class="confetti">${Array.from({ length: 26 }, (_, i) => `<i style="left:${(i * 37) % 100}%;background:${['#F7941D', '#4FC3E8', '#6DA544', '#F25C7A', '#F7D046'][i % 5]};animation-delay:${(i % 9) * 0.3}s"></i>`).join('')}</div></section>`);
    S.speak('Geschichte fertig. Gut zugehört, Agent. Und gut kombiniert.', 'erz');
    setTimeout(() => renderKapitel(), 5200);
  }

  // ---------- Rätsel (immer lösbar: gestufte Hilfe, nie überspringen nötig) ----------
  let hilfeTimer = [];
  function hilfeStart(r, flaeche, extra) {
    hilfeStop();
    const t = token;
    const stufe = n => async () => {
      if (t !== token) return;
      if (n >= 2) flaeche.classList.add('hilfe2');
      if (n >= 3) flaeche.classList.add('hilfe3');
      const h = r.hilfe[Math.min(n - 1, r.hilfe.length - 1)];
      if (h) await sag(h, t);
      if (extra) extra(n);
    };
    hilfeTimer.push(setTimeout(stufe(1), 9000));
    hilfeTimer.push(setTimeout(stufe(2), 19000));
    hilfeTimer.push(setTimeout(stufe(3), 31000));
    let n = 4;
    hilfeTimer.push(setInterval(() => { stufe(Math.min(n++, 3))(); }, 15000));
  }
  function hilfeStop() { hilfeTimer.forEach(clearTimeout); hilfeTimer.forEach(clearInterval); hilfeTimer = []; }

  async function danachWeiter(r, t) {
    hilfeStop();
    A.sfx.correct();
    for (const l of (r.danach || [])) { if (t !== token) return; await sag(l, t); await sleep(300); }
    if (t !== token) return;
    await sleep(500);
    weiter();
  }

  function raetsel(r) {
    const t = token;
    const arten = { find: rFind, wahl: rWahl, klopfen: rKlopf, schrauben: rSchraub };
    (arten[r.art] || rFind)(r, t);
  }

  // Bild mit tippbaren Zielen (Zwinkerlupe, Schrauben, Klopfen teilen sich das Gerüst)
  function zielFlaeche(r, ziele, opts = {}) {
    rumpf(`<div class="bild"><div class="bild-fond"><img src="${bildSrc(r.img)}" alt=""></div><div class="bild-kern raetsel-flaeche"><img src="${bildSrc(r.img)}" alt="">
        <svg class="raetsel-svg" viewBox="0 0 400 300">
          ${ziele.map((z, i) => `<g class="ziel" data-i="${i}" style="cursor:pointer">
            <circle cx="${z.x}" cy="${z.y}" r="${Math.max(z.r || 30, 30)}" fill="#fff" opacity=".001"/>
            <circle class="ziel-ring ${opts.ringOffenAb === 0 ? 'offen' : ''}" cx="${z.x}" cy="${z.y}" r="${(z.r || 30) - 4}"/>
          </g>`).join('')}
          <g class="marken"></g>
        </svg>
      </div></div>
      ${r.werkzeug ? `<div class="raetsel-frage"><button class="b-btn" id="b-frage" aria-label="Aufgabe nochmal">${Art.hasImg('ico_' + r.werkzeug) ? `<img src="${Art.IMG['ico_' + r.werkzeug]}" style="width:38px;height:38px;object-fit:contain">` : '🔍'}</button></div>` : ''}`);
    const fb = $('#b-frage'); if (fb) fb.onclick = e => { e.stopPropagation(); sag(r.intro, token); };
    return buhne.querySelector('.raetsel-flaeche');
  }
  const stern = (x, y) => `<g class="ziel-stern" transform="translate(${x} ${y})"><circle r="16" fill="#6DA544"/><path d="M0 -8 L2.4 -2.4 L8.4 -2.4 L3.6 1.6 L5.6 7.6 L0 4 L-5.6 7.6 L-3.6 1.6 L-8.4 -2.4 L-2.4 -2.4 Z" fill="#fff"/></g>`;

  function rFind(r, t) {
    const fl = zielFlaeche(r, r.ziele);
    const offen = new Set(r.ziele.map((_, i) => i));
    fl.querySelectorAll('.ziel .ziel-ring').forEach(el => el.classList.add('offen'));
    fl.querySelectorAll('.ziel').forEach(g => g.addEventListener('click', async e => {
      e.stopPropagation(); const i = +g.dataset.i;
      if (!offen.has(i)) return;
      offen.delete(i);
      A.sfx.found();
      const z = r.ziele[i];
      fl.querySelector('.marken').insertAdjacentHTML('beforeend', stern(z.x, z.y - (z.r || 30)));
      g.querySelector('.ziel-ring').style.opacity = 0; g.querySelector('.ziel-ring').classList.remove('offen');
      hilfeStop();
      if (z.say) await sag(z.say, t);
      if (t !== token) return;
      if (offen.size === 0) danachWeiter(r, t);
      else hilfeStart(r, fl);
    }));
    // Daneben getippt: kein Strafton, kurzer Tipp-Klang
    fl.addEventListener('click', () => { A.sfx.tap(); });
    (async () => { await sag(r.intro, t); if (t === token) hilfeStart(r, fl); })();
  }

  function rSchraub(r, t) {
    const n = (r.punkte && r.punkte.length) || r.anzahl || 6;
    // Punkte am Bild ausgerichtet (r.punkte), sonst gleichmässig auf einer Ellipse
    const c = r.kreis || { x: 200, y: 175, rx: 78, ry: 34 };
    const ziele = r.punkte ? r.punkte.map(p => ({ x: p[0], y: p[1], r: p[2] || 24 }))
      : Array.from({ length: n }, (_, i) => { const a = (i * (360 / n) - 90) * Math.PI / 180; return { x: Math.round(c.x + c.rx * Math.cos(a)), y: Math.round(c.y + c.ry * Math.sin(a)), r: 24 }; });
    const fl = zielFlaeche(r, ziele);
    fl.querySelectorAll('.ziel .ziel-ring').forEach(el => el.classList.add('offen'));
    // Schrauben sichtbar machen
    fl.querySelectorAll('.ziel').forEach(g => {
      const i = +g.dataset.i; const z = ziele[i];
      // Positionierung aussen, Drehung innen: CSS-Transform darf die SVG-Position nicht überschreiben
      g.insertAdjacentHTML('beforeend', `<g transform="translate(${z.x} ${z.y})"><g class="schraube"><circle r="9" fill="#B9BFC9" stroke="#6B7078" stroke-width="1.5"/><path d="M-5 0 H5 M0 -5 V5" stroke="#4a4a4a" stroke-width="1.8"/></g></g>`);
    });
    const offen = new Set(ziele.map((_, i) => i));
    fl.querySelectorAll('.ziel').forEach(g => g.addEventListener('click', e => {
      e.stopPropagation(); const i = +g.dataset.i;
      if (!offen.has(i)) return;
      offen.delete(i);
      A.sfx[r.sfx || 'screw']();
      g.querySelector('.ziel-ring').style.opacity = 0;
      const sch = g.querySelector('.schraube'); if (sch) sch.classList.add('fest');
      hilfeStop();
      if (offen.size === 0) danachWeiter(r, t); else hilfeStart(r, fl);
    }));
    (async () => { await sag(r.intro, t); if (t === token) hilfeStart(r, fl); })();
  }

  function rKlopf(r, t) {
    const ziel = [{ x: r.tuer ? r.tuer.x : 200, y: r.tuer ? r.tuer.y : 165, r: r.tuer ? r.tuer.r : 70 }];
    const fl = zielFlaeche(r, ziel);
    let k = 0; const n = r.anzahl || 3; let dran = true;
    const g = fl.querySelector('.ziel');
    g.addEventListener('click', async e => {
      e.stopPropagation(); if (!dran || k >= n) return;
      dran = false;
      A.sfx.knock1 ? A.sfx.knock1() : A.sfx.knock();
      hilfeStop();
      const z = (r.zaehlen || [])[k]; k++;
      if (z) await sag(z, t);
      if (t !== token) return;
      if (k >= n) { await sleep(300); if (t === token) weiter(); }
      else { dran = true; hilfeStart(r, fl); }
    });
    (async () => { await sag(r.intro, t); if (t === token) { fl.classList.add('hilfe2'); g.querySelector('.ziel-ring').classList.add('offen'); hilfeStart(r, fl); } })();
  }

  function rWahl(r, t) {
    const karten = r.optionen.map((o, i) => {
      const iq = n => Art.IMG[n] || ('./' + n + '.png');
      const inner = o.who
        ? `<div class="card-av">${Art.avatar(o.who)}</div>${o.img ? `<img class="card-item" src="${iq(o.img)}" style="object-fit:contain;background:var(--blue-pale);border-radius:50%;padding:6px" onerror="this.remove()">` : ''}`
        : (o.img ? `<img class="card-icon" src="${iq(o.img)}" style="object-fit:contain" onerror="this.remove()">` : `<svg viewBox="-40 -40 80 80" class="card-icon">${o.svg || ''}</svg>`);
      return `<button class="card" data-i="${i}">${inner}</button>`;
    }).join('');
    const hinter = bildSrc(r.img || (G.szenen[si - 1] && G.szenen[si - 1].img) || 'g1_b01');
    rumpf(`<div class="bild"><div class="bild-fond"><img src="${hinter}" alt="" style="filter:blur(10px) brightness(.6)"></div></div>
      <div class="b-karten">${karten}</div>
      <div class="raetsel-frage"><button class="b-btn" id="b-frage" aria-label="Frage nochmal">❓</button></div>`);
    $('#b-frage').onclick = e => { e.stopPropagation(); sag(r.intro, token); };
    let locked = false;
    const fl = buhne.querySelector('.b-karten');
    buhne.querySelectorAll('.card').forEach(c => c.addEventListener('click', async e => {
      e.stopPropagation(); if (locked) return;
      const o = r.optionen[+c.dataset.i];
      hilfeStop();
      if (o.richtig) {
        locked = true;
        c.classList.add('right');
        buhne.querySelectorAll('.card').forEach(x => { if (x !== c) x.classList.add('dim'); });
        A.sfx.correct();
        if (o.say) { await sag(o.say, t); if (t !== token) return; }
        danachWeiter(r, t);
      } else {
        A.sfx.wrong(); c.classList.add('shake'); setTimeout(() => c.classList.remove('shake'), 500);
        c.classList.add('dim'); setTimeout(() => c.classList.remove('dim'), 2500);
        if (o.falsch) await sag(o.falsch, t);
        if (t === token) hilfeStart(r, fl, n => { if (n >= 2) { const rIdx = r.optionen.findIndex(x => x.richtig); const rc = buhne.querySelector(`.card[data-i="${rIdx}"]`); rc && rc.classList.add('on'); } });
      }
    }));
    (async () => { await sag(r.intro, t); if (t === token) hilfeStart(r, fl, n => { if (n >= 3) { const rIdx = r.optionen.findIndex(x => x.richtig); const rc = buhne.querySelector(`.card[data-i="${rIdx}"]`); rc && rc.classList.add('on'); } }); })();
  }

  // ---------- Start ----------
  window.__buch = () => ({ g: gi, s: si, kap: !!buhne.querySelector('.kapitel'), start: !!$('#b-los') });
  window.__buchJump = i => { si = i; szene(); };
  window.addEventListener('error', e => console.error('Agent0815 Buch', e.message));
  Art.probeImages && Art.probeImages();
  renderStart();
})();

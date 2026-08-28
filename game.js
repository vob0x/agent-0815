/* Agent 0815 — Spiel-Engine */
(() => {
  const $ = s => document.querySelector(s);
  const stage = $('#stage');
  const A = Audio0815, S = Speech0815;
  const STORE = 'agent0815.v1';
  let state = load();
  let idleTimer = null, deferredInstall = null;
  let cur = { caseId: null, step: 0 };

  function load() { try { return Object.assign({ done: [], unlocked: 1, sound: true }, JSON.parse(localStorage.getItem(STORE) || '{}')); } catch (e) { return { done: [], unlocked: 1, sound: true }; } }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} }

  const inner = svg => svg.replace(/^\s*<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  // ---------- Sprechen (mit Musik-Ducking) ----------
  async function say(text, who = 'erz') { A.duck(true); document.body.classList.add('speaking'); document.body.dataset.who = who; try { await S.speak(text, who); } finally { document.body.classList.remove('speaking'); A.duck(false); } }
  function sfx(name) { if (name && A.sfx[name]) A.sfx[name](); }

  // ---------- Idle-Hilfe ----------
  function idle(fn, ms = 14000) { clearIdle(); idleTimer = setTimeout(fn, ms); }
  function clearIdle() { if (idleTimer) clearTimeout(idleTimer); idleTimer = null; }

  // ---------- Top-Bar ----------
  function topbar({ title = '', back = null, icon = '' } = {}) {
    $('#tb-title').innerHTML = (icon ? `<span class="tb-ico">${icon}</span>` : '') + `<span class="lbl">${esc(title)}</span>`;
    const b = $('#tb-back'); b.style.visibility = back ? 'visible' : 'hidden'; b.onclick = back;
    $('#tb-sound').textContent = state.sound ? '🔊' : '🔇';
  }
  $('#tb-sound').onclick = () => { state.sound = !state.sound; applySound(); save(); $('#tb-sound').textContent = state.sound ? '🔊' : '🔇'; sfx('tap'); };
  const CASE_ICONS = () => [Art.icon('glocke', Art.obj.gloeckchen(0, 0, 1.1), 'tb-svg'), Art.icon('gipfeli', Art.obj.gipfeli(0, 0, 1.2), 'tb-svg'), Art.hasImg('enten') ? `<img class="tb-svg icon-img" src="${Art.IMG.enten}" alt="">` : `<svg viewBox="-40 -40 80 80" class="tb-svg">${Art.obj.ente(0, 0, 1)}</svg>`, Art.icon('velo_a', Art.obj.velo(0, 4, 0.6), 'tb-svg'), Art.icon('zahnrad', Art.obj.zahnrad(0, 0, 0.9), 'tb-svg')];
  function applyText() { document.body.classList.toggle('show-text', !!state.showText); }
  $('#tb-parent').onclick = () => parentGate();
  function applySound() { A.setMusic(state.sound && state.music !== false); A.setSfx(state.sound && state.sfx !== false); S.setEnabled(state.sound && state.voice !== false); }

  // ---------- Start ----------
  function renderStart() {
    clearIdle(); S.stop(); A.stopMusic();
    topbar({ title: '' });
    stage.innerHTML = `
      <section class="screen start">
        <div class="logo-wrap">
          <div class="logo-badge">SGD</div>
          <h1 class="logo">AGENT<br><span>0815</span></h1>
          <p class="tagline">Die Fälle von Bärlingen</p>
        </div>
        <div class="hero">${Art.avatar('nino')}</div>
        <button class="btn btn-primary btn-xl" id="btn-play"><span class="ico">▶</span><span class="lbl">SPIELEN</span></button>
        <p class="hint-small">Für Kinder ab dem Kindergarten. Alles wird vorgelesen.</p>
      </section>`;
    const hero = stage.querySelector('.hero .brille');
    setInterval(() => { if (hero && hero.isConnected) { hero.classList.remove('rutscht'); void hero.getBBox(); hero.classList.add('rutscht'); } }, 5000);
    $('#btn-play').onclick = async () => {
      try { A.ensure(); S.warmup(); applySound(); sfx('klack'); } catch (e) { console.warn('Audio-Start', e); }
      renderMap(true);
    };
    window.addEventListener('error', e => console.error('Agent0815', e.message));
  }

  // ---------- Karte ----------
  function progressMap() { return CASES.map((c, i) => state.done.includes(i) ? 'done' : i < state.unlocked ? 'open' : 'locked'); }
  async function renderMap(greet = false) {
    clearIdle(); S.stop();
    topbar({ title: 'Bärlingen', back: null });
    A.music('map');
    const prog = progressMap();
    const allDone = state.done.length >= CASES.length;
    stage.innerHTML = `
      <section class="screen map">
        <div class="map-wrap">${Art.karte(prog)}</div>
        <div class="map-foot">
          <div class="portrait small">${Art.avatar('nino')}</div>
          <div class="bubble"><p id="map-text">${allDone ? 'Alle Fälle erledigt. Du bist ein echter Agent!' : 'Tipp auf einen Fall. Wir beginnen beim Brunnen.'}</p><div class="wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><button class="btn-replay" id="map-replay" aria-label="Nochmal anhören">🔊</button></div>
          <div class="stars">${CASES.map((c, i) => `<span class="star ${state.done.includes(i) ? 'on' : ''}">★</span>`).join('')}</div>
        </div>
      </section>`;
    stage.querySelectorAll('.spot').forEach(el => {
      const id = +el.dataset.case;
      el.addEventListener('click', () => {
        if (prog[id] === 'locked') { sfx('wrong'); say('Dieser Fall ist noch zu. Löse zuerst den Fall davor.', 'leyla'); el.classList.add('shake'); setTimeout(() => el.classList.remove('shake'), 500); return; }
        sfx('pop'); startCase(id);
      });
    });
    const mapText = allDone ? 'Alle fünf Fälle erledigt. Agent 0815 gratuliert. Du kannst jeden Fall nochmal spielen.' : prog.indexOf('open') === 0 ? 'Willkommen in Bärlingen. Ich bin Nino, Agent 0815. Tipp auf den Brunnen. Da beginnt der erste Fall.' : `Tipp auf die Zahl ${prog.indexOf('open') + 1}. Da wartet der nächste Fall.`;
    $('#map-replay').onclick = () => { sfx('tap'); say(mapText, 'nino'); };
    if (greet) {
      const next = prog.indexOf('open');
      await say(allDone ? 'Alle fünf Fälle erledigt. Agent 0815 gratuliert. Du kannst jeden Fall nochmal spielen.' : next === 0 ? 'Willkommen in Bärlingen. Ich bin Nino, Agent 0815. Tipp auf den Brunnen. Da beginnt der erste Fall.' : `Tipp auf die Zahl ${next + 1}. Da wartet der nächste Fall.`, 'nino');
    }
    idle(() => { const next = prog.indexOf('open'); if (next >= 0) { say('Tipp auf den orangen Kreis.', 'leyla'); const el = stage.querySelector(`.spot[data-case="${next}"]`); el && el.classList.add('pulse'); } });
  }

  // ---------- Fall-Ablauf ----------
  function startCase(id) {
    cur = { caseId: id, step: 0, sceneName: CASES[id].scene, sceneOpts: {} };
    A.music('case');
    renderStep();
  }
  function next() { cur.step++; renderStep(); }
  function renderStep() {
    clearIdle(); S.stop();
    const c = CASES[cur.caseId];
    const step = c.steps[cur.step];
    if (!step) { renderMap(); return; }
    topbar({ title: `Fall ${c.id + 1}: ${c.title}`, icon: `${CASE_ICONS()[c.id]}<b>${c.id + 1}</b>`, back: () => { S.stop(); renderMap(); } });
    const r = renderers[step.type];
    r ? r(step, c) : next();
  }

  // Anker für Sprites auf den Bild-Kulissen (Koordinaten im 400x300-Raster) — nach Sichtung der Bilder justieren
  const ANCHORS = {
    marktplatz: { bell: { x: 203, y: 108, h: 34 }, ducks: { x: 205, y: 222, h: 44 } },
    see: { ducks: { x: 250, y: 232, h: 80 } },
  };
  function sceneHTML(name, opts) {
    opts = opts || {};
    if (Art.hasImg('scene_' + name)) {
      const a = ANCHORS[name] || {};
      let over = '';
      if (opts.gloeckchen && a.bell) over += Art.sprite('glocke', a.bell.x, a.bell.y, a.bell.h, Art.obj.gloeckchen(a.bell.x, a.bell.y, 1));
      if (a.ducks && ((name === 'marktplatz' && opts.enten !== false) || (name === 'see' && opts.enten))) over += `<g class="enten">${Art.sprite('enten', a.ducks.x, a.ducks.y, a.ducks.h)}</g>`;
      over += opts.extra || '';
      return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="scene"><image href="${Art.IMG['scene_' + name]}" width="400" height="300" preserveAspectRatio="xMidYMid slice"/>${over}</svg>`;
    }
    return Art.scenes[name] ? Art.scenes[name](opts) : '';
  }

  function bubble(who, text, extraClass = '') {
    return `<div class="bubble-row ${extraClass}">
      <div class="portrait ${who}">${Art.avatar(who)}</div>
      <div class="bubble"><div class="name">${Art.NAMES[who] || ''}</div><p>${esc(text)}</p><div class="wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><button class="btn-replay" aria-label="Nochmal anhören">🔊</button></div>
    </div>`;
  }
  function wireReplay(who, text) { stage.querySelectorAll('.btn-replay').forEach(b => b.onclick = () => { sfx('tap'); say(text, who); }); }
  function nextButton(label = 'Weiter') {
    return `<div class="actions"><button class="btn btn-primary btn-lg" id="btn-next"><span class="lbl">${label}</span><span class="ico">▶</span></button></div>`;
  }
  function wireNext(fn) { const b = $('#btn-next'); if (b) b.onclick = () => { sfx('tap'); (fn || next)(); }; }
  function progressDots(found, total) { return `<div class="dots" aria-label="${found} von ${total}">${Array.from({ length: total }, (_, i) => `<span class="dot ${i < found ? 'on' : ''}">★</span>`).join('')}</div>`; }
  function svgPoint(svg, ev) { const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse()); }

  function seqStatus(ico, text, round) {
    const st = $('#seq-status'); if (!st) return;
    st.querySelector('.seq-ico').textContent = ico; st.querySelector('.seq-ico').className = 'seq-ico ' + (ico === '👆' ? 'hand' : '');
    st.querySelectorAll('.seq-dots b').forEach((d, i) => d.className = i < round ? 'on' : '');
    $('#seq-text').textContent = text;
  }

  const renderers = {
    // ---- Dialog ----
    async dialog(step) {
      if (step.scene) { cur.sceneName = step.scene.name; cur.sceneOpts = step.scene.opts || {}; }
      stage.innerHTML = `<section class="screen case">
        <div class="scene-wrap">${sceneHTML(cur.sceneName, cur.sceneOpts)}</div>
        ${bubble(step.who, step.text)}
        ${nextButton()}
      </section>`;
      wireReplay(step.who, step.text); wireNext();
      if (step.anim === 'brille') {
        const b = stage.querySelector('.portrait .brille'); if (b) b.classList.add('rutscht');
        const im = stage.querySelector('.portrait .avatar-img');
        if (im && Art.hasImg('nino_brille') && step.who === 'nino') { const orig = im.src; setTimeout(() => { im.src = Art.IMG.nino_brille; sfx('bonk'); }, 900); setTimeout(() => { im.src = orig; }, 2600); }
      }
      sfx(step.sfx);
      await say(step.text, step.who);
      const b = $('#btn-next'); if (b) b.classList.add('bounce');
      idle(() => { say('Tipp auf Weiter.', 'leyla'); }, 20000);
    },

    // ---- Spuren finden ----
    async find(step) {
      const scene = sceneHTML(step.scene, step.sceneOpts);
      const hs = step.hotspots.map(h => h.svg || '').join('');
      const base = inner(scene).replace(/<\/svg>\s*$/, '') + hs;
      let found = 0; const foundSet = new Set();
      stage.innerHTML = `<section class="screen case">
        <div class="scene-wrap find">
          <svg viewBox="0 0 400 300" class="scene interactive" id="find-svg">
            <g id="base">${base}</g>
            <g id="marks"></g>
            ${step.lupe ? `<defs><clipPath id="lupe-clip"><circle id="lupe-c" r="48" cx="-100" cy="-100"/></clipPath></defs>
              <g id="lupe" style="display:none"><g clip-path="url(#lupe-clip)"><g id="lupe-zoom">${base}</g></g><circle id="lupe-ring" r="48" fill="none" stroke="#F2B233" stroke-width="5"/><circle id="lupe-glare" r="48" fill="none" stroke="#fff" stroke-width="2" opacity=".5"/><path id="lupe-crack" d="M-20 -30 L-5 -5 L-12 10" stroke="#fff" stroke-width="1.5" fill="none" opacity=".6"/></g>` : ''}
          </svg>
          ${progressDots(0, step.hotspots.length)}
        </div>
        ${bubble(step.intro.who, step.intro.text, 'compact')}
        <div class="actions"><button class="btn btn-primary btn-lg" id="btn-next" style="display:none"><span class="lbl">Weiter</span><span class="ico">▶</span></button></div>
      </section>`;
      wireReplay(step.intro.who, step.intro.text);
      const svg = $('#find-svg');
      const lupe = $('#lupe');
      const moveLupe = ev => {
        if (!lupe) return; const p = svgPoint(svg, ev);
        lupe.style.display = ''; lupe.setAttribute('transform', `translate(${p.x} ${p.y})`);
        $('#lupe-c').setAttribute('cx', 0); $('#lupe-c').setAttribute('cy', 0);
        $('#lupe-zoom').setAttribute('transform', `scale(2.2) translate(${-p.x} ${-p.y})`);
      };
      let downPt = null;
      svg.addEventListener('pointerdown', ev => { downPt = { x: ev.clientX, y: ev.clientY }; moveLupe(ev); svg.setPointerCapture(ev.pointerId); });
      svg.addEventListener('pointermove', ev => { if (downPt || ev.pointerType === 'mouse') moveLupe(ev); });
      svg.addEventListener('pointerleave', () => { if (lupe && !downPt) lupe.style.display = 'none'; });
      svg.addEventListener('pointerup', async ev => {
        if (!downPt) return; const moved = Math.hypot(ev.clientX - downPt.x, ev.clientY - downPt.y); downPt = null;
        if (lupe) setTimeout(() => { lupe.style.display = 'none'; }, 250);
        if (moved > 25) return;
        const p = svgPoint(svg, ev);
        const hit = step.hotspots.find((h, i) => !foundSet.has(i) && Math.hypot(h.x - p.x, h.y - p.y) <= h.r + 12);
        clearIdle();
        if (!hit) { sfx('tap'); idleHint(); return; }
        const i = step.hotspots.indexOf(hit); foundSet.add(i); found++;
        $('#marks').insertAdjacentHTML('beforeend', `<g class="mark"><circle cx="${hit.x}" cy="${hit.y}" r="${hit.r + 6}" fill="none" stroke="#6DA544" stroke-width="4"/>${Art.obj.stern(hit.x + hit.r, hit.y - hit.r, 0.9)}</g>`);
        stage.querySelector('.dots').outerHTML = progressDots(found, step.hotspots.length);
        sfx('found');
        await say(hit.say, 'nino');
        if (found === step.hotspots.length) {
          sfx('correct');
          stage.querySelector('.bubble-row').outerHTML = bubble(step.done.who, step.done.text, 'compact');
          wireReplay(step.done.who, step.done.text);
          $('#btn-next').style.display = ''; $('#btn-next').classList.add('bounce'); wireNext();
          await say(step.done.text, step.done.who);
        } else idleHint();
      });
      const idleHint = () => idle(async () => {
        const left = step.hotspots.find((h, i) => !foundSet.has(i)); if (!left) return;
        $('#marks').insertAdjacentHTML('beforeend', `<circle class="hintpulse" cx="${left.x}" cy="${left.y}" r="${left.r + 10}" fill="#F7941D" opacity=".4"/>`);
        await say(step.lupe ? 'Schau mal dort, wo es leuchtet. Fahr mit der Lupe darüber.' : 'Schau mal dort, wo es leuchtet.', 'leyla');
      });
      await say(step.intro.text, step.intro.who);
      idleHint();
    },

    // ---- Auswahl ----
    async choose(step) {
      const layout = step.layout || 'suspects';
      let wrongs = 0, locked = false;
      const cards = step.options.map((o, i) => {
        if (layout === 'sound') return `<div class="card sound" role="button" tabindex="0" data-i="${i}"><div class="speaker">🔊</div><div class="card-label">${esc(o.label)}</div><button class="btn btn-mini pick" data-i="${i}"><span class="lbl">Das ist er!</span> ✓</button></div>`;
        if (layout === 'icons') return `<button class="card icon" data-i="${i}">${o.img ? Art.icon(o.img, o.svg) : `<svg viewBox="-40 -40 80 80" class="card-icon">${o.svg}</svg>`}<div class="card-label">${esc(o.label)}</div></button>`;
        return `<button class="card suspect" data-i="${i}"><div class="card-av">${Art.avatar(o.who)}</div>${o.img ? Art.icon(o.img, o.item, 'card-item') : `<svg viewBox="-24 -24 48 48" class="card-item">${o.item}</svg>`}<div class="card-label">${esc(o.label)}</div></button>`;
      }).join('');
      stage.innerHTML = `<section class="screen case">
        ${bubble(step.question.who, step.question.text, 'compact')}
        <div class="cards n${step.options.length} ${layout}">${cards}</div>
        <div class="actions"><button class="btn btn-primary btn-lg" id="btn-next" style="display:none"><span class="lbl">Weiter</span><span class="ico">▶</span></button></div>
      </section>`;
      wireReplay(step.question.who, step.question.text);
      const pick = async (i, el) => {
        if (locked) return; const o = step.options[i]; clearIdle();
        if (o.correct) {
          locked = true; el.classList.add('right'); sfx('correct');
          stage.querySelectorAll('.card').forEach(c => { if (c !== el) c.classList.add('dim'); });
          await say(o.say, 'nino');
          $('#btn-next').style.display = ''; $('#btn-next').classList.add('bounce'); wireNext();
        } else {
          wrongs++; el.classList.add('shake', 'dim'); sfx('wrong'); setTimeout(() => el.classList.remove('shake'), 500);
          await say(o.say, 'leyla');
          if (wrongs >= 2 && step.hint) await say(step.hint.text, step.hint.who);
          idleHint();
        }
      };
      stage.querySelectorAll('.card').forEach(el => {
        const i = +el.dataset.i; const o = step.options[i];
        if (layout === 'sound') {
          el.addEventListener('click', async ev => {
            if (ev.target.closest('.pick')) { pick(i, el); return; }
            if (locked) return; sfx('tap'); stage.querySelectorAll('.pick').forEach(p => p.classList.remove('show'));
            el.classList.add('playing'); await say(o.text, o.voice); el.classList.remove('playing'); el.querySelector('.pick').classList.add('show');
          });
        } else el.addEventListener('click', () => { if (o.sfx) sfx(o.sfx); pick(i, el); });
      });
      const idleHint = () => idle(async () => { if (step.hint) await say(step.hint.text, step.hint.who); });
      await say(step.question.text, step.question.who);
      idleHint();
    },

    // ---- Unterschiede ----
    async diff(step) {
      let found = 0; const foundSet = new Set();
      stage.innerHTML = `<section class="screen case">
        <div class="diff-wrap">
          <div class="diff-side"><div class="frame photo"><div class="frame-img">${Art.avatar(step.left)}</div><div class="frame-label">Foto</div></div></div>
          <div class="diff-side"><div class="frame live" id="diff-right"><div class="frame-img">${Art.avatar(step.right)}<svg viewBox="${Art.hasImg(step.right) ? '0 0 100 234' : '0 0 120 130'}" class="diff-marks" id="diff-marks"></svg></div><div class="frame-label">Am Tresen</div></div></div>
        </div>
        ${progressDots(0, step.spots.length)}
        ${bubble(step.intro.who, step.intro.text, 'compact')}
        <div class="actions"><button class="btn btn-primary btn-lg" id="btn-next" style="display:none"><span class="lbl">Weiter</span><span class="ico">▶</span></button></div>
      </section>`;
      wireReplay(step.intro.who, step.intro.text);
      const marks = $('#diff-marks');
      $('#diff-right').addEventListener('click', async ev => {
        const p = svgPoint(marks, ev);
        const imgMode = Art.hasImg(step.right);
        const spots = imgMode ? step.spots.map(h => ({ ...h, ...(h.img || {}) })) : step.spots;
        const cand = spots.map((h, i) => ({ h, i, d: Math.hypot(h.x - p.x, h.y - p.y) })).filter(c => !foundSet.has(c.i) && c.d <= c.h.r + 6).sort((a, b) => a.d - b.d)[0];
        const hit = cand ? cand.h : null;
        clearIdle();
        if (!hit) { sfx('tap'); idleHint(); return; }
        const i = cand.i; foundSet.add(i); found++;
        marks.insertAdjacentHTML('beforeend', `<circle cx="${hit.x}" cy="${hit.y}" r="${hit.r + 3}" fill="none" stroke="#6DA544" stroke-width="3"/>`);
        stage.querySelector('.dots').outerHTML = progressDots(found, step.spots.length);
        sfx('found'); await say(hit.say, 'nino');
        if (found === step.spots.length) {
          sfx('correct');
          stage.querySelector('.bubble-row').outerHTML = bubble(step.done.who, step.done.text, 'compact'); wireReplay(step.done.who, step.done.text);
          $('#btn-next').style.display = ''; $('#btn-next').classList.add('bounce'); wireNext();
          await say(step.done.text, step.done.who);
        } else idleHint();
      });
      const idleHint = () => idle(async () => {
        const li = step.spots.findIndex((h, i) => !foundSet.has(i)); if (li < 0) return;
        const left = Art.hasImg(step.right) ? { ...step.spots[li], ...(step.spots[li].img || {}) } : step.spots[li];
        marks.insertAdjacentHTML('beforeend', `<circle class="hintpulse" cx="${left.x}" cy="${left.y}" r="${left.r + 6}" fill="#F7941D" opacity=".4"/>`);
        await say('Schau mal dort, wo es leuchtet. Was ist anders als auf dem Foto?', 'leyla');
      });
      await say(step.intro.text, step.intro.who);
      idleHint();
    },

    // ---- Geräusch-Reihenfolge ----
    async sequence(step) {
      let round = 0, input = [], busy = true, fails = 0;
      const btns = step.sounds.map(s => `<button class="card icon snd" data-id="${s.id}">${s.img === 'enten' ? (Art.hasImg('enten') ? `<img class="card-icon icon-img" src="${Art.IMG.enten}" alt="">` : `<svg viewBox="-40 -40 80 80" class="card-icon">${s.svg}</svg>`) : s.img ? Art.icon(s.img, s.svg) : `<svg viewBox="-40 -40 80 80" class="card-icon">${s.svg}</svg>`}<div class="card-label">${esc(s.label)}</div></button>`).join('');
      stage.innerHTML = `<section class="screen case">
        ${bubble(step.intro.who, step.intro.text, 'compact')}
        <div class="seq-status" id="seq-status"><span class="seq-ico">👂</span><span class="seq-dots">${step.rounds.map(() => '<b></b>').join('')}</span><span class="lbl" id="seq-text">Runde 1 von ${step.rounds.length}</span></div>
        <div class="cards n5 sounds">${btns}</div>
        <div class="actions"><button class="btn btn-secondary btn-lg" id="btn-again"><span class="lbl">Nochmal hören</span><span class="ico">🔊</span></button><button class="btn btn-primary btn-lg" id="btn-next" style="display:none"><span class="lbl">Weiter</span><span class="ico">▶</span></button></div>
      </section>`;
      wireReplay(step.intro.who, step.intro.text);
      const btn = id => stage.querySelector(`.snd[data-id="${id}"]`);
      const play = async (slow = false) => {
        busy = true; input = []; stage.querySelectorAll('.snd').forEach(b => b.classList.remove('on'));
        seqStatus('👂', `Runde ${round + 1} von ${step.rounds.length} — Hör zu …`, round);
        await sleep(400);
        for (const id of step.rounds[round]) {
          const s = step.sounds.find(x => x.id === id); const b = btn(id);
          b.classList.add('on'); sfx(s.sfx); await sleep(slow ? 1300 : 900); b.classList.remove('on'); await sleep(250);
        }
        seqStatus('👆', 'Jetzt du! Tipp die Geräusche in derselben Reihenfolge.', round);
        busy = false; idleHint();
      };
      const idleHint = () => idle(async () => { await say('Tipp die Geräusche in derselben Reihenfolge an. Zuerst das erste Geräusch.', 'leyla'); });
      $('#btn-again').onclick = () => { if (!busy) { sfx('tap'); play(true); } };
      stage.querySelectorAll('.snd').forEach(b => b.addEventListener('click', async () => {
        if (busy) return; const id = b.dataset.id; const s = step.sounds.find(x => x.id === id);
        clearIdle(); sfx(s.sfx); b.classList.add('on'); setTimeout(() => b.classList.remove('on'), 350);
        input.push(id);
        const target = step.rounds[round];
        const k = input.length - 1;
        if (input[k] !== target[k]) {
          fails++; busy = true; sfx('wrong'); b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 500);
          await say(fails >= 2 ? 'Hm. Hör nochmal ganz genau zu. Ich spiele es langsam.' : 'Hm. Nicht ganz. Hör nochmal zu.', 'leyla');
          play(fails >= 2); return;
        }
        if (input.length === target.length) {
          busy = true; sfx('correct'); round++;
          if (round >= step.rounds.length) {
            seqStatus('⭐', 'Alle Runden geschafft!', step.rounds.length);
            $('#btn-again').style.display = 'none';
            stage.querySelector('.bubble-row').outerHTML = bubble(step.done.who, step.done.text, 'compact'); wireReplay(step.done.who, step.done.text);
            $('#btn-next').style.display = ''; $('#btn-next').classList.add('bounce'); wireNext();
            await say(step.done.text, step.done.who);
          } else { await say('Super! Nächste Runde.', 'nino'); play(); }
        } else idleHint();
      }));
      await say(step.intro.text, step.intro.who);
      play();
    },

    // ---- Spur in Reihenfolge antippen ----
    async order(step) {
      let k = 0;
      const spuren = step.points.map((p, i) => step.spurSvg(p.x, p.y, i)).join('');
      const targets = step.points.map((p, i) => `<g class="target" data-i="${i}" transform="translate(${p.x} ${p.y})"><circle r="22" fill="#fff" opacity=".001"/><circle class="tring" r="20" fill="none" stroke="#F7941D" stroke-width="3" stroke-dasharray="4 4" opacity=".9"/></g>`).join('');
      stage.innerHTML = `<section class="screen case">
        <div class="scene-wrap"><svg viewBox="0 0 400 300" class="scene interactive" id="order-svg">${inner(sceneHTML(step.scene, {}))}${spuren}<g id="order-marks"></g>${targets}<g id="nino-marker" transform="translate(${step.points[0].x} ${step.points[0].y - 30})"><circle r="14" fill="#6DA544" stroke="#fff" stroke-width="3"/><path d="M-9 -2 L-1 -2 M1 -2 L9 -2" stroke="#F2B233" stroke-width="2"/><rect x="-8" y="-3" width="7" height="5" rx="2" fill="#2B2B2B"/><rect x="1" y="-3" width="7" height="5" rx="2" fill="#2B2B2B"/></g></svg>${progressDots(0, step.points.length)}</div>
        ${bubble(step.intro.who, step.intro.text, 'compact')}
        <div class="actions"><button class="btn btn-primary btn-lg" id="btn-next" style="display:none"><span class="lbl">Weiter</span><span class="ico">▶</span></button></div>
      </section>`;
      wireReplay(step.intro.who, step.intro.text);
      const idleHint = () => idle(async () => { const t = stage.querySelector(`.target[data-i="${k}"] .tring`); if (t) t.classList.add('hintpulse'); await say(k === 0 ? 'Tipp auf die erste Spur beim Veloständer.' : 'Tipp auf die nächste Spur. Dort, wo es leuchtet.', 'leyla'); });
      stage.querySelectorAll('.target').forEach(t => t.addEventListener('click', async () => {
        const i = +t.dataset.i; clearIdle();
        if (i !== k) { sfx('wrong'); t.classList.add('shake'); setTimeout(() => t.classList.remove('shake'), 500); await say(i < k ? 'Da warst du schon. Weiter zur nächsten Spur.' : 'Nicht überspringen. Der Reihe nach.', 'leyla'); idleHint(); return; }
        const p = step.points[i]; k++;
        sfx('pop'); t.querySelector('.tring').setAttribute('stroke', '#6DA544'); t.querySelector('.tring').removeAttribute('stroke-dasharray');
        $('#order-marks').insertAdjacentHTML('beforeend', `<text x="${p.x}" y="${p.y - 24}" text-anchor="middle" font-size="16" font-weight="800" fill="#6DA544" font-family="Fredoka, Nunito, sans-serif">${k}</text>`);
        $('#nino-marker').setAttribute('transform', `translate(${p.x} ${p.y - 30})`);
        stage.querySelector('.dots').outerHTML = progressDots(k, step.points.length);
        if (k === step.points.length) {
          sfx('correct');
          stage.querySelector('.bubble-row').outerHTML = bubble(step.done.who, step.done.text, 'compact'); wireReplay(step.done.who, step.done.text);
          $('#btn-next').style.display = ''; $('#btn-next').classList.add('bounce'); wireNext();
          await say(step.done.text, step.done.who);
        } else idleHint();
      }));
      await say(step.intro.text, step.intro.who);
      idleHint();
    },

    // ---- Unsichtbare Tinte freirubbeln ----
    async reveal(step) {
      const cells = new Set(); const NEED = 70; let done = false, lastRub = 0;
      stage.innerHTML = `<section class="screen case">
        <div class="paper-wrap"><svg viewBox="0 0 260 260" class="paper" id="paper">
          <defs><mask id="ink"><rect width="260" height="260" fill="#000"/><g id="ink-holes"></g></mask></defs>
          <rect x="4" y="4" width="252" height="252" rx="8" fill="#FFF8DC" stroke="#D9C8A9" stroke-width="3"/>
          <g mask="url(#ink)">${step.content}</g>
          <g id="finger-hint" class="finger"><circle cx="60" cy="60" r="10" fill="#F7941D" opacity=".7"/></g>
        </svg></div>
        <div class="bar"><div class="bar-fill" id="bar-fill" style="width:0%"></div></div>
        ${bubble(step.intro.who, step.intro.text, 'compact')}
        <div class="actions"><button class="btn btn-primary btn-lg" id="btn-next" style="display:none"><span class="lbl">Weiter</span><span class="ico">▶</span></button></div>
      </section>`;
      wireReplay(step.intro.who, step.intro.text);
      const svg = $('#paper'); const holes = $('#ink-holes'); let down = false;
      const rub = ev => {
        const p = svgPoint(svg, ev);
        holes.insertAdjacentHTML('beforeend', `<circle cx="${p.x}" cy="${p.y}" r="22" fill="#fff"/>`);
        const cx = Math.floor(p.x / 26), cy = Math.floor(p.y / 26); cells.add(cx + ':' + cy);
        const now = Date.now(); if (now - lastRub > 90) { sfx('rub'); lastRub = now; }
        $('#finger-hint').style.display = 'none';
        const pct = Math.min(100, Math.round(cells.size / NEED * 100)); $('#bar-fill').style.width = pct + '%';
        if (!done && cells.size >= NEED) finish();
      };
      const finish = async () => {
        done = true; clearIdle(); holes.insertAdjacentHTML('beforeend', `<rect width="260" height="260" fill="#fff"/>`); $('#bar-fill').style.width = '100%';
        sfx('correct');
        stage.querySelector('.bubble-row').outerHTML = bubble(step.done.who, step.done.text, 'compact'); wireReplay(step.done.who, step.done.text);
        $('#btn-next').style.display = ''; $('#btn-next').classList.add('bounce'); wireNext();
        await say(step.done.text, step.done.who);
      };
      svg.addEventListener('pointerdown', ev => { down = true; svg.setPointerCapture(ev.pointerId); rub(ev); clearIdle(); });
      svg.addEventListener('pointermove', ev => { if (down) rub(ev); });
      svg.addEventListener('pointerup', () => { down = false; if (!done) idleHint(); });
      const idleHint = () => idle(async () => { $('#finger-hint').style.display = ''; await say('Reib mit dem Finger über das Papier. Überall.', 'leyla'); });
      await say(step.intro.text, step.intro.who);
      idleHint();
    },

    // ---- Karte in Reihenfolge ----
    async maporder(step) {
      let k = 0;
      stage.innerHTML = `<section class="screen case">
        <div class="map-wrap small">${Art.karte(CASES.map(() => 'done'))}</div>
        ${progressDots(0, step.order.length)}
        ${bubble(step.intro.who, step.intro.text, 'compact')}
        <div class="actions"><button class="btn btn-primary btn-lg" id="btn-next" style="display:none"><span class="lbl">Weiter</span><span class="ico">▶</span></button></div>
      </section>`;
      wireReplay(step.intro.who, step.intro.text);
      const names = ['Brunnen', 'Bäckerei', 'See', 'Schule', 'Gartenhaus'];
      stage.querySelectorAll('.spot').forEach(el => { el.querySelectorAll('path[fill="#F7D046"]').forEach(s => s.remove()); });
      const idleHint = () => idle(async () => { const el = stage.querySelector(`.spot[data-case="${step.order[k]}"]`); el && el.classList.add('pulse'); await say(`Tipp auf ${k === 0 ? 'den Brunnen. Das ist die Nummer eins' : 'den Ort, der leuchtet'}.`, 'leyla'); });
      stage.querySelectorAll('.spot').forEach(el => el.addEventListener('click', async () => {
        const id = +el.dataset.case; clearIdle();
        if (id !== step.order[k]) { sfx('wrong'); el.classList.add('shake'); setTimeout(() => el.classList.remove('shake'), 500); await say(`Nein, das ist ${names[id] === 'Bäckerei' ? 'die' : names[id] === 'Schule' ? 'die' : 'der'} ${names[id]}. Schau auf den Zettel: Was kommt als Nummer ${k + 1}?`, 'leyla'); idleHint(); return; }
        k++; sfx('pop'); el.classList.remove('pulse'); el.classList.add('picked');
        el.insertAdjacentHTML('beforeend', `<circle r="34" fill="none" stroke="#F7941D" stroke-width="6"/><circle cx="-24" cy="-24" r="14" fill="#F7941D" stroke="#fff" stroke-width="3"/><text x="-24" y="-18" text-anchor="middle" font-size="16" font-weight="800" fill="#fff" font-family="Fredoka, Nunito, sans-serif">${k}</text>`);
        stage.querySelector('.dots').outerHTML = progressDots(k, step.order.length);
        if (k === step.order.length) {
          sfx('correct');
          stage.querySelector('.bubble-row').outerHTML = bubble(step.done.who, step.done.text, 'compact'); wireReplay(step.done.who, step.done.text);
          $('#btn-next').style.display = ''; $('#btn-next').classList.add('bounce'); wireNext();
          await say(step.done.text, step.done.who);
        } else { await say(names[id] + '. Richtig!', 'nino'); idleHint(); }
      }));
      await say(step.intro.text, step.intro.who);
      idleHint();
    },

    // ---- Belohnung ----
    async reward(step, c) {
      clearIdle(); A.music('win');
      if (!state.done.includes(c.id)) state.done.push(c.id);
      state.unlocked = Math.max(state.unlocked, Math.min(CASES.length, c.id + 2)); save();
      stage.innerHTML = `<section class="screen reward">
        <div class="confetti" id="confetti"></div>
        <div class="stamp-wrap"><div class="stamp" id="stamp"><span class="stamp-check">✔</span><span class="lbl">ERLEDIGT</span></div><div class="portrait big">${Art.avatar('nino')}</div></div>
        <div class="reward-card">
          <div class="reward-title"><span class="lbl">Fall ${c.id + 1} gelöst!</span></div>
          <div class="reward-stars">${'★'.repeat(3)}</div>
          <div class="rule"><div class="rule-icon">📓</div><div class="rule-head lbl">Regel fürs Agentenhandbuch</div><p class="lbl">${esc(step.rule)}</p><button class="btn-replay" id="rule-replay" aria-label="Regel nochmal anhören">🔊</button></div>
          <div class="note lbl">Ninos Note: <b>${esc(step.note)}</b> <span class="note-leyla">— Leyla: «Das war GUT, Nino.»</span></div>
        </div>
        <div class="actions"><button class="btn btn-primary btn-lg" id="btn-next"><span class="lbl">${step.final ? 'Zum Abspann' : 'Zur Karte'}</span><span class="ico">${step.final ? '★' : '🗺️'}</span></button></div>
      </section>`;
      const conf = $('#confetti'); for (let i = 0; i < 40; i++) { const s = document.createElement('i'); s.style.left = Math.random() * 100 + '%'; s.style.animationDelay = Math.random() * 1.5 + 's'; s.style.background = ['#F7941D', '#4FC3E8', '#6DA544', '#F25C7A', '#F7D046'][i % 5]; conf.appendChild(s); }
      await sleep(300); sfx('stamp'); $('#stamp').classList.add('in'); await sleep(500); sfx('fanfare'); sfx('confetti');
      wireNext(() => step.final ? renderEnd() : renderMap(true));
      $('#rule-replay').onclick = () => { sfx('tap'); say(`Regel für mein Handbuch: ${step.rule}`, 'nino'); };
      await say(`Fall Nummer ${c.id + 1}. Erledigt. Note: ${step.note}`, 'nino');
      await say('Das war GUT, Nino.', 'leyla');
      await say(`Regel für mein Handbuch: ${step.rule}`, 'nino');
      $('#btn-next').classList.add('bounce');
    },
  };

  async function renderEnd() {
    topbar({ title: 'Abspann', back: () => renderMap() }); A.music('win');
    const who = ['nino', 'leyla', 'mila', 'brunner', 'buehler', 'gerber', 'kummer'];
    stage.innerHTML = `<section class="screen end">
      <h2 class="logo small">ALLE FÄLLE<br><span>ERLEDIGT</span></h2>
      <div class="cast">${who.map(w => `<div class="cast-one"><div class="portrait">${Art.avatar(w)}</div><div class="cast-name">${Art.NAMES[w]}</div></div>`).join('')}</div>
      <p class="end-text">Agent 0815 sagt: Danke. Du bist jetzt auch im SGD. Ganz geheim. Alle wissen es.</p>
      <div class="actions"><button class="btn btn-primary btn-lg" id="btn-next"><span class="lbl">Zur Karte</span><span class="ico">🗺️</span></button></div>
    </section>`;
    wireNext(() => renderMap());
    await say('Alle fünf Fälle erledigt. Du bist jetzt auch im S G D. Ganz geheim. Alle wissen es.', 'nino');
  }

  // ---------- Elternbereich ----------
  function parentGate() {
    const a = 2 + Math.floor(Math.random() * 4), b = 3 + Math.floor(Math.random() * 5);
    const modal = document.createElement('div'); modal.className = 'modal';
    modal.innerHTML = `<div class="modal-card"><h3>Für Erwachsene</h3><p>Wie viel ist ${a} mal ${b}?</p><input type="number" id="gate-in" inputmode="numeric" autocomplete="off"><div class="modal-actions"><button class="btn btn-secondary" id="gate-cancel">Abbrechen</button><button class="btn btn-primary" id="gate-ok">OK</button></div></div>`;
    document.body.appendChild(modal);
    modal.querySelector('#gate-cancel').onclick = () => modal.remove();
    modal.querySelector('#gate-ok').onclick = () => { if (+modal.querySelector('#gate-in').value === a * b) { modal.remove(); parentArea(); } else { modal.querySelector('.modal-card').classList.add('shake'); setTimeout(() => modal.querySelector('.modal-card').classList.remove('shake'), 500); } };
    setTimeout(() => modal.querySelector('#gate-in').focus(), 50);
  }
  function parentArea() {
    const modal = document.createElement('div'); modal.className = 'modal';
    const tog = (id, label, on) => `<label class="tog"><span>${label}</span><input type="checkbox" id="${id}" ${on ? 'checked' : ''}><i></i></label>`;
    modal.innerHTML = `<div class="modal-card parent"><h3>Elternbereich</h3>
      ${tog('p-music', 'Musik', state.music !== false)}${tog('p-sfx', 'Geräusche', state.sfx !== false)}${tog('p-voice', 'Sprachausgabe', state.voice !== false)}${tog('p-text', 'Text anzeigen (für Leser)', !!state.showText)}
      <p class="small">Stimme: ${S.available() ? esc(S.voiceName) : 'Keine Sprachausgabe in diesem Browser'}</p>
      <p class="small">Fortschritt: ${state.done.length} von ${CASES.length} Fällen gelöst.</p>
      <div class="modal-actions">
        ${deferredInstall ? '<button class="btn btn-secondary" id="p-install">App installieren</button>' : ''}
        <button class="btn btn-secondary" id="p-reset">Fortschritt löschen</button>
        <button class="btn btn-primary" id="p-close">Schliessen</button></div>
      <p class="small credit">Agent 0815 — Die Fälle von Bärlingen. Spiel zum Buch. Version MVP 0.1</p></div>`;
    document.body.appendChild(modal);
    modal.querySelector('#p-music').onchange = e => { state.music = e.target.checked; applySound(); save(); };
    modal.querySelector('#p-sfx').onchange = e => { state.sfx = e.target.checked; applySound(); save(); };
    modal.querySelector('#p-voice').onchange = e => { state.voice = e.target.checked; applySound(); save(); };
    modal.querySelector('#p-text').onchange = e => { state.showText = e.target.checked; applyText(); save(); };
    modal.querySelector('#p-close').onclick = () => modal.remove();
    modal.querySelector('#p-reset').onclick = () => { if (confirm('Wirklich den ganzen Fortschritt löschen?')) { state.done = []; state.unlocked = 1; save(); modal.remove(); renderMap(); } };
    const inst = modal.querySelector('#p-install'); if (inst) inst.onclick = async () => { deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; modal.remove(); };
  }

  // ---------- PWA ----------
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; });
  if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {})); }
  document.addEventListener('visibilitychange', () => { if (document.hidden) { S.stop(); } });

  applyText();
  Art.probeImages().then(() => { CASES = buildCases(); renderStart(); });
})();

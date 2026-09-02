/* Agent 0815 — Spiel-Engine */
(() => {
  const $ = s => document.querySelector(s);
  const stage = $('#stage');
  const A = Audio0815, S = Speech0815;
  const STORE = 'agent0815.v1';
  let state = load();
  let idleTimer = null, deferredInstall = null;
  let cur = { caseId: null, step: 0 };
  window.__cur = () => ({ c: cur.caseId, s: cur.step, m: !!stage.querySelector('.map-wrap') });
  window.__jump = i => { cur.step = i; renderStep(); };

  function load() { try { return Object.assign({ done: [], unlocked: 1, sound: true }, JSON.parse(localStorage.getItem(STORE) || '{}')); } catch (e) { return { done: [], unlocked: 1, sound: true }; } }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} }

  const inner = svg => svg.replace(/^\s*<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  // ---------- Sprechen (mit Musik-Ducking) ----------
  async function say(text, who = 'erz') { A.duck(true); document.body.classList.add('speaking'); document.body.dataset.who = who; try { await S.speak(text, who); } finally { document.body.classList.remove('speaking'); A.duck(false); } }
  function sfx(name) { if (name && A.sfx[name]) A.sfx[name](); }

  // ---------- Idle-Hilfe ----------
  function idle(fn, ms = 14000) { clearIdle(); const t = idleTimer = setTimeout(async () => { try { await fn(); } catch (e) {} if (idleTimer === t) idle(fn, 20000); }, ms); }
  function clearIdle() { if (idleTimer) clearTimeout(idleTimer); idleTimer = null; }

  // ---------- Top-Bar ----------
  function topbar({ title = '', back = null, icon = '' } = {}) {
    $('#tb-title').innerHTML = (icon ? `<span class="tb-ico">${icon}</span>` : '') + `<span class="lbl">${esc(title)}</span>`;
    const b = $('#tb-back'); b.style.visibility = back ? 'visible' : 'hidden'; b.onclick = back;
    $('#tb-sound').textContent = state.sound ? '🔊' : '🔇';
  }
  $('#tb-sound').onclick = () => { state.sound = !state.sound; applySound(); save(); $('#tb-sound').textContent = state.sound ? '🔊' : '🔇'; sfx('tap'); };
  const CASE_ICONS = () => ['silberglocke', 'eckengucker', 'lauschtrichter', 'generalschluessel', 'nachtbrille'].map((n, i) => Art.icon(n, [Scene0815.svgs.silberglocke(0, 0, 1.3), `<rect x="-22" y="-6" width="44" height="12" rx="4" fill="#C9A227" stroke="#8A6A10"/>`, `<path d="M-20 -14 L14 4 L4 14 Z" fill="#C9A227" stroke="#8A6A10"/>`, `<rect x="-24" y="-5" width="48" height="10" rx="2" fill="#C9A227" stroke="#8A6A10"/><circle cx="-12" r="2.5" fill="#fff"/><circle cx="6" r="2.5" fill="#fff"/>`, `<circle r="14" fill="#5A3A22"/><circle r="6" fill="#C77DFF"/>`][i], 'tb-svg'));
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
    stepToken++;
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
    // Unterbrochenen Fall fortsetzen (Neuladen, App im Hintergrund): beim zuletzt erreichten Schritt weitermachen
    const rs = state.cur;
    if (rs && rs.caseId === id && rs.step > 0 && rs.step < CASES[id].steps.length - 1 && !state.done.includes(id)) {
      cur.step = rs.step;
      CASES[id].steps.slice(0, rs.step + 1).forEach(st => { if (st.scene) { cur.sceneName = st.scene.name; cur.sceneOpts = st.scene.opts || {}; } });
    }
    A.music('case');
    renderStep();
  }
  function next() { cur.step++; renderStep(); }
  // Automatisches Weitergehen: nach dem letzten Satz eines Schritts, sofern der Schritt noch aktuell ist
  let stepToken = 0;
  function autoNext(fn, delay = 800) { const t = stepToken; setTimeout(() => { if (t === stepToken) (fn || next)(); }, delay); }
  // Antippen der Szene/Sprechblase (nicht des Lautsprechers) = sofort weiter
  function tapToSkip(fn) {
    const sec = stage.querySelector('.screen'); if (!sec) return;
    sec.classList.add('tappable');
    if (sec._tap) sec.removeEventListener('click', sec._tap);
    sec._tap = ev => { if (ev.target.closest('.btn-replay, button, .card, .spot')) return; sfx('tap'); S.stop(); (fn || next)(); };
    sec.addEventListener('click', sec._tap);
  }
  function renderStep() {
    stepToken++; clearIdle(); S.stop();
    const c = CASES[cur.caseId];
    const step = c.steps[cur.step];
    if (!step) { renderMap(); return; }
    state.cur = step.type === 'reward' ? null : { caseId: cur.caseId, step: cur.step }; save();
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
    const o = { ...opts, bell: opts.bell !== undefined ? opts.bell : !!opts.gloeckchen, ducks: opts.ducks !== undefined ? opts.ducks : opts.enten };
    if (Scene0815.DEFS[name] && Art.hasImg(Scene0815.DEFS[name].img)) return Scene0815.render(name, o);
    if (Art.hasImg('scene_' + name)) {
      const a = ANCHORS[name] || {};
      let over = '';
      if (o.bell && a.bell) over += Art.sprite('silberglocke', a.bell.x, a.bell.y, a.bell.h, Art.obj.gloeckchen(a.bell.x, a.bell.y, 1));
      if (a.ducks && o.ducks) over += `<g class="enten">${Art.sprite('enten', a.ducks.x, a.ducks.y, a.ducks.h)}</g>`;
      over += opts.extra || '';
      return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="scene"><image href="${Art.IMG['scene_' + name]}" width="400" height="300" preserveAspectRatio="xMidYMid slice"/>${over}</svg>`;
    }
    return Art.scenes[name] ? Art.scenes[name](opts) : Scene0815.render(name, o);
  }
  const sceneSvg = () => stage.querySelector('.scene-wrap svg.scene');
  async function runCues(cues, when) {
    if (!cues) return; const list = Array.isArray(cues) ? cues : [cues];
    for (const c of list) { if ((c.at || 'end') !== when) continue; await Scene0815.cue(sceneSvg(), c, sfx); }
  }

  function bubble(who, text, extraClass = '') {
    return `<div class="bubble-row ${extraClass}">
      <div class="portrait ${who}">${Art.avatar(who)}</div>
      <div class="bubble"><div class="name">${Art.NAMES[who] || ''}</div><p>${esc(text)}</p><div class="wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><button class="btn-replay" aria-label="Nochmal anhören">🔊</button></div>
    </div>`;
  }
  function wireReplay(who, text) { stage.querySelectorAll('.btn-replay').forEach(b => b.onclick = () => { sfx('tap'); say(text, who); }); }
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
      // Gleiche Kulisse wie im letzten Dialog: nur die Sprechblase tauschen (kein Neuaufbau, kein Flackern, Animationen laufen weiter)
      const key = cur.sceneName + '|' + JSON.stringify(cur.sceneOpts || {});
      const prev = stage.querySelector('.screen.case.dialog');
      if (prev && prev.dataset.scenekey === key) {
        const row = prev.querySelector('.bubble-row'); const tmp = document.createElement('div'); tmp.innerHTML = bubble(step.who, step.text);
        row.replaceWith(tmp.firstElementChild); prev.querySelectorAll('.actor.talk').forEach(a => a.classList.remove('talk'));
      } else {
        stage.innerHTML = `<section class="screen case dialog">
          <div class="scene-wrap">${sceneHTML(cur.sceneName, cur.sceneOpts)}</div>
          ${bubble(step.who, step.text)}
        </section>`;
        stage.firstElementChild.dataset.scenekey = key;
      }
      wireReplay(step.who, step.text); tapToSkip();
      const t0 = stepToken;
      if (step.anim === 'brille') {
        const b = stage.querySelector('.portrait .brille'); if (b) b.classList.add('rutscht');
        const im = stage.querySelector('.portrait .avatar-img');
        if (im && Art.hasImg('nino_brille') && step.who === 'nino') { const orig = im.src; setTimeout(() => { im.src = Art.IMG.nino_brille; sfx('bonk'); }, 900); setTimeout(() => { im.src = orig; }, 2600); }
      }
      const actor = sceneSvg() && sceneSvg().querySelector(`.actor[data-actor="${step.who}"]`); if (actor) actor.classList.add('talk');
      sfx(step.sfx);
      await runCues(step.cue, 'start'); if (t0 !== stepToken) return;
      await say(step.text, step.who); if (t0 !== stepToken) return;
      if (actor) actor.classList.remove('talk');
      await runCues(step.cue, 'end'); if (t0 !== stepToken) return;
      autoNext(null, step.pause || (step.anim ? 2000 : 900));
    },

    // ---- Antippen (Klopfen, Schrauben festdrehen, Dielen prüfen) ----
    async taps(step) {
      if (step.scene) { cur.sceneName = step.scene.name; cur.sceneOpts = step.scene.opts || {}; }
      let k = 0; const total = step.targets.length; const doneSet = new Set();
      const targets = step.targets.map((t, i) => `<g class="target tap" data-i="${i}" transform="translate(${t.x} ${t.y})"><circle r="${Math.max(t.r || 18, 28)}" fill="#fff" opacity=".001"/><circle class="tring" r="${(t.r || 18) - 2}" fill="none" stroke="#F7941D" stroke-width="3" stroke-dasharray="4 4"/>${t.svg || ''}</g>`).join('');
      stage.innerHTML = `<section class="screen case">
        <div class="scene-wrap"><svg viewBox="${Scene0815.viewBox(cur.sceneName)}" class="scene interactive live" id="taps-svg">${Scene0815.inner(sceneHTML(cur.sceneName, cur.sceneOpts))}<g id="tap-marks"></g>${targets}</svg>${progressDots(0, total)}</div>
        ${bubble(step.intro.who, step.intro.text, 'compact')}
      </section>`;
      wireReplay(step.intro.who, step.intro.text);
      const idleHint = () => idle(async () => { const t = stage.querySelector(`.target[data-i="${step.sequential ? k : [...Array(total).keys()].find(i => !doneSet.has(i))}"] .tring`); if (t) t.classList.add('hintpulse'); await say(step.hint || 'Tipp dort, wo es leuchtet.', 'leyla'); });
      stage.querySelectorAll('.target').forEach(t => t.addEventListener('click', async () => {
        const i = +t.dataset.i; clearIdle();
        if (doneSet.has(i)) { sfx('tap'); return; }
        if (step.sequential && i !== k) { sfx('wrong'); t.classList.add('shake'); setTimeout(() => t.classList.remove('shake'), 500); idleHint(); return; }
        const tg = step.targets[i]; doneSet.add(i); k++;
        sfx(tg.sfx || 'klack'); t.classList.add('done'); t.querySelector('.tring').setAttribute('stroke', '#6DA544'); t.querySelector('.tring').removeAttribute('stroke-dasharray');
        if (tg.spin) { const s = t.querySelector('.spin'); if (s) s.classList.add('spun'); }
        stage.querySelector('.dots').outerHTML = progressDots(k, total);
        if (tg.say) await say(tg.say.text, tg.say.who);
        if (k === total) {
          sfx('correct');
          stage.querySelector('.bubble-row').outerHTML = bubble(step.done.who, step.done.text, 'compact'); wireReplay(step.done.who, step.done.text);
          await runCues(step.cue, 'end');
          await say(step.done.text, step.done.who); autoNext();
        } else idleHint();
      }));
      await say(step.intro.text, step.intro.who);
      idleHint();
    },

    // ---- Spuren finden ----
    async find(step) {
      const sn = typeof step.scene === 'object' ? step.scene.name : step.scene; const so = typeof step.scene === 'object' ? step.scene.opts : step.sceneOpts;
      if (sn) { cur.sceneName = sn; cur.sceneOpts = so || {}; }
      const scene = sceneHTML(cur.sceneName, cur.sceneOpts);
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
        if (!hit) {
          const miss = (step.misses || []).find(m => Math.hypot(m.x - p.x, m.y - p.y) <= m.r + 8);
          if (miss) { sfx(miss.sfx || 'wrong'); if (miss.say) await say(miss.say, miss.who || 'leyla'); } else sfx('tap');
          idleHint(); return;
        }
        const i = step.hotspots.indexOf(hit); foundSet.add(i); found++;
        $('#marks').insertAdjacentHTML('beforeend', `<g class="mark"><circle cx="${hit.x}" cy="${hit.y}" r="${hit.r + 6}" fill="none" stroke="#6DA544" stroke-width="4"/>${Art.obj.stern(hit.x + hit.r, hit.y - hit.r, 0.9)}</g>`);
        stage.querySelector('.dots').outerHTML = progressDots(found, step.hotspots.length);
        sfx('found');
        await say(hit.say, hit.who || 'nino');
        if (found === step.hotspots.length) {
          sfx('correct');
          stage.querySelector('.bubble-row').outerHTML = bubble(step.done.who, step.done.text, 'compact');
          wireReplay(step.done.who, step.done.text);
          await runCues(step.cue, 'end');
          await say(step.done.text, step.done.who); autoNext();
        } else idleHint();
      });
      const idleHint = () => idle(async () => {
        const left = step.hotspots.find((h, i) => !foundSet.has(i)); if (!left) return;
        $('#marks').insertAdjacentHTML('beforeend', `<circle class="hintpulse" cx="${left.x}" cy="${left.y}" r="${left.r + 10}" fill="#F7941D" opacity=".4"/>`);
        await say(step.hint || (step.lupe ? 'Schau mal dort, wo es leuchtet. Fahr mit der Lupe darüber.' : 'Schau mal dort, wo es leuchtet.'), 'leyla');
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
        
      </section>`;
      wireReplay(step.question.who, step.question.text);
      const pick = async (i, el) => {
        if (locked) return; const o = step.options[i]; clearIdle();
        if (o.correct) {
          locked = true; el.classList.add('right'); sfx('correct');
          stage.querySelectorAll('.card').forEach(c => { if (c !== el) c.classList.add('dim'); });
          await say(o.say, 'nino'); autoNext();
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
          await say(step.done.text, step.done.who); autoNext();
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
        <div class="actions"><button class="btn btn-secondary btn-lg" id="btn-again"><span class="lbl">Nochmal hören</span><span class="ico">🔊</span></button></div>
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
              await say(step.done.text, step.done.who); autoNext();
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
          await say(step.done.text, step.done.who); autoNext();
        } else idleHint();
      }));
      await say(step.intro.text, step.intro.who);
      idleHint();
    },

    // ---- Reiben: Tinte / Graben / UV-Licht / Streichen (step.under = erscheint, step.over = Deckschicht) ----
    async reveal(step) {
      const cells = new Set(); const NEED = step.need || 70; let done = false, lastRub = 0; const W = step.w || 260, H = step.h || 260;
      const over = step.over || `<rect x="4" y="4" width="${W - 8}" height="${H - 8}" rx="8" fill="#FFF8DC" stroke="#D9C8A9" stroke-width="3"/>`;
      let under = step.under !== undefined ? step.under : step.content;
      if (step.underImg && Art.IMG[step.underImg]) { const u = step.underImg, iw = step.imgW || 180, ih = iw / (Art.RATIO[u] || 1); under = (step.underBg || '') + `<image href="${Art.IMG[u]}" x="${(W - iw) / 2}" y="${(H - ih) / 2}" width="${iw}" height="${ih}"/>`; }
      const cursor = step.cursor || `<circle r="10" fill="#F7941D" opacity=".7"/>`;
      stage.innerHTML = `<section class="screen case">
        <div class="paper-wrap ${step.mode || ''}"><svg viewBox="0 0 ${W} ${H}" class="paper" id="paper">
          <defs><mask id="ink"><rect width="${W}" height="${H}" fill="#fff"/><g id="ink-holes" fill="#000"></g></mask>${step.defs || ''}</defs>
          <g id="under">${under}</g>
          <g id="over" mask="url(#ink)">${over}</g>
          <g id="finger-hint" class="finger" transform="translate(60 60)">${cursor}</g>
          <g id="cursor" style="display:none">${cursor}</g>
        </svg></div>
        <div class="bar"><div class="bar-fill" id="bar-fill" style="width:0%"></div></div>
        ${bubble(step.intro.who, step.intro.text, 'compact')}
      </section>`;
      wireReplay(step.intro.who, step.intro.text);
      const svg = $('#paper'); const holes = $('#ink-holes'); let down = false; const cur$ = $('#cursor');
      const rub = ev => {
        const p = svgPoint(svg, ev);
        holes.insertAdjacentHTML('beforeend', `<circle cx="${p.x}" cy="${p.y}" r="${step.brush || 22}"/>`);
        cur$.style.display = ''; cur$.setAttribute('transform', `translate(${p.x} ${p.y})`);
        const cx = Math.floor(p.x / 26), cy = Math.floor(p.y / 26); cells.add(cx + ':' + cy);
        const now = Date.now(); if (now - lastRub > 120) { sfx(step.sfx || 'rub'); lastRub = now; }
        $('#finger-hint').style.display = 'none';
        const pct = Math.min(100, Math.round(cells.size / NEED * 100)); $('#bar-fill').style.width = pct + '%';
        if (!done && cells.size >= NEED) finish();
      };
      const finish = async () => {
        done = true; clearIdle(); holes.insertAdjacentHTML('beforeend', `<rect width="${W}" height="${H}"/>`); $('#bar-fill').style.width = '100%'; cur$.style.display = 'none';
        sfx('correct');
        stage.querySelector('.bubble-row').outerHTML = bubble(step.done.who, step.done.text, 'compact'); wireReplay(step.done.who, step.done.text);
        await say(step.done.text, step.done.who); autoNext();
      };
      svg.addEventListener('pointerdown', ev => { down = true; svg.setPointerCapture(ev.pointerId); rub(ev); clearIdle(); });
      svg.addEventListener('pointermove', ev => { if (down) rub(ev); });
      svg.addEventListener('pointerup', () => { down = false; cur$.style.display = 'none'; if (!done) idleHint(); });
      const idleHint = () => idle(async () => { $('#finger-hint').style.display = ''; await say(step.hint || 'Reib mit dem Finger über das Papier. Überall.', 'leyla'); });
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
        
      </section>`;
      wireReplay(step.intro.who, step.intro.text);
      const names = ['Brunnen', 'Bäckerei', 'See', 'Schule', 'Gartenhaus'];
      stage.querySelectorAll('.spot').forEach(el => { el.querySelectorAll('path[fill="#F7D046"]').forEach(s => s.remove()); });
      const idleHint = () => idle(async () => { const el = stage.querySelector(`.spot[data-case="${step.order[k]}"]`); el && el.classList.add('pulse'); await say(`Tipp auf ${k === 0 ? 'den Brunnen. Das ist die Nummer eins' : 'den Ort, der leuchtet'}.`, 'leyla'); });
      stage.querySelectorAll('.spot').forEach(el => el.addEventListener('click', async () => {
        const id = +el.dataset.case; clearIdle();
        if (id !== step.order[k]) { sfx('wrong'); el.classList.add('shake'); setTimeout(() => el.classList.remove('shake'), 500); await say(`Nein, das ist ${names[id] === 'Bäckerei' || names[id] === 'Schule' ? 'die' : names[id] === 'Gartenhaus' ? 'das' : 'der'} ${names[id]}. Schau auf den Zettel: Was kommt als Nummer ${k + 1}?`, 'leyla'); idleHint(); return; }
        k++; sfx('pop'); el.classList.remove('pulse'); el.classList.add('picked');
        el.insertAdjacentHTML('beforeend', `<circle r="34" fill="none" stroke="#F7941D" stroke-width="6"/><circle cx="-24" cy="-24" r="14" fill="#F7941D" stroke="#fff" stroke-width="3"/><text x="-24" y="-18" text-anchor="middle" font-size="16" font-weight="800" fill="#fff" font-family="Fredoka, Nunito, sans-serif">${k}</text>`);
        stage.querySelector('.dots').outerHTML = progressDots(k, step.order.length);
        if (k === step.order.length) {
          sfx('correct');
          stage.querySelector('.bubble-row').outerHTML = bubble(step.done.who, step.done.text, 'compact'); wireReplay(step.done.who, step.done.text);
          await say(step.done.text, step.done.who); autoNext();
        } else { await say(names[id] + '. Richtig!', 'nino'); idleHint(); }
      }));
      await say(step.intro.text, step.intro.who);
      idleHint();
    },

    // ---- Eckengucker: Rohr ziehen, im Spiegel erscheint das Versteckte; darin Dinge antippen ----
    async periscope(step) {
      if (step.scene) { cur.sceneName = step.scene.name; cur.sceneOpts = step.scene.opts || {}; }
      const base = Scene0815.inner(sceneHTML(cur.sceneName, cur.sceneOpts));
      const hidden = Scene0815.inner(sceneHTML(step.hidden.name, step.hidden.opts || {}));
      let found = 0; const foundSet = new Set(); const R = step.r || 58;
      stage.innerHTML = `<section class="screen case">
        <div class="scene-wrap find"><svg viewBox="0 0 400 300" class="scene interactive live" id="find-svg">
          <g id="base">${base}</g>
          <defs><clipPath id="peri-clip"><circle id="peri-c" r="${R}" cx="-200" cy="-200"/></clipPath></defs>
          <g id="peri" style="display:none"><g clip-path="url(#peri-clip)"><g id="peri-view">${hidden}</g><g id="marks"></g></g>
            <circle id="peri-ring" r="${R}" fill="none" stroke="#B8860B" stroke-width="7"/><circle r="${R}" fill="none" stroke="#F2D26B" stroke-width="2" opacity=".8"/>
            <rect id="peri-tube" x="${R - 4}" y="-9" width="70" height="18" rx="6" fill="#C9A227" stroke="#8A6A10" stroke-width="2"/></g>
        </svg>${progressDots(0, step.hotspots.length)}</div>
        ${bubble(step.intro.who, step.intro.text, 'compact')}
      </section>`;
      wireReplay(step.intro.who, step.intro.text);
      const svg = $('#find-svg'), peri = $('#peri');
      const move = ev => { const p = svgPoint(svg, ev); peri.style.display = ''; peri.setAttribute('transform', `translate(${p.x} ${p.y})`); $('#peri-c').setAttribute('cx', p.x); $('#peri-c').setAttribute('cy', p.y); $('#peri-view').setAttribute('transform', `translate(${-p.x} ${-p.y})`); $('#marks').setAttribute('transform', `translate(${-p.x} ${-p.y})`); };
      let downPt = null;
      svg.addEventListener('pointerdown', ev => { downPt = { x: ev.clientX, y: ev.clientY }; move(ev); svg.setPointerCapture(ev.pointerId); clearIdle(); });
      svg.addEventListener('pointermove', ev => { if (downPt || ev.pointerType === 'mouse') move(ev); });
      svg.addEventListener('pointerup', async ev => {
        if (!downPt) return; const moved = Math.hypot(ev.clientX - downPt.x, ev.clientY - downPt.y); downPt = null;
        if (moved > 25) return;
        const p = svgPoint(svg, ev);
        const hit = step.hotspots.find((h, i) => !foundSet.has(i) && Math.hypot(h.x - p.x, h.y - p.y) <= h.r + 10);
        if (!hit) { sfx('tap'); idleHint(); return; }
        const i = step.hotspots.indexOf(hit); foundSet.add(i); found++;
        $('#marks').insertAdjacentHTML('beforeend', `<circle cx="${hit.x}" cy="${hit.y}" r="${hit.r + 6}" fill="none" stroke="#6DA544" stroke-width="4"/>`);
        stage.querySelector('.dots').outerHTML = progressDots(found, step.hotspots.length);
        sfx('found'); await say(hit.say, 'nino');
        if (found === step.hotspots.length) {
          sfx('correct'); stage.querySelector('.bubble-row').outerHTML = bubble(step.done.who, step.done.text, 'compact'); wireReplay(step.done.who, step.done.text);
          await say(step.done.text, step.done.who); autoNext();
        } else idleHint();
      });
      const idleHint = () => idle(async () => { const left = step.hotspots.find((h, i) => !foundSet.has(i)); if (!left) return; $('#base').insertAdjacentHTML('beforeend', `<circle class="hintpulse" cx="${left.x}" cy="${left.y}" r="${left.r + 12}" fill="#F7941D" opacity=".35"/>`); await say(step.hint || 'Schieb das Rohr dorthin, wo es leuchtet. Dann tipp darauf.', 'leyla'); });
      await say(step.intro.text, step.intro.who); idleHint();
    },

    // ---- Lauschtrichter: still halten, bis die Welt leise wird ----
    async hold(step) {
      if (step.scene) { cur.sceneName = step.scene.name; cur.sceneOpts = step.scene.opts || {}; }
      const NEED = step.ms || 3000; let t0 = null, timer = null, noiseTimer = null, done = false, startPt = null;
      stage.innerHTML = `<section class="screen case">
        <div class="scene-wrap"><svg viewBox="0 0 400 300" class="scene interactive live" id="hold-svg">${Scene0815.inner(sceneHTML(cur.sceneName, cur.sceneOpts))}
          <g id="noise-icons" class="noise-icons">${(step.noises || []).map((n, i) => `<g transform="translate(${n.x} ${n.y})"><g class="noise" style="--d:${i * 0.3}s"><circle r="16" fill="#fff" opacity=".85"/><text y="6" text-anchor="middle" font-size="18">${n.icon}</text></g></g>`).join('')}</g>
          <g transform="translate(200 236)"><g class="hold-btn" id="hold-btn"><circle r="46" fill="#F7941D" stroke="#fff" stroke-width="5" class="hold-bg"/><circle r="46" fill="none" stroke="#6DA544" stroke-width="6" id="hold-ring" stroke-dasharray="289" stroke-dashoffset="289" transform="rotate(-90)"/>${Art.hasImg('ico_lauschtrichter') ? `<image href="${Art.IMG.ico_lauschtrichter}" x="-30" y="-30" width="60" height="60"/>` : `<text y="12" text-anchor="middle" font-size="36">👂</text>`}</g></g>
        </svg></div>
        ${bubble(step.intro.who, step.intro.text, 'compact')}
      </section>`;
      wireReplay(step.intro.who, step.intro.text);
      const svg = $('#hold-svg'), ring = $('#hold-ring'), btn = $('#hold-btn');
      const noises = step.noises || [];
      const loud = () => { if (noises.length) { const n = noises[Math.floor(Math.random() * noises.length)]; if (n.sfx && A.sfx[n.sfx]) A.sfx[n.sfx](); } };
      const startNoise = () => { stopNoise(); noiseTimer = setInterval(loud, 650); };
      const stopNoise = () => { if (noiseTimer) clearInterval(noiseTimer); noiseTimer = null; };
      startNoise();
      const cancel = () => { t0 = null; if (timer) cancelAnimationFrame(timer); ring.setAttribute('stroke-dashoffset', 289); btn.classList.remove('holding'); svg.classList.remove('quiet'); if (!done) startNoise(); };
      const tick = () => {
        if (t0 === null) return; const el = performance.now() - t0; const f = Math.min(1, el / NEED);
        ring.setAttribute('stroke-dashoffset', 289 * (1 - f));
        if (f > 0.35) svg.classList.add('quiet');
        if (f > 0.5 && noiseTimer) { stopNoise(); }
        if (f >= 1) { finish(); return; }
        timer = requestAnimationFrame(tick);
      };
      const finish = async () => {
        done = true; stopNoise(); clearIdle(); btn.classList.add('done'); svg.classList.add('quiet');
        await sleep(500); sfx('miau'); await sleep(600);
        stage.querySelector('.bubble-row').outerHTML = bubble(step.done.who, step.done.text, 'compact'); wireReplay(step.done.who, step.done.text);
        sfx('correct'); await say(step.done.text, step.done.who); autoNext();
      };
      svg.addEventListener('pointerdown', ev => { if (done) return; startPt = { x: ev.clientX, y: ev.clientY }; t0 = performance.now(); btn.classList.add('holding'); svg.setPointerCapture(ev.pointerId); clearIdle(); timer = requestAnimationFrame(tick); });
      svg.addEventListener('pointermove', ev => { if (t0 !== null && startPt && Math.hypot(ev.clientX - startPt.x, ev.clientY - startPt.y) > 18) { sfx('wrong'); cancel(); } });
      svg.addEventListener('pointerup', () => { if (!done && t0 !== null) { cancel(); idleHint(); } });
      const idleHint = () => idle(async () => { await say(step.hint || 'Leg den Finger auf den Trichter. Und halt ganz still.', 'leyla'); });
      await say(step.intro.text, step.intro.who); idleHint();
    },

    // ---- Hörsuche: Trichter ziehen, das Geräusch wird lauter, je näher; am Ziel antippen ----
    async listenfind(step) {
      if (step.scene) { cur.sceneName = step.scene.name; cur.sceneOpts = step.scene.opts || {}; }
      const T = step.target; let last = 0, done = false, downPt = null;
      stage.innerHTML = `<section class="screen case">
        <div class="scene-wrap"><svg viewBox="0 0 400 300" class="scene interactive live" id="lf-svg">${Scene0815.inner(sceneHTML(cur.sceneName, cur.sceneOpts))}
          <g id="cone" style="display:none"><circle r="34" fill="#F7941D" opacity=".25"/><circle r="34" fill="none" stroke="#F7941D" stroke-width="3"/>${Art.hasImg('ico_lauschtrichter') ? `<image href="${Art.IMG.ico_lauschtrichter}" x="-22" y="-22" width="44" height="44"/>` : `<text y="9" text-anchor="middle" font-size="26">👂</text>`}<g id="vol"></g></g>
        </svg><div class="vol-bar"><div id="vol-fill"></div></div></div>
        ${bubble(step.intro.who, step.intro.text, 'compact')}
      </section>`;
      wireReplay(step.intro.who, step.intro.text);
      const svg = $('#lf-svg'), cone = $('#cone'), fill = $('#vol-fill');
      const vol = p => Math.max(0, 1 - Math.hypot(T.x - p.x, T.y - p.y) / (step.range || 180));
      const move = ev => {
        const p = svgPoint(svg, ev); cone.style.display = ''; cone.setAttribute('transform', `translate(${p.x} ${p.y})`);
        const v = vol(p); fill.style.width = Math.round(v * 100) + '%'; fill.style.background = v > 0.7 ? '#6DA544' : '#F7941D';
        const now = Date.now(); if (now - last > (1400 - v * 1000)) { last = now; if (A.sfx[step.sfx || 'miau']) A.sfx[step.sfx || 'miau'](0.15 + v * 0.85); }
      };
      svg.addEventListener('pointerdown', ev => { downPt = { x: ev.clientX, y: ev.clientY }; move(ev); svg.setPointerCapture(ev.pointerId); clearIdle(); });
      svg.addEventListener('pointermove', ev => { if (downPt || ev.pointerType === 'mouse') move(ev); });
      svg.addEventListener('pointerup', async ev => {
        if (!downPt || done) return; const moved = Math.hypot(ev.clientX - downPt.x, ev.clientY - downPt.y); downPt = null;
        const p = svgPoint(svg, ev);
        if (Math.hypot(T.x - p.x, T.y - p.y) <= (T.r || 30)) {
          done = true; clearIdle(); sfx('found');
          svg.insertAdjacentHTML('beforeend', `<circle cx="${T.x}" cy="${T.y}" r="${(T.r || 30) + 6}" fill="none" stroke="#6DA544" stroke-width="4"/>${step.foundSvg || ''}`);
          if (step.foundSprite) svg.insertAdjacentHTML('beforeend', Art.sprite(step.foundSprite.name, T.x, T.y, step.foundSprite.h, step.foundSprite.fallback || ''));
          stage.querySelector('.bubble-row').outerHTML = bubble(step.done.who, step.done.text, 'compact'); wireReplay(step.done.who, step.done.text);
          await runCues(step.cue, 'end');
          await say(step.done.text, step.done.who); autoNext();
        } else if (moved <= 25) { sfx('tap'); idleHint(); }
      });
      const idleHint = () => idle(async () => { await say(step.hint || 'Zieh den Trichter über den Hof. Wo ist das Miauen am lautesten? Dort tipp hin.', 'leyla'); });
      await say(step.intro.text, step.intro.who); idleHint();
    },

    // ---- Schablone über den Plan schieben, bis sie einrastet ----
    async align(step) {
      const T = step.target; let pos = { x: step.start.x, y: step.start.y }, grab = null, done = false;
      stage.innerHTML = `<section class="screen case">
        <div class="paper-wrap"><svg viewBox="0 0 300 300" class="paper" id="plan">
          <rect x="4" y="4" width="292" height="292" rx="6" fill="#F3E9C8" stroke="#C9B47E" stroke-width="3"/>
          <g class="plan-lines" stroke="#5A3A22" stroke-width="1.4" fill="none" opacity=".8">${step.plan}</g>
          <g id="cross" style="display:none"><path d="M-7 -7 L7 7 M-7 7 L7 -7" stroke="#B5533C" stroke-width="3"/></g>
          <g id="tmpl" class="template" transform="translate(${pos.x} ${pos.y})">${step.template}</g>
        </svg></div>
        ${bubble(step.intro.who, step.intro.text, 'compact')}
      </section>`;
      wireReplay(step.intro.who, step.intro.text);
      const svg = $('#plan'), tmpl = $('#tmpl');
      svg.addEventListener('pointerdown', ev => { if (done) return; const p = svgPoint(svg, ev); grab = { dx: pos.x - p.x, dy: pos.y - p.y }; svg.setPointerCapture(ev.pointerId); clearIdle(); tmpl.classList.add('drag'); });
      svg.addEventListener('pointermove', ev => { if (!grab || done) return; const p = svgPoint(svg, ev); pos = { x: p.x + grab.dx, y: p.y + grab.dy }; tmpl.setAttribute('transform', `translate(${pos.x} ${pos.y})`); });
      svg.addEventListener('pointerup', async () => {
        if (!grab || done) return; grab = null; tmpl.classList.remove('drag');
        if (Math.hypot(pos.x - T.x, pos.y - T.y) <= (step.snap || 14)) {
          done = true; pos = { x: T.x, y: T.y }; tmpl.setAttribute('transform', `translate(${T.x} ${T.y})`); tmpl.classList.add('snapped'); sfx('click'); await sleep(400);
          $('#cross').style.display = ''; $('#cross').setAttribute('transform', `translate(${step.cross.x} ${step.cross.y})`); $('#cross').classList.add('pop'); sfx('found');
          stage.querySelector('.bubble-row').outerHTML = bubble(step.done.who, step.done.text, 'compact'); wireReplay(step.done.who, step.done.text);
          await say(step.done.text, step.done.who); autoNext();
        } else { sfx('tap'); idleHint(); }
      });
      const idleHint = () => idle(async () => { tmpl.classList.add('hintpulse'); await say(step.hint || 'Schieb den Messingstreifen über den Plan. Bis die Löcher auf die Linien passen.', 'leyla'); });
      await say(step.intro.text, step.intro.who); idleHint();
    },

    // ---- Heft-Eintrag + Opas Zettel ----
    async reward(step, c) {
      clearIdle(); A.music('win');
      if (!state.done.includes(c.id)) state.done.push(c.id);
      state.unlocked = Math.max(state.unlocked, Math.min(CASES.length, c.id + 2)); save();
      const note = step.note || 'Genügend';
      const zIcon = step.zettel && step.zettel.icon ? Art.icon(step.zettel.icon, '', 'zettel-icon') : '';
      stage.innerHTML = `<section class="screen reward">
        <div class="confetti" id="confetti"></div>
        <div class="heft" id="heft">
          <div class="heft-head"><div class="portrait small">${Art.avatar('nino')}</div><div class="heft-num">${c.id + 1}</div><div class="stamp" id="stamp"><span class="stamp-check">✔</span><span class="lbl">ERLEDIGT</span></div></div>
          <div class="heft-lines"><span class="lbl">Fall Nummer ${c.id + 1}: ${esc(c.title)}. Erledigt.</span><span class="lbl">Note: <b>${esc(note)}</b></span></div>
          <div class="reward-stars">${'★'.repeat(3)}</div>
        </div>
        ${step.zettel ? `<div class="zettel" id="zettel"><div class="zettel-from"><div class="portrait small">${Art.avatar('opa')}</div>${zIcon}</div><p class="lbl">${esc(step.zettel.text)}</p><button class="btn-replay" id="zettel-replay" aria-label="Zettel nochmal anhören">🔊</button></div>` : ''}
      </section>`;
      const conf = $('#confetti'); for (let i = 0; i < 40; i++) { const s = document.createElement('i'); s.style.left = Math.random() * 100 + '%'; s.style.animationDelay = Math.random() * 1.5 + 's'; s.style.background = ['#F7941D', '#4FC3E8', '#6DA544', '#F25C7A', '#F7D046'][i % 5]; conf.appendChild(s); }
      const go = () => step.final ? renderEnd() : renderMap(true);
      tapToSkip(go);
      const t0 = stepToken;
      await sleep(300); sfx('stamp'); $('#stamp').classList.add('in'); await sleep(500); sfx('fanfare'); sfx('confetti');
      await say(`Fall Nummer ${c.id + 1}: ${c.title}. Erledigt. Note: ${note}.`, 'nino'); if (t0 !== stepToken) return;
      if (step.zettel) {
        const z = $('#zettel'); z.classList.add('in'); sfx('whoosh'); await sleep(700);
        $('#zettel-replay').onclick = () => { sfx('tap'); say(step.zettel.text, 'opa'); };
        await say(step.zettel.text, 'opa'); if (t0 !== stepToken) return;
      }
      autoNext(go, 1500);
    },
  };

  async function renderEnd() {
    stepToken++; topbar({ title: 'Abspann', back: () => renderMap() }); A.music('win');
    const who = ['nino', 'leyla', 'mila', 'brunner', 'buehler', 'gerber', 'kummer'];
    stage.innerHTML = `<section class="screen end">
      <h2 class="logo small">ALLE FÄLLE<br><span>ERLEDIGT</span></h2>
      <div class="cast">${who.map(w => `<div class="cast-one"><div class="portrait">${Art.avatar(w)}</div><div class="cast-name">${Art.NAMES[w]}</div></div>`).join('')}</div>
      <p class="end-text">Agent 0815 sagt: Danke. Du bist jetzt auch im SGD. Ganz geheim. Alle wissen es.</p>
    </section>`;
    tapToSkip(() => renderMap());
    await say('Alle fünf Fälle erledigt. Du bist jetzt auch im S G D. Ganz geheim. Alle wissen es.', 'nino');
    autoNext(() => renderMap(), 2500);
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
      <p class="small credit">Agent 0815 — Die Fälle von Bärlingen. Spiel zum Buch. Vollversion 1.0</p></div>`;
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

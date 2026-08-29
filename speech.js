/* Agent 0815 — Sprachausgabe (Web Speech API) mit Figurenstimmen */
const Speech0815 = (() => {
  const synth = window.speechSynthesis;
  let voice = null, enabled = true, ready = false, current = null;
  const VOICES = {
    erz:     { pitch: 1.0,  rate: 0.92 },
    nino:    { pitch: 1.25, rate: 1.0 },
    mila:    { pitch: 1.6,  rate: 1.05 },
    leyla:   { pitch: 1.35, rate: 0.98 },
    brunner: { pitch: 0.8,  rate: 0.88 },
    buehler: { pitch: 1.05, rate: 1.08 },
    gerber:  { pitch: 0.9,  rate: 0.85 },
    kummer:  { pitch: 0.65, rate: 0.8 },
    schlatter:{ pitch: 0.95, rate: 0.95 },
    opa:     { pitch: 0.85, rate: 0.85 },
  };
  function pickVoice() {
    if (!synth) return;
    const vs = synth.getVoices();
    if (!vs.length) return;
    const score = v => {
      let s = 0;
      if (/^de[-_]CH/i.test(v.lang)) s += 50;
      else if (/^de/i.test(v.lang)) s += 30;
      if (/Anna|Helena|Petra|Markus|Vicki|Google Deutsch|Katja|Conrad|Amala|Natural|Premium|Enhanced/i.test(v.name)) s += 8;
      if (v.localService) s += 2;
      return s;
    };
    voice = vs.slice().sort((a, b) => score(b) - score(a))[0] || null;
    ready = true;
  }
  if (synth) { pickVoice(); synth.onvoiceschanged = pickVoice; }

  // ---------- Aufgenommene Stimmen (Gemini TTS) ----------
  const VOICE_DIR = './'; const VOICE_MANIFEST = './voice_manifest.json';
  let manifest = null, currentAudio = null, gen = 0;
  const missing = new Set();
  // Manifest wird abgewartet, bevor entschieden wird (sonst greift beim ersten Satz das Geräte-TTS)
  const manifestReady = fetch(VOICE_MANIFEST).then(r => r.ok ? r.json() : null).then(m => { manifest = m; }).catch(() => { manifest = null; });
  function playFile(file, myGen) {
    return new Promise(resolve => {
      const a = new Audio(VOICE_DIR + file); currentAudio = a;
      let done = false;
      const fin = ok => { if (done) return; done = true; if (currentAudio === a) currentAudio = null; resolve(ok); };
      a.onended = () => fin(true);
      a.onerror = () => fin(false);
      // Wird der Satz von einem neueren unterbrochen, sauber (ohne Fallback) beenden
      a.onpause = () => { if (!a.ended && myGen !== gen) fin(true); };
      a.play().catch(() => fin(false));
    });
  }
  function clean(t) { return t.replace(/[«»*_]/g, '').replace(/—/g, ', ').replace(/\bSGD\b/g, 'S G D').replace(/0815/g, 'null acht fünfzehn'); }

  async function speak(text, who = 'erz') {
    if (!enabled) return;
    stop();                       // nie zwei Stimmen gleichzeitig: alles Laufende abbrechen
    const myGen = gen;
    await manifestReady;
    if (myGen !== gen) return;    // inzwischen kam ein neuerer Satz
    const key = who + '|' + text;
    if (manifest && manifest[key]) {
      const ok = await playFile(manifest[key], myGen);
      if (ok || myGen !== gen) return;
      // Datei nicht abspielbar (z. B. Netz) -> Fallback nur, wenn noch aktuell
    } else if (manifest) {
      if (!missing.has(key)) { missing.add(key); console.warn('[Agent 0815] keine Aufnahme für:', key); }
    }
    return speakTTS(text, who, myGen);
  }
  function speakTTS(text, who = 'erz', myGen = gen) {
    return new Promise(resolve => {
      if (!synth || !enabled || myGen !== gen) { resolve(); return; }
      if (!ready) pickVoice();
      try { synth.cancel(); } catch (e) {}
      const u = new SpeechSynthesisUtterance(clean(text));
      u.volume = 1;
      const p = VOICES[who] || VOICES.erz;
      u.pitch = p.pitch; u.rate = p.rate; u.lang = voice ? voice.lang : 'de-CH';
      if (voice) u.voice = voice;
      let done = false;
      const finish = () => { if (done) return; done = true; current = null; resolve(); };
      u.onend = finish; u.onerror = finish;
      current = u;
      // Sicherheitsnetz: manche Browser feuern onend nicht
      const est = 600 + clean(text).length * 75 / p.rate;
      setTimeout(finish, est + 1500);
      setTimeout(() => { if (current === u && myGen === gen) { try { synth.speak(u); } catch (e) { finish(); } } else finish(); }, 60);
    });
  }
  function stop() { gen++; if (synth) { try { synth.cancel(); } catch (e) {} } current = null; if (currentAudio) { const a = currentAudio; currentAudio = null; try { a.pause(); } catch (e) {} } }
  function setEnabled(on) { enabled = on; if (!on) stop(); }
  function missingLines() { return [...missing]; }
  function available() { return !!synth || !!manifest; }
  // iOS: Stimmen laden erst nach einer Nutzergeste
  function warmup() { if (!synth) return; try { pickVoice(); const u = new SpeechSynthesisUtterance(' '); u.volume = 0; synth.speak(u); } catch (e) {} }
  return { speak, stop, setEnabled, available, warmup, missingLines, get enabled() { return enabled; }, get voiceName() { return manifest ? 'Aufnahmen (Gemini TTS)' + (synth ? ', Fallback ' + (voice ? voice.name : 'Gerät') : '') : voice ? voice.name + ' (' + voice.lang + ')' : '—'; } };
})();

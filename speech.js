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

  function clean(t) { return t.replace(/[«»*_]/g, '').replace(/—/g, ', ').replace(/\bSGD\b/g, 'S G D').replace(/0815/g, 'null acht fünfzehn'); }

  function speak(text, who = 'erz') {
    return new Promise(resolve => {
      if (!synth || !enabled) { resolve(); return; }
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
      setTimeout(() => { if (current === u) { try { synth.speak(u); } catch (e) { finish(); } } }, 60);
    });
  }
  function stop() { if (synth) { try { synth.cancel(); } catch (e) {} } current = null; }
  function setEnabled(on) { enabled = on; if (!on) stop(); }
  function available() { return !!synth; }
  // iOS: Stimmen laden erst nach einer Nutzergeste
  function warmup() { if (!synth) return; try { pickVoice(); const u = new SpeechSynthesisUtterance(' '); u.volume = 0; synth.speak(u); } catch (e) {} }
  return { speak, stop, setEnabled, available, warmup, get enabled() { return enabled; }, get voiceName() { return voice ? voice.name + ' (' + voice.lang + ')' : '—'; } };
})();

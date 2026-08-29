/* Agent 0815 — Audio-Engine (Web Audio, prozedural, keine externen Dateien) */
const Audio0815 = (() => {
  let ctx = null, master = null, musicGain = null, sfxGain = null;
  let musicTimer = null, musicMode = null, musicOn = true, sfxOn = true;
  let step = 0;

  function ensure() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return ctx; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch (e) { return null; }
    master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    musicGain = ctx.createGain(); musicGain.gain.value = musicOn ? 0.28 : 0; musicGain.connect(master);
    sfxGain = ctx.createGain(); sfxGain.gain.value = sfxOn ? 0.8 : 0; sfxGain.connect(master);
    return ctx;
  }

  // ---------- Grundbausteine ----------
  function tone({ freq = 440, type = 'sine', dur = 0.3, vol = 0.5, attack = 0.01, release = 0.1, dest, start = 0, slide = null, filter = null }) {
    if (!ensure()) return;
    const t0 = ctx.currentTime + start;
    const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + attack);
    g.gain.setValueAtTime(vol, t0 + Math.max(attack, dur - release));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    let node = o;
    if (filter) { const f = ctx.createBiquadFilter(); f.type = filter.type || 'lowpass'; f.frequency.value = filter.freq || 1200; f.Q.value = filter.q || 1; o.connect(f); node = f; }
    node.connect(g); g.connect(dest || sfxGain);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  function noise({ dur = 0.2, vol = 0.3, start = 0, filterFreq = 1000, type = 'bandpass', dest }) {
    if (!ensure()) return;
    const t0 = ctx.currentTime + start;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = filterFreq; f.Q.value = 0.8;
    const g = ctx.createGain(); g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(dest || sfxGain); src.start(t0);
  }

  // ---------- SFX ----------
  const N = { C4: 261.6, D4: 293.7, E4: 329.6, F4: 349.2, G4: 392, A4: 440, B4: 493.9, C5: 523.3, D5: 587.3, E5: 659.3, G5: 784, A5: 880, C6: 1046.5, E6: 1318.5 };
  const sfx = {
    tap() { tone({ freq: 880, type: 'sine', dur: 0.08, vol: 0.25, slide: 1200 }); },
    pop() { tone({ freq: 300, type: 'sine', dur: 0.12, vol: 0.4, slide: 900 }); },
    correct() { [N.C5, N.E5, N.G5, N.C6].forEach((f, i) => tone({ freq: f, type: 'triangle', dur: 0.35, vol: 0.35, start: i * 0.09 })); },
    fanfare() {
      [N.C5, N.E5, N.G5, N.C6, N.G5, N.C6].forEach((f, i) => tone({ freq: f, type: 'triangle', dur: 0.4, vol: 0.35, start: i * 0.12 }));
      [N.C4, N.G4, N.C5].forEach((f, i) => tone({ freq: f, type: 'sine', dur: 0.9, vol: 0.25, start: 0.6 + i * 0.02 }));
    },
    wrong() { tone({ freq: 330, type: 'sine', dur: 0.18, vol: 0.3 }); tone({ freq: 262, type: 'sine', dur: 0.3, vol: 0.3, start: 0.16 }); },
    found() { tone({ freq: N.A5, type: 'sine', dur: 0.15, vol: 0.3 }); tone({ freq: N.E6, type: 'sine', dur: 0.3, vol: 0.3, start: 0.1 }); noise({ dur: 0.15, vol: 0.08, filterFreq: 6000 }); },
    whoosh() { noise({ dur: 0.35, vol: 0.25, filterFreq: 1500, type: 'bandpass' }); },
    stamp() { noise({ dur: 0.08, vol: 0.5, filterFreq: 400, type: 'lowpass' }); tone({ freq: 90, type: 'square', dur: 0.12, vol: 0.3, slide: 40 }); },
    bonk() { tone({ freq: 180, type: 'square', dur: 0.15, vol: 0.3, slide: 60, filter: { freq: 600 } }); },
    klack() { noise({ dur: 0.05, vol: 0.4, filterFreq: 3000 }); tone({ freq: 1500, type: 'square', dur: 0.04, vol: 0.15 }); },
    splash() { noise({ dur: 0.5, vol: 0.35, filterFreq: 900, type: 'bandpass' }); tone({ freq: 500, type: 'sine', dur: 0.3, vol: 0.2, slide: 150 }); },
    bell() { [N.C6, N.E6, 2093, 2637].forEach((f, i) => tone({ freq: f, type: 'sine', dur: 1.6 - i * 0.2, vol: 0.28 / (i + 1), release: 1.2 })); },
    quack(pitch = 1) {
      tone({ freq: 380 * pitch, type: 'sawtooth', dur: 0.18, vol: 0.28, slide: 250 * pitch, filter: { type: 'bandpass', freq: 900 * pitch, q: 2 } });
      tone({ freq: 360 * pitch, type: 'sawtooth', dur: 0.14, vol: 0.22, start: 0.2, slide: 230 * pitch, filter: { type: 'bandpass', freq: 850 * pitch, q: 2 } });
    },
    quack3() { sfx.quack(1); setTimeout(() => sfx.quack(1.15), 300); setTimeout(() => sfx.quack(0.9), 600); },
    trombone() { tone({ freq: 150, type: 'sawtooth', dur: 0.9, vol: 0.3, slide: 95, filter: { freq: 700, q: 3 } }); tone({ freq: 152, type: 'square', dur: 0.9, vol: 0.12, slide: 96, filter: { freq: 500 } }); },
    horn() { tone({ freq: 440, type: 'square', dur: 0.35, vol: 0.2, filter: { freq: 1200 } }); tone({ freq: 554, type: 'square', dur: 0.35, vol: 0.2, filter: { freq: 1200 } }); },
    miau(v = 1) { tone({ freq: 750, type: 'sawtooth', dur: 0.45, vol: 0.16 * v, slide: 1000, filter: { type: 'bandpass', freq: 1500, q: 4 } }); tone({ freq: 1000, type: 'sawtooth', dur: 0.3, vol: 0.12 * v, start: 0.45, slide: 650, filter: { type: 'bandpass', freq: 1400, q: 4 } }); },
    noiseburst(v = 1) { noise({ dur: 0.25, vol: 0.25 * v, filterFreq: 800 + Math.random() * 3000, type: 'bandpass' }); tone({ freq: 200 + Math.random() * 600, type: 'square', dur: 0.15, vol: 0.08 * v, filter: { freq: 1500 } }); },
    fly() { tone({ freq: 220, type: 'sawtooth', dur: 0.6, vol: 0.06, slide: 260, filter: { type: 'bandpass', freq: 1800, q: 6 } }); },
    sneeze() { noise({ dur: 0.08, vol: 0.3, filterFreq: 2500, type: 'highpass' }); tone({ freq: 500, type: 'sawtooth', dur: 0.25, vol: 0.2, start: 0.08, slide: 180, filter: { freq: 1200 } }); },
    fridge() { tone({ freq: 60, type: 'sawtooth', dur: 0.8, vol: 0.08, filter: { freq: 200 } }); },
    dig() { noise({ dur: 0.18, vol: 0.3, filterFreq: 600, type: 'lowpass' }); noise({ dur: 0.1, vol: 0.15, start: 0.12, filterFreq: 2500, type: 'highpass' }); },
    click() { tone({ freq: 1200, type: 'square', dur: 0.03, vol: 0.2 }); tone({ freq: 700, type: 'square', dur: 0.04, vol: 0.15, start: 0.05 }); },
    uv() { tone({ freq: 1600, type: 'sine', dur: 0.4, vol: 0.06, slide: 2400 }); },
    creak() { tone({ freq: 180, type: 'sawtooth', dur: 0.5, vol: 0.12, slide: 120, filter: { type: 'bandpass', freq: 900, q: 5 } }); },
    drip() { tone({ freq: 1400, type: 'sine', dur: 0.08, vol: 0.2, slide: 900 }); tone({ freq: 1800, type: 'sine', dur: 0.12, vol: 0.12, start: 0.18, slide: 1100 }); },
    whistle() { tone({ freq: 2600, type: 'square', dur: 0.5, vol: 0.12, filter: { freq: 4000 } }); tone({ freq: 2900, type: 'square', dur: 0.5, vol: 0.08, filter: { freq: 4000 } }); },
    brakes() { noise({ dur: 0.7, vol: 0.25, filterFreq: 3500, type: 'bandpass' }); tone({ freq: 3000, type: 'sawtooth', dur: 0.6, vol: 0.08, slide: 2600, filter: { type: 'bandpass', freq: 3200, q: 8 } }); },
    cat() { tone({ freq: 700, type: 'sawtooth', dur: 0.5, vol: 0.18, slide: 1100, filter: { type: 'bandpass', freq: 1500, q: 4 } }); tone({ freq: 1100, type: 'sawtooth', dur: 0.3, vol: 0.15, start: 0.5, slide: 600, filter: { type: 'bandpass', freq: 1400, q: 4 } }); },
    ring() { [0, 0.12, 0.24].forEach(s => tone({ freq: 2200, type: 'sine', dur: 0.1, vol: 0.25, start: s })); },
    rub() { noise({ dur: 0.12, vol: 0.12, filterFreq: 2500, type: 'highpass' }); },
    knock() { [0, 0.22, 0.44].forEach(st => { noise({ dur: 0.06, vol: 0.5, start: st, filterFreq: 500, type: 'lowpass' }); tone({ freq: 140, type: 'square', dur: 0.08, vol: 0.25, start: st, slide: 70 }); }); },
    knock1() { noise({ dur: 0.06, vol: 0.5, filterFreq: 500, type: 'lowpass' }); tone({ freq: 140, type: 'square', dur: 0.08, vol: 0.25, slide: 70 }); },
    screw() { for (let i = 0; i < 4; i++) { noise({ dur: 0.05, vol: 0.2, start: i * 0.07, filterFreq: 2500, type: 'highpass' }); tone({ freq: 900 + i * 120, type: 'square', dur: 0.05, vol: 0.08, start: i * 0.07 }); } tone({ freq: 1800, type: 'sine', dur: 0.15, vol: 0.15, start: 0.3 }); },
    klirr() { for (let i = 0; i < 5; i++) tone({ freq: 2400 + Math.random() * 1500, type: 'triangle', dur: 0.12, vol: 0.12, start: i * 0.06 }); },
    muh() { tone({ freq: 160, type: 'sawtooth', dur: 0.9, vol: 0.25, slide: 120, filter: { freq: 500, q: 2 } }); tone({ freq: 240, type: 'sine', dur: 0.9, vol: 0.12, slide: 180 }); },
    car() { tone({ freq: 70, type: 'sawtooth', dur: 0.5, vol: 0.3, slide: 110, filter: { freq: 400 } }); tone({ freq: 70, type: 'sawtooth', dur: 0.5, vol: 0.3, start: 0.6, slide: 110, filter: { freq: 400 } }); tone({ freq: 70, type: 'sawtooth', dur: 0.7, vol: 0.3, start: 1.2, slide: 40, filter: { freq: 400 } }); },
    tick() { tone({ freq: 2000, type: 'square', dur: 0.03, vol: 0.12 }); },
    confetti() { for (let i = 0; i < 8; i++) tone({ freq: 800 + Math.random() * 1200, type: 'sine', dur: 0.15, vol: 0.12, start: i * 0.05 }); },
  };

  // ---------- Musik (Loop-Sequencer) ----------
  const scales = {
    map: { bpm: 112, bass: [N.C4, N.G4, N.A4, N.F4].map(f => f / 2), mel: [N.E5, N.G5, N.C6, N.G5, N.A5, N.G5, N.E5, N.D5], type: 'triangle' },
    case: { bpm: 96, bass: [N.A4 / 2, N.A4 / 2, N.F4 / 2, N.G4 / 2], mel: [N.A4, N.C5, N.E5, N.C5, N.A4, N.E5, N.D5, N.C5], type: 'sine', minor: true },
    win: { bpm: 124, bass: [N.C4 / 2, N.F4 / 2, N.G4 / 2, N.C4 / 2], mel: [N.C5, N.E5, N.G5, N.E5, N.C6, N.G5, N.E5, N.G5], type: 'triangle' },
  };
  function scheduleBar(cfg) {
    const beat = 60 / cfg.bpm;
    const bar = step % 4;
    tone({ freq: cfg.bass[bar], type: 'sine', dur: beat * 1.8, vol: 0.5, dest: musicGain, attack: 0.02, release: 0.4 });
    for (let i = 0; i < 8; i++) {
      const f = cfg.mel[(i + bar * 2) % cfg.mel.length];
      if ((i + bar) % 5 === 4) continue; // kleine Lücken für Luft
      tone({ freq: f, type: cfg.type, dur: beat * 0.45, vol: 0.22, dest: musicGain, start: i * beat / 2, attack: 0.005, release: 0.15, filter: { freq: 2500 } });
    }
    // sanftes Perkussions-Tick
    for (let i = 0; i < 4; i++) noise({ dur: 0.04, vol: 0.05, start: i * beat, filterFreq: 5000, type: 'highpass', dest: musicGain });
    step++;
  }
  function music(mode) {
    if (!ensure()) return;
    if (mode === musicMode) return;
    stopMusic();
    if (!mode) return;
    musicMode = mode; step = 0;
    const cfg = scales[mode];
    const barMs = (60 / cfg.bpm) * 4 * 1000;
    scheduleBar(cfg);
    musicTimer = setInterval(() => scheduleBar(cfg), barMs);
  }
  function stopMusic() { if (musicTimer) clearInterval(musicTimer); musicTimer = null; musicMode = null; }
  function setMusic(on) { musicOn = on; if (musicGain) musicGain.gain.setTargetAtTime(on ? 0.28 : 0, ctx.currentTime, 0.05); }
  function setSfx(on) { sfxOn = on; if (sfxGain) sfxGain.gain.setTargetAtTime(on ? 0.8 : 0, ctx.currentTime, 0.05); }
  function duck(on) { if (musicGain) musicGain.gain.setTargetAtTime(musicOn ? (on ? 0.1 : 0.28) : 0, ctx.currentTime, 0.1); }

  return { ensure, sfx, music, stopMusic, setMusic, setSfx, duck, get musicOn() { return musicOn; }, get sfxOn() { return sfxOn; } };
})();

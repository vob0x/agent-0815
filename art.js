/* Agent 0815 — Figuren & Kulissen als Inline-SVG */
const Art = (() => {
  const SKIN = { a: '#F6C9A5', b: '#E8B28C', c: '#D9A07A', d: '#C58B66' };

  // ---------- Grund-Kopf ----------
  function head({ skin = SKIN.a, hair = '', extra = '', mouth = 'smile', eyes = 'open', brows = '', body = '#4FC3E8', bodyExtra = '', blush = true }) {
    const mouths = {
      smile: `<path d="M48 76 Q60 88 72 76" stroke="#7A3B2E" stroke-width="3" fill="none" stroke-linecap="round"/>`,
      big: `<path d="M44 74 Q60 96 76 74 Z" fill="#7A3B2E"/><path d="M50 78 Q60 86 70 78 Z" fill="#F98CA1"/>`,
      flat: `<path d="M50 80 L70 80" stroke="#7A3B2E" stroke-width="3" stroke-linecap="round"/>`,
      o: `<ellipse cx="60" cy="80" rx="6" ry="8" fill="#7A3B2E"/>`,
      grin: `<path d="M46 76 Q60 90 74 76" stroke="#7A3B2E" stroke-width="3" fill="#fff" stroke-linecap="round"/>`,
      sad: `<path d="M50 84 Q60 76 70 84" stroke="#7A3B2E" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    };
    const eyeSet = {
      open: `<circle cx="46" cy="60" r="5" fill="#2B2B2B"/><circle cx="74" cy="60" r="5" fill="#2B2B2B"/><circle cx="48" cy="58" r="1.8" fill="#fff"/><circle cx="76" cy="58" r="1.8" fill="#fff"/>`,
      happy: `<path d="M40 62 Q46 54 52 62" stroke="#2B2B2B" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M68 62 Q74 54 80 62" stroke="#2B2B2B" stroke-width="3" fill="none" stroke-linecap="round"/>`,
      none: '',
      squint: `<path d="M41 60 L51 60" stroke="#2B2B2B" stroke-width="3.5" stroke-linecap="round"/><path d="M69 60 L79 60" stroke="#2B2B2B" stroke-width="3.5" stroke-linecap="round"/>`,
    };
    return `<svg viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg" class="avatar">
      <g class="av-body"><path d="M22 130 Q22 96 60 96 Q98 96 98 130 Z" fill="${body}"/>${bodyExtra}</g>
      <g class="av-head">
        <ellipse cx="60" cy="62" rx="34" ry="36" fill="${skin}"/>
        <ellipse cx="26" cy="64" rx="6" ry="8" fill="${skin}"/><ellipse cx="94" cy="64" rx="6" ry="8" fill="${skin}"/>
        ${blush ? `<circle cx="38" cy="74" r="6" fill="#F98CA1" opacity=".45"/><circle cx="82" cy="74" r="6" fill="#F98CA1" opacity=".45"/>` : ''}
        ${eyeSet[eyes] || eyeSet.open}
        ${brows}
        ${mouths[mouth] || mouths.smile}
        ${hair}
        ${extra}
      </g>
    </svg>`;
  }

  const chars = {
    generic: () => `<svg viewBox="-40 -40 80 80" class="avatar"><circle r="38" fill="#DDE7EE"/><circle cy="-8" r="14" fill="#9AA0A8"/><path d="M-26 34 Q0 2 26 34 Z" fill="#9AA0A8"/></svg>`,
    nino: () => head({
      skin: SKIN.b,
      hair: `<path d="M25 54 Q24 18 60 18 Q96 18 95 54 Q84 36 66 40 Q58 30 50 40 Q38 36 25 54 Z" fill="#5A3A22"/><path d="M44 26 L40 14 L52 24 Z" fill="#5A3A22"/><path d="M68 24 L74 12 L78 26 Z" fill="#5A3A22"/>`,
      eyes: 'none',
      extra: `<g class="brille"><path d="M30 56 L90 56" stroke="#F2B233" stroke-width="3"/><path d="M33 54 Q33 74 46 74 Q59 74 58 56 Z" fill="#2B2B2B" stroke="#F2B233" stroke-width="3"/><path d="M62 56 Q61 74 74 74 Q87 74 87 54 Z" fill="#2B2B2B" stroke="#F2B233" stroke-width="3"/><path d="M40 60 Q44 58 50 60" stroke="#fff" stroke-width="2" opacity=".6"/><path d="M68 60 Q72 58 78 60" stroke="#fff" stroke-width="2" opacity=".6"/></g>`,
      mouth: 'smile', body: '#6DA544',
      bodyExtra: `<rect x="44" y="104" width="10" height="10" rx="2" fill="#4C7A2E"/><rect x="66" y="104" width="10" height="10" rx="2" fill="#4C7A2E"/><path d="M60 96 L60 130" stroke="#4C7A2E" stroke-width="3"/>`,
    }),
    mila: () => head({
      skin: SKIN.a,
      hair: `<path d="M26 56 Q26 24 60 24 Q94 24 94 56 Q80 40 60 42 Q40 40 26 56 Z" fill="#E9B44C"/><circle cx="22" cy="70" r="9" fill="#E9B44C"/><circle cx="98" cy="70" r="9" fill="#E9B44C"/><circle cx="22" cy="70" r="3" fill="#F25C7A"/><circle cx="98" cy="70" r="3" fill="#F25C7A"/>`,
      extra: `<path d="M64 84 Q70 90 74 86" stroke="#6B3A1E" stroke-width="4" stroke-linecap="round" opacity=".8"/>`,
      mouth: 'big', body: '#F25C7A',
      bodyExtra: `<path d="M44 100 Q60 116 76 100" stroke="#333" stroke-width="2" fill="none"/><rect x="48" y="108" width="10" height="12" rx="3" fill="#333"/><rect x="62" y="108" width="10" height="12" rx="3" fill="#333"/><rect x="58" y="110" width="4" height="6" fill="#333"/>`,
    }),
    leyla: () => head({
      skin: SKIN.c,
      hair: `<path d="M24 56 Q24 20 60 20 Q96 20 96 56 Q86 40 60 40 Q34 40 24 56 Z" fill="#2A1B12"/><path d="M92 50 Q108 60 100 92 Q96 70 88 62 Z" fill="#2A1B12"/>`,
      brows: `<path d="M38 50 L52 48" stroke="#2A1B12" stroke-width="3" stroke-linecap="round"/><path d="M68 46 L82 50" stroke="#2A1B12" stroke-width="3" stroke-linecap="round"/>`,
      mouth: 'smile', body: '#8E5BD1',
    }),
    brunner: () => head({
      skin: SKIN.a,
      hair: `<path d="M22 50 Q22 26 60 26 Q98 26 98 50 L98 44 Q60 30 22 44 Z" fill="#2F5DA8"/><rect x="18" y="44" width="84" height="10" rx="4" fill="#1F3F78"/><circle cx="60" cy="38" r="6" fill="#F2B233"/>`,
      extra: `<path d="M44 72 Q60 66 76 72 Q60 80 44 72 Z" fill="#6B4A2E"/>`,
      mouth: 'o', body: '#2F5DA8', blush: true,
      bodyExtra: `<circle cx="60" cy="112" r="5" fill="#F2B233"/>`,
    }),
    buehler: () => head({
      skin: SKIN.a,
      hair: `<path d="M20 48 Q18 14 60 14 Q102 14 100 48 Q90 30 60 30 Q30 30 20 48 Z" fill="#fff" stroke="#DDD"/><ellipse cx="60" cy="18" rx="36" ry="12" fill="#fff" stroke="#DDD"/>`,
      extra: `<circle cx="40" cy="68" r="3" fill="#fff"/><circle cx="84" cy="52" r="2.5" fill="#fff"/><circle cx="76" cy="84" r="2" fill="#fff"/>`,
      mouth: 'grin', eyes: 'happy', body: '#fff',
      bodyExtra: `<path d="M36 130 L40 100 L80 100 L84 130 Z" fill="#F2F2F2"/><path d="M40 100 L80 100" stroke="#DDD"/><ellipse cx="60" cy="116" rx="6" ry="3" fill="#F2B233"/>`,
    }),
    buehler_falsch: () => head({
      skin: SKIN.a,
      hair: `<path d="M20 48 Q18 14 60 14 Q102 14 100 48 Q90 30 60 30 Q30 30 20 48 Z" fill="#fff" stroke="#DDD"/><ellipse cx="60" cy="18" rx="36" ry="12" fill="#fff" stroke="#DDD"/>`,
      extra: `<path d="M42 72 Q60 64 78 72 Q60 78 42 72 Z" fill="#2B2B2B"/>`,
      mouth: 'flat', eyes: 'squint', body: '#fff',
      bodyExtra: `<path d="M36 130 L40 100 L80 100 L84 130 Z" fill="#F2F2F2"/><path d="M40 100 L80 100" stroke="#DDD"/>`,
    }),
    gerber: () => head({
      skin: SKIN.a,
      hair: `<path d="M26 54 Q26 26 60 26 Q94 26 94 54 Q80 40 60 40 Q40 40 26 54 Z" fill="#C9C9C9"/><circle cx="60" cy="24" r="12" fill="#C9C9C9"/>`,
      extra: `<circle cx="46" cy="60" r="10" fill="none" stroke="#7A5C3A" stroke-width="2.5"/><circle cx="74" cy="60" r="10" fill="none" stroke="#7A5C3A" stroke-width="2.5"/><path d="M56 60 L64 60" stroke="#7A5C3A" stroke-width="2.5"/>`,
      mouth: 'flat', body: '#B85C38',
      bodyExtra: `<rect x="78" y="100" width="18" height="16" rx="3" fill="#fff" stroke="#999"/><path d="M96 104 Q104 108 96 112" stroke="#999" fill="none" stroke-width="2"/>`,
    }),
    kummer: () => head({
      skin: SKIN.b,
      hair: `<path d="M20 50 Q24 28 60 28 Q96 28 100 50 L104 52 L16 52 Z" fill="#6E6E6E"/><ellipse cx="60" cy="38" rx="42" ry="12" fill="#5C5C5C"/>`,
      brows: `<path d="M38 50 L52 52" stroke="#444" stroke-width="3.5" stroke-linecap="round"/><path d="M68 52 L82 50" stroke="#444" stroke-width="3.5" stroke-linecap="round"/>`,
      mouth: 'flat', body: '#5B7A99', blush: false,
      bodyExtra: `<circle cx="84" cy="112" r="8" fill="none" stroke="#C9A227" stroke-width="3"/><path d="M84 120 L84 130 M80 126 L84 126" stroke="#C9A227" stroke-width="3"/>`,
    }),
    schlatter: () => head({
      skin: SKIN.a,
      hair: `<path d="M26 50 Q28 24 60 24 Q92 24 94 50 Q86 36 60 38 Q34 36 26 50 Z" fill="#222"/>`,
      extra: `<path d="M42 72 Q60 66 78 72" stroke="#222" stroke-width="5" stroke-linecap="round" fill="none"/>`,
      mouth: 'grin', eyes: 'squint', body: '#8B6F47', blush: false,
      bodyExtra: `<rect x="70" y="104" width="24" height="18" rx="3" fill="#5A3A22"/><rect x="78" y="100" width="8" height="4" fill="#5A3A22"/>`,
    }),
    opa: () => head({
      skin: SKIN.a,
      hair: `<path d="M28 50 Q36 32 60 34 Q84 32 92 50 Q84 44 60 44 Q36 44 28 50 Z" fill="#E0E0E0"/>`,
      extra: `<circle cx="46" cy="60" r="9" fill="none" stroke="#555" stroke-width="2"/><circle cx="74" cy="60" r="9" fill="none" stroke="#555" stroke-width="2"/><path d="M40 84 Q60 78 80 84" stroke="#E0E0E0" stroke-width="5" stroke-linecap="round" fill="none"/>`,
      mouth: 'smile', eyes: 'happy', body: '#7A5C3A',
    }),
  };

  // ---------- Bild-Assets (Gemini-Illustrationen), Fallback: SVG ----------
  const IMG = {}; const RATIO = {};
  const IMG_FILES = {
    nino: './fig_nino.png', mila: './fig_mila.png', leyla: './fig_leyla.png', brunner: './fig_brunner.png', buehler: './fig_buehler.png',
    buehler_falsch: './fig_buehler_bruder.png', nino_brille: './fig_nino_brille.png', gerber: './fig_gerber.png', kummer: './fig_kummer.png', schlatter: './fig_schlatter.png', opa: './fig_opa.png',
    scene_marktplatz: './scene_marktplatz.jpg', scene_baeckerei: './scene_baeckerei.jpg', scene_see: './scene_see.jpg', scene_schule: './scene_schule.jpg', scene_gartenhaus: './scene_gartenhaus.jpg',
    karte: './karte.jpg', enten: './enten.png',
    ...Object.fromEntries(['glocke','gipfeli','schraubenzieher','koffer','kaffee','schraube','katze','posaune','postauto','zahnrad','lupe','mappe','velo_a','velo_b','velo_c','velo_d'].map(n => ['ico_' + n, `./ico_${n}.png`])),
  };
  // Icon als <img> (Bild) oder SVG-Fallback
  function icon(name, fallbackSvg, cls = 'card-icon') {
    if (IMG['ico_' + name]) return `<img class="${cls} icon-img" src="${IMG['ico_' + name]}" alt="" draggable="false">`;
    return `<svg viewBox="-40 -40 80 80" class="${cls}">${fallbackSvg || ''}</svg>`;
  }
  // Sprite in einer Kulisse (SVG-Koordinaten 400x300): Bild oder SVG-Fallback
  function sprite(name, x, y, h, fallbackSvg, extraAttr = '') {
    const key = name === 'enten' ? 'enten' : 'ico_' + name;
    if (IMG[key]) { const ratio = RATIO[key] || SPRITE_RATIO[name] || 1.3; const w = h * ratio; return `<image href="${IMG[key]}" x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" ${extraAttr}/>`; }
    return fallbackSvg || '';
  }
  const SPRITE_RATIO = { silberglocke: 0.92, lupe_sprung: 0.91, eckengucker: 0.94, muenzen: 0.94, notizbuch: 1.06, lieferwagen: 1.79, auto_rost: 1.88, sonnenbrille: 2.35, feldstecher: 1.55, enten_schwimmen: 2.455, glocke: 1.08, gipfeli: 1.39, schraubenzieher: 2.02, koffer: 1.14, kaffee: 1.43, schraube: 0.89, katze: 0.91, posaune: 2.14, postauto: 2.4, zahnrad: 1.0, lupe: 1.04, mappe: 1.14, velo_a: 1.57, velo_b: 1.57, velo_c: 1.57, velo_d: 1.65, enten: 2.115 };
  // Figuren/Icons werden mit der App ausgeliefert: sofort als vorhanden registrieren (kein Rennen gegen
  // einen Lade-Timeout, das auf langsamen Netzen die alten SVG-Figuren zeigte). Vorladen mit grosszügigem Timeout.
  Object.assign(IMG, IMG_FILES);
  // Neue Vollversions-Assets: erst nach erfolgreichem Laden registrieren (Datei fehlt evtl. noch)
  const IMG_OPTIONAL = {
    scene_werkstatt: './scene_werkstatt.jpg', scene_schlatter: './scene_schlatter.jpg', scene_schulflur: './scene_schulflur.jpg',
    scene_markt: './scene_markt.jpg', scene_hinterhof: './scene_hinterhof.jpg', scene_kirchplatz: './scene_kirchplatz.jpg', scene_museum: './scene_museum.jpg', scene_anschlagbrett: './scene_anschlagbrett.jpg', scene_gemeinde: './scene_gemeinde.jpg',
    enten_schwimmen: './enten_schwimmen.png', katze: './fig_katze.png', ico_katze: './fig_katze.png', ico_kuh: './ico_kuh.png',
    imhof: './fig_imhof.png', zuercher: './fig_zuercher.png', andermatt: './fig_andermatt.png', mama: './fig_mama.png', vogel: './fig_vogel.png', luca: './fig_luca.png', frau1: './fig_frau1.png', frau2: './fig_frau2.png', oezcan: './fig_oezcan.png',
    ...Object.fromEntries(['silberglocke','lieferwagen','auto_rost','muenzen','notizbuch','lupe_sprung','eckengucker','lauschtrichter','generalschluessel','nachtbrille','kasse','schachtel','spaten','kiste','taschenuhr','draht','zettel','pinsel','farbeimer','sonnenbrille','feldstecher','trillerpfeife'].map(n => ['ico_' + n, `./ico_${n}.png`])),
  };
  function probeImages(timeout = 8000) {
    const all = Object.entries(IMG_FILES).map(([k, src]) => new Promise(res => { const i = new Image(); i.onload = () => { RATIO[k] = i.naturalWidth / i.naturalHeight; res(); }; i.onerror = () => { delete IMG[k]; res(); }; i.src = src; }));
    const opt = Object.entries(IMG_OPTIONAL).map(([k, src]) => new Promise(res => { const i = new Image(); i.onload = () => { IMG[k] = src; RATIO[k] = i.naturalWidth / i.naturalHeight; res(); }; i.onerror = res; i.src = src; }));
    return Promise.race([Promise.all(all.concat(opt)), new Promise(r => setTimeout(r, timeout))]);
  }
  // Bei Ladefehler eines Figurenbilds: SVG-Fallback einsetzen
  function imgFail(el) { const n = el.dataset.fig; delete IMG[n]; const svg = (chars[n] || chars.generic)(); el.insertAdjacentHTML('afterend', svg); el.remove(); }
  function avatar(name) {
    if (name === 'erz') return `<img class="avatar avatar-img avatar-erz" src="${IMG.ico_lupe || ''}" alt="Erzähler" draggable="false">`;
    if (IMG[name]) return `<img class="avatar avatar-img" data-fig="${name}" src="${IMG[name]}" alt="${NAMES[name] || name}" draggable="false" onerror="Art.imgFail(this)">`;
    return (chars[name] || chars.generic)();
  }
  function hasImg(k) { return !!IMG[k]; }

  const NAMES = { erz: 'Erzähler', nino: 'Nino', mila: 'Mila', leyla: 'Leyla', brunner: 'Onkel Brunner', buehler: 'Herr Bühler', buehler_falsch: 'Der Mann', gerber: 'Frau Gerber', kummer: 'Herr Kummer', schlatter: 'Herr Schlatter', opa: 'Opa Ernst', imhof: 'Herr Imhof', zuercher: 'Frau Zürcher', andermatt: 'Frau Andermatt', mama: 'Mama', vogel: 'Herr Vogel', luca: 'Luca', frau1: 'Frau', frau2: 'Frau', katze: 'Büsi' };

  // ---------- Kleine Objekte ----------
  const obj = {
    ente: (x = 0, y = 0, s = 1, flip = false) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><ellipse cx="0" cy="0" rx="16" ry="11" fill="#F7D046"/><circle cx="12" cy="-10" r="8" fill="#F7D046"/><path d="M18 -9 L28 -6 L18 -3 Z" fill="#F28C28"/><circle cx="14" cy="-12" r="1.8" fill="#222"/><path d="M-14 -2 Q-22 -8 -18 2" fill="#E9B44C"/></g>`,
    gloeckchen: (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-12 12 Q-12 -12 0 -16 Q12 -12 12 12 Z" fill="#D9D9D9" stroke="#999"/><rect x="-14" y="12" width="28" height="4" rx="2" fill="#BBB"/><circle cx="0" cy="18" r="3" fill="#999"/><circle cx="0" cy="-17" r="3" fill="#BBB"/></g>`,
    gipfeli: (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-16 6 Q-10 -10 0 -8 Q10 -10 16 6 Q8 2 0 4 Q-8 2 -16 6 Z" fill="#E09A3E" stroke="#B87326"/><path d="M-8 -2 L-4 4 M0 -6 L0 2 M8 -2 L4 4" stroke="#B87326" stroke-width="1.5"/></g>`,
    schraube: (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="0" r="5" fill="#8C8C8C" stroke="#555"/><path d="M-3 0 L3 0 M0 -3 L0 3" stroke="#444" stroke-width="1.5"/></g>`,
    feder: (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 12 Q-8 0 0 -12 Q8 0 0 12 Z" fill="#fff" stroke="#BBB"/><path d="M0 12 L0 -10" stroke="#BBB"/></g>`,
    velo: (x = 0, y = 0, s = 1, color = '#E53935', korb = true, glocke = true) => `<g transform="translate(${x} ${y}) scale(${s})">
      <circle cx="-22" cy="10" r="14" fill="none" stroke="#333" stroke-width="3"/><circle cx="22" cy="10" r="14" fill="none" stroke="#333" stroke-width="3"/>
      <path d="M-22 10 L-8 -10 L14 -10 L22 10 M-8 -10 L2 10 L22 10 M2 10 L-22 10" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M-12 -16 L-4 -16 M14 -10 L12 -18 L20 -18" stroke="#333" stroke-width="3" fill="none"/>
      ${korb ? `<path d="M12 -18 L24 -18 L22 -6 L14 -6 Z" fill="#C9A227" stroke="#8B6F1A"/>` : ''}
      ${glocke ? `<circle cx="10" cy="-20" r="3" fill="#BBB" stroke="#777"/>` : ''}
    </g>`,
    posaune: (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-24 0 L14 0" stroke="#F2B233" stroke-width="5"/><path d="M-24 -6 L-24 6" stroke="#F2B233" stroke-width="4"/><path d="M14 -10 Q30 0 14 10 Z" fill="#F2B233" stroke="#B8860B"/></g>`,
    postauto: (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-30" y="-14" width="60" height="26" rx="6" fill="#F7D046"/><rect x="-24" y="-10" width="14" height="10" fill="#7EC8E3"/><rect x="-6" y="-10" width="14" height="10" fill="#7EC8E3"/><rect x="12" y="-10" width="14" height="10" fill="#7EC8E3"/><circle cx="-18" cy="14" r="5" fill="#333"/><circle cx="18" cy="14" r="5" fill="#333"/></g>`,
    katze: (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="4" rx="14" ry="9" fill="#777"/><circle cx="12" cy="-4" r="8" fill="#777"/><path d="M6 -10 L8 -16 L12 -10 Z M14 -10 L18 -16 L18 -10 Z" fill="#777"/><circle cx="10" cy="-5" r="1.5" fill="#F7D046"/><circle cx="15" cy="-5" r="1.5" fill="#F7D046"/><path d="M-14 4 Q-24 -6 -18 -10" stroke="#777" stroke-width="3" fill="none"/></g>`,
    schluessel: (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="-8" cy="0" r="6" fill="none" stroke="#C9A227" stroke-width="3"/><path d="M-2 0 L14 0 M10 0 L10 5 M6 0 L6 4" stroke="#C9A227" stroke-width="3"/></g>`,
    kaffee: (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-10 -6 L-8 10 L8 10 L10 -6 Z" fill="#fff" stroke="#999"/><path d="M10 -2 Q18 0 10 6" stroke="#999" fill="none" stroke-width="2"/><path d="M-4 -12 Q-2 -16 -4 -20 M2 -12 Q4 -16 2 -20" stroke="#BBB" fill="none"/></g>`,
    schraubenzieher: (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-14" y="-4" width="14" height="8" rx="3" fill="#E53935"/><rect x="0" y="-1.5" width="16" height="3" fill="#999"/></g>`,
    koffer: (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-14" y="-8" width="28" height="18" rx="3" fill="#5A3A22"/><rect x="-5" y="-12" width="10" height="4" fill="#5A3A22"/><rect x="-14" y="-2" width="28" height="2" fill="#C9A227"/></g>`,
    zahnrad: (x = 0, y = 0, s = 1) => { let t = ''; for (let i = 0; i < 8; i++) { const a = i * 45; t += `<rect x="-3" y="-20" width="6" height="8" fill="#C9A227" transform="rotate(${a})"/>`; } return `<g transform="translate(${x} ${y}) scale(${s})">${t}<circle r="15" fill="#E0B640" stroke="#8B6F1A" stroke-width="2"/><circle r="5" fill="#8B6F1A"/></g>`; },
    stern: (x = 0, y = 0, s = 1, c = '#F7D046') => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -12 L3.5 -4 L12 -3.5 L5.5 2 L7.5 11 L0 6 L-7.5 11 L-5.5 2 L-12 -3.5 L-3.5 -4 Z" fill="${c}"/>`,
    fussspur: (x = 0, y = 0, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r})"><ellipse cx="0" cy="0" rx="4" ry="7" fill="#7A5C3A" opacity=".7"/><circle cx="-2" cy="-9" r="1.5" fill="#7A5C3A" opacity=".7"/><circle cx="1" cy="-10" r="1.5" fill="#7A5C3A" opacity=".7"/><circle cx="3.5" cy="-8" r="1.3" fill="#7A5C3A" opacity=".7"/></g>`,
    pfote: (x = 0, y = 0) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="2" rx="4" ry="3.5" fill="#6B4A2E" opacity=".75"/><circle cx="-4" cy="-3" r="1.6" fill="#6B4A2E" opacity=".75"/><circle cx="-1" cy="-5" r="1.6" fill="#6B4A2E" opacity=".75"/><circle cx="2.5" cy="-5" r="1.6" fill="#6B4A2E" opacity=".75"/><circle cx="5" cy="-2.5" r="1.4" fill="#6B4A2E" opacity=".75"/></g>`,
  };

  // ---------- Kulissen (viewBox 400x300) ----------
  const sky = (c1 = '#BDE8F7', c2 = '#EAF7FB') => `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="400" height="300" fill="url(#sky)"/>`;
  const berge = () => `<path d="M0 150 L60 90 L110 130 L170 70 L230 120 L290 80 L350 130 L400 100 L400 170 L0 170 Z" fill="#9FC4D8"/><path d="M170 70 L185 90 L155 90 Z M290 80 L302 96 L278 96 Z" fill="#fff"/>`;
  const wolke = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" class="wolke"><ellipse cx="0" cy="0" rx="26" ry="12" fill="#fff"/><circle cx="-10" cy="-6" r="12" fill="#fff"/><circle cx="8" cy="-8" r="14" fill="#fff"/></g>`;
  const haus = (x, y, w, h, c, dach = '#C0392B') => `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="${w}" height="${h}" fill="${c}"/><path d="M-6 0 L${w / 2} ${-h * 0.5} L${w + 6} 0 Z" fill="${dach}"/><rect x="${w * 0.2}" y="${h * 0.3}" width="${w * 0.2}" height="${h * 0.22}" fill="#7EC8E3"/><rect x="${w * 0.6}" y="${h * 0.3}" width="${w * 0.2}" height="${h * 0.22}" fill="#7EC8E3"/></g>`;

  const scenes = {
    marktplatz: (opts = {}) => `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="scene">${sky()}${berge()}${wolke(70, 40)}${wolke(300, 30, 0.8)}
      ${haus(10, 110, 80, 70, '#F5E6C8')}${haus(110, 100, 90, 80, '#F9D5B0', '#8E5BD1')}${haus(230, 110, 70, 70, '#E8F1D4')}${haus(320, 105, 70, 75, '#FBE3E3', '#2F5DA8')}
      <rect x="0" y="180" width="400" height="120" fill="#D9C8A9"/><path d="M0 180 L400 180" stroke="#C4B08E" stroke-width="2"/>
      <g id="brunnen"><ellipse cx="200" cy="245" rx="90" ry="26" fill="#8FA5B5"/><ellipse cx="200" cy="240" rx="82" ry="20" fill="#7EC8E3"/>
      <rect x="186" y="150" width="28" height="80" fill="#9AA9B5"/><rect x="176" y="142" width="48" height="12" rx="3" fill="#7F8F9C"/>
      ${opts.gloeckchen ? obj.gloeckchen(200, 126, 1) : `<rect x="192" y="130" width="16" height="12" fill="#7F8F9C"/>`}
      <path d="M200 160 Q170 200 150 236 M200 160 Q230 200 250 236" stroke="#BDE8F7" stroke-width="3" fill="none" opacity=".8"/>
      ${opts.enten === false ? '' : `<g class="enten">${obj.ente(150, 238, 0.7)}${obj.ente(210, 246, 0.7, true)}${obj.ente(255, 236, 0.6)}</g>`}
      </g>${opts.extra || ''}</svg>`,

    baeckerei: (opts = {}) => `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="scene"><rect width="400" height="300" fill="#FBEBD3"/>
      <rect x="0" y="0" width="400" height="60" fill="#E8B76A"/><text x="200" y="40" text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-weight="700" font-size="22" fill="#7A3B2E">ZUM GOLDENEN GIPFELI</text>
      <rect x="0" y="200" width="400" height="100" fill="#B87326"/><rect x="0" y="190" width="400" height="14" fill="#D9A05B"/>
      <rect x="20" y="70" width="110" height="110" rx="6" fill="#fff" stroke="#D9A05B" stroke-width="4"/><g transform="translate(30 76) scale(0.75)"><circle cx="60" cy="62" r="30" fill="#F6C9A5"/><path d="M28 48 Q26 20 60 20 Q94 20 92 48 Q84 32 60 32 Q36 32 28 48 Z" fill="#fff" stroke="#DDD"/><path d="M40 62 Q46 54 52 62 M68 62 Q74 54 80 62" stroke="#2B2B2B" stroke-width="3" fill="none"/><path d="M46 76 Q60 90 74 76" stroke="#7A3B2E" stroke-width="3" fill="#fff"/></g><text x="75" y="172" text-anchor="middle" font-size="10" fill="#7A3B2E" font-weight="700">Herr Bühler</text>
      <g id="regal"><rect x="150" y="80" width="230" height="8" fill="#8B5A2B"/><rect x="150" y="130" width="230" height="8" fill="#8B5A2B"/>
      ${[170, 210, 250, 290, 330].map(x => obj.gipfeli(x, 72, 0.9)).join('')}${[170, 210, 250, 290, 330].map(x => obj.gipfeli(x, 122, 0.9)).join('')}</g>
      ${opts.extra || ''}</svg>`,

    see: (opts = {}) => `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="scene">${sky('#A9DDF3', '#E3F4FA')}${berge()}${wolke(120, 36, 0.9)}${wolke(330, 50, 0.7)}
      <rect x="0" y="170" width="400" height="130" fill="#5DB7DC"/><path d="M0 178 Q50 172 100 178 T200 178 T300 178 T400 178" stroke="#8FD3EC" stroke-width="3" fill="none"/>
      <path d="M0 175 L120 175 L120 230 L0 240 Z" fill="#9BC46A"/><rect x="60" y="200" width="60" height="8" fill="#8B5A2B"/><rect x="66" y="208" width="6" height="20" fill="#8B5A2B"/><rect x="106" y="208" width="6" height="20" fill="#8B5A2B"/>
      <g id="schilf">${[300, 320, 340, 360].map(x => `<path d="M${x} 190 Q${x + 4} 150 ${x} 120" stroke="#5E8C3A" stroke-width="4" fill="none"/><ellipse cx="${x}" cy="125" rx="4" ry="12" fill="#7A5C3A"/>`).join('')}</g>
      ${opts.extra || ''}</svg>`,

    schule: (opts = {}) => `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="scene">${sky()}${wolke(80, 40)}${wolke(320, 60, 0.7)}
      <rect x="40" y="60" width="320" height="120" fill="#F4E1B5"/><path d="M30 60 L200 10 L370 60 Z" fill="#B0413E"/>
      ${[70, 130, 190, 250, 310].map(x => `<rect x="${x}" y="90" width="30" height="34" fill="#7EC8E3" stroke="#fff" stroke-width="3"/>`).join('')}
      <rect x="180" y="130" width="40" height="50" fill="#8B5A2B"/><circle cx="200" cy="40" r="10" fill="#fff" stroke="#333"/><path d="M200 34 L200 40 L204 43" stroke="#333" stroke-width="2" fill="none"/>
      <rect x="0" y="180" width="400" height="120" fill="#B7B2A6"/>
      <g id="velostaender">${[60, 90, 120, 150].map(x => `<path d="M${x} 230 L${x} 200 Q${x + 10} 190 ${x + 20} 200 L${x + 20} 230" stroke="#666" stroke-width="4" fill="none"/>`).join('')}</g>
      <rect x="290" y="130" width="90" height="70" fill="#8B5A2B"/><path d="M285 130 L335 105 L385 130 Z" fill="#5A3A22"/><rect x="320" y="150" width="30" height="50" fill="#5A3A22"/>
      ${opts.extra || ''}</svg>`,

    gartenhaus: (opts = {}) => `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="scene"><rect width="400" height="300" fill="#E8DCC4"/>
      <rect x="0" y="0" width="400" height="200" fill="#D9C8A9"/>${[0, 40, 80, 120, 160, 200, 240, 280, 320, 360].map(x => `<line x1="${x}" y1="0" x2="${x}" y2="200" stroke="#C9B48E" stroke-width="2"/>`).join('')}
      <rect x="0" y="200" width="400" height="100" fill="#A67C52"/>${[0, 50, 100, 150, 200, 250, 300, 350].map(x => `<rect x="${x}" y="200" width="48" height="100" fill="#B08A5E" stroke="#8B6B44"/>`).join('')}
      <rect x="230" y="60" width="150" height="110" fill="#8B6B44"/>${[[250, 80], [300, 90], [340, 75], [260, 130], [320, 125]].map(([x, y]) => `<rect x="${x}" y="${y}" width="28" height="22" fill="#FFF8DC" stroke="#C9A227" transform="rotate(${(x % 7) - 3} ${x} ${y})"/>`).join('')}
      <path d="M264 91 L310 101 M310 101 L354 86 M274 141 L310 101" stroke="#E53935" stroke-width="2"/>
      <rect x="30" y="110" width="150" height="14" fill="#5A3A22"/><rect x="40" y="124" width="10" height="80" fill="#5A3A22"/><rect x="160" y="124" width="10" height="80" fill="#5A3A22"/>
      <rect x="60" y="80" width="60" height="30" rx="4" fill="#7A5C3A"/><text x="90" y="100" text-anchor="middle" font-size="12" fill="#F2B233" font-weight="700">E.N.</text>
      ${opts.extra || ''}</svg>`,
  };

  // ---------- Karte von Bärlingen ----------
  function karte(progress) {
    const img = !!IMG.karte;
    const spots = img ? [
      { id: 0, x: 232, y: 300, label: 'Brunnen', icon: obj.gloeckchen(0, 0, 0.9) },
      { id: 1, x: 120, y: 240, label: 'Bäckerei', icon: obj.gipfeli(0, 0, 1) },
      { id: 2, x: 275, y: 130, label: 'See', icon: obj.ente(0, 0, 0.8) },
      { id: 3, x: 110, y: 95, label: 'Schule', icon: obj.velo(0, 4, 0.5) },
      { id: 4, x: 355, y: 170, label: 'Gartenhaus', icon: obj.zahnrad(0, 0, 0.7) },
    ] : [
      { id: 0, x: 200, y: 330, label: 'Brunnen', icon: obj.gloeckchen(0, 0, 0.9) },
      { id: 1, x: 90, y: 230, label: 'Bäckerei', icon: obj.gipfeli(0, 0, 1) },
      { id: 2, x: 320, y: 200, label: 'See', icon: obj.ente(0, 0, 0.8) },
      { id: 3, x: 130, y: 110, label: 'Schule', icon: obj.velo(0, 4, 0.5) },
      { id: 4, x: 300, y: 60, label: 'Gartenhaus', icon: obj.zahnrad(0, 0, 0.7) },
    ];
    const path = img ? '' : spots.map((s, i) => (i ? 'L' : 'M') + s.x + ' ' + s.y).join(' ');
    const R = img ? 26 : 34;
    return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" class="karte">
      <defs><linearGradient id="kg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CDEFD6"/><stop offset="1" stop-color="#B7E0C4"/></linearGradient></defs>
      ${IMG.karte ? `<clipPath id="kclip"><rect width="400" height="400" rx="24"/></clipPath><image href="${IMG.karte}" width="400" height="400" preserveAspectRatio="xMidYMid slice" clip-path="url(#kclip)"/>` : `<rect width="400" height="400" rx="24" fill="url(#kg)"/>
      <path d="M260 120 Q400 150 400 260 L400 400 L300 400 Q280 300 330 250 Q360 200 260 120 Z" fill="#7EC8E3"/>
      <path d="M0 40 L80 0 L160 30 L120 60 L60 70 Z" fill="#9FC4D8"/>`}
      ${path ? `<path d="${path}" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>
      <path d="${path}" stroke="#E9B44C" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 14"/>` : ''}
      ${spots.map(s => {
        const st = progress[s.id] || 'locked';
        const cls = 'spot ' + st;
        const fill = st === 'done' ? '#6DA544' : st === 'open' ? '#F7941D' : '#B9B9B9';
        return `<g class="${cls}" data-case="${s.id}" transform="translate(${s.x} ${s.y})" role="button" tabindex="0" aria-label="Fall ${s.id + 1}: ${s.label}">
          <circle r="${R}" fill="${fill}" stroke="#fff" stroke-width="5"/>
          <g class="spot-icon" opacity="${st === 'locked' ? 0.5 : 1}" transform="scale(${R / 34})">${s.icon}</g>
          <circle cx="${R * 0.7}" cy="${-R * 0.7}" r="13" fill="#fff" stroke="${fill}" stroke-width="3"/><text x="${R * 0.7}" y="${-R * 0.7 + 5}" text-anchor="middle" font-size="15" font-weight="800" fill="${fill}" font-family="Fredoka, Nunito, sans-serif">${s.id + 1}</text>
          ${st === 'done' ? obj.stern(-R * 0.75, -R * 0.75, 1.1) : ''}
          ${st === 'locked' ? `<g transform="translate(0 ${R + 8})"><rect x="-8" y="-6" width="16" height="12" rx="3" fill="#666"/><path d="M-5 -6 V-10 a5 5 0 0 1 10 0 V-6" stroke="#666" stroke-width="3" fill="none"/></g>` : ''}
        </g>`;
      }).join('')}
    </svg>`;
  }

  return { avatar, chars, obj, scenes, karte, NAMES, probeImages, hasImg, IMG, RATIO, icon, sprite, imgFail };
})();

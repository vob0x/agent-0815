/* Agent 0815 — Service Worker: Offline-Cache */
const VERSION = 'agent0815-v11';
const IMAGES = ['./enten.png', './enten_schwimmen.png', './fig_andermatt.png', './fig_brunner.png', './fig_buehler.png', './fig_buehler_bruder.png', './fig_frau1.png', './fig_frau2.png', './fig_gerber.png', './fig_imhof.png', './fig_katze.png', './fig_kummer.png', './fig_leyla.png', './fig_luca.png', './fig_mama.png', './fig_mila.png', './fig_nino.png', './fig_nino_brille.png', './fig_opa.png', './fig_schlatter.png', './fig_vogel.png', './fig_zuercher.png', './ico_auto_rost.png', './ico_draht.png', './ico_eckengucker.png', './ico_ente_empoert.png', './ico_feldstecher.png', './ico_generalschluessel.png', './ico_gipfeli.png', './ico_glocke.png', './ico_kaffee.png', './ico_kasse.png', './ico_katze.png', './ico_katze_mauer.png', './ico_kiste.png', './ico_koffer.png', './ico_kuh.png', './ico_lauschtrichter.png', './ico_lieferwagen.png', './ico_lupe.png', './ico_lupe_sprung.png', './ico_mappe.png', './ico_mappe2.png', './ico_muenzen.png', './ico_nachtbrille.png', './ico_notizbuch.png', './ico_pinsel.png', './ico_posaune.png', './ico_postauto.png', './ico_postauto2.png', './ico_schachtel.png', './ico_schraube.png', './ico_schraubenzieher.png', './ico_silberglocke.png', './ico_sonnenbrille.png', './ico_spaten.png', './ico_spatz.png', './ico_taschenuhr.png', './ico_tauben.png', './ico_trillerpfeife.png', './ico_velo_a.png', './ico_velo_b.png', './ico_velo_c.png', './ico_velo_d.png', './ico_zahnrad.png', './ico_zettel.png', './karte.jpg', './karte_v2.jpg', './scene_altersheim.jpg', './scene_anschlagbrett.jpg', './scene_baeckerei.jpg', './scene_gartenhaus.jpg', './scene_gemeinde.jpg', './scene_hinterhof.jpg', './scene_kirchplatz.jpg', './scene_markt.jpg', './scene_markt_hinter.jpg', './scene_marktplatz.jpg', './scene_museum.jpg', './scene_schlatter.jpg', './scene_schule.jpg', './scene_schulflur.jpg', './scene_see.jpg', './scene_werkstatt.jpg'];
const ASSETS = ['./', './index.html', './buch.html', './style.css', './buch.css', './buch.js', './buch_g01.js', './audio.js', './speech.js', './art.js', './cases.js', './game.js', './scene.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-512-maskable.png'];

self.addEventListener('install', e => {
  // Kern muss gelingen; Bilder nach Möglichkeit (einzeln, Fehler ignorieren), damit ein Spiel nach dem ersten Laden auch offline läuft
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS).then(() => Promise.all(IMAGES.map(u => c.add(u).catch(() => null))))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('agent0815-') && k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // Fonts: Netz zuerst, dann Cache (funktioniert offline mit Fallback-Schrift)
  if (url.origin !== location.origin) {
    e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { if (r.ok) { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); } return r; })));
});

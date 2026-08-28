# Agent 0815 — Die Fälle von Bärlingen

Interaktives Detektiv-Spiel zum Kinderbuch «Agent 0815». PWA, mobile-first, ohne Build-Schritt, ohne Abhängigkeiten.

**Zielgruppe:** Kindergarten bis 2. Klasse. Alles wird vorgelesen, kein Lesen nötig.

## Fünf Fälle (MVP)

| # | Fall | Ort | Mechanik | Lernziel |
|---|------|-----|----------|----------|
| 1 | Das verschwundene Glöckchen | Brunnen | Spuren suchen mit der Zwinkerlupe, Verdächtigen wählen | Genau hinschauen |
| 2 | Der falsche Bäcker | Bäckerei | Unterschiede finden, Stimme erkennen (nur Hören) | Genau hinhören |
| 3 | Die verschwundenen Enten | See | Geräusch-Reihenfolge merken (3 Runden), lautestes Geräusch wählen | Hörgedächtnis |
| 4 | Das verschwundene Velo | Schule | Spur der Reihe nach antippen, Velo nach Merkmalen finden | Reihenfolge, Merkmale kombinieren |
| 5 | Opas geheimer Zettel | Gartenhaus | Unsichtbare Tinte freirubbeln, Orte in Reihenfolge 1–4 antippen, lockeres Brett finden | Zahlen 1–4, Zuordnen |

## Technik

- `index.html`, alle Dateien im Wurzelverzeichnis — reine Web-Standards
- `audio.js` — Musik und Geräusche prozedural mit Web Audio (keine Audiodateien)
- `speech.js` — Sprachausgabe über die Web Speech API (Stimme des Geräts, bevorzugt de-CH)
- `art.js` — alle Figuren und Kulissen als Inline-SVG
- `cases.js` — die Fälle als Daten (Dialoge, Rätsel, Lösungen)
- `game.js` — Spiel-Engine (Karte, Schrittfolge, Rätseltypen, Belohnung, Elternbereich)
- `sw.js`, `manifest.webmanifest` — Offline-Fähigkeit und «Zum Home-Bildschirm»

## Lokal starten

```
python3 -m http.server 8080
# dann http://localhost:8080
```

## Test

```
npm i playwright   # einmalig
node test/play.js  # spielt alle fünf Fälle im iPhone-Viewport durch, Screenshots in test/shots/
```

## Deployment auf GitHub Pages

Repo anlegen, Inhalt pushen, unter *Settings → Pages* den Branch `main` (Ordner `/`) wählen. Alle Pfade sind relativ, kein Build nötig.

## Bekannte Grenzen des MVP

- Stimmen kommen vom Gerät (iOS/Android/Chrome). Qualität schwankt; kein echter Sprecher.
- Musik/Geräusche sind synthetisch. Eine professionelle Soundkulisse braucht produzierte Audiodateien.
- Figuren sind einfache Vektor-Illustrationen, kein finales Charakterdesign.

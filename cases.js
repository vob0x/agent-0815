/* Agent 0815 — Die fünf Fälle (Daten) */
let CASES = null;
const buildCases = () => {
  const O = Art.obj;
  const D = (who, text, opt = {}) => ({ type: 'dialog', who, text, ...opt });

  // Verdächtigen-Karte (Kopf + Gegenstand)
  const suspect = (who, item, label) => ({ who, item, label });

  return [
    // ===================== FALL 1 =====================
    {
      id: 0, title: 'Das verschwundene Glöckchen', place: 'Brunnen', scene: 'marktplatz',
      steps: [
        D('erz', 'Es gibt Tage, an denen in Bärlingen gar nichts passiert. Und dann gibt es Tage wie diesen.', { scene: { name: 'marktplatz', opts: { gloeckchen: true } } }),
        D('buehler', 'Weisch was, Nino! Das Glöckchen vom Brunnen ist weg. Futsch!', { scene: { name: 'marktplatz', opts: {} }, sfx: 'whoosh' }),
        D('brunner', 'Wahrscheinlich der Wind.'),
        D('mila', 'ES WAR NICHT DER WIND!', { sfx: 'pop' }),
        D('nino', 'Agent 0815 übernimmt. Ich brauche die Zwinkerlupe von Opa.', { sfx: 'klack', anim: 'brille' }),
        {
          type: 'find', scene: 'marktplatz', sceneOpts: {}, lupe: true,
          intro: { who: 'nino', text: 'Schau mit der Lupe ganz genau hin. Findest du drei Spuren am Brunnen?' },
          hotspots: [
            { x: 203, y: 138, r: 20, label: 'Kratzer', say: 'Ein Kratzer! Jemand hat hier mit Werkzeug geschraubt.', svg: `<g stroke="#3a2a1a" stroke-width="2" stroke-linecap="round" opacity=".85"><path d="M192 132 L214 142"/><path d="M194 144 L212 134"/><path d="M198 138 L210 139"/></g>` },
            { x: 330, y: 268, r: 18, label: 'Schraube', say: 'Eine Schraube am Boden. Der Wind kann keine Schrauben lösen!', svg: Art.sprite('schraube', 330, 268, 18, O.schraube(330, 268, 1.2), 'transform="rotate(35 330 268)"') },
            { x: 92, y: 272, r: 20, label: 'Katzenspur', say: 'Katzenspuren. Die Katze von Herrn Bühler war hier. Sie hat den Lieferwagen gerochen.', svg: `<g transform="scale(1.4) translate(-26 -80)">${O.pfote(80, 268) + O.pfote(92, 276) + O.pfote(104, 284)}</g>` },
          ],
          done: { who: 'leyla', text: 'Drei Spuren. Jemand hat das Glöckchen abgeschraubt. Mit Werkzeug.' },
        },
        D('gerber', 'Ein Händler war da. Ein Herr Schlatter. Gauner. Aber ich sitze seit vierzig Jahren hier: Das Glöckchen hat er nicht.'),
        {
          type: 'choose',
          question: { who: 'nino', text: 'Wer hat Werkzeug zum Schrauben? Tipp auf die richtige Person.' },
          options: [
            { ...suspect('schlatter', O.koffer(0, 0, 1.2), 'Herr Schlatter'), img: 'koffer', correct: false, say: 'Herr Schlatter hat nur einen Koffer. Kein Werkzeug.' },
            { ...suspect('kummer', O.schraubenzieher(0, 0, 1.4), 'Herr Kummer'), img: 'schraubenzieher', correct: true, say: 'Herr Kummer! Der Hausmeister hat einen Schraubenzieher.' },
            { ...suspect('gerber', O.kaffee(0, 0, 1.2), 'Frau Gerber'), img: 'kaffee', correct: false, say: 'Frau Gerber hat Kaffee. Mit Kaffee kann man nicht schrauben.' },
          ],
          hint: { who: 'leyla', text: 'Schau auf die Hände. Wer hält einen Schraubenzieher?' },
        },
        D('kummer', 'Hat lang genug gedauert. Ich habe das Glöckchen nicht gestohlen. Ich habe es gerettet. Bevor der Gauner es holt.', { scene: { name: 'marktplatz', opts: { gloeckchen: true } } }),
        D('nino', 'Nicht gestohlen. Gerettet! Herr Kummer schraubt es wieder fest. Mit sechs Schrauben.', { sfx: 'bell' }),
        D('mila', 'ICH hab den Fall gelöst. Das war doch total klar.', { sfx: 'pop' }),
        { type: 'reward', rule: 'Ein Agent schaut ganz genau hin.', note: 'Genügend.' },
      ],
    },

    // ===================== FALL 2 =====================
    {
      id: 1, title: 'Der falsche Bäcker', place: 'Bäckerei', scene: 'baeckerei',
      steps: [
        D('erz', 'Am Morgen riecht es in Bärlingen nach Gipfeli. Aber heute stimmt etwas nicht.', { scene: { name: 'baeckerei', opts: {} } }),
        D('nino', 'Die Gipfeli schmecken komisch. Und Herr Bühler hat kein einziges Mal «Weisch was, Nino» gesagt.'),
        D('leyla', 'Vielleicht ist das gar nicht Herr Bühler.'),
        D('nino', 'Ein falscher Bäcker! Agent 0815 übernimmt.', { anim: 'brille', sfx: 'klack' }),
        {
          type: 'diff',
          intro: { who: 'nino', text: 'Links hängt das Foto vom echten Herrn Bühler. Rechts steht der Mann hinter dem Tresen. Findest du drei Unterschiede? Tipp rechts darauf.' },
          left: 'buehler', right: 'buehler_falsch',
          spots: [
            { x: 60, y: 72, r: 16, img: { x: 50, y: 108, r: 14 }, label: 'Schnurrbart', say: 'Ein Schnurrbart! Der echte Herr Bühler hat keinen.' },
            { x: 60, y: 60, r: 14, img: { x: 50, y: 84, r: 15 }, label: 'Augen', say: 'Der schaut ganz anders. Der echte Herr Bühler lacht immer.' },
            { x: 60, y: 116, r: 16, img: { x: 50, y: 185, r: 22 }, label: 'Gipfeli-Knopf', say: 'Der Gipfeli-Knopf an der Schürze fehlt!' },
          ],
          done: { who: 'leyla', text: 'Das ist nicht Herr Bühler. Aber wer ist es dann?' },
        },
        {
          type: 'choose', layout: 'sound',
          question: { who: 'nino', text: 'Hör gut zu. Was sagt der echte Herr Bühler immer? Tipp auf den richtigen Lautsprecher.' },
          options: [
            { label: 'Satz 1', voice: 'buehler', text: 'Guten Tag, was darf es sein?', correct: false, say: 'Nein. Das sagt jeder Bäcker.' },
            { label: 'Satz 2', voice: 'buehler', text: 'Weisch was, Nino!', correct: true, say: 'Genau! «Weisch was, Nino». Das sagt nur der echte Herr Bühler.' },
            { label: 'Satz 3', voice: 'buehler', text: 'Die Gipfeli sind ausverkauft.', correct: false, say: 'Nein. Bei Herrn Bühler sind die Gipfeli nie ausverkauft.' },
          ],
          hint: { who: 'leyla', text: 'Herr Bühler sagt immer «Weisch was, Nino». Welcher Satz ist das?' },
        },
        D('buehler_falsch', 'Ähm. Ich bin der Bruder. Ich wollte nur einen Tag lang Bäcker spielen.', { sfx: 'wrong' }),
        D('buehler', 'Weisch was, Nino! Mein Bruder kann nicht backen. Aber jetzt weiss er es auch.', { sfx: 'correct' }),
        D('mila', 'ICH hab gemerkt, dass die Gipfeli komisch sind. Ich hab nämlich drei gegessen.', { sfx: 'pop' }),
        { type: 'reward', rule: 'Hör genau hin, wer wie redet.', note: 'Genügend plus.' },
      ],
    },

    // ===================== FALL 3 =====================
    {
      id: 2, title: 'Die verschwundenen Enten', place: 'See', scene: 'see',
      steps: [
        D('erz', 'Am Brunnen schwimmen immer drei Enten. Immer. Heute nicht.', { scene: { name: 'marktplatz', opts: { gloeckchen: true, enten: false } } }),
        D('nino', 'Enten merken alles. Wenn die Enten weg sind, stimmt in Bärlingen etwas nicht.'),
        D('leyla', 'Ich habe sie gesehen. Sie sind zum See geflüchtet. Wegen einem Geräusch.', { scene: { name: 'see', opts: { enten: true, extra: Art.hasImg('scene_see') ? '' : O.ente(330, 200, 0.8) + O.ente(360, 215, 0.7, true) + O.ente(300, 222, 0.7) } } }),
        D('nino', 'Dann finden wir heraus, welches Geräusch. Agent 0815 hört zu.', { anim: 'brille', sfx: 'klack' }),
        {
          type: 'sequence',
          intro: { who: 'leyla', text: 'Hör genau hin. Ich spiele dir Geräusche vor. Danach tippst du sie in derselben Reihenfolge.' },
          sounds: [
            { id: 'bell', label: 'Glocke', sfx: 'bell', img: 'glocke', svg: O.gloeckchen(0, 0, 1.2) },
            { id: 'quack', label: 'Ente', sfx: 'quack', img: 'enten', svg: O.ente(0, 0, 1) },
            { id: 'horn', label: 'Postauto', sfx: 'horn', img: 'postauto', svg: O.postauto(0, 0, 0.7) },
            { id: 'cat', label: 'Katze', sfx: 'cat', img: 'katze', svg: O.katze(0, 0, 1.1) },
            { id: 'trombone', label: 'Posaune', sfx: 'trombone', img: 'posaune', svg: O.posaune(0, 0, 1.1) },
          ],
          rounds: [['bell', 'quack'], ['horn', 'cat', 'bell'], ['quack', 'trombone', 'horn', 'trombone']],
          done: { who: 'nino', text: 'Ein Geräusch war immer wieder da. Und es war laut.' },
        },
        {
          type: 'choose', layout: 'icons',
          question: { who: 'nino', text: 'Welches Geräusch hat die Enten verjagt? Tipp darauf.' },
          options: [
            { label: 'Glocke', img: 'glocke', svg: O.gloeckchen(0, 0, 1.4), sfx: 'bell', correct: false, say: 'Die Glocke kennen die Enten. Die stört sie nicht.' },
            { label: 'Posaune', img: 'posaune', svg: O.posaune(0, 0, 1.3), sfx: 'trombone', correct: true, say: 'Die Posaune! Das Geheul kommt aus dem Schulkeller.' },
            { label: 'Katze', img: 'katze', svg: O.katze(0, 0, 1.3), sfx: 'cat', correct: false, say: 'Die Katze ist zu leise. Und sie hat Angst vor Enten.' },
          ],
          hint: { who: 'leyla', text: 'Welches Geräusch war am lautesten? Hör es nochmal an.' },
        },
        D('buehler', 'Weisch was, Nino. Ich übe Posaune. Im Schulkeller. Heimlich. Der Teig verträgt keine Posaune.', { sfx: 'trombone' }),
        D('kummer', 'Hm. Ab jetzt nur noch mit geschlossener Kellertür.', { sfx: 'klack' }),
        D('nino', 'Und die Enten kommen zurück.', { scene: { name: 'marktplatz', opts: { gloeckchen: true } }, sfx: 'quack3' }),
        D('mila', 'ICH hab die Enten gefunden. Sie waren beim See. Ganz klar.', { sfx: 'pop' }),
        { type: 'reward', rule: 'Enten sind keine Zeugen. Aber sie hören alles.', note: 'Gut minus.' },
      ],
    },

    // ===================== FALL 4 =====================
    {
      id: 3, title: 'Das verschwundene Velo', place: 'Schule', scene: 'schule',
      steps: [
        D('leyla', 'Nino! Mein Velo ist weg. Es stand hier am Veloständer.', { scene: { name: 'schule', opts: {} }, sfx: 'whoosh' }),
        D('nino', 'Wie sieht dein Velo aus?'),
        D('leyla', 'Rot. Und mit einem Körbli vorne.'),
        D('nino', 'Rot, mit Körbli. Agent 0815 übernimmt. Da sind Spuren im Kies!', { anim: 'brille', sfx: 'klack' }),
        {
          type: 'order', scene: 'schule',
          intro: { who: 'nino', text: 'Folge der Spur. Tipp die Spuren der Reihe nach an. Vom Veloständer bis zum Schuppen.' },
          points: [
            { x: 100, y: 262 }, { x: 160, y: 272 }, { x: 215, y: 262 }, { x: 265, y: 270 }, { x: 318, y: 250 },
          ],
          spurSvg: (x, y, i) => `<g transform="translate(${x} ${y})"><path d="M-14 -4 Q0 4 14 -4" stroke="#5A3A22" stroke-width="4" fill="none" stroke-dasharray="3 3" opacity=".8"/><path d="M-14 4 Q0 12 14 4" stroke="#5A3A22" stroke-width="4" fill="none" stroke-dasharray="3 3" opacity=".8"/></g>`,
          done: { who: 'nino', text: 'Die Spur führt in den Schuppen. Da stehen viele Velos.' },
        },
        {
          type: 'choose', layout: 'icons',
          question: { who: 'leyla', text: 'Welches ist mein Velo? Rot, und mit einem Körbli.' },
          options: [
            { label: 'Velo 1', img: 'velo_b', svg: O.velo(0, 0, 0.9, '#2F5DA8', true, true), correct: false, say: 'Das ist blau. Leylas Velo ist rot.' },
            { label: 'Velo 2', img: 'velo_c', svg: O.velo(0, 0, 0.9, '#E53935', false, true), correct: false, say: 'Rot, aber ohne Körbli.' },
            { label: 'Velo 3', img: 'velo_a', svg: O.velo(0, 0, 0.9, '#E53935', true, true), correct: true, say: 'Rot, mit Körbli. Das ist es!' },
          ],
          hint: { who: 'leyla', text: 'Beides muss stimmen: rot und mit Körbli.' },
        },
        D('mila', 'Das war ICH. Es hat geregnet. Ich hab es in den Schuppen gestellt. Bitte schön.', { sfx: 'ring' }),
        D('leyla', 'Danke, Mila. Nächstes Mal sagst du es mir vorher.'),
        D('nino', 'Fall gelöst. Und die Brille ist heute nur zweimal runtergerutscht.', { anim: 'brille', sfx: 'bonk' }),
        { type: 'reward', rule: 'Erst schauen, dann sagen.', note: 'Gut minus.' },
      ],
    },

    // ===================== FALL 5 =====================
    {
      id: 4, title: 'Opas geheimer Zettel', place: 'Gartenhaus', scene: 'gartenhaus',
      steps: [
        D('erz', 'Abends im Gartenhaus. Nino öffnet die alte Ledermappe von Opa Ernst. Sie riecht nach Uhrenöl und Pfefferminz.', { scene: { name: 'gartenhaus', opts: {} } }),
        D('nino', 'Ein Zettel. Aber er ist leer! Oder ist die Tinte unsichtbar?'),
        D('opa', 'Wenn du nicht weiterweisst, Nino: Reib mit dem Finger über das Papier.', { sfx: 'whoosh' }),
        {
          type: 'reveal',
          intro: { who: 'nino', text: 'Reib mit dem Finger über den Zettel. Dann wird die geheime Schrift sichtbar.' },
          content: `
            <g font-family="Fredoka, Nunito, sans-serif" font-weight="700" fill="#5A3A22">
              <text x="30" y="52" font-size="16">Lieber Nino,</text>
              <text x="30" y="80" font-size="14">geh so:</text>
            </g>
            <g transform="translate(60 130)"><circle r="16" fill="#F7941D"/><text y="6" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">1</text>${Art.sprite('glocke', 44, 0, 30, O.gloeckchen(40, 0, 0.9))}</g>
            <g transform="translate(180 130)"><circle r="16" fill="#F7941D"/><text y="6" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">2</text>${Art.sprite('gipfeli', 46, 0, 28, O.gipfeli(40, 0, 1))}</g>
            <g transform="translate(60 190)"><circle r="16" fill="#F7941D"/><text y="6" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">3</text>${Art.sprite('enten', 52, 0, 26, O.ente(40, 0, 0.8))}</g>
            <g transform="translate(180 190)"><circle r="16" fill="#F7941D"/><text y="6" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">4</text>${Art.sprite('zahnrad', 44, 0, 30, O.zahnrad(40, 0, 0.6))}</g>
            <text x="30" y="240" font-size="13" fill="#5A3A22" font-family="Fredoka, Nunito, sans-serif">Dann schau unter den Boden. — Opa</text>`,
          done: { who: 'opa', text: 'Eins: Brunnen. Zwei: Bäckerei. Drei: See. Vier: Gartenhaus. Dann schau unter den Boden.' },
        },
        {
          type: 'maporder',
          intro: { who: 'nino', text: 'Tipp die Orte auf der Karte in der richtigen Reihenfolge an. Zuerst der Brunnen.' },
          order: [0, 1, 2, 4],
          done: { who: 'nino', text: 'Zurück im Gartenhaus. Jetzt: unter den Boden schauen.' },
        },
        {
          type: 'find', scene: 'gartenhaus', sceneOpts: {}, lupe: false,
          intro: { who: 'nino', text: 'Ein Brett ist locker. Tipp auf das Brett, das anders aussieht.' },
          hotspots: [
            { x: 232, y: 262, r: 32, label: 'Lockeres Brett', say: 'Das Brett wackelt! Und darunter liegt etwas.', svg: Art.hasImg('scene_gartenhaus') ? `<path d="M196 252 L268 246" stroke="#2a1a0a" stroke-width="3" opacity=".7"/>${Art.sprite('zahnrad', 232, 262, 16)}` : `<rect x="150" y="200" width="48" height="100" fill="#C29A6A" stroke="#8B6B44" transform="rotate(2 174 250)"/><circle cx="174" cy="250" r="3" fill="#5A3A22"/>` },
          ],
          done: { who: 'nino', text: 'Ein Zahnrad! Mit einem Fragezeichen drauf. Das ist für mich.' },
        },
        D('opa', 'Gut gemacht, Nino. Bärlingen beschützt man nicht allein. Du hast Leyla. Und Mila.', { scene: { name: 'gartenhaus', opts: { extra: Art.hasImg('scene_gartenhaus') ? Art.sprite('zahnrad', 232, 255, 40) : O.zahnrad(174, 250, 1.2) } }, sfx: 'fanfare' }),
        D('mila', 'ICH hab ALLE Fälle gelöst. Alle fünf. Ganz klar.', { sfx: 'pop' }),
        D('leyla', 'Total klar.'),
        { type: 'reward', rule: 'Bärlingen beschützt man nicht allein.', note: 'Gut.', final: true },
      ],
    },
  ];
};

/* Agent 0815 — Interaktives Hörbuch
   Geschichte 1: «Das verschwundene Glöckchen» (V6), 1:1 im Hörspiel-Schnitt:
   Figuren sprechen ihre Sätze selbst, der Erzähler alles andere wortwörtlich.
   Reine Redeanhängsel («sagte Nino») entfallen; Regieanweisungen («Pause.») liest der Erzähler.
   Rätsel-Einschübe (Spielleiter = Erzähler) sind als solche markiert und kein Geschichtentext. */
const BUCH_G01 = {
  id: 1,
  titel: 'Das verschwundene Glöckchen',
  szenen: [

    { img: 'g1_b01', kb: 'rechts', lines: [
      { who: 'erz', text: 'Es gibt Tage, an denen in Bärlingen rein gar nichts passiert. Die Enten schwimmen auf dem See, der Brunnen plätschert, und Herr Bühler redet mit seinen Gipfeli, weil sonst niemand da ist.' },
    ] },
    { img: 'g1_b02', lines: [
      { who: 'erz', text: 'Und dann gibt es Tage wie diesen.' },
    ] },

    { img: 'g1_b03', lines: [
      { who: 'erz', text: 'Nino sass in seinem Hauptquartier — dem Gartenhaus hinter dem Haus seiner Eltern — und schrieb in sein Heft. Er nannte das einen «Lagebericht». Das klang wichtig. In Wirklichkeit war es ein Schulheft mit Eselsohren.' },
      { who: 'nino', text: 'Wetter: bewölkt. Gipfeli: null Stück. Verdächtig: alles.', stil: 'liest' },
    ] },
    { img: 'g1_b04', lines: [
      { who: 'erz', text: 'Nino setzte seine Sonnenbrille auf. Sie war eine alte Pilotenbrille, viel zu gross für sein Gesicht. Nino stand auf, straffte die Schultern, und versuchte, so auszusehen wie ein echter Agent.' },
      { who: 'erz', text: 'Die Brille rutschte ihm auf die Nasenspitze.', sfx: 'whoosh' },
      { who: 'erz', text: 'Er schob sie hoch.' },
      { who: 'erz', text: 'Sie rutschte wieder runter.', sfx: 'whoosh' },
      { who: 'erz', text: 'Er schob sie wieder hoch und hielt den Kopf ganz still. So. Jetzt sah er aus wie ein Agent. Ein Agent, der sich nicht bewegen durfte, aber immerhin.' },
    ] },
    { img: 'g1_b05', lines: [
      { who: 'erz', text: 'Ohne Sonnenbrille war er nur Nino: acht Jahre alt, ein bisschen schüchtern, nicht besonders gut in Turnen. Mit Sonnenbrille war er Agent 0815. Gründer und einziger Mitarbeiter des SGD — des Schweizerischen Geheim-Dienstes.' },
    ] },

    { img: 'g1_b06', lines: [
      { who: 'erz', text: 'Die Tür des Gartenhauses knallte auf.', sfx: 'bonk' },
      { who: 'erz', text: 'In der Tür stand Mila, seine kleine Schwester. Fünf Jahre alt, Zöpfe, verschmierter Mund.' },
      { who: 'mila', text: 'Ich bin jetzt auch ein Agent!' },
      { who: 'nino', text: 'Raus.' },
      { who: 'mila', text: 'Aber —' },
      { who: 'nino', text: 'Raus. Geheim heisst geheim.' },
    ] },
    { img: 'g1_b07', lines: [
      { who: 'erz', text: 'Mila stapfte davon. Nino hörte sie im Garten rufen:' },
      { who: 'mila', text: 'MAMA! NINO SPIELT WIEDER GEHEIMDIENST!' },
      { who: 'erz', text: 'Nino seufzte. So viel zum Thema «geheim».' },
    ] },

    { img: 'g1_b08', lines: [
      { who: 'erz', text: 'Auf dem Schulweg roch es nach frischen Gipfeli. Herr Bühler, der Bäcker vom «Goldenen Gipfeli», zog gerade ein Blech aus dem Ofen und wischte sich Mehl von der Schürze.' },
      { who: 'buehler', text: 'Weisch was, Nino,' },
      { who: 'erz', text: '— Herr Bühler sagte immer «Weisch was, Nino», egal ob man etwas wissen wollte oder nicht —' },
      { who: 'buehler', text: 'Erstens: Meine Schwägerin hat sich einen neuen Hut gekauft, so einen grünen, mit einer Feder dran, sieht aus wie ein Papagei.' },
      { who: 'erz', text: 'Er schob das Blech in die Auslage.' },
      { who: 'buehler', text: 'Zweitens: Im Keller hat es nach Käse gerochen, obwohl gar kein Käse da ist.' },
      { who: 'erz', text: 'Er rückte die Gipfeli zurecht.' },
      { who: 'buehler', text: 'Und drittens —' },
      { who: 'erz', text: 'Er hielt inne. Senkte die Stimme.' },
    ] },
    { img: 'g1_b09', lines: [
      { who: 'buehler', text: 'Meine Katze hat die ganze Nacht gefaucht. Die GANZE Nacht! Wegen einem Lieferwagen, der gestunken hat. Und das Glöckchen vom Brunnen ist übrigens auch weg.', sfx: 'miau' },
      { who: 'erz', text: 'Nino blieb stehen.' },
      { who: 'nino', text: 'Das Bärglöckchen?' },
      { who: 'buehler', text: 'Ja! Weg! Futsch!' },
    ] },
    { img: 'g1_b10', kb: 'zoom', lines: [
      { who: 'erz', text: 'Das Bärglöckchen war eine kleine silberne Glocke, die seit zweihundert Jahren auf dem Brunnen am Marktplatz stand. Ninos Grossvater hatte sie oft poliert. Einfach so. Weil er fand, dass etwas, das ein ganzes Städtchen beschützt, immer glänzen sollte.' },
      { who: 'erz', text: 'Und jetzt war sie weg.' },
    ] },
    { img: 'g1_b11', lines: [
      { who: 'erz', text: 'Nino richtete sich auf und schob die Sonnenbrille hoch.' },
      { who: 'nino', text: 'Agent 0815 übernimmt.' },
      { who: 'erz', text: 'Die Brille rutschte runter und landete — KLACK — mitten auf dem Blech mit den frischen Gipfeli.', sfx: 'klack' },
      { who: 'buehler', text: 'Hey! Die sind für Kunden!' },
      { who: 'erz', text: 'Nino fischte die Brille aus dem Blech. Sie war warm und klebte ein bisschen.' },
      { who: 'nino', text: 'Tschuldigung. Kann ich trotzdem ein Gipfeli?' },
    ] },

    { img: 'g1_b12', lines: [
      { who: 'erz', text: 'Auf dem Marktplatz stand Onkel Brunner vor dem Brunnen und kratzte sich am Kopf. Onkel Brunner war Polizist. Ein guter Polizist — für Parkbussen und Schulweg-Winken. Für verschwundene Glocken eher weniger.' },
      { who: 'brunner', text: 'Wahrscheinlich der Wind.' },
      { who: 'erz', text: 'Nino schaute auf den Sockel, wo die Glocke mit VIER Schrauben festgeschraubt gewesen war.' },
      { who: 'nino', text: 'Kann Wind Schrauben lösen?' },
    ] },
    { img: 'g1_b13', lines: [
      { who: 'erz', text: 'Onkel Brunner öffnete den Mund.' },
      { who: 'erz', text: 'Schloss ihn wieder.' },
      { who: 'erz', text: 'Öffnete ihn nochmal.' },
      { who: 'brunner', text: 'Ein STARKER Wind.' },
    ] },
    { img: 'g1_b14', lines: [
      { who: 'mila', text: 'Nino!' },
      { who: 'erz', text: 'Nino drehte sich um. Hinter dem Brunnen stand Mila. Immer noch Zöpfe. Immer noch verschmierter Mund. Jetzt auch noch ein Feldstecher um den Hals, der ungefähr so gross war wie sie selbst.' },
      { who: 'mila', text: 'Ich will auch ermittlen!' },
      { who: 'nino', text: 'Du KANNST nicht ermitteln, du bist FÜNF.' },
      { who: 'mila', text: 'Ich bin fünf und DREI VIERTEL.' },
      { who: 'nino', text: 'Geh. Nach. Hause.' },
    ] },
    { img: 'g1_b15', lines: [
      { who: 'erz', text: 'Mila zog ab. Aber nicht, ohne Onkel Brunner im Vorbeigehen zu sagen:' },
      { who: 'mila', text: 'ES WAR NICHT DER WIND.' },
      { who: 'erz', text: 'Onkel Brunner schaute ihr hinterher. Dann Nino.' },
      { who: 'brunner', text: 'Eure ganze Familie ist verrückt.' },
    ] },

    { img: 'g1_b16', lines: [
      { who: 'erz', text: 'Nach der Schule holte Nino die alte Ledermappe seines Grossvaters. Sie roch nach Uhrenöl und Pfefferminz — Opa Ernst hatte immer Bonbons in der Tasche gehabt.' },
      { who: 'erz', text: 'Heute brauchte Nino die Zwinkerlupe. Eine Lupe mit einem Sprung im Glas. Opa Ernst hatte dazu geschrieben:' },
      { who: 'opa', text: 'Wenn du die Welt schief anschaust, siehst du Dinge, die andere übersehen.' },
      { who: 'erz', text: 'Nino fand das schlau. Allerdings wurde ihm von der Lupe auch ein bisschen schwindelig.' },
    ] },
    { img: 'g1_b17', lines: [
      { who: 'erz', text: 'Am Brunnen roch es nach nassem Stein und Seeluft. Nino ging in die Hocke und hielt die Zwinkerlupe so nah an den Sockel, dass sein Atem kleine Nebelschwaden auf das Glas hauchte. Die Welt sah ein bisschen schief aus durch die Lupe, ein bisschen wackelig, als hätte jemand Bärlingen angestupst. Der Stein war grau und nass, mit kleinen Moosflecken an den Rändern.' },
    ] },

    /* ---- RÄTSEL 1: Zwinkerlupe — Spuren am Sockel finden ---- */
    { raetsel: {
      art: 'find', img: 'g1_r1_sockel', werkzeug: 'lupe_sprung',
      intro: { who: 'erz', text: 'Jetzt bist du dran. Schau durch die Zwinkerlupe. Tipp auf alles, was am Sockel nicht stimmt.' },
      ziele: [
        { x: 200, y: 148, r: 46, say: { who: 'nino', text: 'Vier Löcher. Hier war die Glocke mit vier Schrauben festgeschraubt.' } },
        { x: 236, y: 118, r: 30, say: { who: 'nino', text: 'Ein Kratzer. Und noch einer. Ganz fein, wie ein Haar.' } },
      ],
      hilfe: [
        { who: 'erz', text: 'Schau ganz genau hin. Tipp auf die Stelle, die komisch aussieht.' },
        { who: 'erz', text: 'Siehst du den Kreis, der leuchtet? Tipp genau dort hinein.' },
      ],
      danach: [
        { who: 'erz', text: 'Und da, zwischen der zweiten und der dritten Schraube, fein wie ein Haar: ein Kratzer. Und noch einer. Und noch einer. Jemand hatte die Schrauben mit Werkzeug gelöst.' },
      ],
    } },

    { img: 'g1_b18', lines: [
      { who: 'erz', text: 'Nino beugte sich ein kleines Stück näher. Noch ein Stück. Er spürte die kühle Luft vom Wasser auf der Stirn, und er drückte ein Auge zu, und hielt den Atem an, und —' },
      { who: 'erz', text: 'BONK.', sfx: 'bonk' },
      { who: 'erz', text: 'Stirn gegen Brunnenrand. Sonnenbrille — FLIEGT. Hoher Bogen. PLATSCH. Brunnenwasser.', sfx: 'splash' },
    ] },
    { img: 'g1_b19', lines: [
      { who: 'erz', text: 'Eine Ente quakte empört. Eine zweite quakte noch empörter. Eine dritte biss Nino in den Finger.', sfx: 'quack3' },
      { who: 'nino', text: 'AU!' },
      { who: 'erz', text: 'Nino fischte hektisch nach der Brille. Wasser spritzte überall.' },
      { who: 'leyla', text: 'Schon wieder eine Einzeloperation?' },
      { who: 'erz', text: 'Da stand Leyla. Arme verschränkt. Schiefgelegter Kopf.' },
      { who: 'nino', text: 'Jemand hat die Glocke abgeschraubt.' },
      { who: 'erz', text: 'Nino trocknete die Brille am T-Shirt.' },
      { who: 'nino', text: 'Und die Katze von Herrn Bühler hat einen Lieferwagen gerochen.' },
      { who: 'leyla', text: 'Die zuverlässigste Zeugin in ganz Bärlingen.' },
      { who: 'erz', text: 'Das stimmte.' },
    ] },

    { img: 'g1_b20', lines: [
      { who: 'erz', text: 'Frau Gerber sass vor ihrem Laden und trank Kaffee. Sie war achtundsiebzig und sass IMMER vor ihrem Laden. Im Sommer. Im Winter. Bei Regen. Wahrscheinlich auch bei Erdbeben.' },
      { who: 'gerber', text: 'Weisser Lieferwagen.' },
      { who: 'erz', text: 'Nino hatte noch gar nichts gefragt.' },
      { who: 'gerber', text: 'Genfer Nummern. Halb elf.' },
      { who: 'erz', text: 'Sie trank einen Schluck Kaffee.' },
      { who: 'gerber', text: 'Ein Herr Schlatter. Händler. Gauner.' },
      { who: 'nino', text: 'Woher —' },
      { who: 'gerber', text: 'Nino. Ich sitze seit vierzig Jahren hier.' },
      { who: 'erz', text: 'Sie lächelte.' },
      { who: 'gerber', text: 'Ich weiss ALLES.' },
    ] },
    { img: 'g1_b21', lines: [
      { who: 'erz', text: 'Noch ein Schluck Kaffee.' },
      { who: 'gerber', text: 'Das Bärglöckchen ist echtes Silber. Uralt. Für einen Sammler: ein Schatz.' },
      { who: 'erz', text: 'Sie stellte die Tasse ab und schaute Nino an.' },
      { who: 'gerber', text: 'Stell die richtigen Fragen. Das hat dein Grossvater auch immer gemacht.' },
    ] },

    /* ---- RÄTSEL 2: Was hat Frau Gerber gesehen? ---- */
    { raetsel: {
      art: 'wahl', layout: 'icons',
      intro: { who: 'erz', text: 'Hast du gut zugehört? Was hat Frau Gerber vor dem Laden gesehen? Tipp auf das richtige Bild.' },
      optionen: [
        { img: 'ico_postauto', falsch: { who: 'erz', text: 'Ein gelbes Postauto? Nein. Hör nochmal: Frau Gerber hat etwas Weisses gesehen.' } },
        { img: 'ico_lieferwagen', richtig: true, say: { who: 'erz', text: 'Genau. Ein weisser Lieferwagen mit Genfer Nummern. Um halb elf.' } },
        { img: 'ico_auto_rost', falsch: { who: 'erz', text: 'Das rostige Auto? Nein. Es war grösser. Ein Wagen, in den viele Kisten passen.' } },
      ],
      hilfe: [
        { who: 'erz', text: 'Frau Gerber hat gesagt: Weisser Lieferwagen. Welches Bild zeigt einen Lieferwagen?' },
        { who: 'erz', text: 'Tipp auf das Bild in der Mitte, das leuchtet.' },
      ],
    } },

    { img: 'g1_b22', lines: [
      { who: 'erz', text: 'Nino und Leyla fanden Herrn Schlatter in seinem Laden in Stansstad. Grosser Mann, Schnurrbart, Lächeln, das nicht echt aussah. Im Laden standen Regale voller alter Sachen — Uhren, Vasen, und viele Glocken. Aber keine silberne.' },
      { who: 'schlatter', text: 'Ich war wegen einer Kuckucksuhr in Bärlingen. Eine Frau Imhof wollte ihre alte Uhr verkaufen. Ich habe bei ihr vorbeigeschaut, und danach im Restaurant gegessen. Den ganzen Abend. Fragen Sie die Wirtin.' },
    ] },
    { img: 'g1_b23', lines: [
      { who: 'erz', text: 'Draussen setzte sich Nino auf die Treppe. Seine Schultern hingen. Eine Kuckucksuhr abholen, Abendessen im Restaurant — das klang alles ganz normal.' },
      { who: 'erz', text: 'Agent 0815 steckte fest.' },
    ] },

    { img: 'g1_b24', fx: 'daemmerung', lines: [
      { who: 'erz', text: 'Abends im Gartenhaus. Ohne Sonnenbrille. Ohne Plan.' },
      { who: 'erz', text: 'Nino fühlte sich ganz klein.' },
      { who: 'nino', text: 'Ich bin halt doch kein richtiger Agent.', stil: 'leise' },
      { who: 'erz', text: 'Er nahm die Ledermappe in die Hand. Nicht wegen einem Werkzeug. Sondern weil sie nach Opa roch, nach Uhrenöl und Pfefferminz, und weil sie das Einzige war, das sich gerade richtig anfühlte.' },
    ] },
    { img: 'g1_b25', lines: [
      { who: 'erz', text: 'Zwischen den alten Zetteln fand er einen, den er noch nie gesehen hatte:' },
      { who: 'opa', text: 'Wenn du nicht weiterweisst: Wer hatte NICHTS davon?' },
      { who: 'erz', text: 'Nino las den Satz. Und nochmal. Und nochmal.' },
      { who: 'nino', text: 'Nichts davon. Wer hatte nichts davon?', stil: 'leise' },
      { who: 'nino', text: 'Herr Schlatter? Nein — der wollte die Glocke verkaufen.', stil: 'leise' },
      { who: 'nino', text: 'Aber wer wollte gar nichts verkaufen? Wer wollte nur, dass die Glocke bleibt, wo sie hingehört?', stil: 'leise' },
    ] },

    /* ---- RÄTSEL 3: Wer hatte nichts davon? ---- */
    { raetsel: {
      art: 'wahl', layout: 'verdaechtige',
      intro: { who: 'erz', text: 'Hilf Nino nachdenken. Wer wollte gar nichts verkaufen? Wer wollte nur, dass die Glocke bleibt, wo sie hingehört?' },
      optionen: [
        { who: 'schlatter', img: 'ico_muenzen', falsch: { who: 'erz', text: 'Herr Schlatter? Der wollte die Glocke verkaufen. Der hatte etwas davon. Überleg nochmal.' } },
        { who: 'kummer', img: 'ico_schraubenzieher', richtig: true, say: { who: 'nino', text: 'Herr Kummer.' } },
        { who: 'brunner', img: 'ico_notizbuch', falsch: { who: 'erz', text: 'Onkel Brunner? Der glaubt immer noch, es war der Wind. Überleg nochmal.' } },
      ],
      hilfe: [
        { who: 'erz', text: 'Wer hat eine Werkstatt voller Werkzeug und sieht alles, ohne je etwas zu sagen?' },
        { who: 'erz', text: 'Tipp auf den Mann in der Mitte. Den Hausmeister.' },
      ],
      danach: [
        { who: 'erz', text: 'Der Schulhausmeister. Der alles sah und nie etwas sagte. Der gestern «Überstunden» gemacht hatte. Der eine Werkstatt voller Werkzeug hatte.' },
        { who: 'nino', text: 'Was, wenn er die Glocke gar nicht gestohlen, sondern in Sicherheit gebracht hatte — bevor Herr Schlatter zuschlagen konnte?', stil: 'leise' },
      ],
    } },

    { img: 'g1_b26', lines: [
      { who: 'erz', text: 'Im Schulhausflur roch es nach Putzmittel, scharf und zitronig. Ninos Schritte hallten auf dem alten Boden. Er ging langsamer. Vor der Tür zur Werkstatt blieb er stehen. Dahinter: Stille.' },
      { who: 'erz', text: 'Er hob die Hand.' },
    ] },

    /* ---- RÄTSEL 4: Klopf an die Tür ---- */
    { raetsel: {
      art: 'klopfen', img: 'g1_r4_tuer', anzahl: 3, sfx: 'knock', tuer: { x: 205, y: 185, r: 58 },
      intro: { who: 'erz', text: 'Jetzt du. Klopf an die Tür. Dreimal.' },
      zaehlen: [
        { who: 'erz', text: 'Einmal.' },
        { who: 'erz', text: 'Zweimal.' },
        { who: 'erz', text: 'Dreimal.' },
      ],
      hilfe: [
        { who: 'erz', text: 'Tipp mit dem Finger auf die Tür.' },
        { who: 'erz', text: 'Tipp genau auf den Kreis, der auf der Tür leuchtet.' },
      ],
    } },

    { img: 'g1_b27', lines: [
      { who: 'erz', text: 'Die Tür ging auf. Herr Kummer schaute herunter. Sein Gesicht war wie immer: still, grau, schwer zu lesen.', sfx: 'creak' },
      { who: 'nino', text: 'Herr Kummer. Sie haben das Bärglöckchen.' },
      { who: 'erz', text: 'Nichts.' },
      { who: 'nino', text: 'Aber nicht gestohlen. Gerettet.' },
      { who: 'erz', text: 'Nichts. Nichts.' },
      { who: 'erz', text: 'Dann, ganz langsam, etwas in Herrn Kummers Gesicht, das beinahe ein Lächeln war.' },
      { who: 'kummer', text: 'Hat lang genug gedauert.' },
    ] },
    { img: 'g1_b28', lines: [
      { who: 'erz', text: 'In der Werkstatt, zwischen Schrauben und einem alten Kalender, stand das Bärglöckchen. Klein, silbern, ein bisschen angelaufen.' },
      { who: 'kummer', text: 'Dieser Schlatter ist ein Gauner.' },
      { who: 'erz', text: 'Pause.' },
      { who: 'kummer', text: 'Das wusste dein Grossvater.' },
      { who: 'erz', text: 'Lange Pause.' },
      { who: 'kummer', text: 'Und dein Onkel hätte gesagt …' },
      { who: 'nino', text: '… es war der Wind.' },
      { who: 'erz', text: 'Sie grinsten beide.' },
      { who: 'kummer', text: 'Dein Grossvater hat auf die Dinge aufgepasst, die andere nicht sehen.' },
      { who: 'erz', text: 'Herr Kummer schaute Nino an. Lange.' },
      { who: 'kummer', text: 'Sieht aus, als macht das jetzt jemand anders.' },
      { who: 'erz', text: 'Nino schluckte. Sein Hals war eng. Aber auf eine gute Art.' },
    ] },

    { img: 'g1_b29', lines: [
      { who: 'erz', text: 'Am Nachmittag schraubte Herr Kummer die Glocke zurück auf den Brunnen. Mit sechs Schrauben statt vier.' },
    ] },

    /* ---- RÄTSEL 5: Schrauben festdrehen ---- */
    { raetsel: {
      art: 'schrauben', img: 'g1_r5_glocke', anzahl: 6, sfx: 'screw', punkte: [[108, 46], [200, 45], [292, 46], [90, 247], [200, 247], [315, 247]],
      intro: { who: 'erz', text: 'Hilf Herrn Kummer. Dreh jede Schraube fest. Tipp auf alle sechs.' },
      hilfe: [
        { who: 'erz', text: 'Tipp auf eine Schraube, die noch leuchtet.' },
        { who: 'erz', text: 'Da, wo es orange blinkt. Genau dort tippen.' },
      ],
      danach: [
        { who: 'erz', text: 'Fest. Alle sechs. Diese Glocke holt so schnell niemand mehr herunter.', sfx: 'bell' },
      ],
    } },

    { img: 'g1_b30', lines: [
      { who: 'nino', text: 'Frag Frau Imhof, ob sie wirklich eine Kuckucksuhr verkaufen wollte.' },
      { who: 'erz', text: 'Wollte sie nicht. Frau Imhof hatte gar keine Kuckucksuhr. Herr Schlatter hatte gelogen.' },
      { who: 'erz', text: 'Frau Gerber hob ihre Kaffeetasse, als Nino vorbeiging.' },
      { who: 'gerber', text: 'Dein Grossvater hätte das genauso gemacht.' },
      { who: 'erz', text: 'Sie trank einen Schluck.' },
      { who: 'gerber', text: 'Eine Spur schneller vielleicht.' },
      { who: 'erz', text: 'Sie zwinkerte.' },
      { who: 'gerber', text: 'Aber er hatte mehr Übung.' },
    ] },
    { img: 'g1_b31', lines: [
      { who: 'erz', text: 'Und dann stand da Mila. Mitten auf dem Marktplatz. Feldstecher um den Hals. Hände in die Hüften gestemmt.' },
      { who: 'mila', text: 'ICH hab den Fall gelöst. Es war der Hausmeister. Das war doch total klar.' },
      { who: 'erz', text: 'Nino schaute Leyla an. Leyla schaute Nino an.' },
      { who: 'leyla', text: 'Total klar.' },
    ] },

    { img: 'g1_b32', fx: 'nacht', lines: [
      { who: 'erz', text: 'Abends im Gartenhaus. Nino schrieb in sein Heft:' },
      { who: 'nino', text: 'Fall Nummer 1: Das Bärglöckchen. Erledigt. Note: Genügend.', stil: 'liest' },
      { who: 'erz', text: 'Genügend. Mehr war es wohl nicht. Ein richtiger Agent hätte den Fall schneller gelöst. Und hätte nicht die Sonnenbrille im Brunnen versenkt. Und vorher ins Gipfeli-Blech fallen lassen.' },
    ] },
    { img: 'g1_b33', lines: [
      { who: 'erz', text: 'Aber als er die Ledermappe zuklappen wollte, fiel ein Zettel heraus. Opa Ernsts Handschrift:' },
      { who: 'opa', text: 'Gut gemacht, Nino. Das nächste Werkzeug findest du unter dem Boden vom Gartenhaus.' },
      { who: 'erz', text: 'Ninos Herz machte einen Sprung. Opa hatte gewusst, dass Nino das Gartenhaus benutzen würde. Opa hatte das hier vorbereitet. Für ihn.' },
      { who: 'erz', text: 'Aber es war spät, und Mama rief zum Abendessen.' },
    ] },
    { img: 'g1_b34', lines: [
      { who: 'erz', text: 'Nino setzte die Sonnenbrille auf. Sie war feucht vom Brunnen, klebrig vom Gipfeli-Blech, und ein Entenfederchen hing am Bügel. Aber sie sass auf seiner Nase.' },
      { who: 'erz', text: 'Er fühlte sich ein kleines bisschen grösser als heute Morgen.' },
      { who: 'nino', text: 'Agent 0815. Erster Fall. Erledigt.' },
    ] },

  ],
};
if (typeof module !== 'undefined') module.exports = BUCH_G01;

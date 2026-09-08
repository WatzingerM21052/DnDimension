# Sternenbruch – Storyboard des Kampagnenraums

**Stand:** 2026-09-08 · **Status:** Low-Fidelity-Design zur Durchsicht, keine implementierte Oberfläche.

Vertiefung von [EXP-01](../../delivery/2026-09-08-experience-plan.md) und dem [Erlebniskonzept](2026-09-08-immersive-experience-design.md). Die grundsätzliche Richtung wurde im Gespräch bestätigt; dieses konkrete Layout und seine Bedienung sind noch nicht getestet. Die folgenden sechs Wireframes sind schematisch, keine fertigen Illustrationen oder maßstabsgetreuen Mockups. Release-Gates bleiben unverändert.

## Gemeinsame Regie

Ein eigener Ort statt einer Ansammlung unabhängiger Werkzeuge: Der warme Kartentisch bleibt der visuelle Anker. Das Figurenbuch liegt links, die Chronik rechts; der Sternenbogen im Hintergrund rahmt den Kampagnentitel. Arbeitsflächen übernehmen diese Materialien sparsam, ohne Text auf unruhige Illustrationen zu legen.

Desktop-Entwurfsfläche: 1440 × 900 CSS-Pixel. Kopfzeile 64 Pixel, Rand 32 Pixel, Rasterabstand 24 Pixel. Formulare erhalten links etwa 208 Pixel für Kapitel und rechts etwa 280 Pixel für die Vorschau; der Inhalt dazwischen wächst. Diese Maße sind Entwurfswerte, keine starren Mindestbreiten.

Die bestehende Arcane-Cartographer-Palette und Typografie bleiben erhalten: dunkles Blau als Grund, warmes Papier für Inhalte, Messing für Orientierung, Türkis für die Hauptaktion. Pro Ansicht genau eine visuell dominante Aktion. Fokus, Fehler und Status werden zusätzlich durch Form und Text vermittelt.

Die persistente Kopfzeile zeigt Kampagne, Bereich, Wissenskontext und Darstellung. „Spieleransicht“ ist hier eine lokale Vorschau der freigegebenen Informationen, kein bereits implementiertes Mehrspieler-Rollensystem. Kein geheimer Inhalt darf in diese Vorschau gelangen.

## Durchgehendes Beispiel

Die eigene Kampagne **Sternenbruch** spielt an einer unterbrochenen Handelsroute. Im stillgelegten Observatorium leuchtet nachts wieder ein Signal. Die aktive Gruppe steht am Nordtor und spricht mit der Kartografin **Mira Venn**.

Die Spielleitung verwaltet zusätzlich den noch nicht eingesetzten Charakterentwurf **Neris**. Dadurch lässt sich die Charaktererstellung zwischen zwei Sitzungen zeigen, ohne eine aktive Figur nachträglich umzubauen. Zahlen in der Vorschau stammen später ausschließlich aus dem validierten Regelprofil; dieser Entwurf erfindet keine Regelresultate.

```text
01 Kampagnenraum → 02 Figurenbuch → 03 Attribute ändern
        ↑                                  │
        └──── 04 Rückkehr mit Entwurf ←─────┘
                    │
              05 Sitzung fortsetzen → 06 Hinweis freigeben
```

## Bild 01 – Ankommen: „Hier geht unser Abenteuer weiter“

```text
┌ Sternenbruch / Übersicht ───────── DM-Kontext · Darstellung ┐
│ Charaktere   Welt   Vorbereitung   Journal                 │
│                                                           │
│              S T E R N E N B R U C H                      │
│                 [Sternenbogen]                            │
│                                                           │
│ [Figurenbuch]        [Kartentisch]        [Chronik]         │
│ Charaktere           Welt                Journal          │
│                                         Vorbereitung      │
│ ┌ Letzte Situation ─────────────────────────────────────┐ │
│ │ Am Nordtor wartet Mira auf eure Entscheidung.         │ │
│ │ Sitzung 03 · pausiert              [Fortsetzen]       │ │
│ └───────────────────────────────────────────────────────┘ │
└ Lokal gespeichert · Daten & Sicherung                      ┘
```

- **Blickführung:** Titel → helle Fortsetzen-Karte → beschriftete Raumobjekte. Dekor ist dem aktuellen Spielstand untergeordnet.
- **Aktion im Storyboard:** „Charaktere“ öffnet Bild 02. „Fortsetzen“ würde ohne Umweg Bild 05 öffnen. Die direkte Navigation erreicht dieselben Ziele.
- **Bewegung:** maximal 450 ms feste Annäherung an das Figurenbuch; Labels und Fokus bleiben eindeutig. Reduzierte Bewegung öffnet die Zielansicht unmittelbar.
- **Leer-/Fehlerzustand:** ohne Sitzung „Sitzung vorbereiten“, ohne Kampagne separater Startzustand mit „Kampagne anlegen“. Ladefehler zeigen Wiederholen und Datenhilfe, keinen vermeintlich leeren Bestand.
- **Prüffrage:** Findet eine neue Person Fortsetzen, ohne zuerst die Raumobjekte ausprobieren zu müssen?

## Bild 02 – Figurenbuch: ein Entwurf, keine Wand aus Regeln

```text
┌ Sternenbruch / Charaktere ─────────────── Zur Übersicht ┐
│ Neris · Entwurf              Regelprofil: 2024          │
├────────────────┬───────────────────────┬───────────────┤
│ Idee           │ Attribute             │ Vorschau      │
│ Klasse         │                       │ Neris         │
│ Herkunft       │ Methode: Standardwerte│               │
│ > Attribute    │ Werte zuordnen        │ Noch nicht    │
│ Identität      │ [Attribut] [Wert ▼]   │ spielfertig   │
│ Ausstattung    │ [Attribut] [Wert ▼]   │               │
│ Prüfen         │ …                     │ [Warum?]      │
│                │                       │               │
├────────────────┴───────────────────────┴───────────────┤
│ Entwurf gespeichert                 [Weiter: Identität]│
└────────────────────────────────────────────────────────┘
```

- **Einstieg:** Figurenbuch zeigt im Beispiel den zuletzt geöffneten Entwurf; „Alle Charaktere“ bleibt als untergeordneter Link erreichbar. Ohne letzten Entwurf erscheint zuerst die Auswahl, ohne Figuren die Erstellung.
- **Inhalt:** Kapitelstatus unterscheidet offen, vollständig und zu prüfen. „2024“ ist keine spontane Umschaltfläche: Ein späterer Editionswechsel benötigt einen gesonderten, erklärten Ablauf.
- **Interaktion:** Dropdowns oder auswählbare Wertchips mit Tastaturalternative; kein notwendiges Drag-and-drop. Herkunftsanpassungen stehen getrennt von den Grundwerten.
- **Entwurf versus gültige Figur:** Speichern bleibt auch bei unvollständigen Pflichtwahlen möglich. Erst „Prüfen und abschließen“ verlangt Vollständigkeit.
- **Prüffrage:** Versteht die Person, welche Wahl sie jetzt trifft und weshalb der Charakter noch nicht spielfertig ist?

## Bild 03 – Eine Entscheidung wird nachvollziehbar

```text
┌ Neris / Attribute ──────────────────────────────────────┐
│ Zuordnung ändern                                       │
│ [Attribut A] [neuer Wert ▼]                             │
│                                                        │
│ Der Wert ist bereits Attribut B zugeordnet.             │
│ [Zuordnungen tauschen]   [Abbrechen]                     │
│                                                        │
│ ┌ Warum verändert sich dieser Wert? ──────────────────┐ │
│ │ Grundwert → Herkunftsanpassung → Ergebnis           │ │
│ │ Betroffene Werte: aus dem aktiven Regelprofil       │ │
│ │ Regelquelle: Titel, Version und Fundstelle          │ │
│ └────────────────────────────────────────────────────┘ │
│ Änderung gespeichert · [Rückgängig]      [Weiter]        │
└────────────────────────────────────────────────────────┘
```

Der Wireframe zeigt den Konfliktbereich und den nach erfolgreichem Tausch sichtbaren Speicherstatus zur Illustration; im tatsächlichen Ablauf erscheinen sie nacheinander, nicht als widersprüchliche gleichzeitige Zustände.

1. Auswahl eines bereits vergebenen Werts verändert zunächst nichts dauerhaft.
2. „Zuordnungen tauschen“ bestätigt beide betroffenen Zuordnungen ausdrücklich; Abbrechen bewahrt den alten Entwurf.
3. Die Regelvorschau aktualisiert nur belegbare Werte. Nicht unterstützte Ableitungen werden benannt, nicht geschätzt.
4. Erst nach erfolgreichem Speichern erscheint „Änderung gespeichert“. Rückgängig stellt die vorherige Zuordnung über denselben kontrollierten Änderungsweg wieder her.

Betroffene Werte werden einmal für etwa 200 ms markiert. Eine kurze Statusmeldung ist auch ohne Animation wahrnehmbar; es gibt kein blinkendes Zahlenzählen. „Warum?“ öffnet ein Kontextpanel, dessen Schließen den Fokus an den Auslöser zurückgibt.

**Speicherfehler:** Eingabe sichtbar bewahren, „Noch nicht gespeichert“ und Wiederholen anbieten. Beim Verlassen muss die Person zwischen Bleiben und bewusstem Verwerfen wählen können. Kein Erfolgshinweis auf Basis einer bloßen Animation.

**Prüffrage:** Kann die Person erklären, was sich verändert hat, und den Tausch ohne Hilfe zurücknehmen?

## Bild 04 – Zurück im Raum, ohne den Faden zu verlieren

```text
┌ Sternenbruch / Übersicht ──────────────── DM-Kontext ┐
│ Charaktere   Welt   Vorbereitung   Journal           │
│                                                     │
│ [Figurenbuch: Fokus]     [Kartentisch]     [Chronik]  │
│ Neris · Entwurf                                     │
│                                                     │
│ Sitzung 03 · Am Nordtor                             │
│ Die Gruppe wartet auf Miras Antwort.                │
│                                     [Fortsetzen]   │
└─────────────────────────────────────────────────────┘
```

„Zur Übersicht“ und Browser-Zurück führen wieder in denselben Kampagnenkontext. Bei Rückkehr über den Raumlink wird der Fokus am Figurenbuch wiederhergestellt; bei anderem Einstieg gilt ein sinnvoller Seitenfokus. Eine kurze umgekehrte Kamerafahrt ist optional. Der Entwurf bleibt ein Entwurf und wird weder automatisch der Gruppe zugewiesen noch in die laufende Sitzung übernommen.

„Fortsetzen“ öffnet den gespeicherten Sessionzustand. Es erzeugt keine neue Sitzung und spielt kein Intro ab. Mehrfachklick erzeugt keine mehrfachen Starts. Ein Entwurfsfehler aus Bild 03 darf nicht hinter diesem Bildschirm verschwinden.

**Prüffrage:** Ist klar, dass Neris gespeichert wurde, während die pausierte Gruppe unverändert blieb?

## Bild 05 – Spielen: die Situation hat Vorrang

```text
┌ Sternenbruch / Sitzung 03 ───── DM-Kontext · Pausieren ┐
│ Beteiligte: aktive Gruppe                            │
├──────────────────────────────────┬───────────────────┤
│ NORDTOR                          │ Kontextbuch       │
│ Mira rollt ihre beschädigte      │ Mira Venn         │
│ Karte auf dem Brunnenrand aus.   │ Bekannte Fakten   │
│                                  │                   │
│ Offene Entscheidung              │ DM-Notizen        │
│ Wohin führt die alte Route?      │ Nicht freigegeben │
│                                  │ [Hinweis prüfen]  │
│ Bisherige bestätigte Ereignisse  │                   │
├──────────────────────────────────┴───────────────────┤
│ Handlung oder Notiz erfassen …                       │
│ [Sprechen] [Untersuchen] [Andere Handlung]            │
└ Lokal gespeichert · keine KI verbunden               ┘
```

Die Handlungshilfen öffnen im ersten Produktumfang eine menschlich geleitete Erfassung beziehungsweise Auflösung. Sie erzeugen weder selbstständig NPC-Antworten noch automatische Würfe. Der DM entscheidet, ob überhaupt eine Probe erforderlich ist. Die aktive Figur wird aus dem Sessionkontext gewählt, nicht aus dem zuletzt bearbeiteten Charakterentwurf.

Exploration und soziale Szenen verwenden denselben Rahmen. Kampf ergänzt Initiative und Ressourcen, ohne die Szene durch einen völlig anderen Bildschirm zu ersetzen. Ein vorgeschlagener Effekt bleibt von einem bestätigten Ergebnis unterscheidbar.

**Aktion im Storyboard:** „Hinweis prüfen“ öffnet Bild 06. Dieser Weg ist nur im DM-Kontext vorhanden. In der Spieleransicht erscheint an seiner Stelle kein verräterischer Platzhalter für geheime Inhalte.

**Prüffrage:** Kann eine Person nach einer Unterbrechung Situation, Beteiligte und offene Entscheidung benennen?

## Bild 06 – Eine Enthüllung mit sichtbaren Folgen

```text
┌ Sitzung 03 / Hinweis prüfen ───────────────────────────┐
│ DM-Entwurf · nicht freigegeben                         │
│ Öffentlicher Titel: Der vergessene Steg                │
│ Öffentlicher Text: Hinter dem Nordtor zweigt ein alter  │
│ Pfad zum Fluss ab.                                     │
│                                                       │
│ Private Notiz (wird NICHT übernommen)                  │
│ Mira verschweigt, wer die Karte verändert hat.         │
│                                                       │
│ [Öffentliche Vorschau ansehen]                         │
│ Übernehmen in: öffentliche Sessionchronik              │
│                       [Abbrechen] [Hinweis freigeben]  │
└───────────────────────────────────────────────────────┘
```

- **Vor Bestätigung:** Spielerprojektion bleibt unverändert. Die Vorschau wird ausschließlich aus öffentlichen Feldern gebildet; private Notizen werden nicht bloß per CSS versteckt.
- **Nach Bestätigung:** öffentliche Szene und Sessionjournal zeigen denselben bestätigten Hinweis, keine zwei unabhängig erzeugten Texte. Status: „Freigegeben · im Sessionjournal erfasst“; Fokus landet auf der Bestätigung mit Link zum Eintrag.
- **Langfristige Übernahme:** Kampagnenwissen wird erst beim vorgesehenen Sitzungsabschluss ausdrücklich übernommen. Der Hinweis ist jetzt in der laufenden Sitzung öffentlich, nicht schon automatisch dauerhaft in allen Kampagnenansichten verbreitet.
- **Doppelklick/Fehler:** eine Freigabe erzeugt genau einen Eintrag. Bei Fehler bleibt der Entwurf erhalten; keine teilweise vorgetäuschte Veröffentlichung.
- **Korrektur:** eine spätere Änderung wird nachvollziehbar protokolliert. Bereits gelesene Informationen lassen sich nicht durch „Rückgängig“ aus dem Wissen der Mitspielenden entfernen.
- **Bewegung:** kurze Markierung am neuen Journaleintrag; beim Wechsel zur öffentlichen Vorschau keine Übergangsschnappschüsse mit DM-Inhalten.

**Prüffrage:** Kann die Spielleitung vor dem Klick sicher sagen, was sichtbar wird und was privat bleibt?

## Mobile und einfache Darstellung

Bei 390 × 844 Pixeln gilt für alle sechs Bilder dieselbe Inhaltsreihenfolge; bei 320 Pixeln muss sie ohne horizontales Seitenscrollen funktionieren. Navigation ist nicht in der Illustration versteckt.

| Bild | Mobile Anordnung | Einfache Desktop-Alternative |
|---|---|---|
| 01 | Titel, Fortsetzen-Karte, beschriftete Bereichskarten; Raum als flacher Bildkopf | dieselben Bereichskarten neben statischer Raumillustration |
| 02 | Kapitelwahl, aktiver Schritt, aufklappbare Vorschau | unverändertes Formular ohne Raumübergang |
| 03 | Auswahl, Tauschbestätigung, Erklärung untereinander | sofortiges Statusupdate statt Bewegung |
| 04 | Fortsetzen zuerst, Entwurfstatus darunter | direktes Wiedererscheinen der Übersicht |
| 05 | Szene, Entscheidung, Aktionen; Kontext als eigene aufklappbare Ansicht | unveränderte Sessionansicht |
| 06 | öffentliche Felder, private Notiz klar getrennt, Vorschau und Bestätigung | keine animierte Enthüllung nötig |

Touch-Ziele werden mit mindestens 44 × 44 CSS-Pixeln geplant. Fixierte Aktionsleisten dürfen weder letzte Formularfelder noch Fokus oder Bildschirmtastatur verdecken. Lange Texte scrollen natürlich. Zurück aus einem Kontextpanel führt zur vorigen Leseposition. Darstellungseinstellungen bleiben auch vor dem Laden von Raumassets erreichbar.

## Abnahme und nächster Übergang

Für das Low-Fidelity-Review prüfen wir sechs Fragen: Fortsetzen auffindbar, Charakterentscheidung verständlich, Änderung umkehrbar, Session unverändert, Wiedereinstieg klar, Freigabe sicher. Diese Fragen sind noch nicht mit Nutzern getestet.

EXP-01 ist mit diesem Dokument **textuell und als Wireframe ausgearbeitet**, aber noch nicht als ausillustriertes Storyboard visuell abgenommen. Vor EXP-02 werden diese Layouts durchgesehen; bei gewünschter höherer visueller Treue folgen sechs statische, gestaltete Ansichten. Dafür braucht es keine App-Implementierung und keinen neuen technischen Stack.

Ein späterer Navigationsprototyp verwendet synthetische Daten und trägt „Design-Demo – keine echten Spielstände“. Die Bilder 03 und 06 prüfen dort Verständlichkeit, nicht die Korrektheit einer fertigen Regel- oder Speicherengine. Produktintegration und deren Tests bleiben eigene Arbeitspakete.

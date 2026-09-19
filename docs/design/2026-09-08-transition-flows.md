# Übergänge: vom Raum zur Handlung

**Stand:** 2026-09-08. **Status:** konkretisierter Designvorschlag; keine Implementierung, keine bestandenen Interaktionstests. Die mobile Bildrichtung wurde im Gespräch positiv aufgenommen. Das ist keine technische Abnahme.

Grundlagen: [Designreferenz](2026-09-08-visual-direction-and-interaction.md), [mobile Studien](2026-09-08-mobile-studies.md), [Bewegungsbudgets](../superpowers/specs/2026-09-08-immersive-experience-design.md). Die folgenden Abläufe präzisieren diese Vorgaben, ohne Releaseumfang oder Fachmodelle zu ändern.

## 1. Gemeinsamer Ablauf eines Wechsels

```text
Ziel wählen → Zugriff und ungespeicherte Eingaben prüfen
           → erlaubtes Ziel öffnen → Fokus und Kontext herstellen
           → optionale Bewegung endet, Arbeitsfläche ruht
```

Die logische Navigation hängt nicht am Ende einer Animation. Wenn Zielinhalte fehlen, wird ein ehrlicher Lade-/Fehlerzustand gezeigt; keine fertig aussehende leere Seite. Ein bereits sichtbares Ziel bleibt bedienbar, während Dekoration ausläuft. Gleichzeitige Wechsel werden nicht als Fahrten aufgestaut: Das jüngste erlaubte Ziel gewinnt. Ein Speicherschutzdialog ist davon ausgenommen und wird nicht durch weitere Klicks umgangen.

**Zustandsgrenzen:** URL und Bereich beschreiben Navigation; Panelwahl und Lesemodus beschreiben Darstellung; Charakterentwurf und Handlungsentwurf sind getrennte fachnahe Daten; bestätigte Sessionfolgen entstehen ausschließlich über deren autorisierte Änderungswege. Öffnen, Schließen oder Animieren allein schreibt keine Spielfolgen.

## 2. Die sechs Hauptabläufe

| Ablauf | Ausgangspunkt und Aktion | Sichtbares Ergebnis | Fokus und Erhalt |
|---|---|---|---|
| A · Station öffnen | Raum → „Charaktere“ | Figurenbuch, aktive Figur oder verständliche Auswahl | Fokus zur Zielüberschrift; Kampagne bleibt gleich |
| B · Direkt wechseln | Figurenbuch → „Welt“ | Kartenansicht ohne Raumtour | Entwurf sichern oder Schutz anbieten; letzter Kartenausschnitt bleibt erhalten |
| C · Ort nachschlagen | Karte → „Nordtor“ | Desktop-Dossier / mobiles Ortsblatt | Fokus zur Detailüberschrift; Auswahl bleibt sichtbar, kein Reiseereignis |
| D · Kontext öffnen | Sitzung → „Figuren“ → Mira | ein ergänzendes Panel mit erlaubtem Wissen | Leseposition und Eingabe unverändert; Schließen zurück zum Auslöser |
| E · Lesen erweitern | Sitzung → „Lesefokus“ | mehr Chronik, kleinere Szene | gleicher gelesener Eintrag, kein Sprung ans Ende |
| F · Handlung vorbereiten | Entwurf → „Auflösung vorbereiten“ | Prüfoberfläche für Absicht und Auflösung | Eingabe bleibt vorhanden; noch keine Ressourcenänderung |

### A. Raum → Figurenbuch → Raum

1. Klick, Touch oder Enter aktiviert denselben beschrifteten Stationslink.
2. Sofortiger Auswahlzustand; im atmosphärischen Modus kurze Annäherung von bevorzugt 350–450 ms, niemals über 600 ms. Die Schließe bewegt sich innerhalb dieses Budgets.
3. Das Formular erscheint als scharfe, gerade Arbeitsfläche. Die Kamera ist kein weiterlaufender Hintergrundeffekt.
4. „Zur Übersicht“ führt zum Raum; dort wird der auslösende Stationslink fokussiert, sofern er weiterhin vorhanden ist. Sonst erhält die Überschrift Fokus.

Direktlink oder Reload starten im Figurenbuch, ohne nachgeholte Ankunftsanimation. Ein fehlender Entwurf führt zu verständlicher Auswahl oder Fehlerbehandlung, nicht zu einer neu angelegten Figur.

### B. Arbeitsansicht → andere Arbeitsansicht

Der direkte Wechsel nutzt einen kurzen Übergang von 180–240 ms, ohne erst in den Raum zurückzukehren. Vorher wird der Speicherstatus geprüft. Ein vollständig lokal gesicherter, aber noch unvollständiger Charakterentwurf darf verlassen werden. Ein fehlgeschlagener Speicherversuch bleibt dagegen sichtbar.

Schutztext: „Deine letzten Änderungen sind noch nicht gespeichert.“ Aktionen: **„Hier bleiben“**, **„Speichern und wechseln“**, **„Änderungen verwerfen“**. Verwerfen bedeutet nur die noch ungesicherten Änderungen seit dem letzten bestätigten Speicherstand, nicht das Löschen der Figur. Scheitert erneutes Speichern, bleibt die bisherige Ansicht mit den Eingaben erhalten.

### C. Karte → Ort → zurück zur Karte

Marker, Suche und Liste wählen dieselbe Orts-ID. Auf Desktop öffnet sich das Dossier neben der Karte, mobil zunächst das kompakte Ortsblatt. Ist der Marker überdeckt, erfolgt nur die nötige Ausschnittkorrektur; Zoom bleibt gleich. Eine Einblendung dauert höchstens 240 ms und wartet nicht auf ein Ortsbild.

„Ortsdetails öffnen“ führt zur eigenständigen Detailansicht. Zurück stellt Auswahl und Kartenausschnitt wieder her. Das bloße Schließen des kompakten Blatts entfernt nur das Blatt; die Auswahl darf markiert bleiben. Ein anderer Marker ersetzt den Inhalt, statt weitere Blätter zu stapeln.

Verschieben und Zoomen sind keine animierten Stationswechsel. Ortsnamen und Schaltflächen bleiben lesbar; keine Kameraneigung oder automatische Drehung. Ohne kalibrierte Geometrie gibt es keine verbindlichen Distanzwerte.

### D. Sitzung → Figurenkontext → Sitzung

Auf Desktop ersetzt das ergänzende Panel bei Bedarf ein bereits offenes Werkzeugpanel. Es ist nicht modal: die Sitzung bleibt erreichbar, der Fokus wird nicht darin gefangen. Auf kleinen Geräten wird der ausführliche Kontext als temporäre modale Ansicht dargestellt; Hintergrundinhalte sind dann nicht bedienbar. Kompaktes Karten-Ortsblatt und ausführlicher mobiler Figurenkontext sind unterschiedliche Zustände.

Eine sichtbare Schließen-Aktion funktioniert ohne Wischgeste. Escape schließt das oberste temporäre Element, nicht sofort die Sitzung. Bei Rückkehr werden Auslöserfokus, Leseanker und Handlungsentwurf wiederhergestellt. Wenn der Auslöser nicht mehr existiert, erhält die nächstpassende Bereichsüberschrift Fokus. Private Notizen werden nicht in eine Spielerprojektion oder deren Übergangsschnappschüsse übernommen.

### E. Szenenfokus ↔ Lesefokus ↔ Eingabe

Die Darstellungswahl heißt **„Szenenfokus“ / „Lesefokus“**; der übergeordnete mobile Navigationspunkt heißt **„Sitzung“**, nicht nochmals „Szene“. Das korrigiert die doppelte Bedeutung im mobilen Bild.

Beim Wechsel wird der aktuell gelesene Eintrag mit seinem relativen Abstand als Anker bewahrt, statt einen rohen Pixelwert trotz verändertem Layout blind wiederzuverwenden. Der Wechsel dauert optional 180–240 ms; bei Reduced Motion erfolgt er unmittelbar. Neue Einträge ändern den Fokusmodus nicht. Wer zurückliest, bekommt „Neue Einträge“ angeboten, ohne automatische Rückführung.

Beim Öffnen der Bildschirmtastatur darf die Szene weichen. Eingabe und primäre Aktion bleiben erreichbar, die Bereichsnavigation darf vorübergehend entfallen. Nach Schließen der Tastatur kehrt der vorher gewählte Fokusmodus zurück. Tastaturschließen sendet keine Handlung. Bei zu wenig Höhe wird natürlicher Scrollraum bereitgestellt, statt Schrift oder Touchziele zu verkleinern.

### F. Handlung → Prüfung → bestätigtes Ergebnis

```text
Handlungsentwurf → Auflösung vorbereiten → Prüfung durch Spielleitung
                      ↑                          │
                      └── Überarbeiten/Abbrechen ┤
                                                 ↓
                           erforderliche Auflösung durchführen
                                                 ↓
                           Ergebnis prüfen und ausdrücklich bestätigen
                                                 ↓
                           bestätigter Zustand + Journaleintrag
```

Vorbereitung zeigt Absicht, beteiligte Figur/Ziel und bekannte Voraussetzungen. Ein Wurf wird nur verlangt, wenn die menschliche Spielleitung ihn für nötig hält. Unterstützte Regeln können eine nachvollziehbare Berechnung liefern; nicht unterstützte Fälle werden benannt und benötigen den vorgesehenen manuellen Weg. Das Design behauptet keine vorhandene Regelengine.

Vor Bestätigung lautet der Status „Entwurf“ oder „Prüfung offen“. Nach tatsächlich erfolgreicher Übernahme „Ergebnis übernommen“. Wiederholtes Bestätigen darf keine doppelten Effekte erzeugen. Ein unbekannter Speicher-/Übertragungsstatus wird als ungeklärt angezeigt und zunächst geprüft, nicht durch erneutes blindes Ausführen aufgelöst. Abbrechen bewahrt den Entwurf und verwirft nur unbestätigte Vorschläge.

## 3. History, Wiederherstellung und Grenzen

Für den ersten Prototyp wird die bisher vorgeschlagene einfache Politik beibehalten: Hauptansichten erzeugen History-Einträge, ergänzende Panels und Fokusmodi nicht. Browser-Zurück wechselt daher die Hauptansicht und schließt nicht zwingend zuerst ein Panel. Die sichtbare Panel-Schließen-Aktion bleibt der eindeutige Weg. Diese mobile Konsequenz ist ausdrücklich im Nutzertest zu prüfen; eine andere History-Politik wäre eine bewusste Designänderung.

Eine spätere native App müsste Plattform-Zurück gesondert spezifizieren; dieser Entwurf verspricht dafür noch kein Verhalten. Reload-Wiederherstellung wird von gewöhnlichem Bereichswechsel unterschieden:

| Zustand | Wechsel innerhalb der App | Nach Reload |
|---|---|---|
| bestätigte Spielfakten | unverändert vorhanden | aus autoritativem Speicher wiederherstellen |
| gesicherter Charakter-/Handlungsentwurf | bewahren | gespeicherte Entwurfsrevision laden |
| noch ungesicherte Eingabe | halten oder Schutzdialog | keine Wiederherstellung garantieren; Schutz und frühe lokale Sicherung separat testen |
| Kartenausschnitt und Leseanker | pro Kampagne/Sitzung erhalten | nur bei erfolgreicher Speicherung als UI-Präferenz; sonst sinnvoller Einstieg |
| temporäres Panel | bei passendem Kontext erhalten, sonst schließen | zunächst geschlossen; Direktlink auf Detail bleibt eigenständig |
| Kamerafahrt | beenden/ersetzen | nicht fortsetzen |

Speicherung von UI-Präferenzen ist best effort und blockiert keine Spielfunktion. Ein verschwundener Leseanker führt zum nächstpassenden Eintrag mit verständlicher Orientierung. Veraltete oder nicht mehr erlaubte Ziele werden nicht aus einem Cache wieder sichtbar gemacht.

## 4. Prüfszenarien für den späteren Prototyp

| ID | Szenario | Erwartung |
|---|---|---|
| TR-01 | Raumstation per Maus, Touch und Tastatur öffnen | gleiches Ziel, sichtbarer Fokus, keine Pflichtanimation |
| TR-02 | zehn schnelle Stationswechsel | letztes erlaubtes Ziel; keine Fahrtenwarteschlange oder doppelten Änderungen |
| TR-03 | Figurenentwurf mit simuliertem Speicherfehler verlassen | Schutz mit klaren Optionen; Eingaben bleiben bis bewusster Entscheidung |
| TR-04 | Marker unter künftigem Dossier wählen | Marker bleibt erreichbar; kein Zoomreset oder Reiseereignis |
| TR-05 | bei älterem Chronikeintrag Panel öffnen/schließen | gleicher Leseanker und unveränderter Entwurf |
| TR-06 | im Lesefokus neue Einträge erhalten | Hinweis statt erzwungenem Sprung oder Layoutwechsel |
| TR-07 | mobile Tastatur öffnen, drehen, schließen | Eingabe/Aktion erreichbar; Entwurf bleibt, kein versehentliches Absenden |
| TR-08 | Reduced Motion vor und während eines Wechsels aktivieren | Bewegung entfällt/endet; gültiger Zielzustand und Fokus bleiben |
| TR-09 | Browser-Zurück, Direktlink und Reload testen | dokumentierte History-Politik; keine Raumtour oder leeren Scheindaten |
| TR-10 | DM- zu Spielerprojektion wechseln | keine geheimen Panelreste, Suchtreffer oder Übergangsbilder |
| TR-11 | Bestätigung doppelt auslösen, Fehlerstatus simulieren | ein Ergebnis oder klarer ungeklärter Status; kein zweiter Effekt |
| TR-12 | 320 CSS-Pixel, 200 % Zoom, fehlendes Szenenbild | Kernaufgaben erreichbar; keine durch Dekoration verdeckten Aktionen |

Alle Szenarien sind **noch nicht ausgeführt**. Ein Demo-Prototyp kann Navigations- und Fehlerabläufe simulieren, aber keine Produktionspersistenz oder Regelkorrektheit beweisen. Timingbudgets bleiben die aus dem Erlebniskonzept; Messungen benötigen dokumentierte Geräte und Browser.

## 5. Übergabegrenze

Dieser Ablauf ist das nächste prüfbare Planungsergebnis. Als Folgeschritt kann nach Durchsicht ein begrenzter klickbarer Navigationsprototyp separat freigegeben werden. Die hier verwendeten TR-IDs sind lokale Prüfkennungen, keine bereits angelegten oder abgeschlossenen GitHub-Issues.

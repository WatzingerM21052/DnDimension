# DnDimension – lokale Navigationsdemo

Ein funktionaler Durchstich, **keine fertige App und keine bildgetreue Umsetzung**. Die Weltkarte besitzt eine echte verschiebbare Kartenfläche mit HTML-Ortsmarkern. Die übrigen Bildstudien bleiben nicht-interaktive Referenzen.

## Start

Im Repository mit Node.js 24:

```powershell
node docs/design/prototype/serve.mjs
```

Dann [lokale Demo öffnen](http://127.0.0.1:4178/prototype/). Port 4178, ausschließlich `127.0.0.1`. Beenden mit Ctrl+C. Keine Installation oder Netzwerkdienste nötig. Der Server liefert nur explizit freigegebene Browserdateien und Design-PNGs aus; keine privaten Bücher, Verzeichnislisten oder Produktdateien. Die GitHub-Sicherung stellt keine öffentliche Website bereit.

## Durchklicken

1. Raum → Figurenbuch; eine Idee zu Neris eingeben.
2. Weltkarte → vergrößern, ziehen, Nordtor/Alter Steg/Observatorium/Tannwald öffnen und Dossier schließen. „Gesamte Karte“ setzt die Ansicht zurück.
3. Sitzung → Handlung schreiben, Figuren öffnen/schließen, Lesefokus wechseln.
4. Andere Station wählen und per Browser-Zurück zurückkehren: Eingaben bleiben erhalten.
5. „Auflösung vorbereiten“ zeigt ausschließlich eine Textvorschau ohne Spielfolgen.
6. „Weniger Bewegung“ aktivieren; die Betriebssystempräferenz wird zusätzlich respektiert.

Eingaben existieren nur im Arbeitsspeicher des geöffneten Dokuments. **Neuladen verwirft sie.** Keine echten oder sensiblen Spielstände eingeben. Ein unvollständiger Charaktereditor oder Würfelautomat wird nicht simuliert.

## Verifikation

```powershell
node --test docs/design/prototype/*.test.mjs
node --check docs/design/prototype/app.mjs
node --check docs/design/prototype/state.mjs
node --check docs/design/prototype/serve.mjs
```

Prüfstand einschließlich seitlichem Ortsdossier (2026-09-08):

- Ab 1100 px Browserbreite feste Dossierspalte neben der Karte. Ein ruhiger Hinweis belegt den Platz ohne geöffnetes Dossier; Öffnen/Schließen verändert die Kartenbreite nicht. Darunter bleibt das nichtmodale Dossier im Inhaltsfluss unter der Karte.
- Vorher im Browser bestätigt: Dossier lag unterhalb der Karte. Nachher: rechts daneben, Kartenbreite vor/nach Öffnen jeweils 849,5 px im geprüften Desktopfenster. Nordtor → Observatorium sowie Escape-Fokusrückgabe geprüft.
- Bei 390 und 320 px Browserbreite bleibt das geöffnete Dossier unterhalb der Karte; Dokumentbreite entspricht jeweils der verfügbaren Breite (375 bzw. 305 px). „Auf Karte zeigen“ mobil bedient, Dossiertitel erhält Fokus. Abschließendes Browserfehlerprotokoll leer.
- Bestehende 20 Node-Tests weiterhin bestanden; Layoutänderung direkt im Browser geprüft, keine neue Spiellogik. Kein Versprechen einer vollständig scrollfreien Bedienung: außerhalb des sichtbaren Bereichs liegende Inhalte werden weiterhin über die bestehende Fokus-/Scrollführung erreichbar gemacht.
- Gestaltung: vorhandene Pergament-/Messingfarben und Schriftrollen unverändert; separate schmale Wissensspalte statt Kartenüberlagerung. Keine zusätzliche Bewegung, auch bei Reduced Motion keine neue Animation.

Vorheriger Richtungsstand:

- 20 Node-Tests bestanden; neue Richtungstests vor Implementierung mit zwei erwarteten Fehlern ausgeführt. Alle vier Richtungen, Randbegrenzung und unbekannte Richtung abgedeckt.
- Browser: Ost-Button verschiebt um 60 px, Pfeil links kehrt zur vorherigen Position zurück. Bei 305 % Zoom bleibt Nordtor nach Tab-Fokus innerhalb der Karte und der Zoom erhalten.
- Richtungstasten am jeweiligen Rand deaktiviert, nach Reset alle vier deaktiviert. Mobile 320-Pixel-Stichprobe: vier Trefferflächen je 44 × 44 px. Einen 1-px-Überlauf der Stationsnavigation reproduziert und korrigiert; danach Dokument- und Inhaltsbreite jeweils 305 px. Abschließendes Browserfehlerprotokoll leer. Keine vollständige Accessibility-Abnahme.

Vorheriger Suchstand:

- 18 Node-Tests bestanden. Neu: Teilwortsuche unabhängig von Groß-/Kleinschreibung und äußerem Leerraum, leere/erfolglose Suche sowie Kamerafokus mit Zoom-Erhalt und Randbegrenzung. Nach TDD zuerst fünf erwartete Fehler beobachtet, dann implementiert.
- Browser: „  STEG  “ liefert nur Alter Steg; Enter fokussiert den Treffer, weiteres Enter öffnet das Dossier. „Auf Karte zeigen“ schließt es und fokussiert die Karte bei weiterhin 125 % Zoom und verändertem Kartenausschnitt.
- Erfolglose Suche und „Suche leeren“ geprüft; alle vier Treffer kommen zurück. Mobile Stichprobe 390 × 844: Suche nach Tannwald, Dossier und Kartenrückweg bedient; Dokumentbreite 375 px ohne horizontalen Überlauf. Abschließendes Browserfehlerprotokoll leer.

Vorheriger Kartenstand:

- 13 Node-Tests bestanden. Zusätzlich zum ursprünglichen Durchstich: Zoom-Anker, Zoomgrenzen, Pan-Grenzen, Größenwechsel und ungültige Eingaben; neue Browsermodule durch HTTP-Test abgedeckt.
- Im Browser: Zoom 100 → 125 %, Pfeiltasten-Pan, Maus-Drag mit geändertem Transform, Reset, Marker → Dossier → Escape mit Fokusrückgabe, Zoom-Erhalt beim Stationswechsel.
- Mobile Browseransicht 390 × 844: Observatorium öffnet korrekt mit Fokus auf Dossiertitel; Dokumentbreite und verfügbare Breite jeweils 375 px, kein horizontaler Überlauf. Keine Browserfehler in der abschließenden Prüfung.
- Scroll-Konflikt reproduziert und behoben: normales Mausrad scrollt die Seite; nur Alt + Mausrad auf der fokussierten Karte zoomt. Danach Desktop- und mobilen Dossierweg erneut erfolgreich geprüft.

Bereits zuvor geprüft:

- Acht Node-Tests bestanden: Navigation, unveränderliche Zustandsübergänge, Entwurfserhalt, Ortswahl/Lesemodus, Panelwechsel, sichere Dateiauslieferung und Ablehnung unerlaubter Pfade/Methoden.
- Im Codex-Browser geprüft: vier Ansichten, Browser-Zurück mit Handlung und Figurenidee, Ortsdossier, Figurenpanel, Lesefokus, ungültiger Hash, Leerraum-Eingabe abgewiesen, HTML-Zeichen als Klartext, manuelle Bewegungsreduktion.
- Skip-Link-Fehler im Browser reproduziert, korrigiert und erneut geprüft: kein unbeabsichtigter Routenwechsel mehr.
- Responsive Stichprobe mit 390 × 844 Viewport: DOM-Breite 375 CSS-Pixel (Scrollbar), Dokumentbreite ebenfalls 375; kein horizontaler Überlauf. Das ist keine vollständige mobile Abnahme.
- Keine bestehenden App-Tests ausgeführt: `code/` wurde nicht geändert, keine App-Abhängigkeiten installiert. Die Demo hatte vor Beginn keine eigene Testsuite.

## Noch offen / bewusste Grenzen

- Kalibrierung und Atlaswechsel. Ortssuche, Pan/Zoom und vier Marker sind implementiert, aber keine Reise-, Entfernungs- oder Sichtbarkeitsregeln. Suche umfasst ausschließlich die vier öffentlichen Demo-Ortsnamen, keine Volltext-/Tippfehlersuche.
- Touch nutzt Einfinger-Verschieben und Zoom-Buttons; kein Pinch-Zoom. Native Gerätegesten wurden nicht geprüft. Die mobile Browseransicht ist keine physische Geräteabnahme.
- Eigene optimierte Szene-/Portraitassets statt vollständiger UI-Referenzbilder; echte Raumkamerafahrten. Aktuell nur kurze Einblendung/Versetzung (220 ms, aus Raum 400 ms).
- Finale Foundation-Schriften/-Komponenten: hier lokale Georgia-/Segoe-UI-Fallbacks, keine zweite Produktions-Designbibliothek.
- Mobile Kontextpanels sind im Inhaltsfluss **nicht modal**. Bildschirmtastatur und native Gerätegesten sind nicht getestet.
- Chronik bewahrt derzeit numerische Scrollposition; semantischer Leseanker bei Textumbruch/Viewportwechsel bleibt offen. Keine Synchronisation oder neu eintreffenden Ereignisse implementiert.
- Keine Produktionspersistenz, Speicherfehler-Simulation, Rollen-/Rechtesystem oder Geheimnisprojektionen. Es werden ausschließlich öffentliche synthetische Daten geladen.
- Keine vollständige Tastatur-/Screenreader-, Forced-Colors-, 200%-Zoom-, 320-Pixel- oder Performanceprüfung. Kein pauschales Bestehen der TR-01–12-Szenarien.
- Keine Behauptung, dass EXP-02 insgesamt abgeschlossen ist.

## Struktur

`state.mjs` enthält den Demo-Zustand, `app.mjs` bindet ihn an die Oberfläche. `map-state.mjs` berechnet begrenzte Kamerakoordinaten und Suchtreffer, `map.mjs` bindet Suche und Pointer-/Tastatureingaben. `map.css` ergänzt die Darstellung. Vier Testdateien prüfen echte Funktionen beziehungsweise HTTP-Antworten, ohne neue Testpakete.

## Kartenbedienung und Gestaltung

- Suche filtert nur die Ortsliste direkt unter dem Suchfeld; Marker bleiben zur Orientierung sichtbar. Enter im Suchfeld fokussiert den ersten Treffer, ohne ihn automatisch zu öffnen. Suchtext bleibt beim Stationswechsel erhalten und wird beim Neuladen verworfen.
- „Auf Karte zeigen“ im Dossier schließt den Kontext und richtet die Karte auf den gewählten Ort aus, soweit die Kartenränder dies zulassen. Zoom bleibt unverändert; bei 100 % bleibt die Gesamtkarte sichtbar. Keine animierte Kamerafahrt, kein zusätzlicher Bewegungsreiz.
- Zoom 100–400 %, begrenztes Verschieben, Reset; Kamera bleibt beim Stationswechsel im Arbeitsspeicher erhalten. Neuladen setzt sie zurück.
- Pfeiltasten verschieben die fokussierte Karte, + / − zoomen, Pos1 setzt zurück. Browser-Zoom-Tastenkürzel werden nicht abgefangen.
- Ortsmarker behalten beim Zoomen ihre Bildschirmgröße. Die gleichwertige Ortsliste bleibt auch für außerhalb des Ausschnitts liegende Orte erreichbar. Tastaturfokus auf einen abgeschnittenen Marker richtet den Ausschnitt auf diesen Ort aus und erhält den Zoom.
- Vier beschriftete Richtungstasten unter der Karte bieten Verschieben ohne Drag-Geste. Sie bewegen den Ausschnitt um 60 Bildschirm-Pixel pro Aktivierung, wie die Pfeiltasten. Nicht mögliche Richtungen sind deaktiviert; bei Gesamtansicht muss zuerst vergrößert werden.
- Ein Drag öffnet kein versehentliches Dossier. Escape schließt das nichtmodale Dossier und gibt den Fokus zurück.
- Ruhiges Pergament, dunkler Rahmen und Messingdetails; keine dekorativen Daueranimationen und kein simuliertes Reisen. Alle Orte sind öffentliche synthetische Beispieldaten.
- Neues Asset: [08-world-terrain.png](../assets/08-world-terrain.png), erzeugt mit dem eingebauten Imagegen-Werkzeug als eigenständige Ableitung von `03-world-map.png`; ursprüngliche Studie unverändert. Keine Handbuchgrafiken verwendet.

Verwendeter Bildprompt (eingebautes Werkzeug, kein CLI):

> Use case: precise-object-edit. Asset type: clean background illustration for an interactive DnDimension fantasy map. Input image is edit target/style reference. Extract and recompose ONLY the illustrated terrain map to fill an entire landscape 1536x1024 canvas. Keep its beautiful hand-inked medieval cartography, restrained parchment, muted forest green and blue rivers, fine shaded contours, architectural miniatures, and geographic relationships: walled town Nordtor in western middle around (32%,40%), observatory on northeast hill (76%,20%), dense Tannwald forest east middle (82%,52%), old bridge over river in lower middle (51%,68%). NO text anywhere, NO labels, NO markers, NO buttons, NO navigation, NO side panel, NO compass, NO scale, NO border, NO book or desk. Map terrain must fill every edge. This is a usable background asset, not a UI mockup. Keep small villages, rivers, lakes, mountains and roads; avoid photorealism, huge 3D buildings or high-saturation colors.

Grundlagen: [Umsetzungsplan](../../superpowers/plans/2026-09-08-navigation-demo.md), [Übergänge](../2026-09-08-transition-flows.md), [Bildreferenzen](../2026-09-08-visual-direction-and-interaction.md).

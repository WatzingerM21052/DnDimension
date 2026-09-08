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

Prüfstand einschließlich interaktiver Karte (2026-09-08):

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

- Kartensuche, Kalibrierung und Atlaswechsel. Pan/Zoom und vier Marker sind implementiert, aber keine Reise-, Entfernungs- oder Sichtbarkeitsregeln.
- Touch nutzt Einfinger-Verschieben und Zoom-Buttons; kein Pinch-Zoom. Native Gerätegesten wurden nicht geprüft. Die mobile Browseransicht ist keine physische Geräteabnahme.
- Eigene optimierte Szene-/Portraitassets statt vollständiger UI-Referenzbilder; echte Raumkamerafahrten. Aktuell nur kurze Einblendung/Versetzung (220 ms, aus Raum 400 ms).
- Finale Foundation-Schriften/-Komponenten: hier lokale Georgia-/Segoe-UI-Fallbacks, keine zweite Produktions-Designbibliothek.
- Mobile Kontextpanels sind im Inhaltsfluss **nicht modal**. Bildschirmtastatur und native Gerätegesten sind nicht getestet.
- Chronik bewahrt derzeit numerische Scrollposition; semantischer Leseanker bei Textumbruch/Viewportwechsel bleibt offen. Keine Synchronisation oder neu eintreffenden Ereignisse implementiert.
- Keine Produktionspersistenz, Speicherfehler-Simulation, Rollen-/Rechtesystem oder Geheimnisprojektionen. Es werden ausschließlich öffentliche synthetische Daten geladen.
- Keine vollständige Tastatur-/Screenreader-, Forced-Colors-, 200%-Zoom-, 320-Pixel- oder Performanceprüfung. Kein pauschales Bestehen der TR-01–12-Szenarien.
- Keine Behauptung, dass EXP-02 insgesamt abgeschlossen ist.

## Struktur

`state.mjs` enthält den Demo-Zustand, `app.mjs` bindet ihn an die Oberfläche. `map-state.mjs` berechnet begrenzte Kamerakoordinaten, `map.mjs` bindet Pointer-/Tastatureingaben. `map.css` ergänzt die Darstellung. Drei Testdateien prüfen echte Funktionen beziehungsweise HTTP-Antworten, ohne neue Testpakete.

## Kartenbedienung und Gestaltung

- Zoom 100–400 %, begrenztes Verschieben, Reset; Kamera bleibt beim Stationswechsel im Arbeitsspeicher erhalten. Neuladen setzt sie zurück.
- Pfeiltasten verschieben die fokussierte Karte, + / − zoomen, Pos1 setzt zurück. Browser-Zoom-Tastenkürzel werden nicht abgefangen.
- Ortsmarker behalten beim Zoomen ihre Bildschirmgröße. Die gleichwertige Ortsliste bleibt auch für außerhalb des Ausschnitts liegende Orte erreichbar. Tastaturfokus auf einen abgeschnittenen Marker stellt die Gesamtansicht wieder her.
- Ein Drag öffnet kein versehentliches Dossier. Escape schließt das nichtmodale Dossier und gibt den Fokus zurück.
- Ruhiges Pergament, dunkler Rahmen und Messingdetails; keine dekorativen Daueranimationen und kein simuliertes Reisen. Alle Orte sind öffentliche synthetische Beispieldaten.
- Neues Asset: [08-world-terrain.png](../assets/08-world-terrain.png), erzeugt mit dem eingebauten Imagegen-Werkzeug als eigenständige Ableitung von `03-world-map.png`; ursprüngliche Studie unverändert. Keine Handbuchgrafiken verwendet.

Verwendeter Bildprompt (eingebautes Werkzeug, kein CLI):

> Use case: precise-object-edit. Asset type: clean background illustration for an interactive DnDimension fantasy map. Input image is edit target/style reference. Extract and recompose ONLY the illustrated terrain map to fill an entire landscape 1536x1024 canvas. Keep its beautiful hand-inked medieval cartography, restrained parchment, muted forest green and blue rivers, fine shaded contours, architectural miniatures, and geographic relationships: walled town Nordtor in western middle around (32%,40%), observatory on northeast hill (76%,20%), dense Tannwald forest east middle (82%,52%), old bridge over river in lower middle (51%,68%). NO text anywhere, NO labels, NO markers, NO buttons, NO navigation, NO side panel, NO compass, NO scale, NO border, NO book or desk. Map terrain must fill every edge. This is a usable background asset, not a UI mockup. Keep small villages, rivers, lakes, mountains and roads; avoid photorealism, huge 3D buildings or high-saturation colors.

Grundlagen: [Umsetzungsplan](../../superpowers/plans/2026-09-08-navigation-demo.md), [Übergänge](../2026-09-08-transition-flows.md), [Bildreferenzen](../2026-09-08-visual-direction-and-interaction.md).

# DnDimension – lokale Navigationsdemo

Ein erster funktionaler Durchstich, **keine fertige App und keine bildgetreue Umsetzung**. Die bestehenden Bildstudien sind nicht-interaktive Referenzen. Tatsächliche Links, Formulare und Buttons stehen getrennt daneben.

## Start

Im Repository mit Node.js 24:

```powershell
node docs/design/prototype/serve.mjs
```

Dann [lokale Demo öffnen](http://127.0.0.1:4178/prototype/). Port 4178, ausschließlich `127.0.0.1`. Beenden mit Ctrl+C. Keine Installation oder Netzwerkdienste nötig. Der Server liefert nur die vier Browserdateien und Design-PNGs aus; keine privaten Bücher, Verzeichnislisten oder Produktdateien. Die GitHub-Sicherung stellt keine öffentliche Website bereit.

## Durchklicken

1. Raum → Figurenbuch; eine Idee zu Neris eingeben.
2. Weltkarte → Nordtor/Alter Steg öffnen und Dossier schließen.
3. Sitzung → Handlung schreiben, Figuren öffnen/schließen, Lesefokus wechseln.
4. Andere Station wählen und per Browser-Zurück zurückkehren: Eingaben bleiben erhalten.
5. „Auflösung vorbereiten“ zeigt ausschließlich eine Textvorschau ohne Spielfolgen.
6. „Weniger Bewegung“ aktivieren; die Betriebssystempräferenz wird zusätzlich respektiert.

Eingaben existieren nur im Arbeitsspeicher des geöffneten Dokuments. **Neuladen verwirft sie.** Keine echten oder sensiblen Spielstände eingeben. Ein unvollständiger Charaktereditor oder Würfelautomat wird nicht simuliert.

## Verifikation

```powershell
node --test docs/design/prototype/state.test.mjs docs/design/prototype/serve.test.mjs
node --check docs/design/prototype/app.mjs
node --check docs/design/prototype/state.mjs
node --check docs/design/prototype/serve.mjs
```

Prüfstand des ersten Durchstichs:

- Acht Node-Tests bestanden: Navigation, unveränderliche Zustandsübergänge, Entwurfserhalt, Ortswahl/Lesemodus, Panelwechsel, sichere Dateiauslieferung und Ablehnung unerlaubter Pfade/Methoden.
- Im Codex-Browser geprüft: vier Ansichten, Browser-Zurück mit Handlung und Figurenidee, Ortsdossier, Figurenpanel, Lesefokus, ungültiger Hash, Leerraum-Eingabe abgewiesen, HTML-Zeichen als Klartext, manuelle Bewegungsreduktion.
- Skip-Link-Fehler im Browser reproduziert, korrigiert und erneut geprüft: kein unbeabsichtigter Routenwechsel mehr.
- Responsive Stichprobe mit 390 × 844 Viewport: DOM-Breite 375 CSS-Pixel (Scrollbar), Dokumentbreite ebenfalls 375; kein horizontaler Überlauf. Das ist keine vollständige mobile Abnahme.
- Keine bestehenden App-Tests ausgeführt: `code/` wurde nicht geändert, keine App-Abhängigkeiten installiert. Die Demo hatte vor Beginn keine eigene Testsuite.

## Noch offen / bewusste Grenzen

- Echte Kartenfläche mit Pan/Zoom, Marker-Overlays, Suche, Kalibrierung und Atlaswechsel.
- Eigene optimierte Szene-/Portraitassets statt vollständiger UI-Referenzbilder; echte Raumkamerafahrten. Aktuell nur kurze Einblendung/Versetzung (220 ms, aus Raum 400 ms).
- Finale Foundation-Schriften/-Komponenten: hier lokale Georgia-/Segoe-UI-Fallbacks, keine zweite Produktions-Designbibliothek.
- Mobile Kontextpanels sind im Inhaltsfluss **nicht modal**. Bildschirmtastatur und native Gerätegesten sind nicht getestet.
- Chronik bewahrt derzeit numerische Scrollposition; semantischer Leseanker bei Textumbruch/Viewportwechsel bleibt offen. Keine Synchronisation oder neu eintreffenden Ereignisse implementiert.
- Keine Produktionspersistenz, Speicherfehler-Simulation, Rollen-/Rechtesystem oder Geheimnisprojektionen. Es werden ausschließlich öffentliche synthetische Daten geladen.
- Keine vollständige Tastatur-/Screenreader-, Forced-Colors-, 200%-Zoom-, 320-Pixel- oder Performanceprüfung. Kein pauschales Bestehen der TR-01–12-Szenarien.
- Keine Behauptung, dass EXP-02 insgesamt abgeschlossen ist.

## Struktur

`state.mjs` enthält den DOM-unabhängigen Demo-Zustand, `app.mjs` bindet ihn an die Oberfläche. `index.html`/`styles.css` sind die Darstellung, `serve.mjs` der lokale Server. Die zwei Testdateien prüfen echte Funktionen beziehungsweise HTTP-Antworten, ohne neue Testpakete.

Grundlagen: [Umsetzungsplan](../../superpowers/plans/2026-09-08-navigation-demo.md), [Übergänge](../2026-09-08-transition-flows.md), [Bildreferenzen](../2026-09-08-visual-direction-and-interaction.md).

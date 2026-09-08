# Kampagnenprototyp – zusammenhängende Demo

Stand: 2026-09-08 · Branch `codex/navigation-demo` · isoliert von `code/` und dem UI-Foundation-Worktree.

## Was jetzt bedienbar ist

| Station | Tatsächliche Funktion | Bewusste Grenze |
|---|---|---|
| Observatorium | Sechs Stationszugänge, direkter Spieltisch, aktueller Kampagnentitel und Ziel; eigene CSS-Armillarsphäre | Kein begehbarer 3D-Raum, ursprüngliche Illustration separat als Referenz |
| Figurenbuch | Drei Kapitel: Identität, sechs Attribute und TP, Geschichte. Übernahme in Bogen und Begegnung | Freier Einzelcharakter-Entwurf; keine vollständige Erstellung nach Handbuch, Spezies-/Klassenpakete, Zauber oder Level-ups |
| Weltkarte | Suche, Marker, Dossiers, begrenztes Pan/Zoom, Tastatur-/Richtungstasten, Desktop-Seitendossier | Vier öffentliche Demo-Orte; keine Weltbearbeitung, Reisen, taktische Geometrie oder Atlasumschaltung |
| Kampagne | Titel, nächstes Ziel und Szenenauftakt bearbeiten und im Raum/Spieltisch anzeigen | Eine lokale Beispielkampagne, keine Mitglieder-/Rechteverwaltung |
| Bestiarium | Drei eigene Wesen ansehen, mehrfach in eine Begegnung übernehmen | Erfundenes Beispielmaterial, keine offiziellen Monsterwerte oder Encounter-Balance |
| Inventar | Gegenstände hinzufügen, Mengen erhöhen/verringern, Ausrüstung markieren | Keine Traglast, Währung oder regelwirksamen Boni; Nullmengen bleiben sichtbar |
| Journal | Textnotizen anlegen, archivieren, einblenden und wiederherstellen | Keine geheimen DM-Notizen, Synchronisation oder dauerhafte Speicherung |
| Sitzung | Vorbereiteter Auftakt, Chronik, Handlungsvorschlag, manuell bestätigte Erzählung, Figurenkontext, Lesefokus, freier Würfeltisch und manuelle Begegnung | Keine KI-Antwort, Angriffs-/Zauberautomatik, Ressourcenverrechnung oder vollständige Kampfregeln |

Alle Änderungen leben nur im Speicher dieses Browserdokuments. Browser-Navigation zwischen Stationen erhält sie; Neuladen beginnt neu. UI weist dauerhaft darauf hin. Kein LocalStorage, Upload, externer Dienst oder zusätzlicher Paketdownload.

## Vollständiger Durchlauf

1. Observatorium öffnen → Figurenbuch. Name, Editionskennzeichnung, Klasse/Konzept und Herkunft bearbeiten.
2. Zum Grundwertekapitel wechseln, Zahlen setzen, Geschichte ergänzen und Figur übernehmen. Bogen aktualisiert sich; die Figur wird in der Begegnung entsprechend umbenannt. Änderungen während eines laufenden Kampfes werden mit Hinweis abgelehnt.
3. Kampagne öffnen, Titel/Ziel/Auftakt übernehmen. Die Übersicht und der Spieltisch verwenden diese Texte.
4. Auf der Karte nach einem Ort suchen, Dossier öffnen, zur Karte zurückkehren.
5. Im Bestiarium ein Wesen zur Begegnung hinzufügen. Während einer laufenden Begegnung sind Hinzufügen/Entfernen und Initiativeänderungen gesperrt.
6. Inventar: einen Gegenstand einpacken, Menge ändern, ausrüsten. Journal: Hinweis notieren und optional archivieren.
7. Sitzung: freie Initiative setzen und Begegnung starten. Höhere Initiative beginnt, Gleichstände behalten ihre Reihenfolge. „Nächster Zug“ läuft alle Beteiligten durch und erhöht nach dem letzten die Runde.
8. TP mit ±1 manuell verändern; Werte bleiben zwischen 0 und Maximum. 0 TP überspringt niemanden und löst keine Todesregeln aus. Beenden bewahrt TP und Teilnehmer.
9. Freie Würfe: 1–10 Würfel, W4/W6/W8/W10/W12/W20/W100 und Modifikator −20 bis +20. Einzelwürfe und Summe sind sichtbar; letzte fünf Würfe bleiben im UI. Browser-Pseudozufall, kein manipulationssicherer Würfeldienst.
10. Handlung eingeben → Auflösung vorbereiten → eigene Erzählung als Spielleitung formulieren → bewusst in die Chronik übernehmen. Keine automatische KI oder Würfelinterpretation.
11. „Neueste Erzählung anzeigen“ führt auf Wunsch zum Ende der Chronik. Beim Ergänzen wird die numerische Leseposition nicht automatisch ans Ende gesetzt.

## Regelquellen und Aussagegrenzen

Die Editionsauswahl 2024/2014 ist **nur ein Label am Entwurf**. Diese Erweiterung lädt oder interpretiert keine Handbücher. Die vorhandenen PDFs werden weder veröffentlicht noch in die Demo eingebettet. Daher keine Behauptung, der Charakter sei vollständig oder regelkonform. Alle Gegnertexte und ihre Zahlen sind frei erfundene Demo-Inhalte.

Handbuchgestützte Erstellung, Quellen-/Seitenbelege und Editionstrennung der Regelengine bleiben eigenständige Produktarbeit. Das gilt ebenso für KI-DM, Multiplayer, Accounts, Persistenz, Rechte, echte Welt-/Storyeditoren, Audio, 3D-Kamerafahrten und Produktionsperformance. „Zusammenhängender Prototyp“ bedeutet nicht, sämtliche Produktanforderungen seien abgeschlossen.

## Gestaltung

Vorhandene Palette: Tintenblau `#0B1620`, Schiefer `#132631`, Pergament `#E8E0CF`, Messing `#D6A85F`, Akzent `#4FC3B5`. Georgia als Display-Fallback, Segoe UI für Bedienung. Keine neue Remote-Schrift oder zweite Produktionsbibliothek.

Die Armillarsphäre ist ein ruhiges, mit CSS gebautes Instrument, kein interaktives 3D-Versprechen. Das Figurenbuch hat zwei geschichtete Seiten; mobil einspaltig. Inventar als Liste, Journal als Einträge, Bestiarium als großzügige Vorlagen. Vorhandene kurze Stationsübergänge und Reduced-Motion-Schalter bleiben bestehen; keine neue Daueranimation.

## Tatsächlich verifiziert

- 27 Node-Tests bestanden: bisherige Navigation/HTTP/Kartentests plus zusätzliche Routen, Charaktervalidierung, unveränderliche Übernahme, Mengenbegrenzung, Ausrüstungsmarkierung, Journal/Klartext/Archiv, Vorbereitung, Chronik, Initiative/Runden/TP, Sperre laufender Begegnungen und Würfelgrenzen.
- Vor der Implementierung fehlende Kernfunktionen und Routen mit fehlgeschlagenen Tests nachgewiesen; danach grün. Syntaxcheck für `suite.mjs`, bestehende HTTP-Allowlist um die expliziten neuen Dateien erweitert.
- Browser-Durchlauf: Elara angelegt, Stärke 16 und eigene Geschichte übernommen; anschließend Kampagne „Die Uhr des Nebels“ und eigener Auftakt. Figur/Auftakt am Spieltisch korrekt übernommen.
- Messingwächter aus Bestiarium übernommen; Begegnung gestartet, Zug von Elara zum Wächter gewechselt, TP 18 → 17, Begegnung beendet. Würfelergebnis mit Einzelwurf und Summe sichtbar.
- Seil mit Anzahl 2 hinzugefügt, auf 1 reduziert. Journaltext mit `<b>` bleibt Klartext, kein erzeugtes HTML-Element. Archivieren, Archiv einblenden und Wiederherstellen erfolgreich.
- Eigene Erzählung in Chronik übernommen; späteren manuellen Lesesprung geprüft: Fokus auf Chronik, Scrollposition am Ende.
- 2014 im Figurenformular ausgewählt und im übernommenen Bogen sichtbar bestätigt. Dies prüft nur das Label, keine Regeln.
- Alle acht Routen im 320-px-Browserviewport durchlaufen. Ein Überlauf langer Gegnernamen reproduziert und korrigiert. Danach auch dort Dokumentbreite 305 px = verfügbare Breite; andere Stationen bereits ohne Überlauf.
- Bestehende Weltkarte/Dossier weiter bedient. Abschließendes Browserfehlerprotokoll leer.

Keine vollständige Screenreader-/Geräte-/Performanceabnahme, keine automatisierte End-to-End-Suite und keine Tests der Produkt-App unter `code/`. Physische Touchgesten und Bildschirmtastatur nicht geprüft.

## Reproduzieren

```powershell
node --test docs/design/prototype/*.test.mjs
node --check docs/design/prototype/suite.mjs
node --check docs/design/prototype/suite-state.mjs
node docs/design/prototype/serve.mjs
```

Aufrufen: `http://127.0.0.1:4178/prototype/`. Server ausschließlich lokal und mit expliziter Dateifreigabe. GitHub sichert den Quellstand, hostet dadurch keine öffentliche Demo.

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

Alle Änderungen leben zunächst im Speicher dieses Browserdokuments. Browser-Navigation zwischen Stationen erhält sie; Neuladen beginnt neu. Übernommene Kampagnendaten können jetzt manuell als JSON-Datei gesichert und importiert werden. Kein Autosave, LocalStorage, Upload, externer Dienst oder zusätzlicher Paketdownload.

## Manuelle Sicherung und Import

Unter **Kampagne → Kampagnendaten sichern**:

1. „Export vorbereiten“ erzeugt eine geprüfte Sicherung. Erst „Datei herunterladen“ bzw. Kopieren des JSON-Textes sichert sie außerhalb des Tabs. Die App behauptet nicht, dass ein vorbereiteter Download bereits gespeichert wurde.
2. Datei auswählen oder JSON einfügen. Die Prüfung begrenzt die Größe auf 1.000.000 UTF-8-Bytes, Sammlungen auf 500 Einträge und einzelne Texte auf 20.000 Zeichen. Formatkennung und Version müssen passen.
3. Vorschau zeigt Titel, Figur, Notiz- und Beteiligtenzahl. Unbekannte Felder, doppelte IDs, ungültige Werte/Flags, inkonsistente Figur/Begegnung und ungültige Zugpositionen werden abgelehnt. Keine Datenzusammenführung, kein Ausführen von Inhalten.
4. Erst „Diesen Stand übernehmen“ ersetzt die Kampagnendaten und synchronisiert die Figuren-/Vorbereitungsformulare. Abbrechen lässt den Stand unverändert. Änderungen am JSON verwerfen die vorherige Prüfvorschau.
5. „Stand vor Import zurückholen“ stellt den vorigen Kampagnenzustand wieder her; dabei gehen auch spätere Kampagnenänderungen seit dem Import verloren. Sichtbarer Hinweis, nur ein Rücknahmestand bis zum Neuladen.

Enthalten: übernommene Figur, Vorbereitung, Inventar, Journal inklusive Archiv, bestätigte Chronik, Beteiligte und Kampfzustand. Nicht enthalten: offene Formulare, Handlungsvorschlag, letzte Würfe, Karte/Suche oder Leseposition. Andere offene Formulare und Karten-/Würfelkontext bleiben beim Import bestehen; sie gehören nicht zur Sicherung.

Dateiformat: `dndimension-demo`, Version 1. Kein Format für produktive oder fremde D&D-Spielstände. Keine Verschlüsselung: nur synthetische Demo-Daten verwenden.

Zusätzlich verifiziert: 32 Node-Tests insgesamt. Export/Import-Rundlauf inklusive laufender Begegnung; beschädigtes JSON, zukünftige Version, Übergröße, HP/IDs/Zugpositionen/Flags und unbekannte Felder. Fehler nach Gegnerentfernung reproduziert und korrigiert: alte Zugposition wird jetzt auf die verbleibenden Beteiligten begrenzt.

Browser: Export-JSON und Download-Blob erzeugt, ungültiges JSON ohne Datenänderung abgewiesen, Vorschau ohne Übernahme geprüft, Sicherung übernommen und vorherigen Titel erfolgreich zurückgeholt. Bearbeitung des JSON versteckt die alte Vorschau. Bei 320 px Dokument- und Inhaltsbreite 305 px, keine Browserfehler. Der tatsächliche OS-Download-/Dateiauswahldialog wurde nicht automatisiert abgenommen; Import wurde über denselben Parser mit eingefügtem Export-JSON geprüft.

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

- Vor der Sicherungserweiterung: 27 Node-Tests bestanden; bisherige Navigation/HTTP/Kartentests plus zusätzliche Routen, Charaktervalidierung, unveränderliche Übernahme, Mengenbegrenzung, Ausrüstungsmarkierung, Journal/Klartext/Archiv, Vorbereitung, Chronik, Initiative/Runden/TP, Sperre laufender Begegnungen und Würfelgrenzen. Aktuell 32 Tests einschließlich Sicherungen, siehe oben.
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

# DEC-002: v1.0 Character Content Boundary

**Status:** Accepted<br>
**Datum:** 2026-08-28<br>
**Owner:** WatzingerM21052<br>
**Betroffene Releases/Requirements:** v0.2-v1.1; FR-001, FR-009, FR-011; CON-001, CON-002, CON-007, CON-009

## Kontext

Der Character Creator benötigt Klassen, Spezies, Hintergründe, Talente, Zauber, Ausrüstung und Regeltexte. Das vollständige Player's Handbook und Erweiterungsbücher enthalten proprietäre Optionen, die nicht als veröffentlichter App-Datenbestand oder Repository-Inhalt übernommen werden. Gleichzeitig benötigt v1.0 einen klaren, testbaren und ohne private Dateien funktionierenden Erstellungsablauf.

## Entscheidung

DnDimension liefert in v1.0 ausschließlich Charakteroptionen fest eingebaut aus, die aus dem offiziellen **SRD 5.2.1** rechtmäßig veröffentlicht und korrekt attribuiert werden können.

### Verbindlicher v1.0-Umfang

- Der Character Creator funktioniert vollständig mit dem eingebauten SRD-5.2.1-Datenpaket.
- Jede auswählbare Option besitzt Ruleset-, Source-, Lizenz- und Snapshot-Metadaten.
- Werte und abgeleitete Regeln werden gegen den 2024-Regelkern validiert.
- Nicht verfügbare Buchoptionen werden nicht erfunden, aus privaten PDFs kopiert oder als funktionslose Auswahl angezeigt.
- UI-Erklärungen werden eigenständig formuliert; längere proprietäre Regeltexte werden nicht übernommen.
- Der Kernablauf benötigt weder einen PDF-Anhang noch einen Onlinezugriff.

### Spätere private und Homebrew-Optionen

- Private beziehungsweise nicht im SRD enthaltene Optionen folgen frühestens mit dem kontrollierten Homebrew-/Settings-Ausbau ab v1.1.
- Solche Optionen müssen als `private` oder `homebrew` gekennzeichnet und pro Nutzer beziehungsweise Kampagne isoliert bleiben.
- Ein möglicher privater Import aus nutzereigenen Quellen benötigt vor Umsetzung eine eigene Produkt-, Sicherheits- und Lizenzentscheidung.
- Proprietäre Inhalte werden auch bei privater Nutzung nicht in Git, öffentliche Builds, Telemetrie oder gemeinsame Standarddatenpakete übernommen.

## Abnahmekriterien

- Jede im v1.0-Character-Creator sichtbare Content-Option lässt sich auf einen zugelassenen SRD-5.2.1-Snapshot zurückführen.
- Ein automatisierter Check schlägt fehl, wenn Source- oder Lizenzmetadaten fehlen.
- Der Character Creator kann ohne private Bibliothek und ohne Netzwerk einen gültigen Charakter erzeugen.
- Nicht unterstützte Optionen erscheinen nicht als auswählbare, aber unvollständige Platzhalter.
- Exportierte Charaktere bewahren die Quellenkennung ihrer Optionen.

## Erwogene Alternativen

1. **Vollständige PHB-/Erweiterungsdaten fest einbauen:** verworfen, weil diese Inhalte nicht automatisch veröffentlicht werden dürfen und den Scope stark erweitern.
2. **Private PDFs zur Laufzeit zwingend voraussetzen:** verworfen, weil v1.0 reproduzierbar, offline und ohne externe Dateivoraussetzung funktionieren soll.
3. **Beliebige manuelle Optionen bereits in v1.0:** verworfen, weil ein sicherer, validierbarer Homebrew-Editor ein eigener v1.1-Slice ist.
4. **Nicht unterstützte Optionen als deaktivierte Liste anzeigen:** verworfen, weil dies falsche Vollständigkeit vermittelt und keinen Nutzerwert liefert.

## Folgen und Trade-offs

- Der v1.0-Character-Creator bietet weniger Optionen als vollständige kommerzielle Regeltools, ist dafür reproduzierbar, veröffentlichbar und vollständig testbar.
- Datenmodell und UI müssen zwischen eingebautem SRD-, privatem und Homebrew-Content unterscheiden.
- Die private Referenzbibliothek bleibt Recherchequelle und wird nicht zur Laufzeitabhängigkeit der App.
- Neue eingebaute Content-Pakete benötigen Source-Registry-, Lizenz- und Regressionstests.

## Ersetzt / ersetzt durch

Keine vorherige Decision. Diese Entscheidung konkretisiert DEC-001 und die Content-Foundation.

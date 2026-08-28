# DEC-005: Session as Auditable Runtime Boundary

**Status:** Accepted<br>
**Datum:** 2026-08-28<br>
**Owner:** WatzingerM21052<br>
**Betroffene Releases/Requirements:** v0.2-v3.5; FR-006 bis FR-008, FR-022, FR-029 bis FR-039; NFR-011 bis NFR-015; CON-012, CON-014 bis CON-016

## Kontext

Kampagnen und Adventures beschreiben Regeln, Wissen und mögliche Spielsituationen. Eine konkrete Sitzung verändert dagegen Trefferpunkte, Ressourcen, Beziehungen, Hinweise, Zeit, Ziele und Weltzustand. Werden Vorlage und Laufzeitzustand vermischt oder Änderungen nur als letzter Wert gespeichert, lassen sich Pausen, Korrekturen, Spielerwissen und spätere KI-Kontexte nicht zuverlässig rekonstruieren.

DnDimension soll bereits ohne KI eine normale D&D-Sitzung unterstützen. Der frühe v0.6-Alpha-Slice darf klein sein, aber keine Combat-zentrierte Architektur festschreiben, welche soziale Interaktion und Erkundung später nur als Notizen anhängt.

## Entscheidung

Eine Session ist eine eigenständige, auditierbare Laufzeit- und Wissensgrenze innerhalb eines Adventures beziehungsweise einer Kampagne.

### Fachliche Hierarchie

```text
Campaign -> Adventure -> Session -> Scene/Encounter -> Event
```

- Kampagne, Adventure und Szenenvorlagen speichern geplante beziehungsweise langfristige Wahrheit.
- Die Session speichert den tatsächlich gespielten Ablauf und aktuellen Laufzeitzustand.
- Ergebnisse werden erst beim Abschluss oder durch eine ausdrückliche Zwischenbestätigung in übergeordnete Objekte übernommen.

### Drei gleichwertige Säulen

Social, Exploration und Combat verwenden denselben Beschreiben–Handeln–Auflösen–Folgen-Kern. Kampf erhält zusätzliche Runden- und Zugstruktur, ist aber nicht das allgemeine Modell für jede Szene.

### Ereignisse und Wiederaufnahme

- Regelrelevante Handlungen, Würfe, Enthüllungen und Zustandsänderungen werden als geordnete, unveränderlich referenzierbare Ereignisse protokolliert.
- Eine Korrektur löscht kein vorheriges Ereignis, sondern dokumentiert die Abweichung und den neuen Zustand.
- Konsistente Snapshots ermöglichen schnelles Laden und Wiederherstellung.
- Die technische Persistenz muss nicht als vollständiges Event Sourcing umgesetzt werden; Auditierbarkeit und deterministische Wiederaufnahme sind jedoch Produktanforderungen.

### DM-Autorität und Automatisierung

- Spielerhandlungen werden nie still erzeugt.
- Der DM entscheidet, ob ein Wurf erforderlich ist und welche Informationen sichtbar werden.
- Regelvorgänge tragen den Grad `computed`, `assisted` oder `manual_recorded`.
- Ein manueller Vorgang bleibt möglich, wenn Automatisierung einen Sonderfall noch nicht abdeckt, und wird sichtbar protokolliert.
- Manuelle Korrekturen bewahren vorherigen Wert, neuen Wert, Grund, Zeitpunkt und verantwortliche Rolle.

### Sichtbarkeit

Session-, Szenen- und Ereignisdaten erzwingen mindestens `dm_only`, `player_facing` und bewusstes `revealed`. Neue Datentypen sind deny-by-default. Persönliche Sichtbarkeit folgt erst mit dem Account- und Rollenmodell.

### Alpha und Endprodukt

v0.6 implementiert den kleinsten durchgängigen, säulenübergreifenden Ablauf und einen vollständigen kleinen Referenzkampf. Dieser Slice ist kein minimalistisches Endprodukt. v0.8 muss den gesamten v1-P0-Sitzungsumfang funktional enthalten; v0.9 stabilisiert ihn; v1.0 ermöglicht normalen lokalen Mehrsitzungsbetrieb für Spieler und menschlichen DM ohne KI.

## Abnahmekriterien

- Kampagnen-/Adventure-Vorlagen und Session-Laufzeitzustand besitzen getrennte IDs und Änderungswege.
- Eine pausierte Sitzung kann nach App-Neustart aus Snapshot und Log identisch fortgesetzt werden.
- Social-, Exploration- und Combat-Szenen können in derselben Sitzung auf gemeinsame Teilnehmer und Zustände zugreifen.
- Jede bestätigte Zustandsänderung ist auf Ereignis, Akteur, Quelle und Automatisierungsgrad zurückführbar.
- Korrekturen und Enthüllungen sind nachvollziehbar; sie überschreiben Historie oder Sichtbarkeit nicht still.
- Eine Session kann erst nach bestätigter Vorschau Adventure- oder Campaign-Zustand verändern.
- Die v1.0-Abnahme enthält eine Kampagne über mehrere Sitzungen und alle drei Säulen, nicht nur einen Combat-Demoablauf.

## Folgen und Trade-offs

- Das Datenmodell ist anspruchsvoller als ein Formular plus Combat-Tabelle.
- Audit-Log und Snapshot benötigen Konsistenz-, Migrations- und Wiederherstellungstests.
- Die Trennung erleichtert später Realtime-Synchronisation, VTT und KI, ohne diese Infrastruktur in v1.0 vorzuziehen.
- Transparente manuelle Auflösung verhindert Blockaden, verlangt aber klare UI-Kennzeichnung und darf Automatisierungslücken nicht verstecken.
- Vollständigkeit wird über klar definierte Reifegrade erreicht; v0.6 bleibt realistisch klein, während v1.0 funktional vollständig bleibt.

## Erwogene Alternativen

1. **Combat-first mit Freitext für Social/Exploration:** verworfen, weil es den späteren Sitzungs- und KI-Kontext auf Kampfzustand verengt.
2. **Adventure vollständig vor jeder Session implementieren:** verworfen, weil ein großer Autoreneditor den ersten spielbaren Lernzyklus unnötig verzögert.
3. **Nur letzten Zustand speichern:** verworfen, weil Korrekturen, Sichtbarkeit, Wiederaufnahme und Regelherkunft nicht verlässlich erklärbar wären.
4. **Vollständiges Event-Sourcing-Framework verbindlich vorschreiben:** verworfen, weil die Produktanforderung Auditierbarkeit ist und die konkrete Persistenz erst im Architekturspike entschieden wird.

## Ersetzt / ersetzt durch

Keine vorherige Decision. Diese Entscheidung konkretisiert DEC-001, DEC-003 und DEC-004 für Adventure-, Session- und Laufzeitzustand.

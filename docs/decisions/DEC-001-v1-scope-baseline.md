# DEC-001: v1.0 Scope Baseline

**Status:** Accepted<br>
**Datum:** 2026-08-28<br>
**Owner:** WatzingerM21052<br>
**Betroffene Releases/Requirements:** v0.1-v1.0; FR-001 bis FR-010; NFR-001 bis NFR-004 und NFR-010; CON-003, CON-004, CON-006, CON-007

## Kontext

DnDimension umfasst langfristig lokale Player-/DM-Werkzeuge, Accounts, Multiplayer, Visual Tabletop und KI. Ohne eine explizite Grenze würde v1.0 mehrere weitgehend unabhängige Großvorhaben gleichzeitig versprechen und wäre für ein Ein-Personen-Projekt nicht verlässlich lieferbar.

Die erste stabile Version soll deshalb bereits den vollständigen lokalen Spielverwaltungsablauf lösen, aber keine Cloud-, Realtime-, VTT- oder KI-Infrastruktur voraussetzen.

## Entscheidung

v1.0 ist eine **local-first Player-/DM-Anwendung für D&D 5e 2024**, die ohne Account und ohne KI vollständig nutzbar ist.

### Verbindlicher v1.0-Scope

- geführte Charaktererstellung nach dem Regelstand 2024;
- Charakterbogen, Inventar, Ressourcen, Zauber und regelgeführter Level-up;
- Kampagnenerstellung und Verwaltung von Orten, NPCs, Fraktionen, Quests, Lore und DM-Notizen;
- Encounter Builder sowie Würfel-, Initiative-, HP-, Zustands-, Konzentrations- und Combat-Verwaltung;
- Sitzungsprotokoll und Wiederaufnahme gespeicherter Zustände;
- lokale Speicherung mehrerer Charaktere und Kampagnen;
- Export, Import, Backup und Restore ohne Informationsverlust;
- Onboarding, verständliche Fehler-/Leerzustände und grundlegende Accessibility der Kernflüsse;
- explizite Edition- und Quellenmetadaten für Regeln und Content.

### Nicht Bestandteil von v1.0

- Accounts, Nutzerprofile und Cloud-Synchronisierung;
- Sharing, Rollen, Realtime-Gruppen oder Multiplayer;
- Battle Maps, Fog of War oder vollständiges Visual Tabletop;
- KI-Assistent, DM-Copilot oder autonomer KI-Dungeon-Master;
- vollständiger Homebrew-Editor;
- vollständige Rules Engine für den Regelstand 2014.

### Kompatibilitätsregel

Das Datenmodell trägt von Beginn an Ruleset-, Quellen- und Herkunftsmetadaten. Dadurch bleiben spätere 2014- und Homebrew-Erweiterungen möglich. Diese Vorbereitung ist kein Versprechen, die entsprechenden Oberflächen oder Berechnungsregeln bereits in v1.0 auszuliefern.

- Homebrew wird nach dem stabilen Kern als kontrollierter Bereich der Kampagnen-/App-Einstellungen umgesetzt, aktuell vorgesehen für v1.1.
- 2014-Kompatibilität folgt erst, wenn der 2024-Kern stabil funktioniert. Der Zielrelease bleibt bis zu einer eigenen Aufwand- und Risikoentscheidung offen.
- Ein später unterstützter Regelstand wird pro Kampagne ausgewählt und gespeichert.
- Eine 2014-Auswahl darf erst angeboten werden, wenn Content-Adapter, Rules Engine, Migrationen und getrennte Tests für diesen Regelstand vollständig abgenommen sind.

## Abnahme der Entscheidung

Die Scope-Baseline gilt als eingehalten, wenn:

- kein v1.0-P0-Requirement eine ausgeschlossene Capability voraussetzt;
- v1.0 vollständig offline beziehungsweise ohne Account nutzbar bleibt;
- 2024-Regeln der einzige verpflichtend ausführbare Regelstand sind;
- Export und Restore alle für Kernflüsse benötigten Daten erhalten;
- spätere Capabilities über klar getrennte Adapter oder Release-Slices ergänzt werden können.

## Erwogene Alternativen

1. **2014 und 2024 vollständig in v1.0:** verworfen, weil Content- und Rules-Engine-Aufwand sowie Testmatrix deutlich wachsen.
2. **Accounts und Gruppen bereits in v1.0:** verworfen, weil Auth, Datenschutz, Sync und Realtime den lokalen Produktnutzen nicht validieren.
3. **KI-DM als erstes Kernprodukt:** verworfen, weil strukturierte Regeln, Zustand und Quellenkontrolle zuerst belastbar sein müssen.
4. **Nur Character Creator als v1.0:** verworfen, weil das bestätigte Produktziel auch den menschlichen DM- und Sitzungsablauf umfasst.

## Folgen und Trade-offs

- v1.0 besitzt einen klaren, aber weiterhin umfangreichen vertikalen Produktumfang.
- Homebrew-, Cloud-, Visual- und KI-Wünsche werden späteren Releases zugeordnet; 2014-Kompatibilität bleibt als bestätigte spätere Capability ohne voreiligen Zielrelease vorgemerkt.
- Architektur und Datenmodell müssen Erweiterbarkeit vorbereiten, dürfen spätere Infrastruktur aber nicht vorzeitig implementieren.
- Scope-Erweiterungen für v1.0 benötigen eine explizite Änderung dieser Entscheidung sowie eine Auswirkungsanalyse auf Roadmap, Risiken und Requirements.

## Ersetzt / ersetzt durch

Keine vorherige Decision. Diese Baseline konkretisiert die Master Vision und den Requirements-Katalog.

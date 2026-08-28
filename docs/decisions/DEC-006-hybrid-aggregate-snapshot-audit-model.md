# DEC-006: Hybrid Aggregate, Snapshot and Audit Model

**Status:** Accepted<br>
**Datum:** 2026-08-28<br>
**Owner:** WatzingerM21052<br>
**Betroffene Releases/Requirements:** v0.2-v3.5; FR-009, FR-010, FR-024, FR-029, FR-030, FR-033, FR-035, FR-036; NFR-003, NFR-010, NFR-012 bis NFR-015; CON-003, CON-004, CON-006 bis CON-008, CON-012 bis CON-016

## Kontext

DnDimension muss Charakter-, Kampagnen-, Adventure- und Sitzungszustand lokal zuverlässig speichern, nach Abstürzen fortsetzen, Regel- und Quellenstände erklären und später für Gruppen, VTT und KI erweitern können. Ein reines CRUD-Modell mit optionalem Aktivitätslog würde aktuellen Zustand und Historie leicht auseinanderlaufen lassen. Vollständiges Event Sourcing würde dagegen Event-Versionierung, Projektionen und Replay zu früh zur alleinigen Grundlage des gesamten Produkts machen.

DEC-004 und DEC-005 verlangen getrennte langfristige und laufende Wahrheiten, bewussten Rückfluss, nachvollziehbare Korrekturen und Session-Recovery. Die Persistenztechnologie ist noch nicht entschieden und darf das Domainmodell nicht bestimmen.

## Entscheidung

DnDimension verwendet ein hybrides Modell aus:

1. **revisionierten Aggregaten** als operativer fachlicher Wahrheit;
2. **append-orientierten Audit-Events** für bestätigte Handlungen, Auflösungen, Enthüllungen, Korrekturen und relevante Zustandsänderungen;
3. **konsistenten Session-Snapshots** an bekannten Eventpositionen für schnelles Laden und Recovery;
4. **idempotenten Commands** mit erwarteter Aggregate-Revision als einzigem Mutationsweg;
5. **bestätigten Transfer-Batches** für Änderungen zwischen Session und langfristigen Aggregaten.

Domain und Rules Engine bleiben unabhängig von UI, Datenbank, Cloudanbieter und KI. Adapter implementieren portable Repository-, Unit-of-Work-, Event-, Snapshot-, Migration- und Import-/Export-Verträge.

### Verbindliche Besitzgrenzen

- Content & Sources besitzen versionierte, lizenzierte Content-Pakete.
- Rules besitzt deterministische Definitionen und Auflösungen, aber keinen Nutzerzustand.
- Character trennt bestätigte Builds von kampagnenspezifischem Fortschritt.
- Campaign ist Regel- und Wissensgrenze, jedoch kein monolithisches Weltdokument.
- Adventure und Scene-/Encounter-Templates beschreiben vorbereitete Möglichkeiten.
- Session besitzt den tatsächlich gespielten Laufzeitzustand in Scene-/Encounter-Runs.
- Journal & Transfer übernimmt Folgen erst nach Vorschau und Bestätigung.

### Verbindliche Schutzregeln

- Ruleset, Source Manifest, Schema und Aggregate-Revision sind getrennte Versionen.
- aktive Sessions pinnen relevante Character-, Template-, Ruleset- und Content-Revisionen;
- Ereignis, Zustandsänderung und Revision werden atomar gespeichert;
- Korrekturen und Reveals erzeugen neue Events statt Historie zu überschreiben;
- neue wissensrelevante Typen sind deny-by-default;
- unbekannte oder beschädigte Daten werden nicht still interpretiert oder gelöscht;
- v1.0 implementiert keine CRDT- oder Realtime-Infrastruktur auf Vorrat.

Die vollständigen Verträge stehen in der [v0.2 Domain & Data Model Specification](../spec-planning/v0.2-domain-data-model-spec.md).

## Optionen

### Option A: Hybrid aus Aggregaten, Snapshots und Audit-Events

| Dimension | Bewertung |
|---|---|
| Komplexität | mittel |
| Recovery/Audit | hoch |
| lokale Performance | hoch |
| spätere Synchronisierbarkeit | hoch |
| Implementierungsrisiko | kontrollierbar |

**Vorteile:** aktuelle Zustände sind einfach lesbar; Sitzungen bleiben rekonstruierbar; keine Datenbankbindung; gute Grundlage für Explainability, Gruppen und KI.

**Nachteile:** Aggregate, Event-Log und Snapshot benötigen gemeinsame Konsistenz-, Migrations- und Vertragstests.

### Option B: Vollständiges Event Sourcing

| Dimension | Bewertung |
|---|---|
| Komplexität | hoch |
| Recovery/Audit | sehr hoch |
| lokale Performance | projektionabhängig |
| spätere Synchronisierbarkeit | sehr hoch |
| Implementierungsrisiko | hoch für Einzelentwicklerprojekt |

**Vorteile:** vollständige Historie und mächtige Replay-/Projektionsmöglichkeiten.

**Nachteile:** Event-Migration, Projektionen, Debugging und langfristige Replay-Kompatibilität werden zu früher Pflicht, auch wo das Produkt sie nicht benötigt.

### Option C: Snapshot-zentriertes CRUD mit optionalem Activity Log

| Dimension | Bewertung |
|---|---|
| Komplexität | niedrig |
| Recovery/Audit | niedrig bis mittel |
| lokale Performance | hoch |
| spätere Synchronisierbarkeit | niedrig |
| Implementierungsrisiko | zunächst niedrig, später hoch |

**Vorteile:** schnellster Einstieg und wenig Infrastruktur.

**Nachteile:** Log und Zustand können auseinanderlaufen; Korrekturen, Sichtbarkeit, Absturz-Recovery und späterer Mehrbenutzerbetrieb werden unsicher beziehungsweise teuer nachzurüsten.

## Trade-off-Analyse

Option A erfüllt die akzeptierten Produktanforderungen, ohne das technische Verfahren vollständigen Event Sourcings zum Selbstzweck zu machen. Sie ist komplexer als CRUD, aber diese Komplexität entsteht aus realen Anforderungen: lange Sitzungen, DM-Geheimnisse, Korrekturen, Regelherkunft, Save/Resume und bewusster Kampagnenfortschritt.

Der konkrete lokale Adapter bleibt austauschbar. Spike #20 entscheidet anhand von Transaktionen, Recovery, Browserunterstützung, Performance, Migration und Export, welche Persistenz die Verträge am besten erfüllt.

## Abnahmekriterien

- Character-, Campaign-, Adventure- und Session-Daten besitzen eindeutige Aggregate- und Besitzgrenzen.
- Mutationen sind idempotente Commands mit Revisionsprüfung.
- Session-Zustand kann aus validem Snapshot plus bestätigten Folgeevents identisch fortgesetzt werden.
- Audit-Korrekturen bewahren Originalevent und Ursache.
- Cross-Aggregate-Rückfluss ist vorschaupflichtig, idempotent und wiederaufnehmbar.
- mindestens ein In-Memory- und der später gewählte lokale Adapter bestehen dieselben Repository-Vertragstests.
- Export/Restore bewahrt IDs, Revisionen, Regeln, Quellen, Events, Snapshots und Sichtbarkeit.

## Folgen und Trade-offs

- Domain- und Persistenzarbeit ist vor dem ersten sichtbaren Creator-Slice umfangreicher.
- Vollständige Atomizität, Idempotenz, Migration und Recovery werden zu frühen Quality Gates.
- Spätere Cloud-, VTT- und KI-Funktionen können denselben bestätigten Zustand verwenden.
- Eine physische Datenbankstruktur darf optimiert werden, bleibt aber Adapterdetail.
- Vollständiges Event Sourcing kann später für einen eng begrenzten Teil erneut bewertet werden, ist keine globale Voraussetzung.

## Ersetzt / ersetzt durch

Keine vorherige Decision. Diese Entscheidung konkretisiert DEC-004 und DEC-005 und löst deren offene Persistenzmodellfrage auf fachlicher Ebene. Die konkrete Persistenztechnologie bleibt in Spike #20 offen.

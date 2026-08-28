# DEC-007: Typed Deterministic Rule Resolution Kernel

**Status:** Accepted<br>
**Datum:** 2026-08-28<br>
**Owner:** WatzingerM21052<br>
**Betroffene Releases/Requirements:** v0.3-v4.0; FR-006, FR-008, FR-009, FR-020 bis FR-022, FR-024, FR-032, FR-034, FR-038, FR-039; NFR-010, NFR-011, NFR-014; CON-003, CON-004, CON-007 bis CON-010, CON-012, CON-016

## Kontext

Character Creator, Campaign Creator und Play Session müssen dieselben versionierten D&D-Regeln verwenden. Die 2024-Regeln bestehen aus allgemeinen Mechanismen, spezifischen Ausnahmen, nicht stapelnden Modifikatoren, alternativen Grundberechnungen und Situationen mit DM-Ermessen. Werden diese Regeln direkt pro UI oder Feature implementiert, entstehen konkurrierende Wahrheiten. Ein vollständig generischer Regelinterpreter würde dagegen zu früh eine eigene Programmiersprache, Sandbox, Debugger und langfristige Skriptkompatibilität erfordern.

DEC-003 verlangt Tabletop-Regeltreue, transparente Varianten und menschliche Kontrolle. DEC-006 verlangt eine zustandslose Rules Engine, vorgeschlagene Änderungen, revisionsgeprüfte Commands und auditierbare Anwendung.

## Entscheidung

DnDimension verwendet einen **hybriden, typisierten und deterministischen Regelauflösungskern**.

1. Ein kleiner imperativer Kernel steuert Validierung, Priorität, Würfelauflösung, Trace und Ergebnisbildung.
2. Jede Regelfamilie besitzt einen typisierten Request-, Context-, Resolution- und Proposal-Vertrag.
3. Versionierte Content-/Regeldefinitionen verwenden ausschließlich bekannte deklarative Bausteine.
4. Regeldefinitionen dürfen keinen beliebigen ausführbaren Code oder seiteneffektbehaftete Ausdrücke enthalten.
5. Der Kernel lädt und speichert nichts. Er erhält vollständige unveränderliche Snapshots und liefert eine unveränderliche Resolution.
6. Die Engine mutiert keine Aggregate. Sie erzeugt nur fachliche Zustandsänderungsvorschläge.
7. Vorschau und bestätigte Anwendung bleiben getrennt; der Application Layer erzwingt Revision, Idempotenz und Atomizität gemäß DEC-006.
8. Regeln und Quellen werden über ein explizites `RuleProfileRef` gepinnt. Ein unbekanntes Profil fällt nicht still auf ein anderes zurück.
9. Allgemeine Regeln dürfen nur durch explizit spezifischere, dafür typisierte Ersetzungen oder Ausnahmen verdrängt werden.
10. Gleichrangige Konflikte werden sichtbar als `conflict` oder `pending_decision` ausgegeben.
11. Automatisierungsgrad, Wurfart und begründete DM-Overrides bleiben getrennt, unterscheidbar und auditierbar.
12. Nicht implementierte Regelfamilien liefern `unsupported`; sie werden nicht angenähert oder erfunden.

Die verbindlichen Verträge, Pipeline, Regelfamilien und Tests stehen in der [v0.3 Rules Engine Foundation Specification](../spec-planning/v0.3-rules-engine-foundation-spec.md).

## Regelpriorität

Die Pipeline folgt einer stabilen fachlichen Reihenfolge:

1. Profil und Quelle prüfen;
2. Voraussetzungen validieren;
3. Grundregel wählen;
4. spezifische Ersetzungen/Ausnahmen anwenden;
5. typisierte Modifikatoren anwenden;
6. Grenzen und nicht stapelnde Zustände normalisieren;
7. Würfel auflösen;
8. Follow-ups und ausstehende Entscheidungen ausweisen;
9. Ergebnis und Vorschläge erzeugen;
10. vollständigen Trace liefern.

Dateireihenfolge, Registrierungszeitpunkt oder zufällige IDs sind keine fachliche Konfliktentscheidung.

## Optionen

### Option A: Typisierter Hybridkern mit deklarativen Definitionen

| Dimension | Bewertung |
|---|---|
| Anfangskomplexität | mittel |
| Regelerklärbarkeit | hoch |
| Testbarkeit | hoch |
| Flexibilität | hoch innerhalb bekannter Capabilities |
| Sicherheits-/Migrationsrisiko | kontrollierbar |

**Vorteile:** klare Invarianten; kompakte, sichere Definitionen; reproduzierbare Ergebnisse; gute Grundlage für 2024, spätere Varianten, VTT und KI.

**Nachteile:** neue fundamentale Regelmechanismen benötigen Kernel-Erweiterung, Schemaänderung und Tests.

### Option B: Regeln als hart codierte Feature-Funktionen

| Dimension | Bewertung |
|---|---|
| Anfangskomplexität | niedrig |
| Regelerklärbarkeit | mittel bis niedrig |
| Testbarkeit | zunächst hoch, bei Wachstum sinkend |
| Flexibilität | niedrig |
| Sicherheits-/Migrationsrisiko | später hoch |

**Vorteile:** schnell für einzelne Formeln und wenige bekannte Fälle.

**Nachteile:** Ausnahmen verteilen sich über Features; UI und Session können auseinanderlaufen; Varianten und Homebrew erzeugen Sonderfallcode.

### Option C: Vollständige Rules DSL mit Interpreter

| Dimension | Bewertung |
|---|---|
| Anfangskomplexität | sehr hoch |
| Regelerklärbarkeit | theoretisch hoch, praktisch werkzeugabhängig |
| Testbarkeit | hoch bei reifer Plattform |
| Flexibilität | sehr hoch |
| Sicherheits-/Migrationsrisiko | hoch |

**Vorteile:** nahezu beliebige Regeln könnten als Daten beschrieben werden.

**Nachteile:** Parser, Typprüfung, Sandbox, Debugger, Ressourcenlimits und dauerhafte Skriptmigration würden vor dem ersten Nutzerfluss zur Pflicht.

## Trade-off-Analyse

Option A bildet die tatsächlich benötigte Flexibilität ab: D&D besitzt wiederkehrende Mechanismen und klar benennbare Ausnahmen, aber nicht jeder Content-Eintrag benötigt eine eigene Programmiersprache. Der Kernel bleibt klein und fachlich überprüfbar; Definitionen können ohne Deployment erweitert werden, solange sie bekannte Bausteine verwenden.

Die bewusste Grenze ist ein Vorteil: Wenn eine neue Mechanik nicht durch vorhandene Bausteine darstellbar ist, wird sie transparent als neue Capability geplant. `assisted` und `manual_recorded` verhindern, dass seltene Sonderfälle den Spielfluss blockieren oder still falsch automatisiert werden.

## Abnahmekriterien

- gleiche vollständige Inputs und derselbe Seed erzeugen dasselbe Ergebnis und denselben fachlichen Trace;
- jede Auflösung pinnt Regelprofil, Quellen und angewandte Regelversionen;
- der Kernel besitzt keine UI-, Persistenz-, Netzwerk-, Cloud- oder KI-Abhängigkeit;
- Regeldefinitionen können keinen beliebigen Code ausführen;
- gleichrangige Konflikte und unbekannte Regeln werden nicht still entschieden;
- `computed`, `assisted` und `manual_recorded`, automatische/manuelle Würfe sowie DM-Entscheidungen sind unterscheidbar;
- die Engine liefert nur Vorschläge und kann Aggregate nicht direkt verändern;
- Preview/Apply und Stale-/Idempotenzschutz sind über Application-Vertragstests nachgewiesen;
- mindestens `DerivedValueResolution`, `D20TestResolution` und `ResourceTransitionResolution` bestehen Referenz-, Interaktions- und Property-Tests;
- Player-Projektionen enthalten keine DM-only Trace-Daten.

## Folgen und Trade-offs

- v0.3 benötigt mehr Vertrags- und Testarbeit als einige direkt in den Character Creator geschriebene Formeln.
- Neue Regelcapabilities werden bewusst versioniert und reviewt.
- Content-Importer müssen deklarative Definitionen validieren und dürfen keine Skripte erzeugen.
- Der Trace wird Teil des stabilen fachlichen Ergebnisses und benötigt eigene Sichtbarkeits- und Migrationsregeln.
- 2014, Homebrew und optionale Komfortregeln können später getrennt ergänzt werden, sind aber nicht automatisch kompatibel.
- KI kann Ergebnisse später erklären oder Anfragen vorbereiten, erhält aber keine eigene konkurrierende Regelautorität.

## Ersetzt / ersetzt durch

Keine vorherige Decision. Diese Entscheidung konkretisiert DEC-003 und DEC-006 für die Rules Engine.

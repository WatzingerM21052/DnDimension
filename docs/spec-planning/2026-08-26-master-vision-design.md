# DnDimension — Master Vision & Architektur

**Status:** Aktualisierte Master Vision<br>
**Erstellt:** 2026-08-26<br>
**Aktualisiert:** 2026-08-28<br>
**Scope:** Gesamtvision und Architekturprinzipien. Verbindliche Release-Gates stehen in der [Release-Roadmap](../product/roadmap.md); konkrete Features erhalten eigene Specs.

## 1. Vision

Eine Web-App, die Spieler und menschliche Dungeon Master beim vollständigen D&D-5e-Ablauf unterstützt, ohne dass sie das Regelwerk auswendig kennen müssen. Die App übernimmt Buchhaltung wie Werte, Ressourcen, Initiative und Regeln. Das erste stabile Produkt v1.0 funktioniert local-first, ohne Accountzwang und ohne KI. Accounts und Gruppen folgen in v1.x, visuelle/VTT-Funktionen in v2.x und ein quellengebundener KI-DM erst in v3.x.

**Leitprinzip: Zugänglichkeit vor Regelkenntnis.** Jede Design-Entscheidung wird daran gemessen, ob sie jemandem ohne D&D-Erfahrung hilft, trotzdem ein regelkonformes Spiel zu erleben. Die App erklärt progressiv und übernimmt Rechen-/Zustandsarbeit; kreative Entscheidungen bleiben bei Spielern und DM. Spätere KI schlägt vor und führt, wird aber nie unbemerkt zur Quelle der Wahrheit.

**Erlebnisprinzip: Tabletop first, digital clarity second.** DnDimension strebt gemäß [DEC-003](../decisions/DEC-003-tabletop-authenticity-and-inspiration.md) die Glaubwürdigkeit einer echten D&D-Sitzung an. Digitale Rollenspiele und Mods dürfen Klarheit, Feedback und Komfort inspirieren, aber keine Regeln unmarkiert verändern und keine geschützten Inhalte oder markanten Gestaltungen liefern.

Nutzer:innen können mehrere Kampagnen parallel anlegen und verwalten, mit eigener Welt und eigenen Charakteren. v1.0 ist fachlich **2024-first**. Jede Kampagne und jeder Content-Eintrag trägt trotzdem von Beginn an einen Regelstand. Eine spätere 2014-Kompatibilität wird erst nach Stabilisierung des 2024-Kerns als vollständig geprüfte, kampagnenspezifische Einstellung angeboten; ein halbfertiger Auswahlpunkt ist ausgeschlossen.

**Kampagnenprinzip:** Eine Kampagne ist gemäß [DEC-004](../decisions/DEC-004-campaign-as-rules-and-knowledge-boundary.md) die versionierte Grenze für Regelprofil, Session-Zero-Absprachen, Charakterzuordnung und Wissenssichtbarkeit. Spätere Gruppen-, VTT- und KI-Funktionen verwenden diese Kampagnenwahrheit, statt konkurrierende Zustände einzuführen.

**Sitzungsprinzip:** Gemäß [DEC-005](../decisions/DEC-005-session-as-auditable-runtime-boundary.md) gilt `Campaign -> Adventure -> Session -> Scene/Encounter -> Event`. v0.6 beweist einen kleinen, aber säulenübergreifenden Ablauf; dieser Alpha-Slice ist nicht das Endprodukt. v0.8 enthält den vollständigen v1-P0-Spielablauf, v0.9 stabilisiert ihn und v1.0 muss normalen lokalen Mehrsitzungsbetrieb über Social, Exploration und Combat ermöglichen.

**Datenprinzip:** Gemäß [DEC-006](../decisions/DEC-006-hybrid-aggregate-snapshot-audit-model.md) bilden revisionierte Aggregate die operative Wahrheit. Idempotente Commands, append-orientierte Audit-Events, konsistente Session-Snapshots und bestätigte Transfer-Batches sichern Erklärbarkeit und Recovery, ohne vollständiges Event Sourcing vorzuschreiben. Die Details stehen in der [v0.2 Domain & Data Model Specification](v0.2-domain-data-model-spec.md).

## 2. Abgrenzung zum Markt

| Plattform | Stärke | Lücke, die wir füllen |
|---|---|---|
| Offizielle digitale Regeltools | verlässliche Inhalte und Charakterverwaltung | DnDimension fokussiert einen durchgängigen Player-/DM-Arbeitsablauf |
| AI-Game-Master-Apps | niedrigschwelliges Storytelling | DnDimension plant strukturierte Regeln, Quellen und portablen Kampagnenzustand |
| Etablierte VTTs | starke Karten-, Token- und Erweiterungssysteme | DnDimension priorisiert zunächst Zugänglichkeit und integrierte Buchhaltung |

Die Abgrenzung ist eine Produkt-Hypothese und wird vor v1.0 durch aktuelle Marktanalyse und Nutzertests überprüft. Zielbild: regelbewusste Kern-App, später visuelles Spiel und erst danach kontrollierte KI.

## 3. Content- & Lizenzstrategie

- **SRD 5.1** und **SRD 5.2.1** stehen unter **CC-BY-4.0** und bilden mit korrekter Attribution die veröffentlichbare Basis. Inhalte werden als strukturierte Daten, nicht als PDF-Volltext, gepflegt.
- Die offizielle SRD-Fassung ist fachlich maßgeblich. Open5e kann als strukturierter Importkandidat dienen, wird aber versioniert importiert und gegen das offizielle SRD geprüft. Drittanbieter-Dokumente werden nicht durch einen breiten Open5e-Import eingeschleppt.
- Das SRD ist bewusst nicht identisch mit allen Optionen kommerzieller Regelbücher. Fehlende Optionen werden sichtbar als nicht verfügbar behandelt; private Referenzen werden nicht kopiert. Homebrew und private Eingaben folgen kontrolliert ab v1.1.
- Der v1.0-Character-Creator liefert gemäß [DEC-002](../decisions/DEC-002-v1-character-content-boundary.md) ausschließlich eingebauten SRD-5.2.1-Content; private PDFs sind weder Build-Quelle noch Laufzeitvoraussetzung.
- **PHB-PDFs (2014 & 2024)** bleiben strikt proprietär. Volltext daraus wandert **nie** ins Repo — unabhängig davon, ob das Repo privat oder öffentlich ist. Sie dienen uns nur als Referenz beim manuellen Nacharbeiten von Strukturen/Konzepten, nicht als Datenquelle zum Kopieren.
- **Homebrew/eigene Inhalte** (z.B. selbst erfundene NPCs, Encounter, Hausregeln) leben ausschließlich im Laufzeitspeicher des Nutzers (lokal; ab v1.2 optional im Cloud-Adapter), nie als Git-Commit. Damit bleibt das Repo unabhängig vom Sichtbarkeits-Status sauber.
- Attribution-Hinweis für SRD-Inhalte wird fest im Footer/Impressum der App verankert.
- **Repo ist aktuell privat.** Ein späterer Wechsel zu public ist möglich, ohne Architektur zu ändern, weil Content-Trennung von Anfang an sauber ist.

## 4. Architektur

**Akzeptierte Plattformarchitektur für v0.x-v1.1:** TypeScript, React, Vite und pnpm als installierbare PWA und modularer Monolith gemäß [DEC-008](../decisions/DEC-008-typescript-pwa-modular-monolith.md). Regeln, Domainlogik und Application Layer bleiben in eigenen Packages; Modulgrenzen werden technisch geprüft. Website und lokale Installation verwenden denselben statischen Build und die App benötigt für Kernfunktionen kein Netzwerk. Der vollständige Stack, Ordnerbaum, öffentliche Verträge, Quality Gates und Bootstrap-Spikes stehen im [Pre-Code Engineering Blueprint](pre-code-engineering-blueprint.md).

**Lokale Persistenz:** v1 verwendet IndexedDB über einen isolierten Dexie-Adapter, portable Backups und begrenzte Derived Caches gemäß [DEC-009](../decisions/DEC-009-local-persistence-backup-and-cloud-evolution.md). Private PDFs werden weder in Appdaten noch in Builds oder Standardbackups dupliziert. Browserpersistenz ersetzt keinen bewusst überprüfbaren Backup-/Restore-Weg.

**UI- und Qualitätsbasis:** Ein eigenes CSS-Token-Designsystem, React Aria und gezielte Motion-Unterstützung bilden gemäß [DEC-010](../decisions/DEC-010-custom-design-system-and-lean-quality-toolchain.md) die visuelle und zugängliche Grundlage. Material 3 dient als Interaktions- und Bewegungsreferenz, nicht als generischer Google-App-Look. Der lokale Toolchain vermeidet Docker, Electron, Android SDK, Storybook, Cypress und vollständige Browserdownloads, solange kein messbarer Bedarf besteht.

**Backend-Kandidat ab v1.2:** Cloudflare Workers oder eine gleichwertige Adapterimplementierung. SQL bleibt hinter einem Port; D1 ist der führende Free-first-Kandidat und PostgreSQL der strategische Fallback. Die endgültige Auswahl folgt unmittelbar vor dem Cloud-Slice einer aktualisierten Architektur- und Kostenentscheidung und darf den lokalen Kern nicht binden.
- **Durable Object pro aktiver Session** = Quelle der Wahrheit für alles Live: Initiative, HP, verbundene Spieler, Chat-/Erzähl-Log. Ein "Raum" pro laufender Kampagnen-Sitzung.
- **D1** (SQL) für dauerhafte Daten: User, Kampagnen, Charaktere, Welt-Einträge, Bestiary, Content-Bibliothek (SRD + Homebrew, mit Lizenz-Flag pro Eintrag).
- **R2** für Dateien: Charakterbilder, Kartenbilder (relevant ab Battle-Map-Sub-Projekt).
- **KI ab v3.0:** Provider-Adapter statt harter Bindung an ein einzelnes Modell. Kontext wird aus strukturiertem Zustand und zugelassenem Retrieval zusammengestellt.

**Datenfluss local-first:** Nutzeraktion → idempotenter Domain-Command mit Revisionsprüfung → validiertes Aggregate/Audit-Event → persistenter Zustand/Snapshot/Export.<br>
**Datenfluss Multiplayer:** Client-Command → serverseitig autorisierter Session-State → Live-Update → persistenter Snapshot.<br>
**Datenfluss KI:** bestätigter Zustand → gezieltes Retrieval → Modellvorschlag → Validierung/Override → State-Änderung.

**Token-Kosten-Strategie (kritisch für Hobby-Projekt-Budget):** Niemals die komplette Kampagnenhistorie pro KI-Zug mitschicken. Kontext = aktuelle Szene + zusammengefasste Vorgeschichte (Summarization) + gezielt relevante Lore-Einträge. Zusätzlich ein Token-Budget pro Session/Tag als Sicherheitsnetz gegen Kostenexplosion.

**Regelwerk-Versionierung:** Jede Kampagne trägt ein `ruleset`-Feld; v1.0 akzeptiert zunächst `2024`. Content-Einträge (Zauber, Klassenfeatures etc.) sind an einen Regelstand gebunden. Ein späterer Wert `2014` benötigt einen eigenen, geprüften Content-Adapter und eigene Regeltests; das Datenmodell bereitet ihn vor, verspricht ihn aber nicht automatisch für v1.0.

## 5. Capability-Reihenfolge

Die exakten Versionen und Exit-Kriterien stehen in der Roadmap. Capability-Specs liegen in `docs/spec-planning/`.

1. Project, Content und Data Foundation (v0.1-v0.2)
2. Rules Engine (v0.3)
3. Charakter-Slice (v0.4)
4. Kampagnen-/DM- und Session-Slices (v0.5-v0.6)
5. integrierte Alpha, Beta und stabiles local-first Release (v0.7-v1.0)
6. Settings/Homebrew, Accounts, Sharing und Gruppen (v1.1-v1.5)
7. visuelle Experience und VTT (v2.x)
8. AI Foundation, Solo-DM und Qualitätshärtung (v3.x)
9. optionale Plattformfähigkeiten erst bei validiertem Bedarf (v4.0)

**Warum diese Reihenfolge:** Erst stabile Daten und Regeln, dann sichtbare vertikale Slices. Das lokale Produkt validiert den Nutzen ohne Account-, Realtime-, Visual- oder KI-Komplexität. Multiplayer, VTT und KI bauen anschließend auf denselben bestätigten Zustandsmodellen auf.

## 6. Testing-Strategie (grob)

- Rules Engine: reine Funktionen, isoliert unit-testbar (kein Infra-Bezug)
- Session: atomare Zustandsübergänge, Audit-Log/Snapshot-Recovery und Mehrsitzungs-End-to-End-Tests über alle drei Säulen
- Wissen: deny-by-default Sichtbarkeits- und Player-Preview-Negativtests für jeden neuen Feld-/Ereignistyp
- Persistenz: gemeinsame Contract Tests für In-Memory- und IndexedDB-Adapter, Migration, Browser-Eviction-Warnung sowie Export-/Restore-Roundtrips
- UI: React Testing Library, Accessibility-/Reduced-Motion-Prüfung und wenige stabile visuelle Regressionen; vollständige Browsermatrix primär in CI
- Worker-Endpunkte: Vitest + Miniflare (lokale Cloudflare-Simulation)
- KI-DM-Qualität: automatisierte Szenario-Evals plus manuelles Playtesting ab v3.0

## 7. Offene Validierungen und spätere Sub-Projekt-Specs

- Der [Pre-Code Engineering Blueprint](pre-code-engineering-blueprint.md) ist als Design akzeptiert; exakte Paketversionen, Installationsgrößen, IndexedDB-Transaktionsannahmen und PWA-Updateverhalten bleiben vor Produktcode durch die dort definierten Bootstrap-Spikes nachzuweisen.
- Auth-, SQL-Provider- und Sync-Methode werden unmittelbar vor v1.2 gegen dann aktuelle Anforderungen, Free Tiers, Datenschutz und Anbietergrenzen entschieden.
- Snapshotfrequenz, Multi-Tab-Koordination und konkrete Laufzeitbudgets werden im Persistenz-Spike gemessen.
- Summarization-, Retrieval- und Eval-Strategie folgt in der v3.0-Spec.

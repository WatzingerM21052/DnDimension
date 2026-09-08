# DnDimension Dokumentation

Dieser Index ist der Einstieg in die Projektunterlagen. Er unterscheidet Produktentscheidungen, operative Planung, Forschung und Vorlagen.

## Aktuelle Designplanung – September 2026

- [Bevorzugte Bildentwürfe, Nutzerfeedback und Bedienkonzept](design/2026-09-08-visual-direction-and-interaction.md)

- [Lebendiger Kampagnenraum: Erlebnis, Bildschirme und Bewegung](superpowers/specs/2026-09-08-immersive-experience-design.md)
- [Sternenbruch: sechs Wireframes und durchgehendes Storyboard](superpowers/specs/2026-09-08-campaign-room-storyboard.md)
- [Ausbauplan und überprüfbare Arbeitspakete](delivery/2026-09-08-experience-plan.md)
- [Recherche, Bestandsprüfung und tatsächliche Lesetiefe](research/2026-09-08-experience-review.md)

Diese Ergänzungen sind ausgearbeitete Vorschläge. Die akzeptierten Release-Gates bleiben maßgeblich; ein früher Designprototyp ist weder eine fertige Spielfunktion noch ein vorgezogenes 3D-/KI-Release.

## Autoritätsreihenfolge

Bei Widersprüchen gilt:

1. akzeptierte Requirement- oder Decision-Record-Änderung;
2. [Release-Roadmap](product/roadmap.md) für Versionen und Release-Gates;
3. [Requirements-Katalog](product/requirements-catalog.md) für verbindlich angenommene Produktanforderungen;
4. [GitHub Project](https://github.com/users/WatzingerM21052/projects/2) für den aktuellen operativen Arbeitsstand;
5. Capability-Specs und Forschungsnotizen als detaillierende, noch überprüfbare Grundlage.

Eine neue Entscheidung soll widersprechende ältere Aussagen nicht nur ergänzen, sondern sichtbar aktualisieren oder als abgelöst markieren.

## Produkt und Governance

- [Projektantrag und Projektbeschreibung](product/project-proposal.md)
- [Zielekatalog](product/goals-catalog.md)
- [Release-Roadmap](product/roadmap.md)
- [Requirements Engineering und Anforderungskatalog](product/requirements-catalog.md)
- [Stakeholderanalyse](product/stakeholder-analysis.md)
- [Business Case](product/business-case.md)
- [Projektmarketing](product/project-marketing.md)

## Delivery und Projektsteuerung

- [Objektstrukturplan](delivery/object-structure-plan.md)
- [Projektstrukturplan](delivery/project-structure-plan.md)
- [Ablauf- und Balkenplan](delivery/delivery-plan.md)
- [Risikoanalyse und Risk Register](delivery/risk-register.md)
- [Scrum- und Kanban-Playbook](delivery/scrum-kanban-playbook.md)
- [GitHub-Issue- und Project-Workflow](delivery/github-workflow.md)
- [Initialer GitHub-Backlog](delivery/initial-backlog.md)
- [Traceability- und Release-Review-Matrix](delivery/traceability-matrix.md)

## Architektur und Capability-Specs

- [Master Vision und Architektur](spec-planning/2026-08-26-master-vision-design.md)
- [Content-Foundation](spec-planning/2026-08-26-content-foundation-design.md)
- [v0.2 Portable Domain & Data Model Specification](spec-planning/v0.2-domain-data-model-spec.md)
- [v0.3 Rules Engine Foundation Specification](spec-planning/v0.3-rules-engine-foundation-spec.md)
- [v0.4 Character Creator Specification](spec-planning/v0.4-character-creator-spec.md)
- [v0.5 Campaign Creator Specification](spec-planning/v0.5-campaign-creator-spec.md)
- [v0.6 Play Session Specification](spec-planning/v0.6-play-session-spec.md)
- [Pre-Code Engineering Blueprint](spec-planning/pre-code-engineering-blueprint.md) — akzeptierte Startarchitektur; P-01 bestanden, weitere Foundation-Spikes offen
- [AI-DM Prompt-System Design](spec-planning/2026-08-28-ai-dm-prompt-system-design.md)
- [UI Design System Foundation](superpowers/specs/2026-08-29-ui-design-system-foundation-design.md) — freigegebene Arcane-Cartographer-Richtung für Spike #69; Umsetzung noch offen

## Ausführungspläne

- [v0.1 Toolchain Bootstrap Validation](superpowers/plans/2026-08-28-v0.1-toolchain-bootstrap-implementation.md) — erster ausführbarer Plan für Spike #70; nachgelagerte Spikes bleiben getrennt
- [UI and Quality Foundation Implementation](superpowers/plans/2026-08-29-ui-quality-foundation-implementation.md) — ausführbarer TDD-Plan für Spike #69; Umsetzung noch offen

## Entscheidungen

- [DEC-001: v1.0 Scope Baseline](decisions/DEC-001-v1-scope-baseline.md)
- [DEC-002: v1.0 Character Content Boundary](decisions/DEC-002-v1-character-content-boundary.md)
- [DEC-003: Tabletop Authenticity and Inspiration Boundary](decisions/DEC-003-tabletop-authenticity-and-inspiration.md)
- [DEC-004: Campaign as Rules and Knowledge Boundary](decisions/DEC-004-campaign-as-rules-and-knowledge-boundary.md)
- [DEC-005: Session as Auditable Runtime Boundary](decisions/DEC-005-session-as-auditable-runtime-boundary.md)
- [DEC-006: Hybrid Aggregate, Snapshot and Audit Model](decisions/DEC-006-hybrid-aggregate-snapshot-audit-model.md)
- [DEC-007: Typed Deterministic Rule Resolution Kernel](decisions/DEC-007-typed-deterministic-rule-resolution-kernel.md)
- [DEC-008: TypeScript-PWA als modularer Monolith](decisions/DEC-008-typescript-pwa-modular-monolith.md)
- [DEC-009: Lokale Persistenz, Backups und spätere SQL-Cloud](decisions/DEC-009-local-persistence-backup-and-cloud-evolution.md)
- [DEC-010: Eigenes Design-System und schlanker Qualitäts-Toolchain](decisions/DEC-010-custom-design-system-and-lean-quality-toolchain.md)

## Forschung und Quellen

- [Katalog der privaten Referenzbibliothek](research/reference-library-catalog.md)
- [v0.1 Toolchain Validation Report](research/v0.1-toolchain-validation-report.md) — reproduzierbarer P-01-Nachweis mit Versionen, Tests und Speicherwerten
- [AI-DM Quellenstrategie](research/ai-dm-source-strategy.md)

## Anleitungen und Vorlagen

- [AI-DM Prompt-Anleitung](guides/ai-dm-prompt-usage.md)
- [Statusbericht](templates/status-report.md)
- [Projektbesprechung](templates/project-meeting.md)
- [Decision Record](templates/decision-record.md)

## Vollständigkeitsgrenze

Die Dokumentation ist für den aktuellen v0.1-Foundation-Stand vollständig: Produktvision, v1-Scope, Requirements, Release-Gates, Risiken, Governance, Architektur, Daten-/Rules-Verträge, Character-, Campaign- und erster Session-Slice sowie Bootstrap-Plan und P-01-Evidenz sind festgehalten und verknüpft.

„Vollständig“ bedeutet nicht, dass entfernte Releases bereits mit Scheingenauigkeit spezifiziert sind:

- v0.7 bis v1.0 besitzen verbindliche Outcomes, Requirements und Release-Gates; ihre detaillierten Capability-Specs entstehen vor dem jeweiligen Refinement.
- v1.1 und später bleiben Roadmap-Gates, bis der lokale v1-Kern und die davorliegenden Risiken validiert sind.
- Der Engineering Blueprint ist als Design akzeptiert, aber erst nach #20, #21 und #69 bis #71 operational validiert.
- Operativer Status, Owner und Schätzung werden ausschließlich im GitHub Project aktuell gehalten; Snapshot-Dokumente kennzeichnen ihr Datum.

## Pflegeauslöser

| Änderung                        | Mindestens aktualisieren                                     |
| ------------------------------- | ------------------------------------------------------------ |
| neues oder verschobenes Release | Roadmap, Requirements, Milestone, Delivery-Plan              |
| neues Feature                   | Requirement/Spec, Epic/Story, Testsicht                      |
| Architekturentscheidung         | Decision Record, betroffene Spec, Risiko                     |
| neue Content-Quelle             | Bibliothekskatalog, Source Registry/Strategie, Lizenzprüfung |
| Sprint-/Statuswechsel           | GitHub Project; Statusbericht nur zum Berichtszeitpunkt      |
| neues wesentliches Risiko       | Risk Register und betroffene Issue/Release-Review            |

# DnDimension Dokumentation

Dieser Index ist der Einstieg in die Projektunterlagen. Er unterscheidet Produktentscheidungen, operative Planung, Forschung und Vorlagen.

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

## Architektur und Capability-Specs

- [Master Vision und Architektur](spec-planning/2026-08-26-master-vision-design.md)
- [Content-Foundation](spec-planning/2026-08-26-content-foundation-design.md)
- [v0.4 Character Creator Specification](spec-planning/v0.4-character-creator-spec.md)
- [v0.5 Campaign Creator Specification](spec-planning/v0.5-campaign-creator-spec.md)
- [Pre-Code Engineering Blueprint](spec-planning/pre-code-engineering-blueprint.md)
- [AI-DM Prompt-System Design](spec-planning/2026-08-28-ai-dm-prompt-system-design.md)

## Entscheidungen

- [DEC-001: v1.0 Scope Baseline](decisions/DEC-001-v1-scope-baseline.md)
- [DEC-002: v1.0 Character Content Boundary](decisions/DEC-002-v1-character-content-boundary.md)
- [DEC-003: Tabletop Authenticity and Inspiration Boundary](decisions/DEC-003-tabletop-authenticity-and-inspiration.md)
- [DEC-004: Campaign as Rules and Knowledge Boundary](decisions/DEC-004-campaign-as-rules-and-knowledge-boundary.md)

## Forschung und Quellen

- [Katalog der privaten Referenzbibliothek](research/reference-library-catalog.md)
- [AI-DM Quellenstrategie](research/ai-dm-source-strategy.md)

## Anleitungen und Vorlagen

- [AI-DM Prompt-Anleitung](guides/ai-dm-prompt-usage.md)
- [Statusbericht](templates/status-report.md)
- [Projektbesprechung](templates/project-meeting.md)
- [Decision Record](templates/decision-record.md)

## Pflegeauslöser

| Änderung | Mindestens aktualisieren |
|---|---|
| neues oder verschobenes Release | Roadmap, Requirements, Milestone, Delivery-Plan |
| neues Feature | Requirement/Spec, Epic/Story, Testsicht |
| Architekturentscheidung | Decision Record, betroffene Spec, Risiko |
| neue Content-Quelle | Bibliothekskatalog, Source Registry/Strategie, Lizenzprüfung |
| Sprint-/Statuswechsel | GitHub Project; Statusbericht nur zum Berichtszeitpunkt |
| neues wesentliches Risiko | Risk Register und betroffene Issue/Release-Review |

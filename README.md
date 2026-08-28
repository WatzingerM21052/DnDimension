# DnDimension

Eine geplante Web-App zur Unterstützung von D&D-5e-Spielern und Dungeon Mastern: Charaktere, Kampagnen, Adventures, Regeln und vollständiger Sitzungszustand in einem zugänglichen Ablauf. v1.0 soll normales lokales D&D-Spiel über mehrere Sitzungen mit Social, Exploration und Combat ermöglichen – ohne KI, aber nicht minimalistisch. Accounts/Gruppen, Visual/VTT und KI folgen bewusst in späteren Releases.

**Status:** v0.1 Project Foundation — der ausführbare Workspace wird unter `code/` aufgebaut.

## Einstieg

- [Dokumentations-Hub](docs/README.md)
- [Release-Roadmap](docs/product/roadmap.md)
- [Projektantrag](docs/product/project-proposal.md)
- [Requirements & Anforderungskatalog](docs/product/requirements-catalog.md)
- [GitHub Project „DnDimension Development“](https://github.com/users/WatzingerM21052/projects/2) · [Kanban-View](https://github.com/users/WatzingerM21052/projects/2/views/2)
- [Initialer Backlog und Issue-Hierarchie](docs/delivery/initial-backlog.md)
- [Master Vision & Architektur](docs/spec-planning/2026-08-26-master-vision-design.md)
- [Content-Foundation](docs/spec-planning/2026-08-26-content-foundation-design.md)
- [Pre-Code Engineering Blueprint](docs/spec-planning/pre-code-engineering-blueprint.md)
- [v0.2 Portable Domain & Data Model Specification](docs/spec-planning/v0.2-domain-data-model-spec.md)
- [v0.3 Rules Engine Foundation Specification](docs/spec-planning/v0.3-rules-engine-foundation-spec.md)
- [v0.4 Character Creator Specification](docs/spec-planning/v0.4-character-creator-spec.md)
- [v0.5 Campaign Creator Specification](docs/spec-planning/v0.5-campaign-creator-spec.md)
- [v0.6 Play Session Specification](docs/spec-planning/v0.6-play-session-spec.md)
- [Traceability- und Release-Review-Matrix](docs/delivery/traceability-matrix.md)
- [Erster ausführbarer v0.1-Bootstrap-Plan](docs/superpowers/plans/2026-08-28-v0.1-toolchain-bootstrap-implementation.md)
- [Private Referenzbibliothek: Katalog & Ablageregeln](docs/research/reference-library-catalog.md)

Weitere Projektmanagement-, Delivery-, Risiko- und Vorlagendokumente liegen unter `docs/product/`, `docs/delivery/` und `docs/templates/`.

## Code

Der speichereffiziente TypeScript-/React-/Vite-Workspace liegt vollständig in `code/`. Dadurch bleiben Quellcode, Dependencies, Caches und Builds klar von Dokumentation, Prompts und der privaten Referenzbibliothek getrennt. Alle App-Befehle werden aus diesem Ordner ausgeführt.

## Prompts

- [Prompt-Übersicht](prompts/README.md)
- [Solo AI-DM Master Prompt v2](prompts/dnd-solo-ai-dm-master-prompt-v2.md) — empfohlene Stable-Candidate-Fassung
- [Group AI-DM Overlay](prompts/dnd-group-ai-dm-master-prompt-experimental.md) — experimenteller Mehrspielermodus

## Lizenz-Hinweis

Dieses Projekt nutzt SRD-5.1/5.2.1-Inhalte von Wizards of the Coast LLC unter CC-BY-4.0. Private Bücher, Handouts und Karten liegen ausschließlich in `private-library/` und werden nie ins Repo committed (siehe `.gitignore`). Der versionierte Katalog enthält nur Metadaten und Herkunftsnotizen, keine Buchinhalte.

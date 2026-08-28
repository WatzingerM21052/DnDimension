# Initialer GitHub-Backlog

**Snapshot:** 2026-08-28<br>
**Operative Quelle:** [GitHub Project „DnDimension Development“](https://github.com/users/WatzingerM21052/projects/2) · [Kanban-View](https://github.com/users/WatzingerM21052/projects/2/views/2)

Dieses Dokument erklärt die initiale Zerlegung. Status, Zuständigkeit und Schätzung werden anschließend im GitHub Project gepflegt; bei Abweichungen gilt GitHub als aktuelle operative Quelle.

## Umfang des Bootstrap-Backlogs

- 25 initial angelegte Issues; im Snapshot 21 offen und 4 abgeschlossen;
- 10 Release-Epics von v0.1 bis v1.0;
- 6 verfeinerte Stories für v0.1 und v0.2;
- 9 Tasks beziehungsweise Spikes für die unmittelbar anstehende Foundation-Arbeit;
- 24 Release-Milestones von v0.1 bis v4.0;
- Parent-/Sub-Issue-Beziehungen zwischen Epics, Stories und Tasks/Spikes.

Die Releases nach v1.0 sind zunächst als Milestones und Roadmap-Gates angelegt. Detaillierte Stories entstehen erst im passenden Refinement, damit weit entfernte Arbeit nicht mit Scheingenauigkeit geplant wird.

## v0.1 - Project Foundation

- [#1 `[EPIC] v0.1 Project Foundation`](https://github.com/WatzingerM21052/DnDimension/issues/1)
  - [#11 `[STORY] Projektgrundlagen nachvollziehbar verwalten`](https://github.com/WatzingerM21052/DnDimension/issues/11) — Done
    - [#12 `[TASK] Projektmanagement-Dokumentation konsolidieren`](https://github.com/WatzingerM21052/DnDimension/issues/12) — Done
    - [#13 `[TASK] GitHub Labels, Milestones und Project-Felder einrichten`](https://github.com/WatzingerM21052/DnDimension/issues/13) — Done
    - [#14 `[TASK] Issue- und Pull-Request-Templates bereitstellen`](https://github.com/WatzingerM21052/DnDimension/issues/14) — Done
  - [#15 `[STORY] Anforderungen und Release-Gates baselinen`](https://github.com/WatzingerM21052/DnDimension/issues/15)
    - [#16 `[TASK] Ziele- und Anforderungskatalog reviewen`](https://github.com/WatzingerM21052/DnDimension/issues/16)
    - [#17 `[TASK] Release-Roadmap mit Exit-Kriterien validieren`](https://github.com/WatzingerM21052/DnDimension/issues/17)
    - [#18 `[TASK] Traceability und Release-Review definieren`](https://github.com/WatzingerM21052/DnDimension/issues/18)
  - [#19 `[STORY] Technische Foundation entscheidungsbereit machen`](https://github.com/WatzingerM21052/DnDimension/issues/19)
    - [#20 `[SPIKE] Local-first Persistenzarchitektur bewerten`](https://github.com/WatzingerM21052/DnDimension/issues/20)
    - [#21 `[SPIKE] Offiziellen SRD-Importpfad bewerten`](https://github.com/WatzingerM21052/DnDimension/issues/21)
    - [#22 `[TASK] Quality Gates und CI-Plan festlegen`](https://github.com/WatzingerM21052/DnDimension/issues/22)
    - [#26 `[TASK] Pre-Code Engineering Blueprint finalisieren`](https://github.com/WatzingerM21052/DnDimension/issues/26) — nach dem initialen Bootstrap ergänzt; Backlog

## v0.2 - Content & Data Foundation

- [#2 `[EPIC] v0.2 Content & Data Foundation`](https://github.com/WatzingerM21052/DnDimension/issues/2)
  - [#23 `[STORY] Content-Quellen und Lizenzen registrieren`](https://github.com/WatzingerM21052/DnDimension/issues/23)
  - [#24 `[STORY] Portables Domain-Datenmodell definieren`](https://github.com/WatzingerM21052/DnDimension/issues/24)
  - [#25 `[STORY] Reproduzierbaren SRD-Import bereitstellen`](https://github.com/WatzingerM21052/DnDimension/issues/25)

## Release-Epics v0.3 bis v1.0

- [#3 v0.3 Rules Engine Foundation](https://github.com/WatzingerM21052/DnDimension/issues/3)
- [#4 v0.4 Character Creator Slice](https://github.com/WatzingerM21052/DnDimension/issues/4)
- [#5 v0.5 First Local Alpha](https://github.com/WatzingerM21052/DnDimension/issues/5)
- [#6 v0.6 Play Session Alpha](https://github.com/WatzingerM21052/DnDimension/issues/6)
- [#7 v0.7 Integrated Local Alpha](https://github.com/WatzingerM21052/DnDimension/issues/7)
- [#8 v0.8 Feature-Complete Beta](https://github.com/WatzingerM21052/DnDimension/issues/8)
- [#9 v0.9 Release Candidate](https://github.com/WatzingerM21052/DnDimension/issues/9)
- [#10 v1.0 Local Player & DM](https://github.com/WatzingerM21052/DnDimension/issues/10)

## Refinement-Regel

1. Das nächste Release-Gate aus der Roadmap auswählen.
2. Epic in unabhängige, nutzerwertorientierte Stories zerlegen.
3. Stories mit Requirements, Akzeptanzkriterien, Abhängigkeiten und Risiko versehen.
4. Erst danach Tasks oder zeitlich begrenzte Spikes anlegen.
5. Nur Items gemäß Definition of Ready nach `Ready` verschieben.

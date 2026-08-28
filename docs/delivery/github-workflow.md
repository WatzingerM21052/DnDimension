# GitHub-Issue- und Project-Workflow

**Project:** [DnDimension Development](https://github.com/users/WatzingerM21052/projects/2) · [Kanban-View](https://github.com/users/WatzingerM21052/projects/2/views/2)<br>
**Bootstrap-Backlog:** [Initialer GitHub-Backlog](initial-backlog.md)

## Namensschema

- `[EPIC] <Ergebnis>`
- `[STORY] <Nutzerwert>`
- `[TASK] <konkrete Arbeit>`
- `[SPIKE] <zu klärende Frage>`
- `[BUG] <beobachtete Abweichung>`
- `[DOCS] <Dokumentationsarbeit>`

## Pflichtmetadaten

Jedes Issue erhält:

- ein `type:*`-Label und das Project-Feld `Work Type`;
- Priority;
- Area;
- Milestone/Version;
- Status;
- Owner, sobald aktiv;
- Story Points bei Story, Task oder Spike;
- Parent-Issue bei Story, Task und Spike;
- Requirement-IDs, wenn Nutzer-/Produktverhalten betroffen ist.

## Labels

| Gruppe | Werte |
|---|---|
| Type | `type:epic`, `type:story`, `type:task`, `type:bug`, `type:spike`, `type:docs`, `type:chore` |
| Priority | `priority:P0` bis `priority:P3` |
| Area | `area:product`, `content`, `rules`, `character`, `campaign`, `encounter`, `combat`, `data`, `platform`, `ux`, `auth`, `multiplayer`, `vtt`, `ai`, `docs` |
| State/Need | `status:blocked`, `needs:decision`, `needs:research`, `good first issue` |

Milestones bilden Versionen ab und werden nicht zusätzlich als Versionslabel dupliziert.

## Project-Felder

- `Status`: Backlog, Ready, In Progress, Blocked, In Review, Testing, Done
- `Work Type`: Epic, Story, Task, Bug, Spike, Docs, Chore (`Type` ist bei GitHub Projects reserviert)
- `Priority`: P0, P1, P2, P3
- `Area`: fachlicher Hauptbereich
- `Target Version`: Release-Gate
- `Sprint`: Textfeld für Sprintname
- `Story Points`: Zahlenfeld
- `Risk`: None, Low, Medium, High, Critical

Das native GitHub-Feld `Status` ist der verbindliche Prozessstatus und steuert die Spalten der View `Kanban`.

## Story-Vorlage

```markdown
## User Story
Als <Persona> möchte ich <Fähigkeit>, sodass <Nutzen>.

## Kontext
<Problem, Quelle, Requirement-IDs>

## Akzeptanzkriterien
- Given ... When ... Then ...
- Given ... When ... Then ...

## Nicht im Scope
- ...

## Abhängigkeiten / Risiken
- ...
```

## Task-Vorlage

```markdown
## Ziel
<konkretes überprüfbares Ergebnis>

## Umsetzungshinweise
- ...

## Akzeptanzkriterien
- [ ] ...
- [ ] ...

## Parent / Requirements
- Parent: #...
- Requirements: FR-... / NFR-...
```

## Pull Requests

- PR-Titel verweist auf Issue, beispielsweise `feat(character): validate ability scores (#42)`.
- PR beschreibt Änderung, Testnachweis, Screenshots bei UI und Risiken/Migrationen.
- `Closes #...` nur für tatsächlich vollständig erledigte Issues.
- Merge erst nach Review/Testing und aktualisierten Docs.

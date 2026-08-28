# Scrum- und Kanban-Playbook

## Arbeitsmodell

DnDimension nutzt **Scrumban**: zweiwöchige Sprintziele für Fokus und Review, kombiniert mit einem kontinuierlichen Kanban-Flow. Für ein Ein-Personen-Projekt ist ein künstliches Daily Meeting nicht nötig; ein kurzer asynchroner Check-in im Issue oder Statusbericht reicht.

## Board-Status

| Status | Bedeutung | Eintritt | Austritt |
|---|---|---|---|
| **Backlog** | Idee oder priorisierte Arbeit, noch nicht umsetzungsbereit | Issue erfasst | Definition of Ready erfüllt |
| **Ready** | klar, geschätzt und ohne bekannten Startblocker | Refinement abgeschlossen | aktiv begonnen |
| **In Progress** | aktive Umsetzung | Owner beginnt Arbeit | PR/Ergebnis zur Prüfung bereit |
| **Blocked** | aktive Arbeit kann nicht sinnvoll fortgesetzt werden | Blocker dokumentiert | Blocker entfernt; zurück zu vorherigem Status |
| **In Review** | Code-/Dokumentreview oder Product Review | überprüfbares Ergebnis vorhanden | Änderungen nötig oder Test bereit |
| **Testing** | Akzeptanz-, Integrations-, Accessibility- oder Release-Test | Review bestanden | Fehler zurück; Kriterien erfüllt |
| **Done** | Definition of Done vollständig erfüllt | Abnahme abgeschlossen | bleibt abgeschlossen |

## WIP-Limits

- In Progress: maximal 2 Items, empfohlen 1.
- In Review: maximal 3 Items.
- Testing: maximal 3 Items.
- Blocked zählt weiterhin zum WIP und wird nicht durch neue Arbeit „versteckt“.

## Issue-Hierarchie

```text
Epic
└── Story
    ├── Task
    ├── Spike
    └── Bug
```

- **Epic:** releaseübergreifendes oder großes Ergebnis; niemals direkt in einen Sprint ziehen.
- **Story:** unabhängiger Nutzerwert, möglichst innerhalb eines Sprints lieferbar.
- **Task:** konkrete Umsetzung ohne eigene User-Story-Formulierung.
- **Spike:** zeitlich begrenzte Untersuchung mit dokumentierter Entscheidung.
- **Bug:** Abweichung von akzeptiertem Verhalten mit Reproduktion und Erwartung.

## Prioritäten

| Priorität | Bedeutung |
|---|---|
| P0 | Release oder Daten/Sicherheit blockiert; sofort behandeln |
| P1 | für aktuelles Release erforderlich |
| P2 | wichtig, aber verschiebbar |
| P3 | Idee/Optimierung; kein Release-Versprechen |

## Schätzung

Story Points bilden relative Unsicherheit und Aufwand ab: 1, 2, 3, 5, 8, 13. Eine Story über 8 Punkten wird vor `Ready` geteilt. Epics werden nicht mit Story Points geschätzt.

## Sprintplanung

1. reale verfügbare Stunden bestimmen;
2. nur 70-80 % als geplante Kapazität verwenden;
3. ein messbares Sprint Goal wählen;
4. P0/P1-Items aus `Ready` auswählen;
5. Abhängigkeiten und Risiken prüfen;
6. Stretch-Items ausdrücklich als solche markieren.

## Definition of Ready

- Nutzen und Scope verständlich;
- Requirement-ID oder begründete interne Aufgabe verlinkt;
- Akzeptanzkriterien testbar;
- Priorität, Milestone, Area und Type gesetzt;
- Abhängigkeiten und Risiken sichtbar;
- Story Points für Story/Task gesetzt;
- kein unbekannter Startblocker.

## Definition of Done

- Akzeptanzkriterien erfüllt;
- Tests und Review bestanden;
- Dokumentation, Migration und Quellenangaben aktuell;
- betroffene Qualitätsanforderungen geprüft;
- Parent-Fortschritt und Board-Status aktualisiert;
- Ergebnis im Sprint Review demonstrierbar.

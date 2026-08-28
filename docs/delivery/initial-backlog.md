# Initialer GitHub-Backlog

**Snapshot:** 2026-08-28<br>
**Operative Quelle:** [GitHub Project „DnDimension Development“](https://github.com/users/WatzingerM21052/projects/2) · [Kanban-View](https://github.com/users/WatzingerM21052/projects/2/views/2)

Dieses Dokument erklärt die initiale Zerlegung. Status, Zuständigkeit und Schätzung werden anschließend im GitHub Project gepflegt; bei Abweichungen gilt GitHub als aktuelle operative Quelle.

## Umfang des Bootstrap-Backlogs

- 48 angelegte Issues; im Snapshot 35 offen und 13 abgeschlossen;
- 10 Release-Epics von v0.1 bis v1.0;
- 12 verfeinerte Stories für v0.1, v0.2 und den bestätigten v0.6-Sitzungsschnitt;
- 26 Tasks beziehungsweise Spikes; v0.6-Tasks bleiben bis zu ihren fachlichen und technischen Abhängigkeiten im Backlog;
- 24 Release-Milestones von v0.1 bis v4.0;
- Parent-/Sub-Issue-Beziehungen zwischen Epics, Stories und Tasks/Spikes.

Die Releases nach v1.0 sind zunächst als Milestones und Roadmap-Gates angelegt. Detaillierte Stories entstehen erst im passenden Refinement, damit weit entfernte Arbeit nicht mit Scheingenauigkeit geplant wird.

## v0.1 - Project Foundation

- [#1 `[EPIC] v0.1 Project Foundation`](https://github.com/WatzingerM21052/DnDimension/issues/1)
  - [#11 `[STORY] Projektgrundlagen nachvollziehbar verwalten`](https://github.com/WatzingerM21052/DnDimension/issues/11) — Done
    - [#12 `[TASK] Projektmanagement-Dokumentation konsolidieren`](https://github.com/WatzingerM21052/DnDimension/issues/12) — Done
    - [#13 `[TASK] GitHub Labels, Milestones und Project-Felder einrichten`](https://github.com/WatzingerM21052/DnDimension/issues/13) — Done
    - [#14 `[TASK] Issue- und Pull-Request-Templates bereitstellen`](https://github.com/WatzingerM21052/DnDimension/issues/14) — Done
  - [#15 `[STORY] Anforderungen und Release-Gates baselinen`](https://github.com/WatzingerM21052/DnDimension/issues/15) — Done
    - [#16 `[TASK] Ziele- und Anforderungskatalog reviewen`](https://github.com/WatzingerM21052/DnDimension/issues/16) — Done
    - [#17 `[TASK] Release-Roadmap mit Exit-Kriterien validieren`](https://github.com/WatzingerM21052/DnDimension/issues/17) — Done
    - [#18 `[TASK] Traceability und Release-Review definieren`](https://github.com/WatzingerM21052/DnDimension/issues/18) — Done
  - [#19 `[STORY] Technische Foundation entscheidungsbereit machen`](https://github.com/WatzingerM21052/DnDimension/issues/19)
    - [#20 `[SPIKE] Local-first Persistenzarchitektur bewerten`](https://github.com/WatzingerM21052/DnDimension/issues/20)
    - [#21 `[SPIKE] Offiziellen SRD-Importpfad bewerten`](https://github.com/WatzingerM21052/DnDimension/issues/21)
    - [#22 `[TASK] Quality Gates und CI-Plan festlegen`](https://github.com/WatzingerM21052/DnDimension/issues/22)
    - [#26 `[TASK] Pre-Code Engineering Blueprint finalisieren`](https://github.com/WatzingerM21052/DnDimension/issues/26) — nach dem initialen Bootstrap ergänzt; Backlog

## v0.2 - Content & Data Foundation

- [#2 `[EPIC] v0.2 Content & Data Foundation`](https://github.com/WatzingerM21052/DnDimension/issues/2)
  - [#23 `[STORY] Content-Quellen und Lizenzen registrieren`](https://github.com/WatzingerM21052/DnDimension/issues/23)
  - [#24 `[STORY] Portables Domain-Datenmodell definieren`](https://github.com/WatzingerM21052/DnDimension/issues/24) — Done, 4 / 4 Sub-Issues
    - [#46 `[TASK] Domain-Grenzen und Aggregate spezifizieren`](https://github.com/WatzingerM21052/DnDimension/issues/46) — Done, 3 SP
    - [#48 `[TASK] Command-, Event- und Snapshot-Verträge definieren`](https://github.com/WatzingerM21052/DnDimension/issues/48) — Done, 2 SP
    - [#47 `[TASK] Migration, Import und Recovery-Verträge definieren`](https://github.com/WatzingerM21052/DnDimension/issues/47) — Done, 2 SP
    - [#45 `[TASK] Domain-Verträge und Testmatrix festlegen`](https://github.com/WatzingerM21052/DnDimension/issues/45) — Done, 1 SP
  - [#25 `[STORY] Reproduzierbaren SRD-Import bereitstellen`](https://github.com/WatzingerM21052/DnDimension/issues/25)

## v0.3 - Rules Engine Foundation

- [#3 `[EPIC] v0.3 Rules Engine Foundation`](https://github.com/WatzingerM21052/DnDimension/issues/3) — 28 SP
  - [#49 `[STORY] Regelprofil und Auflösungsverträge eindeutig festlegen`](https://github.com/WatzingerM21052/DnDimension/issues/49) — 5 SP
    - [#50 `[TASK] Typisierte Rules-Engine-Verträge implementieren`](https://github.com/WatzingerM21052/DnDimension/issues/50) — 2 SP
    - [#51 `[TASK] Regelprofil, Quellen und Priorität auflösen`](https://github.com/WatzingerM21052/DnDimension/issues/51) — 2 SP
    - [#52 `[TASK] Status-, Fehler- und Trace-Pipeline implementieren`](https://github.com/WatzingerM21052/DnDimension/issues/52) — 1 SP
  - [#53 `[STORY] Abgeleitete Charakterwerte nachvollziehbar berechnen`](https://github.com/WatzingerM21052/DnDimension/issues/53) — 5 SP
    - [#54 `[TASK] Attributsmodifikator, Proficiency und Expertise implementieren`](https://github.com/WatzingerM21052/DnDimension/issues/54) — 2 SP
    - [#55 `[TASK] Alternative AC-Grundberechnungen auflösen`](https://github.com/WatzingerM21052/DnDimension/issues/55) — 2 SP
    - [#56 `[TASK] Invarianten und Regressionen abgeleiteter Werte absichern`](https://github.com/WatzingerM21052/DnDimension/issues/56) — 1 SP
  - [#57 `[STORY] D20-Prüfungen transparent auflösen`](https://github.com/WatzingerM21052/DnDimension/issues/57) — 8 SP
    - [#58 `[TASK] Begrenzte Würfelausdrücke und injizierbaren Resolver implementieren`](https://github.com/WatzingerM21052/DnDimension/issues/58) — 3 SP
    - [#59 `[TASK] D20-Pipeline mit Vorteil und Nachteil implementieren`](https://github.com/WatzingerM21052/DnDimension/issues/59) — 3 SP
    - [#60 `[TASK] Manuelle Würfe, Follow-ups und D20-Regressionen absichern`](https://github.com/WatzingerM21052/DnDimension/issues/60) — 2 SP
  - [#61 `[STORY] Generische Ressourcen regelkonform verändern`](https://github.com/WatzingerM21052/DnDimension/issues/61) — 5 SP
    - [#62 `[TASK] Generisches Ressourcenmodell implementieren`](https://github.com/WatzingerM21052/DnDimension/issues/62) — 2 SP
    - [#63 `[TASK] Ressourcen-Transitionen als Vorschläge auflösen`](https://github.com/WatzingerM21052/DnDimension/issues/63) — 2 SP
    - [#64 `[TASK] Ressourceninvarianten und Auflade-Trigger testen`](https://github.com/WatzingerM21052/DnDimension/issues/64) — 1 SP
  - [#65 `[STORY] Regelauflösungen sicher vorschauen und bestätigen`](https://github.com/WatzingerM21052/DnDimension/issues/65) — 5 SP
    - [#66 `[TASK] Preview- und Apply-Vertrag implementieren`](https://github.com/WatzingerM21052/DnDimension/issues/66) — 2 SP
    - [#67 `[TASK] Revision, Idempotenz und atomare Anwendung absichern`](https://github.com/WatzingerM21052/DnDimension/issues/67) — 2 SP
    - [#68 `[TASK] Sichtbarkeitssichere Resolution-Projektionen implementieren`](https://github.com/WatzingerM21052/DnDimension/issues/68) — 1 SP

Alle v0.3-Items stehen im `Backlog` und tragen Milestone, Labels, Parent, Priority, Area, Work Type, Target Version, Risk und Story Points. Sie werden erst nach dem Pre-Code Engineering Blueprint und der Prüfung der Abhängigkeiten #20/#23/#25 in `Ready` verschoben.

## Weitere Release-Epics v0.4 bis v1.0

- [#4 v0.4 Character Creator Slice](https://github.com/WatzingerM21052/DnDimension/issues/4)
- [#5 v0.5 First Local Alpha](https://github.com/WatzingerM21052/DnDimension/issues/5)
- [#6 v0.6 Play Session Alpha](https://github.com/WatzingerM21052/DnDimension/issues/6)
- [#7 v0.7 Integrated Local Alpha](https://github.com/WatzingerM21052/DnDimension/issues/7)
- [#8 v0.8 Feature-Complete Beta](https://github.com/WatzingerM21052/DnDimension/issues/8)
- [#9 v0.9 Release Candidate](https://github.com/WatzingerM21052/DnDimension/issues/9)
- [#10 v1.0 Local Player & DM](https://github.com/WatzingerM21052/DnDimension/issues/10)

## v0.6 - Play Session Alpha

- [#6 `[EPIC] v0.6 Play Session Alpha`](https://github.com/WatzingerM21052/DnDimension/issues/6)
  - [#27 `[STORY] Sitzung vorbereiten, starten und fortsetzen`](https://github.com/WatzingerM21052/DnDimension/issues/27) — 8 SP
    - [#28 `[TASK] Adventure- und Session-Laufzeitmodell definieren`](https://github.com/WatzingerM21052/DnDimension/issues/28) — 5 SP
    - [#29 `[TASK] Session-Lifecycle, Snapshot und Wiederaufnahme umsetzen`](https://github.com/WatzingerM21052/DnDimension/issues/29) — 3 SP
  - [#30 `[STORY] Szenen aller drei D&D-Säulen verwalten`](https://github.com/WatzingerM21052/DnDimension/issues/30) — 8 SP
    - [#31 `[TASK] Adventure- und Scene-Foundation implementieren`](https://github.com/WatzingerM21052/DnDimension/issues/31) — 5 SP
    - [#32 `[TASK] Social- und Exploration-Szenenablauf implementieren`](https://github.com/WatzingerM21052/DnDimension/issues/32) — 3 SP
  - [#33 `[STORY] Würfe und DM-Auflösung nachvollziehbar protokollieren`](https://github.com/WatzingerM21052/DnDimension/issues/33) — 5 SP
    - [#34 `[TASK] Würfel- und Modifikatorauflösung implementieren`](https://github.com/WatzingerM21052/DnDimension/issues/34) — 3 SP
    - [#35 `[TASK] Intentionslog, Automatisierungsgrad und DM-Override implementieren`](https://github.com/WatzingerM21052/DnDimension/issues/35) — 2 SP
  - [#36 `[STORY] Kleine Kampfbegegnung vollständig durchführen`](https://github.com/WatzingerM21052/DnDimension/issues/36) — 13 SP; vor `Ready` weiter zu teilen
    - [#37 `[TASK] Initiative, Runden und Aktionsökonomie implementieren`](https://github.com/WatzingerM21052/DnDimension/issues/37) — 8 SP
    - [#38 `[TASK] HP, Todeszustand, Effekte, Konzentration und Ressourcen implementieren`](https://github.com/WatzingerM21052/DnDimension/issues/38) — 5 SP
  - [#39 `[STORY] Sitzungswissen sicher trennen und enthüllen`](https://github.com/WatzingerM21052/DnDimension/issues/39) — 5 SP
    - [#40 `[TASK] Session-Sichtbarkeitsmodell deny-by-default implementieren`](https://github.com/WatzingerM21052/DnDimension/issues/40) — 3 SP
    - [#41 `[TASK] Player Preview, Enthüllung und Visibility-Negativtests implementieren`](https://github.com/WatzingerM21052/DnDimension/issues/41) — 2 SP
  - [#42 `[STORY] Sitzung abschließen und Kampagnenfortschritt übernehmen`](https://github.com/WatzingerM21052/DnDimension/issues/42) — 5 SP
    - [#43 `[TASK] Sitzungsrückblick und Adventure-Campaign-Rückfluss implementieren`](https://github.com/WatzingerM21052/DnDimension/issues/43) — 3 SP
    - [#44 `[TASK] Session-Abschluss, Archivierung und Restore absichern`](https://github.com/WatzingerM21052/DnDimension/issues/44) — 2 SP

Alle v0.6-Items stehen im `Backlog`, tragen Milestone, Priority, Area, Work Type, Target Version, Risk und vorläufige Story Points. Sie werden erst nach v0.2/v0.3-Domain-, Persistenz- und Rules-Entscheidungen in `Ready` verschoben. #36 überschreitet bewusst die Ready-Grenze von 8 Punkten und muss im späteren Refinement in kleinere nutzerwertorientierte Stories zerlegt werden.

## Refinement-Regel

1. Das nächste Release-Gate aus der Roadmap auswählen.
2. Epic in unabhängige, nutzerwertorientierte Stories zerlegen.
3. Stories mit Requirements, Akzeptanzkriterien, Abhängigkeiten und Risiko versehen.
4. Erst danach Tasks oder zeitlich begrenzte Spikes anlegen.
5. Nur Items gemäß Definition of Ready nach `Ready` verschieben.

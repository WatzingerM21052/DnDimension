# Traceability- und Release-Review-Matrix

**Stand:** 2026-08-28<br>
**Status:** Working Baseline<br>
**Operative Quelle für Status:** [GitHub Project „DnDimension Development“](https://github.com/users/WatzingerM21052/projects/2)

## 1. Zweck

Jede akzeptierte Anforderung muss von ihrer fachlichen Quelle bis zur Release-Abnahme verfolgbar sein:

```text
Ziel / Entscheidung
        -> Requirement-ID
        -> GitHub Epic / Story / Task
        -> Pull Request / Änderung
        -> automatisierter oder manueller Testnachweis
        -> Release-Review
```

Diese Matrix ersetzt keine Tests oder GitHub-Statuspflege. Sie definiert die verbindlichen Verknüpfungen und zeigt, wo Nachweise im Projektlebenszyklus entstehen.

## 2. Verknüpfungsregeln

- Jede Story nennt mindestens eine Requirement-ID oder begründet, warum sie reine technische beziehungsweise dokumentarische Arbeit ist.
- Tasks nennen Parent-Story, betroffene Requirements und konkrete Verifikation.
- Pull Requests verlinken die gelieferten Issues und nennen die ausgeführten Quality Gates.
- Tests verwenden Requirement- oder Story-ID in Name, Metadaten oder Testplan.
- Ein Requirement wird erst `Verified`, wenn Implementierung und geforderter Nachweis im Zielrelease vorhanden sind.
- Ein geschlossenes Issue allein verifiziert keine Produktanforderung.
- Wesentliche Scope-Änderungen benötigen Requirement- und gegebenenfalls Decision-Record-Revision vor einer Story-Änderung.

## 3. Capability-Matrix bis v1.0

| Capability | Ziele/Entscheidungen | Requirements | Fachliche Spec | GitHub-Epic | primärer Release-Nachweis |
|---|---|---|---|---|---|
| Content & Data | Z-07; DEC-001/002 | FR-009; CON-001/002/009 | Content Foundation | [#2](https://github.com/WatzingerM21052/DnDimension/issues/2) | Source Registry, Lizenzprüfung, Schema- und Importtests |
| Rules Engine | Z-02; DEC-002/003 | FR-006; NFR-010/011; CON-010 | Content Foundation und späterer Rules-Spec | [#3](https://github.com/WatzingerM21052/DnDimension/issues/3) | deterministische Unit- und Regelregressionstests |
| Character Creator | Z-01/02; DEC-001/002/003 | FR-001 bis FR-003, FR-020/021 | [v0.4 Character Creator](../spec-planning/v0.4-character-creator-spec.md) | [#4](https://github.com/WatzingerM21052/DnDimension/issues/4) | gültiger SRD-Charakter, Persistenz- und Negativtests |
| Campaign Creator | Z-03/05; DEC-001/004 | FR-004/005, FR-023 bis FR-028 | [v0.5 Campaign Creator](../spec-planning/v0.5-campaign-creator-spec.md) | [#5](https://github.com/WatzingerM21052/DnDimension/issues/5) | Draft/Activation, Regelrevision und Visibility-Negativtests |
| Adventure & Play Session | Z-03/11/12/13/14; DEC-003/004/005 | FR-006 bis FR-008, FR-022, FR-029 bis FR-039 | [v0.6 Play Session](../spec-planning/v0.6-play-session-spec.md) | [#6](https://github.com/WatzingerM21052/DnDimension/issues/6) | säulenübergreifende Testsitzung, Referenzkampf, Audit-/Recovery-Tests |
| Lokale Integration | Z-01 bis Z-05; DEC-001/005 | FR-002/003/005/010, FR-037 bis FR-039 | Specs v0.4-v0.6 | [#7](https://github.com/WatzingerM21052/DnDimension/issues/7) | Mehrsitzungs-End-to-End-Test ohne Netzwerk |
| Feature-Complete Beta | DEC-001/003/005 | alle v1-P0-FR/NFR/CON | Specs und Requirements-Katalog | [#8](https://github.com/WatzingerM21052/DnDimension/issues/8) | vollständige v1-Testmatrix und externe Playtests |
| Release Candidate | DEC-001 | alle v1-P0/P1 mit akzeptierter Restliste | Release-Review | [#9](https://github.com/WatzingerM21052/DnDimension/issues/9) | Migration, Restore, Performance, Accessibility und Regression |
| Local Player & DM | Z-01 bis Z-08; DEC-001 | akzeptierter v1.0-Scope | alle Capability-Specs | [#10](https://github.com/WatzingerM21052/DnDimension/issues/10) | stabile Mehrsitzungskampagne über Social, Exploration und Combat |

## 4. Nachweisarten

| Kürzel | Nachweis | Beispiele |
|---|---|---|
| UT | Unit Test | Ableitungen, Würfelparser, Effekt- und Ressourcentransitionen |
| IT | Integration Test | Content + Rules + Persistenz, Visibility-Filter, Import/Export |
| E2E | End-to-End-Test | Charakter bis Kampagne, Session und Journal |
| AT | Acceptance Test | Given/When/Then gegen Story und Release-Gate |
| A11Y | Accessibility-Test | Tastatur, Fokus, Screenreader, Kontrast |
| SEC | Security-/Privacy-Test | Geheimnisfilter, Berechtigungen, Secret Scan |
| LIC | Lizenz-/Quellenprüfung | Attribution, Source Manifest, keine privaten Assets |
| PERF | Performance-/Recovery-Test | Ladebudget, Snapshot, Crash-/Restore-Szenario |
| UAT | Nutzer-/Playtest | Regel-Neuling, Spieler, menschlicher DM |

## 5. Release-Review-Checkliste

### Scope und Requirements

- [ ] alle P0-Requirements des Releases sind `Verified` oder das Release ist blockiert;
- [ ] offene P1/P2-Abweichungen besitzen Issue, Risiko und Zielrelease;
- [ ] keine neue Funktion umgeht eine akzeptierte Scope- oder Content-Grenze;
- [ ] Roadmap, Milestone, Epic und Capability-Spec stimmen überein.

### Implementierung und Qualität

- [ ] alle verknüpften Stories erfüllen Akzeptanzkriterien und Definition of Done;
- [ ] Build, Typecheck, Lint und relevante automatisierte Tests sind grün;
- [ ] Datenmigration, Export, Import und Wiederherstellung sind proportional zum Release getestet;
- [ ] Accessibility-, Security-, Datenschutz- und Lizenzwirkung wurden geprüft;
- [ ] bekannte Fehler sind nach P0-P3 priorisiert; keine offenen P0-Fehler.

### Produktabnahme

- [ ] Release-Gate wurde als reproduzierbarer Ablauf demonstriert;
- [ ] wichtige Fehler-, Leer-, Offline- und Wiederaufnahmezustände wurden geprüft;
- [ ] Nutzer-/Playtest-Erkenntnisse und verbleibende Risiken sind dokumentiert;
- [ ] Product Owner bestätigt Scope und bekannte Abweichungen;
- [ ] Release-Notiz nennt neue Funktionen, Migration, bekannte Grenzen und Restore-Weg.

## 6. Beispielkette

```text
DEC-005
  -> FR-030 Sitzung pausieren und fortsetzen
  -> v0.6 Epic #6
  -> Story „Sitzung vorbereiten, starten und fortsetzen“
  -> Tasks für Lifecycle, Snapshot/Recovery und UI
  -> PR mit AT/IT/PERF-Nachweisen
  -> v0.6 Release-Review: Neustart aus Active und Paused identisch
```

## 7. Pflege

- Die Matrix wird bei neuen Requirements, Decision Records oder Release-Schnitten aktualisiert.
- Operativer Status und Story Points werden nicht doppelt hier gepflegt; dafür gilt GitHub.
- Konkrete PR- und Testlinks werden in Issues beziehungsweise Release-Reviews geführt.
- Vor jedem Release Review wird mindestens eine vollständige Kette stichprobenartig vom Requirement bis zum Test geprüft.

# Requirements Engineering und Anforderungskatalog

**Stand:** 2026-08-28<br>
**Status:** High-Level Baseline; Feature-Spezifikationen verfeinern diese Anforderungen

## 1. Anforderungsmanagement

Jede Anforderung besitzt:

- stabile ID;
- Typ: funktional, Qualität, Constraint oder Transition;
- Quelle und betroffene Persona;
- Priorität nach MoSCoW beziehungsweise P0-P3;
- Zielrelease und verantwortlichen Owner;
- überprüfbare Akzeptanzkriterien;
- Beziehungen zu Story, Test und Entscheidung;
- Status: Proposed, Accepted, In Progress, Verified, Rejected oder Superseded.

Änderungen werden nicht still in bestehende Anforderungen geschrieben. Wesentliche Scope-Änderungen dokumentieren Motivation, Auswirkungen auf Roadmap, Risiken und abgelöste IDs.

## 2. Personas

- **P1 Regel-Neuling:** möchte spielen, ohne Regeln vorher vollständig zu lernen.
- **P2 Spieler:** verwaltet Charaktere, Fortschritt, Inventar und Entscheidungen.
- **P3 Dungeon Master:** plant und leitet Kampagnen, Welt, NPCs und Begegnungen.
- **P4 Gruppen-Host:** verwaltet Mitglieder, Rollen und gemeinsame Sitzungen.
- **P5 Solo-Spieler:** nutzt ab v3 einen KI-DM mit belastbarem Gedächtnis.

## 3. Funktionale Anforderungen

| ID | Anforderung | Release | Priorität | Abnahme auf hoher Ebene |
|---|---|---|---|---|
| FR-001 | Das System führt durch eine editionskorrekte Charaktererstellung. | v0.4 | P0 | gültiger 2024-Charakter ohne manuelle Nachrechnung |
| FR-002 | Nutzer können mehrere Charaktere speichern, laden, kopieren und archivieren. | v1.0 | P0 | Zustände bleiben nach Neustart identisch |
| FR-003 | Spieler können Level-ups regelgeführt durchführen. | v1.0 | P0 | Voraussetzungen und abgeleitete Werte werden validiert |
| FR-004 | DMs können Kampagnen mit Regeln, Ton und Fortschrittsart anlegen. | v0.5 | P0 | Kampagne ist speicher- und wiederöffbar |
| FR-005 | DMs verwalten Orte, NPCs, Fraktionen, Quests und Lore. | v0.7 | P0 | Einträge sind verknüpfbar und kampagnenisoliert |
| FR-006 | Das System unterstützt Würfelwürfe mit nachvollziehbaren Modifikatoren. | v0.6 | P0 | Ergebnis zeigt Würfel, Bonus, Quelle und Total |
| FR-007 | DMs erstellen und verwalten Begegnungen. | v0.6 | P0 | Teilnehmer können in eine Sitzung übernommen werden |
| FR-008 | Das System verwaltet Initiative, HP, Zustände und Konzentration. | v0.6 | P0 | vollständiger kleiner Kampf ist durchführbar |
| FR-009 | Regeln und Inhalte tragen Edition und Quelle; aktivierte Regelstände werden nie unmarkiert vermischt. | v0.2 | P0 | 2024 ist als kanonischer Start-Regelstand filterbar; optionale 2014-Daten bleiben strikt getrennt |
| FR-010 | Nutzer können ihre lokalen Daten exportieren und wiederherstellen. | v0.8 | P0 | Roundtrip-Test ohne Informationsverlust |
| FR-011 | Nutzer können eigene private Inhalte ergänzen. | v1.1 | P1 | Herkunft ist als private/homebrew markiert |
| FR-012 | Accounts und Rollen ermöglichen geteilte Kampagnen. | v1.3 | P0 | DM/Spieler-Rechte sind technisch erzwungen |
| FR-013 | Mehrere Clients erhalten konsistenten Live-Sitzungszustand. | v1.4 | P0 | Reconnect und Konfliktverhalten sind getestet |
| FR-014 | Karten, Tokens und visuelle Zustände unterstützen Sitzungen. | v2.2 | P0 | zentrale Kartenaktionen sind zugänglich und speicherbar |
| FR-015 | Ein Solo-KI-DM verwendet Kampagnenzustand und zugelassene Quellen. | v3.1 | P0 | relevante Evals und Quellenanzeige bestehen |
| FR-016 | Ein menschlicher DM kann KI-Vorschläge prüfen, ändern oder verwerfen. | v3.0 | P1 | keine KI-Änderung wird ungefragt verbindlich |
| FR-017 | Das VTT unterstützt Grid, Sicht, Fog und Flächeneffekte. | v2.5 | P0 | taktische Begegnung ist Ende-zu-Ende möglich |
| FR-018 | Erweiterungen nutzen versionierte, beschränkte Schnittstellen. | v4.0 | P1 | Erweiterung kann deaktiviert werden, ohne Daten zu beschädigen |

## 4. Qualitätsanforderungen

| ID | Qualitätsziel | Mess-/Abnahmekriterium | Release |
|---|---|---|---|
| NFR-001 | Bedienbarkeit | Kernaufgaben besitzen klare leere, Lade- und Fehlerzustände | v0.5 |
| NFR-002 | Accessibility | Kernflüsse zielen auf WCAG 2.2 AA; Tastatur und Screenreader werden getestet | v0.8 |
| NFR-003 | Datenintegrität | Migrationen und Export/Import sind automatisiert getestet | v0.8 |
| NFR-004 | Performance | Interaktionen reagieren lokal wahrnehmbar direkt; konkrete Budgets werden im technischen Spec festgelegt | v0.7 |
| NFR-005 | Sicherheit | keine Secrets im Client/Repo; Berechtigungen serverseitig geprüft | v1.2 |
| NFR-006 | Datenschutz | Datensparsamkeit, Lösch-/Exportweg und Aufbewahrung dokumentiert | v1.2 |
| NFR-007 | Verfügbarkeit | Reconnect und Wiederherstellung verhindern stillen Sitzungsverlust | v1.4 |
| NFR-008 | Beobachtbarkeit | Fehler besitzen Korrelation und nutzerfreundliche Meldung ohne sensitive Daten | v1.2 |
| NFR-009 | KI-Transparenz | Quellenstatus, Unsicherheit und Kostenlimit sind erkennbar | v3.0 |
| NFR-010 | Wartbarkeit | Rules Engine und Content sind unabhängig von UI und KI testbar | v0.3 |

## 5. Constraints

| ID | Constraint |
|---|---|
| CON-001 | Veröffentlichter Regelcontent basiert nur auf zulässigen Quellen und korrekter Attribution. |
| CON-002 | Proprietäre Referenzbücher bleiben außerhalb von Git und veröffentlichten Datenbeständen. |
| CON-003 | Kampagnen tragen ein explizites Ruleset; Konvertierungen werden nicht automatisch verborgen. |
| CON-004 | KI ist kein technischer Zwang für v0.1-v2.0. |
| CON-005 | Keine verbindlichen Termine ohne verfügbare Kapazität und geschätzte Ready-Issues. |

## 6. Traceability

```text
Ziel → Requirement-ID → GitHub Story/Task → Pull Request → Test → Release-Gate
```

Eine Story verweist auf Requirement-IDs. Tests nennen die Story oder Requirement-ID. Release Reviews prüfen offene P0/P1-Anforderungen und bekannte Abweichungen.

## 7. Definition of Ready

Eine Story darf nach `Ready`, wenn Problem/Nutzen, Scope, Abhängigkeiten, Akzeptanzkriterien, Release, Priorität und grobe Schätzung vorhanden sind. Offene Blocker verhindern `Ready`.

## 8. Definition of Done

- Akzeptanzkriterien erfüllt und getestet;
- relevante automatisierte Tests grün;
- Review abgeschlossen;
- Accessibility, Sicherheit, Datenschutz und Lizenzwirkung geprüft, soweit betroffen;
- Dokumentation und Migration aktualisiert;
- Product-Owner-Abnahme für Nutzerstories;
- keine offenen P0-Fehler im gelieferten Scope.

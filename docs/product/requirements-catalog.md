# Requirements Engineering und Anforderungskatalog

**Stand:** 2026-08-28<br>
**Status:** v1.0-Scope gemäß [DEC-001](../decisions/DEC-001-v1-scope-baseline.md) akzeptiert; einzelne Anforderungen werden im laufenden Review verfeinert

**Domain-Baseline:** Die [v0.2 Portable Domain & Data Model Specification](../spec-planning/v0.2-domain-data-model-spec.md) und [DEC-006](../decisions/DEC-006-hybrid-aggregate-snapshot-audit-model.md) definieren die gemeinsamen Identitäts-, Revisions-, Command-, Audit-, Snapshot-, Migrations- und Import-/Export-Verträge für die nachfolgenden Anforderungen.

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
| FR-001 | Das System führt mit eingebautem, veröffentlichbarem SRD-5.2.1-Content durch eine editions- und quellenkorrekte Charaktererstellung. | v0.4 | P0 | gültiger 2024-Charakter ohne private Datei, Netzwerk oder manuelle Nachrechnung |
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
| FR-019 | Nach Freigabe eines zusätzlichen Regelstands können Nutzer ihn pro Kampagne in den Einstellungen auswählen. | Future, nach stabilem 2024-Kern | P2 | 2014 wird erst angeboten, wenn Content, Berechnungen, Migration und getrennte Tests vollständig abgenommen sind |
| FR-020 | Der Character Creator unterstützt Standard Array, Point Buy, transparenten In-App-Wurf und manuelle Attributseingabe. | v0.4 | P0 | jede Methode ist validiert, persistierbar und zeigt Zuordnung beziehungsweise Berechnung nachvollziehbar |
| FR-021 | Kampagnen können zulässige Attributsmethoden festlegen. | v0.5 | P0 | gesperrte Methoden sind für zugeordnete Charaktere nicht auswählbar; bestehende Abweichungen werden sichtbar markiert |
| FR-022 | Ein menschlicher DM kann automatisierte Zustände begründet korrigieren. | v0.6 | P1 | vorheriger/neuer Wert, Grund und Zeitpunkt bleiben im Sitzungslog nachvollziehbar |
| FR-023 | Der Campaign Creator führt wahlweise geführt oder kompakt durch eine lokale Kampagnenerstellung. | v0.5 | P0 | Draft mit Prämisse, Format und Startpunkt kann offline angelegt, fortgesetzt und aktiviert werden |
| FR-024 | Jede Kampagne speichert ein versioniertes Regelprofil aus Ruleset, Source Snapshot, unterstütztem Startlevel, Fortschrittsart und aktivierten Regeln. | v0.5 | P0 | Regelprofil bleibt nach Neustart identisch; Änderungen besitzen Revision und Auswirkungsanalyse |
| FR-025 | DMs können Session-Zero-Erwartungen und gemeinsam vereinbarte Grenzen dokumentieren und revisionieren. | v0.5 | P0 | aktuelle Absprachen sind player-facing sichtbar und frühere Revisionen nachvollziehbar |
| FR-026 | Kampagneninformationen werden fachlich in `player_facing` und `dm_only` getrennt. | v0.5 | P0 | Player Preview erhält in Negativtests keine DM-only Daten |
| FR-027 | Lokale Charaktere können einer Kampagne zugeordnet und gegen deren Regelprofil geprüft werden. | v0.5 | P0 | Ergebnis zeigt kompatibel, Warnung oder Inkompatibilität mit Gründen ohne stille Mutation |
| FR-028 | Kampagnen besitzen einen sicheren Lebenszyklus aus Draft, Active, Paused, Completed und Archived. | v0.5 | P0 | Zustandswechsel bleiben nach Neustart erhalten; Archivierung löscht keine abhängigen Daten |
| FR-029 | Adventures sind eigene Handlungsbögen innerhalb einer Kampagne und speichern Hook, Ziele, Konflikte, mögliche Endzustände, Fortschritt und Sitzungsreferenzen. | v0.6 | P0 | Adventure kann unabhängig vorbereitet, in einer Sitzung referenziert und ohne stille Vorlagenmutation fortgeschrieben werden |
| FR-030 | Sitzungen besitzen den Lebenszyklus Draft, Prepared, Active, Paused, Completed und Archived und können exakt fortgesetzt werden. | v0.6 | P0 | Neustart aus Draft, Active und Paused stellt jeweils den letzten konsistenten Stand wieder her |
| FR-031 | Sitzungen unterstützen soziale, erkundungsbezogene, kämpferische, gemischte und freie Szenen über denselben Beschreiben–Handeln–Auflösen–Folgen-Kern. | v0.6 | P0 | eine Testsitzung wechselt durch alle drei Säulen, ohne Teilnehmer-, Ressourcen- oder Wissenszustand zu verlieren |
| FR-032 | Spielerabsichten, DM-Auflösung und Würfe werden mit Kontext, Würfeln, Modifikatoren, Ziel, Sichtbarkeit, Ergebnis und Quelle erfasst. | v0.6 | P0 | automatische und manuelle Würfe sind unterscheidbar und vollständig nachvollziehbar |
| FR-033 | Bestätigte Sitzungsereignisse und konsistente Snapshots ermöglichen Audit, Korrektur und Wiederherstellung. | v0.6 | P0 | Korrekturen bewahren Historie; Crash-/Restore-Test rekonstruiert denselben bestätigten Zustand |
| FR-034 | Der Combat Tracker verwaltet Initiative, Runden/Züge, Aktionsökonomie, HP, temporäre HP, Todesrettungen, Schaden, Heilung, Zustände, Konzentration, Effekte und generische Ressourcen. | v0.6 | P0 | ein kleiner Referenzkampf kann über mehrere Runden bis zu einem tödlichen oder nicht-tödlichen Ende durchgeführt werden |
| FR-035 | Sitzungs-, Szenen- und Ereignisdaten erzwingen `dm_only`, `player_facing` und bewusstes `revealed`. | v0.6 | P0 | neue Feldtypen sind deny-by-default; Player-Preview-Negativtests decken alle DM-only Typen ab |
| FR-036 | Der Sitzungsabschluss erzeugt getrennte Rückblicke und einen bestätigten Rückfluss in Adventure, Kampagnenjournal und Charakterfortschritt. | v0.6 | P0 | keine übergeordnete Vorlage wird ohne Vorschau und Bestätigung verändert; Herkunft zur Sitzung bleibt erhalten |
| FR-037 | DMs verwalten mehrere Adventures und Sitzungen mit verknüpften Orten, NPCs, Hinweisen, Belohnungen, Zielen und offenen Folgen. | v0.7 | P0 | eine Kampagne kann zwei aufeinanderfolgende Sitzungen mit konsistentem Adventure- und Weltfortschritt durchführen |
| FR-038 | Session und Rules Engine integrieren soziale Haltungen, Beziehungen, Zeit, Licht, Reiseabschnitte, Gefahren, Rasten und mehrere Encounters zwischen Rasten. | v0.7 | P0 | Social-/Exploration-/Ressourcenänderungen bleiben über Szenen und Sitzungen konsistent |
| FR-039 | Der gesamte v1-P0-Spielablauf ist für den freigegebenen 2024/SRD-Umfang feature-complete; Sonderfälle sind berechnet, unterstützt oder transparent manuell protokollierbar. | v0.8 | P0 | externer Mehrsitzungs-Playtest benötigt für keinen Kernschritt Account, KI, VTT oder eine unmarkierte Regelannahme |

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
| NFR-011 | Regelerklärbarkeit und Spielerautonomie | automatische Würfe, Modifikatoren und Zustandsänderungen zeigen Ursache; keine Spielerentscheidung wird still ersetzt | v0.4 |
| NFR-012 | Wissensgrenzen | alle Kampagnenabfragen erzwingen Sichtbarkeit im Datenzugriff; neue Feldtypen benötigen Negativtests | v0.5 |
| NFR-013 | Atomare Sitzungsintegrität | bestätigte Zustandsänderungen sind vollständig oder gar nicht angewandt; Snapshot und Logposition werden gemeinsam validiert | v0.6 |
| NFR-014 | Transparente Regelabdeckung | jeder regelrelevante Vorgang ist als `computed`, `assisted` oder `manual_recorded` erkennbar; kein unbekannter Fall wird still als berechnet dargestellt | v0.6 |
| NFR-015 | Langzeitsitzung und Wiederaufnahme | definierte Teilnehmer-, Log- und Laufzeitbudgets sowie Crash-/Restore-Szenarien werden spätestens in der Beta nachgewiesen | v0.8 |

## 5. Constraints

| ID | Constraint |
|---|---|
| CON-001 | Veröffentlichter Regelcontent basiert nur auf zulässigen Quellen und korrekter Attribution. |
| CON-002 | Proprietäre Referenzbücher bleiben außerhalb von Git und veröffentlichten Datenbeständen. |
| CON-003 | Kampagnen tragen ein explizites Ruleset; Konvertierungen werden nicht automatisch verborgen. |
| CON-004 | KI ist kein technischer Zwang für v0.1-v2.0. |
| CON-005 | Keine verbindlichen Termine ohne verfügbare Kapazität und geschätzte Ready-Issues. |
| CON-006 | v1.0 bleibt ohne Account, Cloud, Sharing, Realtime, VTT, KI und vollständigen Homebrew-Editor vollständig nutzbar. |
| CON-007 | v1.0 führt verpflichtend nur 2024-Regeln aus; 2014-Kompatibilität wird vorbereitet, aber separat geplant und abgenommen. |
| CON-008 | Nicht vollständig implementierte Regelstände erscheinen weder als auswählbare Einstellung noch werden sie automatisch mit aktiven Kampagnen vermischt. |
| CON-009 | Fest eingebaute v1.0-Charakteroptionen stammen ausschließlich aus zulässigem SRD-5.2.1-Content; proprietäre und private Optionen folgen nur über getrennte spätere Mechanismen. |
| CON-010 | RAW 2024 ist der Standard; Varianten und Komfortregeln werden nur als explizite kampagnenspezifische Einstellungen aktiviert. |
| CON-011 | Inspiration aus Videospielen oder Mods darf keine geschützten Assets/Texte/UI-Kompositionen übernehmen und keine abweichende Mechanik als offizielle Regel darstellen. |
| CON-012 | Regel- oder Quellenänderungen einer aktiven Kampagne werden versioniert und niemals ohne Auswirkungsanalyse auf Charaktere und Sitzungszustand angewandt. |
| CON-013 | Veröffentlichte Abenteuer dürfen als private Referenz registriert werden; proprietärer Volltext und Medien werden weder eingebaut noch automatisch aus privaten Dateien importiert. |
| CON-014 | Der bewusst kleine v0.6-Alpha-Slice definiert nicht die Funktionsobergrenze; v0.8 muss den gesamten akzeptierten v1-P0-Umfang enthalten und v1.0 normalen lokalen Mehrsitzungsbetrieb ermöglichen. |
| CON-015 | v1.0 darf für einen vollständigen Sitzungsablauf keine Battle Map oder VTT-Funktion voraussetzen; abstrakte Positionierung und manuelle Distanzeingabe bleiben möglich. |
| CON-016 | Ein nicht automatisierter Regel- oder Content-Sonderfall muss transparent unterstützt oder manuell protokolliert werden; die App darf weder Spielerentscheidung noch Regelergebnis erfinden. |

## 6. Traceability

```text
Ziel → Requirement-ID → GitHub Story/Task → Pull Request → Test → Release-Gate
```

Eine Story verweist auf Requirement-IDs. Tests nennen die Story oder Requirement-ID. Release Reviews prüfen offene P0/P1-Anforderungen und bekannte Abweichungen.

Querschnittsarbeit am Domainmodell darf mehrere spätere Requirements vorbereiten, ohne deren Zielrelease vorzuziehen. GitHub-Story #24 weist deshalb primäre betroffene Requirements und nachgelagerte Capability-Beziehungen getrennt aus.

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

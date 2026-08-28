# Projektstrukturplan

Der Projektstrukturplan beschreibt die **Arbeitspakete**, mit denen der Objektstrukturplan geliefert wird.

| PSP-ID | Arbeitspaket | Ergebnis | Hauptabhängigkeit |
|---|---|---|---|
| 1.1 | Projektauftrag und Governance | freigegebener Scope, Ziele, Stakeholder und Arbeitsweise | keine |
| 1.2 | Requirements Engineering | versionierter Anforderungskatalog und Traceability | 1.1 |
| 1.3 | Risiko, Business Case und Kommunikation | Risk Register, Kostenmodell, Reporting | 1.1 |
| 1.4 | Pre-Code Engineering Blueprint | akzeptierte Startarchitektur plus reproduzierbare Toolchain-, Persistenz-, PWA- und UI-Validierung | 1.2, 2.1 und Architekturspikes |
| 2.1 | Content- und Lizenzanalyse | zulässige Quellen und Attribution | 1.2 |
| 2.2 | Domänen- und Datenmodell | akzeptierte [portable Domain-/Data-Spezifikation](../spec-planning/v0.2-domain-data-model-spec.md) für Content, Character, Campaign, Adventure und Session | 2.1 |
| 2.3 | Content-Import-Spike | wiederholbarer SRD-Datenweg | 2.1, 2.2 |
| 3.1 | Rules Engine Kern | Attribute, Proficiency, Checks und Ressourcen | 2.2 |
| 3.2 | Ruleset-Versionierung | 2014/2024-Trennung und Kompatibilität | 3.1 |
| 3.3 | Regeltests | deterministische Testmatrix | 3.1, 3.2 |
| 4.1 | App-Grundgerüst | PWA App Shell, Package-Grenzen, lokale Persistenz, Design Tokens, Entwicklung und CI ohne v1-Backendzwang | 1.4 |
| 4.2 | Charakter-Slice | Erstellung, Validierung, Sheet und Persistenz | 2.2, 3.1, 4.1 |
| 4.3 | Kampagnen-/DM-Slice | Kampagne, Regelprofil, Session Zero, Welt und DM-Notizen | 2.2, 4.1 |
| 4.4 | Play-Session-Alpha | Adventure Foundation, drei Säulen, Würfel, Referenzkampf, Audit-Log und Save/Resume | 3.1, 4.2, 4.3 |
| 5.1 | Lokale Mehrsitzungsintegration | mehrere Adventures/Sitzungen, Welt-/NPC-/Hinweiszustand, Zeit/Reise/Rast, Journal, Fehlerfälle und Migration | 4.2-4.4 |
| 5.2 | Feature-Complete Beta | vollständige v1-P0-Spielmatrix, Level-up, Inventar, Effekte, Import/Export, Accessibility und Performance | 5.1 |
| 5.3 | v1 Release | Release Candidate, Abnahme und Dokumentation | 5.2 |
| 6.1 | Settings und Homebrew | Anpassungen und eigene Inhalte | 5.3 |
| 6.2 | Accounts und Cloud-Sync | Identität, Datenschutz und Sync | 5.3 |
| 6.3 | Sharing und Multiplayer | Rollen, Realtime und Reconnect | 6.2 |
| 7.1 | Visual Experience Expansion | Vertiefung des ab v0.1 vorhandenen Designsystems, atmosphärische Medien und visuelle Kernansichten | 5.3 |
| 7.2 | Battle Map und VTT | Karten-, Token- und Sichtsystem | 6.3, 7.1 |
| 8.1 | AI Foundation | Retrieval, Evals, Kosten und DM-Copilot | 3.x, 5.3 |
| 8.2 | Solo AI-DM | Kampagnenschleife, Gedächtnis und Save/Resume | 8.1 |
| 9.1 | Plattformoption | APIs, Erweiterungen und Moderation | validierter Bedarf nach v3.5 |

## Verantwortungsprinzip

Bis ein größeres Team existiert, ist der Product Owner zugleich Projektleitung und technischer Owner. GitHub-Issues tragen trotzdem ein `Area`-Feld und einen eindeutigen Owner, damit spätere Mitarbeitende ohne Umstrukturierung einsteigen können.

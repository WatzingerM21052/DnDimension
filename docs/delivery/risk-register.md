# Risikoanalyse und Risk Register

**Bewertung:** Wahrscheinlichkeit und Auswirkung jeweils Low/Medium/High.<br>
**Owner:** Product Owner, bis Rollen separat besetzt werden.

| ID | Risiko | Kategorie | Wkt. | Auswirkung | Level | Maßnahme | Status |
|---|---|---|---|---|---|---|---|
| R-01 | Scope wächst schneller als verfügbare Einzelentwickler-Kapazität. | Operational | High | High | Critical | Release-Gates, P0-Begrenzung, 20 % Puffer, WIP-Limit 1-2 | Open |
| R-02 | 2014- und 2024-Regeln werden unbemerkt vermischt. | Quality | Medium | High | High | DEC-007; gepinntes `RuleProfileRef`; kein stiller Fallback; Cross-Ruleset-Negativtests | Open |
| R-03 | Proprietäre Inhalte gelangen in Repo oder veröffentlichte Daten. | Compliance | Medium | High | High | private-library ignorieren; Source-Registry; Content-Review im DoD | Mitigated |
| R-04 | Drittanbieter-Content-API ändert Struktur oder Inhalt. | Technical | Medium | High | High | versionierter Import, Adapter, Snapshots und Prüfung gegen offizielles SRD | Open |
| R-05 | Lokale Daten gehen durch Migration, Browserbereinigung, Eviction oder Fehler verloren. | Operational | Medium | High | High | DEC-006/009; Browser-Persistenz anfragen, Speicherstatus anzeigen, schrittweise Migration, Pre-Migration-Backup, Checksummen, Recovery- und Restore-Tests | Open |
| R-06 | Cloud-Sync erzeugt Konflikte oder Datenschutzprobleme. | Security/Compliance | Medium | High | High | erst ab v1.2; Datenminimierung, Rechteprüfung, Konfliktmodell, Löschweg | Open |
| R-07 | Echtzeitgruppen verlieren oder überschreiben Zustand. | Technical | Medium | High | High | serverseitige Autorität, Sequenzen, Reconnect- und Lasttests | Open |
| R-08 | Oberfläche ist für Neulinge weiterhin zu komplex. | Product | Medium | High | High | progressive Offenlegung, Usability-Tests ab v0.4, Metriken | Open |
| R-09 | KI erfindet Regeln, Quellen oder Kampagnenzustand. | AI/Quality | High | High | Critical | Retrieval, Quellenstatus, strukturierter Zustand, Evals, menschlicher Override | Open für v3 |
| R-10 | KI-Kosten überschreiten Hobby-/Produktbudget. | Financial | Medium | High | High | Tokenbudget, Kostenmessung, Rate Limits, Zusammenfassung, Kill Switch | Open für v3 |
| R-11 | Ein Anbieter-Lock-in erschwert Migration. | Strategic | Medium | Medium | Medium | DEC-008/009; Domänenlogik und SQL-Ports portabel halten; Provider-Adapter; Exportformate und Contract Tests | Open |
| R-12 | Barrierefreiheit wird erst spät geprüft. | Product/Compliance | Medium | High | High | Accessibility-Kriterien ab v0.4, automatisierte und manuelle Checks | Open |
| R-13 | Private Referenzbibliothek existiert nur auf einem Datenträger. | Operational | Medium | High | High | 3-2-1-Backup planen; Cloud-Streaming nur als Kopie, nicht einziges Backup | Open |
| R-14 | GitHub-Backlog wird zu groß und ungepflegt. | Operational | Medium | Medium | Medium | regelmäßiges Refinement; Archive/Won't Do; nur Ready-Items schätzen | Open |
| R-15 | Der Anspruch „möglichst detailgetreu mit allem“ führt zu unkontrolliertem Scope-Wachstum. | Product/Operational | High | High | Critical | Tabletop-Prinzip über Release-Slices liefern; Non-Goals und Exit-Gates beibehalten; neue v1-Funktion benötigt Scope-Tausch | Open |
| R-16 | Videospiel-/Mod-Inspiration wird mit offiziellen Regeln verwechselt oder gestalterisch zu eng übernommen. | Product/Compliance | Medium | High | High | DEC-003, getrennte Variantenprofile sowie Regel-, Content- und Design-Review | Open |
| R-17 | DM-Geheimnisse erscheinen durch neue Felder, Regel-Traces oder Exporte versehentlich in einer Spieleransicht. | Security/Product | Medium | Critical | Critical | DEC-004/007; fachliche Sichtbarkeitsfilter, deny-by-default und Negativtests je Feld-/Trace-/Issue-Typ | Open |
| R-18 | Änderungen am Kampagnen-Regelprofil machen Charaktere oder Sitzungszustände unbemerkt ungültig. | Data/Product | Medium | High | High | versionierte Regelprofile, Auswirkungsanalyse, explizite Migration und Kompatibilitätstests | Open |
| R-19 | Technologien und Libraries werden ohne reale Installations-, Wartungs-, Lizenz- oder Bundleprüfung übernommen. | Technical/Operational | Medium | High | High | DEC-008 bis DEC-010; akzeptierter Blueprint bleibt bis reproduzierbarem Bootstrap `Validation Pending`; just-in-time Dependencies und dokumentierter Fallback | Mitigating |
| R-20 | Der kleine v0.6-Alpha-Slice wird irrtümlich als ausreichender Endumfang behandelt und Social-, Exploration- oder komplexe Sitzungsfälle bleiben dauerhaft unvollständig. | Product/Quality | Medium | Critical | Critical | CON-014, Reifegradmatrix v0.6-v1.0, feature-complete Beta-Gate und Mehrsitzungs-Playtest | Open |
| R-21 | Ereignislog und Snapshot widersprechen sich oder eine Korrektur überschreibt Historie, wodurch Sitzungen nicht zuverlässig fortgesetzt werden können. | Data/Technical | Medium | Critical | Critical | DEC-005/006, atomare Unit of Work, Eventsequenzen, Checksummen, Recovery-/Replay-Tests und Migrationsprüfung | Open |
| R-22 | Spezifische Ausnahmen oder gleichrangige Regeln werden aufgrund impliziter Reihenfolge falsch beziehungsweise still aufgelöst. | Quality/Technical | Medium | Critical | Critical | DEC-007; typisierte Prioritätspipeline, explizite Spezifität, `conflict`/`pending_decision`, vollständiger Trace und Interaktionsregressionen | Open |
| R-23 | Build-, Dependency-, Browser- oder Testcaches füllen den knappen lokalen Datenträger. | Operational/Technical | Medium | High | High | DEC-010; pnpm Shared Store, vorhandener Edge statt lokaler Browsermatrix, keine Docker-/Native-Toolchains, feste Budgets, `disk:report` und sichere Clean-Skripte | Mitigating |
| R-24 | Der modulare Monolith erodiert zu einer eng gekoppelten Codebasis und erschwert spätere Cloud-/Service-Extraktion. | Technical/Strategic | Medium | High | High | DEC-008; Package-Exports, Importregeln, zyklusfreier Build, Ports, Contract Tests und Extraktionskriterien | Open |
| R-25 | Kostenlose Cloudangebote ändern Limits oder führen nach Upgrade zu unerwarteten laufenden Kosten. | Financial/Strategic | Medium | High | High | DEC-009; Anbieterpreise je Release neu prüfen, local-first Fallback, Budget/Alert/Kill Switch, keine Paid-Aktivierung ohne Entscheidung | Open für v1.2+ |
| R-26 | Atmosphärische UI, Fonts und Animationen verschlechtern Performance, Lesbarkeit oder Accessibility. | Product/Technical | Medium | High | High | DEC-010; semantische Tokens, CSS-first Motion, Reduced Motion, responsive Assetbudgets, UI-Lab sowie A11y-/Visual-/Performance-Gates | Open |

## Eskalationsregel

Critical- und High-Risiken werden bei jeder Release-Review geprüft. Ein neues Critical-Risiko blockiert das betroffene Release, bis es mitigiert oder ausdrücklich akzeptiert wurde.

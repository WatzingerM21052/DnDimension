# Risikoanalyse und Risk Register

**Bewertung:** Wahrscheinlichkeit und Auswirkung jeweils Low/Medium/High.<br>
**Owner:** Product Owner, bis Rollen separat besetzt werden.

| ID | Risiko | Kategorie | Wkt. | Auswirkung | Level | Maßnahme | Status |
|---|---|---|---|---|---|---|---|
| R-01 | Scope wächst schneller als verfügbare Einzelentwickler-Kapazität. | Operational | High | High | Critical | Release-Gates, P0-Begrenzung, 20 % Puffer, WIP-Limit 1-2 | Open |
| R-02 | 2014- und 2024-Regeln werden unbemerkt vermischt. | Quality | Medium | High | High | Ruleset in allen Daten/Tests; Cross-Ruleset-Negativtests | Open |
| R-03 | Proprietäre Inhalte gelangen in Repo oder veröffentlichte Daten. | Compliance | Medium | High | High | private-library ignorieren; Source-Registry; Content-Review im DoD | Mitigated |
| R-04 | Drittanbieter-Content-API ändert Struktur oder Inhalt. | Technical | Medium | High | High | versionierter Import, Adapter, Snapshots und Prüfung gegen offizielles SRD | Open |
| R-05 | Lokale Daten gehen durch Migration oder Fehler verloren. | Operational | Medium | High | High | versionierte Migration, automatischer Export, Restore-Tests | Open |
| R-06 | Cloud-Sync erzeugt Konflikte oder Datenschutzprobleme. | Security/Compliance | Medium | High | High | erst ab v1.2; Datenminimierung, Rechteprüfung, Konfliktmodell, Löschweg | Open |
| R-07 | Echtzeitgruppen verlieren oder überschreiben Zustand. | Technical | Medium | High | High | serverseitige Autorität, Sequenzen, Reconnect- und Lasttests | Open |
| R-08 | Oberfläche ist für Neulinge weiterhin zu komplex. | Product | Medium | High | High | progressive Offenlegung, Usability-Tests ab v0.4, Metriken | Open |
| R-09 | KI erfindet Regeln, Quellen oder Kampagnenzustand. | AI/Quality | High | High | Critical | Retrieval, Quellenstatus, strukturierter Zustand, Evals, menschlicher Override | Open für v3 |
| R-10 | KI-Kosten überschreiten Hobby-/Produktbudget. | Financial | Medium | High | High | Tokenbudget, Kostenmessung, Rate Limits, Zusammenfassung, Kill Switch | Open für v3 |
| R-11 | Ein Anbieter-Lock-in erschwert Migration. | Strategic | Medium | Medium | Medium | Domänenlogik portabel halten; Provider-Adapter; Exportformate | Open |
| R-12 | Barrierefreiheit wird erst spät geprüft. | Product/Compliance | Medium | High | High | Accessibility-Kriterien ab v0.4, automatisierte und manuelle Checks | Open |
| R-13 | Private Referenzbibliothek existiert nur auf einem Datenträger. | Operational | Medium | High | High | 3-2-1-Backup planen; Cloud-Streaming nur als Kopie, nicht einziges Backup | Open |
| R-14 | GitHub-Backlog wird zu groß und ungepflegt. | Operational | Medium | Medium | Medium | regelmäßiges Refinement; Archive/Won't Do; nur Ready-Items schätzen | Open |

## Eskalationsregel

Critical- und High-Risiken werden bei jeder Release-Review geprüft. Ein neues Critical-Risiko blockiert das betroffene Release, bis es mitigiert oder ausdrücklich akzeptiert wurde.

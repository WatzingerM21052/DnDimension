# DnDimension Release-Roadmap

**Stand:** 2026-08-28<br>
**Planungsart:** Ergebnisorientierte Release-Gates, keine verbindlichen Kalendertermine<br>
**Aktueller Zielkorridor:** v0.1

## Grundsatz

Versionsnummern beschreiben einen überprüfbaren Produktzustand. Ein Release wird erst erreicht, wenn seine Exit-Kriterien erfüllt sind. Zeitangaben werden erst nach Kapazitätsklärung und Schätzung in Sprints geplant.

### Vor dem ersten stabilen Release

| Release | Produktzustand | Schwerpunkt | Exit-Kriterien |
|---|---|---|---|
| **v0.1 Project Foundation** | Planbares Vorhaben | Projektauftrag, Ziele, Stakeholder, Anforderungen, Risiken, GitHub-Prozess, Architekturrahmen und [Pre-Code Engineering Blueprint](../spec-planning/pre-code-engineering-blueprint.md) | Governance-Dokumente konsistent; initialer Backlog priorisiert; Quality Gates und Entscheidungsweg definiert; technische Projektanlage vor Produktcode entscheidungsreif |
| **v0.2 Content & Data Foundation** | Belastbares Inhalts- und Datenmodell | SRD-Quellen, Lizenzmetadaten, Content-Schema, Kampagnen-/Charakter-Grundmodell, Import-Spike | Datenmodell reviewt; offizieller SRD-Datenweg nachweisbar; Edition und Herkunft jedes Inhalts abfragbar |
| **v0.3 Rules Engine Foundation** | Testbarer Regelkern | Attribute, Proficiency, Checks, AC, Ressourcen und Ruleset-Versionierung | Kernfunktionen sind UI-unabhängig, deterministisch und automatisiert getestet |
| **v0.4 Character Creator Slice** | Erster sichtbarer Nutzerfluss | geführte 2024-Charaktererstellung mit eingebautem SRD-5.2.1-Content, vier nachvollziehbaren Attributsmethoden, Validierung und lokalem Charakterbogen gemäß [Character Creator Spec](../spec-planning/v0.4-character-creator-spec.md) | gültiger Charakter kann ohne private Dateien, Netzwerk oder manuelle Nachrechnung erstellt und erneut geöffnet werden; Entscheidungen und abgeleitete Werte sind erklärbar |
| **v0.5 First Local Alpha** | Erstmals nutzbare lokale App | Campaign Creator mit Prämisse, Regelprofil, Session Zero, Wissensgrenzen, Charakterzuordnung und Lebenszyklus gemäß [Campaign Creator Spec](../spec-planning/v0.5-campaign-creator-spec.md) | Charakter und Kampagne funktionieren gemeinsam in einem vertikalen lokalen Ablauf; Player Preview enthält keine DM-only Informationen |
| **v0.6 Play Session Alpha** | Erste verwaltete Spielsitzung | Würfel, Encounter, Initiative, HP, Zustände und Sitzungsprotokoll | eine kleine Begegnung kann vom Start bis zum Abschluss verwaltet und gespeichert werden |
| **v0.7 Integrated Local Alpha** | Zusammenhängende Single-User-App ohne KI | Charakter, Kampagne, Welt, Sitzung und Regeln integriert; robuste lokale Persistenz | zentraler End-to-End-Flow funktioniert ohne Account, Cloud oder KI; Daten überstehen Neustarts |
| **v0.8 Feature-Complete Beta** | Inhaltlich vollständiger v1-Scope | Level-up, Inventar, Import/Export, homebrew-fähiges Datenmodell ohne vollständigen Editor, Onboarding, Accessibility und Fehlerfälle | alle v1-P0-Anforderungen implementiert; offene Fehler sind priorisiert; externe Playtests möglich |
| **v0.9 Release Candidate** | Stabilisierung statt neuer Features | Migrationen, Performance, Security, Accessibility, Dokumentation und Release-Prozess | keine offenen P0-Fehler; definierter P1-Rahmen; Backup/Restore und Upgrade-Pfad getestet |
| **v1.0 Local Player & DM** | Erstes stabiles 2024-first Produkt ohne KI | vollständige local-first Player-/DM-Kernanwendung gemäß [DEC-001](../decisions/DEC-001-v1-scope-baseline.md) | Release-Gates bestanden; Kernflüsse getestet und dokumentiert; Daten portabel und wiederherstellbar; kein Account oder Onlinedienst erforderlich |

### Ausbau nach v1.0

| Release | Produktzustand | Schwerpunkt | Exit-Kriterien |
|---|---|---|---|
| **v1.1 Settings & Homebrew** | Anpassbare lokale App | App-/Kampagneneinstellungen, Hausregeln, eigene Inhalte, Vorlagen und erweiterte Im-/Exporte | Anpassungen sind quellenmarkiert, migrierbar und pro Kampagne isolierbar |
| **v1.2 Accounts & Cloud Sync** | Optionale persistente Identität | Auth, Nutzerprofil, Cloud-Speicher, Geräte-Sync, Export und Löschung | Account ist optional; Rechte, Datenschutz, Sync und Wiederherstellung sind getestet |
| **v1.3 Sharing & Roles** | Geteilte Kampagnen ohne vollständiges Live-Spiel | Einladungen, DM-/Spielerrollen, Berechtigungen und asynchrone Freigabe | Nutzer sehen und ändern nur freigegebene Daten; Rollenwechsel und Entzug funktionieren |
| **v1.4 Realtime Groups Beta** | Experimentelles gemeinsames Live-Spiel | Lobby, Präsenz, Live-Zustand, Reconnect und Konfliktauflösung | geschlossene Gruppentests ohne stillen Zustandsverlust; bekannte Grenzen dokumentiert |
| **v1.5 Stable Multiplayer** | Stabiler Gruppenmodus | belastbarer Echtzeitbetrieb, Moderation, Sitzungswiederaufnahme und Gruppen-UX | Mehrbenutzersitzungen erfüllen Stabilitäts-, Rechte- und Wiederaufnahme-Gates |
| **v2.0 Visual Foundation** | Neues konsistentes Erscheinungsbild | Designsystem, responsive Shell, Themes, Animation, Accessibility und visuelle Tests | alle Kernansichten nutzen stabile Tokens/Komponenten und bestehen Accessibility-Prüfungen |
| **v2.1 Visual Character & World** | Visuell reichere Kernbereiche | Charakterdarstellung, Weltbeziehungen, Timeline, Handouts und Medien | visuelle Elemente verbessern Entscheidungen und bleiben ohne Medien vollständig bedienbar |
| **v2.2 Battle Map Beta** | Erste taktische Karte | Karten, Tokens, Raster, grundlegende Bewegung und Fog of War | kleine Begegnungen sind auf der Karte spielbar; Zustand synchronisiert mit Combat-Tracker |
| **v2.5 Advanced VTT** | Stabiles virtuelles Spielbrett | Sichtlinien, Flächen, Ebenen, Messung, Medienverwaltung und Automatisierung | taktische Gruppenbegegnungen sind Ende-zu-Ende im VTT durchführbar |
| **v3.0 AI Foundation & DM Copilot** | Kontrollierte KI-Unterstützung | Quellen-Retrieval, Prompt-/Eval-System, DM-Vorschläge, Kosten- und Datenschutzgrenzen | KI-Ausgaben sind prüfbar, nicht automatisch verbindlich und budgetiert |
| **v3.1 Solo AI-DM Alpha** | Erster autonomer Solo-Ablauf | Session Zero, Charakter, Kampagne, Spielschleife und Save/Resume | geschlossene Solo-Tests können mehrere Sitzungen mit konsistentem Zustand durchführen |
| **v3.2 AI Memory & Quality** | Belastbares Langzeitspiel | strukturierte Erinnerung, Zusammenfassung, Quellenkonflikte, Evals und Beobachtbarkeit | definierte Qualitäts- und Kostenmetriken bestehen über lange Tests |
| **v3.5 Stable AI Game Master** | Stabiles Solo-KI-Erlebnis | produktionsreifer Solo-DM, menschlicher Override, experimenteller Gruppen-KI-Modus | kritische Halluzinations-, Sicherheits-, Zustands- und Kosten-Gates bestanden |
| **v4.0 Platform & Ecosystem** | Optional erweiterbare Plattform | versionierte API, Integrationen, Erweiterungen und kontrolliertes Teilen eigener Inhalte | Erweiterungen sind isoliert; Herkunft/Lizenz und Moderationspfad sind durchgängig |

### Bestätigte spätere Capability ohne Zielrelease

**D&D-5e-2014-Kompatibilität** bleibt vorgemerkt, wird aber erst nach einem stabilen 2024-Kern terminiert. Sie wird später als kampagnenspezifische Regelwerkoption in den Einstellungen angeboten und benötigt zuvor einen vollständigen Content-Adapter, eine getrennte Rules Engine beziehungsweise Regeladaption, Migrationen sowie eigene Negativ- und Regressionstests. Eine unvollständige oder rein kosmetische 2014-Auswahl wird nicht veröffentlicht.

## Now / Next / Later

### Now - v0.1

- Projektmanagement- und Requirements-Basis konsolidieren.
- GitHub-Backlog, Milestones, Issue-Hierarchie und Kanban etablieren.
- Content-Foundation gegen offizielle SRD-Quellen validieren.
- Architekturentscheidungen für lokalen Start und spätere Cloud-Fähigkeit treffen.
- Technisches Grundgerüst und Quality Gates planen.
- Vor Produktcode den Pre-Code Engineering Blueprint mit Projektanlage, Struktur, Modulen, Methoden, Technologien und externen Abhängigkeiten abnehmen.

### Next - v0.2 bis v0.5

- Content-/Datenmodell und Rules Engine zuerst stabilisieren.
- Danach Charakter-Slice und erste lokale Alpha verbinden.

### Later - v0.6 bis v4.0

- Play Session, integrierte Alpha, Beta und Release Candidate führen kontrolliert zu v1.0.
- Accounts und Gruppen erst nach dem stabilen local-first Release.
- Visuelle Schicht erst nach validierten Kernflüssen systematisch ausbauen.
- KI erst auf strukturierte, testbare Regeln und Kampagnendaten aufsetzen.
- Advanced VTT, KI und Ökosystem als eigenständige Großvorhaben behandeln.

## Release-Governance

- **Milestone:** jedes Release besitzt einen GitHub-Milestone.
- **Epic:** beschreibt ein größeres Ergebnis innerhalb eines Releases.
- **Story:** liefert erkennbaren Nutzerwert und besitzt testbare Akzeptanzkriterien.
- **Task/Spike/Bug:** konkrete Umsetzung, Untersuchung oder Korrektur.
- **Release Review:** Exit-Kriterien, offene P0/P1-Fehler, Dokumentation, Risiken und Migration werden geprüft.
- **Keine automatische Datumszusage:** Termine entstehen erst aus geschätztem Backlog, realer Kapazität und Abhängigkeiten.

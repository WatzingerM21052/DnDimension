# Pre-Code Engineering Blueprint

**Status:** Planned – vor dem ersten Produktcode zu finalisieren<br>
**Stand:** 2026-08-28<br>
**Owner:** Technical Owner<br>
**Gate:** v0.1 Project Foundation / Startfreigabe für das App-Grundgerüst

## Zweck

Dieses Dokument wird ausgearbeitet, sobald Produktumfang, Capability-Specs und notwendige Architekturspikes ausreichend stabil sind. Es übersetzt die fachliche Planung in eine ausführbare technische Startanleitung, bevor Ordner, Frameworks oder Abhängigkeiten voreilig festgeschrieben werden.

## Verbindlicher Inhalt der späteren Ausarbeitung

1. **Projektanlage:** Voraussetzungen, Paketmanager, exakte Initialisierungsbefehle, lokale Entwicklungsumgebung und erster reproduzierbarer Build.
2. **Repository- und Ordnerstruktur:** Workspace-/Monorepo-Entscheidung, Verzeichnisbaum, Verantwortungen, erlaubte Abhängigkeiten und Benennungsregeln.
3. **Architekturgrenzen:** App Shell, Domain, Rules Engine, Content, Persistenz, Import/Export und spätere Adapter für Cloud, VTT und KI.
4. **Domänenübersicht:** zentrale Aggregate, Entities, Value Objects, Commands, Events, Services und ihre Lebenszyklen.
5. **Klassen-, Modul- und Methodenübersicht:** öffentliche Verantwortungen und Signaturen der ersten Slices; detailliert genug für Issues und Tests, ohne unnötige Implementierungsstubs vorzutäuschen.
6. **Technologiematrix:** Frontend, Styling, State, Formulare, Validierung, Persistenz, Build, Tests, Linting, Dokumentation, CI/CD und Hosting mit begründeten Alternativen.
7. **Libraries und APIs:** Zweck, Versionierungsstrategie, Lizenz, Wartungszustand, Bundle-/Offline-Auswirkung, Sicherheitsrisiko, Austauschbarkeit und Fallback jeder externen Abhängigkeit.
8. **Daten und Migration:** lokales Schema, Transaktionen, Versionierung, Migrationen, Backup, Export/Import, Konflikte und spätere Synchronisierung.
9. **Content- und Rules-Pipeline:** reproduzierbarer SRD-Import, Source Manifest, Validierung, Ruleset-Trennung und deterministische Tests.
10. **Qualitätsstrategie:** Testpyramide, Accessibility, Performance-Budgets, Security, Lizenzprüfung, Fehlerbehandlung und Definition of Done.
11. **Konfiguration und Betrieb:** Umgebungen, Secrets, Feature Flags, Logs, Releases, Update-/Rollback-Weg und späterer Deployment-Adapter.
12. **Umsetzungsreihenfolge:** Bootstrap-Schritte, technische Spikes, erste Issues, Abhängigkeiten und überprüfbare Zwischenstände.

## Entscheidungsregeln

- Technologien und Libraries werden gegen aktuelle offizielle Dokumentation und einen kleinen reproduzierbaren Spike geprüft.
- Eine Library wird nur aufgenommen, wenn ihr Nutzen die Wartungs-, Sicherheits-, Lizenz-, Bundle- und Offline-Kosten rechtfertigt.
- Domain- und Rules-Logik bleiben unabhängig von UI, Persistenzanbieter, Cloudflare und KI testbar.
- Spätere Capabilities erhalten Adapterpunkte, aber keine vorzeitige Infrastruktur im v1-Code.
- Der Blueprint nennt konkrete Entscheidungen, Versionen und Befehle sowie eine begründete Ausweichoption; reine Wunschlisten bestehen das Gate nicht.
- Änderungen an tragenden Entscheidungen werden nach Start über Decision Records nachvollzogen.

## Benötigte Eingaben

- akzeptierte Scope-, Roadmap- und Requirements-Baseline;
- Character-, Campaign-, Session- und Content-/Rules-Specs der ersten Releases;
- Ergebnisse der Persistenz- und SRD-Import-Spikes;
- Datenmodell und relevante Security-/Lizenzanforderungen;
- akzeptierte [v0.2 Domain & Data Model Specification](v0.2-domain-data-model-spec.md) und [DEC-006](../decisions/DEC-006-hybrid-aggregate-snapshot-audit-model.md);
- aktuelle Laufzeit-, Tooling- und Hosting-Recherche unmittelbar vor der Entscheidung.

## Abnahmekriterien des Blueprint-Gates

- Der vollständige Verzeichnis- und Modulbaum besitzt eindeutige Verantwortungen und Abhängigkeitsregeln.
- Kernklassen/-module und öffentliche Methoden der ersten Implementierungsslices sind Requirements und Tests zuordenbar.
- Jede externe Library/API steht mit Zweck, Lizenz, Risiko und Fallback in einer Decision-Matrix.
- Projektanlage und Build wurden in einem sauberen Testverzeichnis reproduziert.
- Persistenz, Migration, Content-Import, Teststrategie und CI besitzen einen ausführbaren Startpfad.
- Offene Architekturfragen sind entweder entschieden oder als blockierende Spikes mit Owner und Exit-Kriterium erfasst.
- Die resultierenden GitHub-Stories erfüllen die Definition of Ready.

## Noch nicht festgelegt

Konkrete Framework-, Library-, Klassen- und Methodenentscheidungen werden bewusst erst nach den fachlichen Specs und technischen Spikes finalisiert. Die bestehende Master Vision enthält Kandidaten und Architekturprinzipien, aber der akzeptierte Blueprint wird die operative technische Quelle der Wahrheit.

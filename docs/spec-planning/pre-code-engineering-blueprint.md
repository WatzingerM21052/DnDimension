# Pre-Code Engineering Blueprint

**Status:** Accepted Design Baseline – P-01 Passed, P-02 bis P-05 Pending<br>
**Stand:** 2026-08-28<br>
**Owner:** Technical Owner<br>
**Gate:** v0.1 Project Foundation / Startfreigabe für das App-Grundgerüst<br>
**Entscheidungen:** [DEC-008](../decisions/DEC-008-typescript-pwa-modular-monolith.md), [DEC-009](../decisions/DEC-009-local-persistence-backup-and-cloud-evolution.md), [DEC-010](../decisions/DEC-010-custom-design-system-and-lean-quality-toolchain.md)

## 1. Zweck und Entscheidungsstatus

Dieser Blueprint übersetzt Vision, Requirements und Capability-Specs in die verbindliche technische Startarchitektur von DnDimension. Er beschreibt Projektanlage, Module, Abhängigkeiten, öffentliche Verträge, Datenhaltung, UI-System, Qualitätsstrategie und den späteren Ausbau zu Cloud, Realtime, VTT und KI.

Die Architekturentscheidungen sind fachlich akzeptiert. Vor Produktcode bleibt ein reproduzierbarer Bootstrap-Spike verpflichtend. Erst dieser Spike pinnt tatsächlich getestete Paketversionen, misst Installations- und Buildgrößen und belegt PWA-, Persistenz- und Testannahmen auf einem sauberen System. Bis dahin bedeutet „gewählt“ die verbindliche technische Richtung, nicht die Behauptung eines bereits erfolgreichen Builds.

## 2. Verbindliche Leitentscheidungen

- Eine Codebasis liefert Website und installierbare Progressive Web App.
- TypeScript ist die primäre Sprache für UI, Application Layer, Domain, Rules Engine, Content und spätere Worker-Adapter.
- React und Vite bilden App- und Build-Grundlage; pnpm verwaltet einen schlanken Workspace mit einem Lockfile.
- DnDimension startet als modularer Monolith. Fachmodule besitzen erzwungene Grenzen und können später selektiv als Dienste extrahiert werden.
- v1.0 bleibt local-first, offline nutzbar und benötigt weder Account, Cloud, Docker, native Toolchain noch bezahlten Dienst.
- IndexedDB ist der lokale Browserstandard; Dexie ist der austauschbare v1-Adapter.
- Revisionierte Aggregate, Commands, Audit-Events und Session-Snapshots folgen [DEC-006](../decisions/DEC-006-hybrid-aggregate-snapshot-audit-model.md).
- Die Rules Engine bleibt deterministisch, UI-/Persistenz-unabhängig und folgt [DEC-007](../decisions/DEC-007-typed-deterministic-rule-resolution-kernel.md).
- Das UI verwendet ein eigenes DnDimension Design System mit CSS Design Tokens, React Aria und gezielter Motion-Unterstützung.
- Kostenlose, wirksame und exportierbare Dienste werden bevorzugt. Bezahlte Dienste oder variable Kosten benötigen eine bewusste Entscheidung, Budgetgrenze und Kill Switch.
- Private PDFs, Scans und Karten sind keine Build-, Test- oder Laufzeitvoraussetzung und werden nicht in App-Daten oder Backups dupliziert.

## 3. Zielarchitektur

```text
Website / installierte PWA
          |
          v
React App Shell + Feature-Module
          |
          v
Application Layer: Commands, Queries, Use Cases
       /        |          \
      v         v           v
 Domain      Rules       Content
      \         |          /
       \        |         /
        v       v        v
        Ports und Unit of Work
                 |
                 v
    In-Memory- oder IndexedDB-Adapter
```

### 3.1 Kein verteilter Monolith

Der modulare Monolith ist ein Deployment-Artefakt, aber keine unstrukturierte Codebasis. Modulgrenzen werden durch Package-Exports, TypeScript-Konfiguration, Lint-Regeln und Architekturtests erzwungen. Ein Feature darf keine internen Dateien eines anderen Moduls importieren und keine Persistenz außerhalb definierter Ports umgehen.

Microservices werden nicht vorsorglich gebaut. Eine Extraktion ist erst gerechtfertigt, wenn mindestens eines gilt:

- unabhängige Skalierung oder Ausfallsicherheit ist erforderlich;
- der Bereich benötigt geheime Schlüssel oder eine eigene Sicherheitsgrenze;
- eine andere Laufzeit oder Infrastruktur ist fachlich notwendig;
- getrennte Teams oder Releasezyklen brauchen unabhängiges Deployment;
- ein Hintergrund- oder Realtime-Prozess kann im Browser nicht zuverlässig laufen.

Accounts, Realtime-Räume, Medienverarbeitung und KI-Orchestrierung sind wahrscheinliche spätere Dienste. Domain- und Rules-Pakete bleiben gemeinsam nutzbar.

## 4. Technologiematrix

| Bereich | Verbindliche Richtung | Begründung | Fallback / spätere Neubewertung |
|---|---|---|---|
| Sprache | TypeScript, `strict` | ein Typ- und Toolingmodell für Browser, Tests und spätere Worker | C#/.NET nur bei grundlegend geändertem Team-/Plattformbedarf |
| UI | React | starkes Ökosystem für zugängliche, dynamische Weboberflächen | kein Frameworkwechsel ohne messbares Problem |
| Build/Dev | Vite | schneller Entwicklungsserver, statischer Produktionsbuild | anderer Bundler nur nach reproduzierbarem Blocker |
| Paketmanager | pnpm Workspace | content-addressed Store, ein Lockfile, geringe Duplizierung | npm nur bei nicht lösbarer Toolkompatibilität |
| Auslieferung | PWA + statisches Hosting | eine Codebasis für Website und lokale Installation | Tauri erst bei belegtem Bedarf an nativen Dateirechten oder Installer |
| Routing | React Router | etablierte Clientnavigation, verschachtelte Layouts | alternative Router nur vor Bootstrap-Abnahme vergleichen |
| Styling | modernes CSS, CSS Modules, Design Tokens | kein Runtime-CSS-Overhead, volle visuelle Kontrolle | kein vollständiges UI-Kit als Designquelle |
| Accessible Primitives | React Aria Components | Verhalten, Fokus, Tastatur und Internationalisierung ohne Look-in | native Elemente, wenn sie den Vertrag vollständig erfüllen |
| Animation | CSS zuerst, Motion for React gezielt | einfache Effekte nativ; komplexe Layout-/Gestenanimationen kontrolliert | View Transitions nur als progressive Enhancement |
| Formulare | React Hook Form | komplexe Creator-Flows mit kontrollierten Re-Renders | React-State für kleine Formulare |
| Runtime-Schemas | Zod | Import-, Command- und Adaptergrenzen zur Laufzeit prüfen | kleinere Alternative nur bei gemessenem Bundleproblem |
| Lokale DB | IndexedDB über Dexie | standardisiert, offline, transaktional, TypeScript-fähig | nativer Adapter oder späterer nativer Dateiadapter |
| Unit/Integration | Vitest | Vite-nahe TypeScript-Testumgebung | kein paralleler Jest-Stack |
| UI-Tests | React Testing Library + user-event | nutzerorientierte Tests statt Implementierungsdetails | Browserintegration für nicht simulierbare APIs |
| Property Tests | fast-check, nur Rules-/Domainkern | systematische Invarianten- und Grenzfallprüfung | eigene generierte Testmatrizen bei kleinerem Scope |
| E2E | Playwright | mehrere Browser, PWA/Offline, Accessibility und Screenshots | lokal vorhandener Edge; volle Matrix in CI |
| Codequalität | ESLint + Prettier + `tsc --noEmit` | reife React-/A11y-/Importregeln und deterministische Formatierung | Biome später nur nach Paritäts- und Größenmessung |
| CI | GitHub Actions | bestehender GitHub-Workflow, keine eigene CI-Infrastruktur | Anbieterwechsel bleibt durch pnpm-Skripte möglich |
| v1 Hosting | statische Auslieferung, Anbieteradapter | keine Serverpflicht; Free Tier möglich | jeder statische Host kann den Build ausliefern |
| spätere Cloud | SQL hinter Ports; D1/Workers führender Kandidat | Free-first, Scale-to-zero, Realtime-Erweiterbarkeit | PostgreSQL und andere Adapter bleiben möglich |

### 4.1 Abhängigkeiten werden just-in-time ergänzt

Nur die für den aktuellen Release-Slice nötigen Pakete werden installiert. Exportkompression, lokale Suche, Kartenrendering, Realtime oder KI-SDKs gehören nicht in den v0.1-Bootstrap. Für jedes neue Paket werden Zweck, Lizenz, Wartungszustand, Bundleauswirkung, Offlineverhalten, Sicherheitsrisiko und Fallback im Issue oder Decision Record dokumentiert.

### 4.2 Dependency-Admission-Matrix

Die folgenden SPDX-Angaben wurden am 2026-08-28 gegen die offiziellen Repository-Lizenzen geprüft. Sie erlauben die weitere technische Evaluierung, ersetzen aber nicht den Lockfile- und Transitivlizenz-Scan des Bootstrap-Spikes.

| Paket/Gruppe | Rolle | Laufzeit | Lizenz | Aufnahme/Fallback |
|---|---|---|---|---|
| TypeScript | Compiler und Typprüfung | Build/Dev | Apache-2.0 | v0.1; ohne parallelen Sprachcompiler |
| React + React DOM | UI-Runtime | Runtime | MIT | v0.1; Frameworkwechsel nur per neuer Decision |
| Vite | Dev Server und Build | Build/Dev | MIT | v0.1; statischer Output bleibt Anbietergrenze |
| pnpm | Workspace und Shared Store | Dev | MIT | v0.1; npm bleibt Notfallfallback |
| React Router | Clientnavigation | Runtime | MIT | v0.1; nur benötigten Modus verwenden |
| React Aria Components | zugängliche Interaktionsprimitive | Runtime | Apache-2.0 | mit erstem UI-Slice; native Elemente als kleiner Fallback |
| Motion | komplexe Bewegung | Runtime | MIT | nur bei erstem belegten Motion-Pattern; CSS zuerst |
| React Hook Form | komplexe Creator-Formulare | Runtime | MIT | mit Character-/Campaign-Slice; React-State für kleine Formulare |
| Zod | Runtime-Schema- und Importvalidierung | Runtime | MIT | mit erstem externen Datenvertrag; Alternative nur nach Bundlemessung |
| Dexie | IndexedDB-Adapter | Runtime | Apache-2.0 | nach bestandenem Persistenz-Spike; native IndexedDB als Fallback |
| vite-plugin-pwa + Workbox | Manifest und Service Worker | Build/Runtime | MIT | nach bestandenem PWA-Spike; kleiner eigener Worker nur bei Blocker |
| Vitest | Unit-, Contract- und Integrationstest | Dev | MIT | v0.1; kein paralleler Jest-Stack |
| React Testing Library + user-event | Component-/Interaktionstest | Dev | MIT | mit UI-Basis; echte Browserintegration bei API-Grenzen |
| fast-check | Property-based Tests | Dev | MIT | erst mit Rules-/Domain-Invarianten; generierte Matrix als Fallback |
| Playwright | E2E, Browser und Visual Checks | Dev/CI | Apache-2.0 | lokal vorhandener Edge, vollständige Browser nur in CI |
| axe-core | automatisierte Accessibility-Prüfung | Dev/CI | MPL-2.0 | mit UI-Basis; manuelle Prüfung bleibt zusätzlich verpflichtend |
| ESLint + Prettier | Regeln, Importgrenzen und Format | Dev | MIT | v0.1; Biome nur nach nachgewiesener Parität |

Vor Aufnahme werden außerdem Maintaineraktivität, bekannte Advisories, direkte/transitive Paketanzahl, gepackte Größe, Tree-Shaking und Browserbundle gemessen. Ein zulässiger Lizenzname allein begründet keine Dependency.

## 5. Repository- und Ordnerstruktur

```text
DnDimension/
|-- code/                    # gesamter ausführbarer Workspace
|   |-- apps/
|   |   `-- web/
|       |-- public/
|       |   |-- fonts/
|       |   `-- icons/
|       |-- src/
|       |   |-- app/
|       |   |   |-- bootstrap/
|       |   |   |-- routes/
|       |   |   |-- providers/
|       |   |   |-- shell/
|       |   |   `-- error-boundaries/
|       |   |-- features/
|       |   |   |-- characters/
|       |   |   |-- campaigns/
|       |   |   |-- adventures/
|       |   |   |-- sessions/
|       |   |   |-- compendium/
|       |   |   |-- settings/
|       |   |   `-- ui-lab/
|       |   |-- styles/
|       |   |   |-- reset.css
|       |   |   |-- tokens.css
|       |   |   |-- themes.css
|       |   |   |-- motion.css
|       |   |   `-- global.css
|       |   |-- main.tsx
|       |   `-- vite-env.d.ts
|       |-- index.html
|       `-- vite.config.ts
|   |-- packages/
|   |-- core/
|   |-- domain/
|   |   `-- src/{character,campaign,adventure,session,journal}/
|   |-- rules/
|   |-- content/
|   |-- application/
|   |-- persistence/
|   |   `-- src/{memory,indexeddb,migrations,backup}/
|   |-- ui/
|   |   `-- src/{primitives,components,patterns,hooks}/
|   `-- testkit/
|   |-- tooling/
|   |   |-- eslint/
|   |   |-- typescript/
|   |   `-- scripts/
|   |-- package.json
|   |-- pnpm-lock.yaml
|   |-- pnpm-workspace.yaml
|   `-- tsconfig.json
|-- docs/
|-- prompts/
|-- private-library/          # immer ignoriert
|-- tmp/                      # immer ignoriert
`-- .github/
```

Alle Implementierungs-, Dependency-, Cache- und Buildpfade liegen damit unter `code/`. Dokumentation, Prompts und die private Referenzbibliothek bleiben bewusst getrennt. Befehle des App-Toolings werden aus `code/` ausgeführt; Git- und Dokumentationsbefehle weiterhin aus der Repositorywurzel.

### 5.1 Package-Verantwortungen

| Package | Darf enthalten | Darf nicht enthalten |
|---|---|---|
| `core` | IDs, Clock, Result, Fehlerbasen, Checksummenverträge, gemeinsame Metadaten | React, Browser-DB, fachliche Regeln |
| `domain` | Aggregate, Value Objects, Invarianten, Domain-Events | UI, Dexie, HTTP, Cloudflare, KI |
| `content` | Content-Schemas, Source Manifest, versionierte Referenzen, Validatoren | private PDF-Texte, UI, Persistenzimplementation |
| `rules` | Rule Requests/Results, Resolver, Priorität, Trace, Würfelabstraktion | Aggregate schreiben, UI, IndexedDB |
| `application` | Commands, Queries, Use Cases, Ports, Unit of Work, Projektionen | konkrete DB oder Frameworkkomponenten |
| `persistence` | In-Memory-/IndexedDB-Adapter, Migration und Backupmapping | fachliche Entscheidungen oder UI |
| `ui` | Design Tokens, zugängliche Primitive, generische Komponenten und Patterns | Campaign-/Character-Fachlogik, Datenbankzugriff |
| `testkit` | deterministische Builder, Fixtures, Fake Clock/ID/Dice, Contract-Suites | Produktionsimporte aus anderen Packages |
| `apps/web` | App Shell, Feature-Komposition, Routing, View Models, Seiten | neue fachliche Wahrheit oder direkter DB-Zugriff aus Komponenten |

### 5.2 Erlaubte Abhängigkeiten

```text
core
|- domain -> core
|- content -> core
|- rules -> core + content contracts
|- ui -> core
|- application -> core + domain + content + rules
|- persistence -> core + domain + content + application ports
`- apps/web -> application + persistence + ui + öffentliche Fachverträge

testkit -> alle Packages ausschließlich in Tests
```

Zyklische Package-Abhängigkeiten blockieren den Build. Interne Moduldateien werden nicht über relative Tiefenpfade importiert; jedes Package veröffentlicht nur freigegebene Entry Points über `exports`.

## 6. Application-, Klassen- und Methodenübersicht

TypeScript verwendet bevorzugt reine Datenobjekte, diskriminierte Unions und kleine Services. Klassen werden nur eingesetzt, wenn Identität, Lebenszyklus oder Adapterzustand sie rechtfertigen. Persistierte Objekte sind serialisierbare Daten und keine Dexie-Klassen.

### 6.1 Gemeinsame Verträge

```ts
interface CommandBus {
  execute<TCommand, TResult>(command: CommandEnvelope<TCommand>): Promise<CommandResult<TResult>>;
}

interface QueryBus {
  execute<TQuery, TResult>(query: TQuery): Promise<QueryResult<TResult>>;
}

interface AggregateRepository<TAggregate> {
  load(ref: EntityRef): Promise<TAggregate | null>;
  stage(expectedRevision: number, next: TAggregate): void;
}

interface UnitOfWork {
  run<TResult>(operation: (context: UnitOfWorkContext) => Promise<TResult>): Promise<TResult>;
}

interface RuleResolver {
  resolve(request: RuleRequest, context: RuleContext): RuleResolution;
}

interface VisibilityProjector {
  project<T>(input: T, audience: AudienceContext): VisibleProjection<T>;
}
```

Erwartbare Fachfehler werden als typisiertes `Result` beziehungsweise `CommandResult` zurückgegeben. Exceptions sind unerwarteten Programmier-, Browser- oder Infrastrukturfehlern vorbehalten.

### 6.2 Erste Use-Case-Gruppen

| Modul | Öffentliche Use Cases der ersten Slices |
|---|---|
| Content | `registerSourceManifest`, `importContentPackage`, `validateContentPackage`, `queryContent` |
| Character | `createCharacterDraft`, `updateCharacterDraft`, `validateCharacterBuild`, `confirmCharacterBuild`, `archiveCharacter` |
| Campaign | `createCampaignDraft`, `updateSessionZero`, `activateCampaign`, `assignCharacter`, `reviseRuleProfile` |
| Adventure | `createAdventure`, `prepareScene`, `prepareEncounter`, `updateAdventureProgress` |
| Session | `prepareSession`, `startSession`, `recordIntent`, `resolveAction`, `pauseSession`, `resumeSession`, `completeSession` |
| Transfer | `buildProgressProposal`, `confirmTransferBatch`, `resumeInterruptedTransfer` |
| Data | `estimateStorage`, `requestPersistence`, `exportBundle`, `inspectImport`, `restoreBundle`, `runMigrations` |

Diese Namen sind öffentliche Architekturverträge, keine Aufforderung, alle Methoden im ersten Commit als leere Stubs anzulegen. Jeder Release-Slice implementiert nur seine benötigte Teilmenge Ende-zu-Ende.

## 7. Zustands- und Datenfluss

```text
Nutzerabsicht
  -> UI validiert Form und baut Command
  -> Application Layer lädt benötigte Aggregate
  -> Domain prüft Lebenszyklus und Invarianten
  -> Rules Engine berechnet/validiert bei Bedarf
  -> Nutzer/DM bestätigt bei `assisted`
  -> Unit of Work schreibt Zustand + Events + Idempotenznachweis atomar
  -> Query/Projection entfernt nicht erlaubte Informationen
  -> UI zeigt Ergebnis, Trace oder typisierten Fehler
```

- React-Komponenten verändern keine Aggregate direkt.
- Zustand, der einen App-Neustart überleben muss, gehört nicht ausschließlich in React-State.
- Persistente Daten werden über Queries/Repositories gelesen; UI-State bleibt lokal beim Feature.
- Redux oder ein anderer globaler Store wird nicht vorsorglich eingeführt. Eine kleine Bibliothek darf erst nach einem belegten, featureübergreifenden UI-State-Problem ergänzt werden.
- Spätere KI erhält ausschließlich freigegebene Projektionen und erzeugt Vorschläge oder Commands, nie direkte Writes.

## 8. Lokale Persistenz

### 8.1 Physische v1-Richtung

Eine versionierte IndexedDB-Datenbank wird über einen Dexie-Adapter verwaltet. Vorgesehene Object Stores sind:

```text
metadata
characters
characterBuilds
campaignCharacterStates
campaigns
worldEntries
relationships
adventures
sceneTemplates
encounterTemplates
sessions
sessionEvents
sessionSnapshots
contentPackages
contentEntries
drafts
processedCommands
migrationJournal
```

Die genaue Indexliste wird pro Query-Bedarf im Persistenz-Spike definiert. Boolesche oder komplexe Objekte werden nicht unbedacht als IndexedDB-Index verwendet. Fachobjekte werden zwischen Domain- und Storage-DTO explizit gemappt.

### 8.2 Transaktionsregeln

- Aggregate-Revision, erzeugte Events und Idempotenznachweis werden in einer IndexedDB-Transaktion gespeichert.
- Externe asynchrone Arbeit wie Hashing großer Dateien oder Netzwerkzugriff findet vor beziehungsweise nach der DB-Transaktion statt.
- Ein fehlerhafter Commit hinterlässt keine teilweise angewandte Fachänderung.
- Migrationen laufen schrittweise, journalisiert und nach einem Pre-Migration-Backup.
- Beim Start werden DB-Version, letzter Migrationsstand und bekannte Recovery-Marker geprüft.
- Multi-Tab-Zugriffe verwenden Revisionsprüfung; eine spätere Koordinationsentscheidung für Web Locks/BroadcastChannel folgt aus dem Spike.

### 8.3 Browserhaltbarkeit

Die App fragt `navigator.storage.persist()` an, zeigt `navigator.storage.estimate()` verständlich an und behauptet niemals, Browserdaten seien unzerstörbar. Bewusstes Löschen von Website-/Appdaten kann lokale Daten entfernen. Deshalb sind Backup, Restore und sichtbare Warnungen Teil des Produkts.

## 9. Backup, Export und private Dateien

### 9.1 Portables Bundle

Das geplante `.dndim`-Bundle enthält mindestens:

```text
manifest.json
data/*.json
checksums.json
media/*                 # nur ausdrücklich zugehörige eigene Medien
```

Das Manifest trägt Format-, Schema-, Ruleset-, Source- und App-Version. Import erfolgt in zwei Phasen: unveränderliche Inspektion/Validierung und danach bewusst bestätigte Anwendung. Größen-, Dateizahl-, Pfad-, Schema- und Prüfsummenlimits schützen gegen beschädigte oder bösartige Archive.

Kompression wird erst mit dem Export-Slice ergänzt; eine kleine Browserbibliothek wie `fflate` ist führender Kandidat, aber keine v0.1-Abhängigkeit.

### 9.2 Private Referenzbibliothek

- PDFs, Scans, Karten und Bucharchive bleiben außerhalb von Git, Build, IndexedDB und normalen Backups.
- Der Katalog speichert Titel, Ausgabe, Sprache, Dateiname, Größe, Prüfsumme, Text-/OCR-Status und einen verständlichen Ablagehinweis.
- Browser-Dateihandles dürfen nur nach bewusster Auswahl gespeichert werden und sind keine plattformübergreifende Kernvoraussetzung.
- OCR, Volltextindex und Thumbnails sind löschbare Derived Caches mit konfigurierbarem Limit und niemals fachliche Wahrheit.

## 10. PWA-, Offline- und Updatevertrag

- Der Vite-Build erzeugt statische HTML-, CSS-, JavaScript- und Assetdateien.
- `vite-plugin-pwa`/Workbox ist der bevorzugte Service-Worker-Weg und wird im Bootstrap-Spike geprüft.
- App Shell, selbst gehostete Fonts, Icons und veröffentlichbarer SRD-Content dürfen kontrolliert offline gecacht werden.
- Private Nutzerdaten liegen in IndexedDB, nicht im Service-Worker-Cache.
- Ein Update aktiviert sich nicht mitten in einer ungespeicherten Sitzung. Die UI zeigt eine neue Version an und bietet einen sicheren Reload-Zeitpunkt.
- Service-Worker- und DB-Schemaversionen werden gemeinsam in Upgrade-/Rollback-Szenarien getestet.
- Website und installierte PWA stammen aus demselben Artefakt. Ein nativer Wrapper ist kein v1-Release-Gate.

## 11. UI- und Design-System

### 11.1 Grundidee

Material 3/Expressive dient als Referenz für Hierarchie, adaptive Komponenten, Bewegung und verständliche Interaktion, nicht als visuelle Kopiervorlage. DnDimension erhält eine eigene Fantasy-Identität und verwendet kein vollständiges Material-UI-Kit als Fundament.

Design Tokens umfassen mindestens:

- semantische Farben und Oberflächen;
- Typografie und Schriftrollen;
- Abstände, Größen, Formen und Radien;
- Schatten, Tiefe, Licht und Fokus;
- z-Index- und Overlay-Ebenen;
- Motion-Dauer, Easing und reduzierte Bewegung;
- Breakpoints, Container und Dichtevarianten.

### 11.2 Komponentenebenen

```text
Tokens -> Primitives -> Components -> Patterns -> Feature Screens
```

- **Primitives:** Text, Surface, Stack, Grid, Icon, VisuallyHidden.
- **Components:** Button, Field, Select, Tabs, Dialog, Tooltip, Menu, Toast.
- **Patterns:** Creator Step, Rule Explanation, Resource Tracker, DM Secret Panel, Empty/Error/Recovery State.
- **Feature Screens:** Character Creator, Campaign Creator, Session Workspace und spätere VTT-Flächen.

### 11.3 Visuelle und zugängliche Qualität

- WCAG 2.2 AA ist Mindestziel der Kernflüsse.
- Fokus, Tastatur, Screenreader-Name, Kontrast, Zoom und Touch-Ziele sind Komponentenverträge.
- `prefers-reduced-motion` deaktiviert oder vereinfacht nicht notwendige Bewegung.
- CSS übernimmt einfache Hover-/Fokus-/Statusübergänge; Motion nur komplexe Layout-, Gesten- und Shared-Element-Animationen.
- Themes ändern Atmosphäre, nicht Semantik oder Position kritischer Bedienmuster.
- Desktop erhält einen mehrspaltigen DM-Arbeitsbereich, Tablet einen Tischmodus und Smartphone fokussierte Einzelansichten.
- Eine interne `/dev/ui`-Route dokumentiert Komponenten im Development-Build. Storybook wird erst bei nachgewiesenem Mehrwert ergänzt.

### 11.4 Assets und Fonts

- maximal zwei primäre, lokal gespeicherte WOFF2-Schriftfamilien mit benötigten Sprachzeichen;
- SVG für Icons und eigene Symbole; große Icon-/Bildpakete werden vermieden;
- responsive AVIF/WebP-Bilder und Lazy Loading für dekorative Medien;
- keine geschützten D&D-/BG3-Assets oder nachgeahmten markanten UI-Kompositionen;
- optionale Medien verbessern Atmosphäre, sind aber nie für Kernbedienung erforderlich.

## 12. Fehler-, Sicherheits- und Datenschutzmodell

### 12.1 Fehlerklassen

Die Domainfehler aus der v0.2-Spec bleiben verbindlich: `ValidationError`, `LifecycleError`, `RevisionConflict`, `MissingReference`, `RulesetConflict`, `VisibilityViolation`, `UnsupportedSchema` und `CorruptedData`.

- Erwartete Fehler werden lokalisiert und handlungsorientiert dargestellt.
- Unbekannte Fehler landen in einer App Error Boundary mit Recovery-, Export- und Neuversuchsoption.
- Logs sind strukturiert, korrelierbar und redigieren Content, Geheimnisse und personenbezogene Daten.
- v1 sendet keine Telemetrie ungefragt an einen externen Dienst.

### 12.2 Sicherheitsgrenzen

- Player Preview entsteht durch deny-by-default Projektionen im Application Layer, nicht durch CSS-Verstecken.
- IndexedDB ist kein Tresor gegen Personen mit Zugriff auf dasselbe Betriebssystemprofil.
- Im Client oder Repository existieren keine geheimen API-Schlüssel.
- HTML aus Content oder Importen wird nicht unkontrolliert ausgeführt.
- Importdateien besitzen Größen-, Struktur-, Schema- und Prüfsummenlimits.
- Dependencies und Actions werden regelmäßig geprüft; Secrets und private Medien werden nie gecacht oder als CI-Artefakt hochgeladen.

## 13. Konfiguration und Betrieb

- `packageManager`, Node-Engine und Lockfile pinnen den reproduzierbaren Toolstand.
- Die aktive Node-LTS-Version wird im Bootstrap-Spike exakt festgelegt und in einer Repository-Datei dokumentiert.
- `.env.example` dokumentiert ausschließlich erlaubte Variablen. `VITE_*` ist öffentlich und darf keine Secrets enthalten.
- v1-Feature-Flags sind typisierte lokale Konfigurationen, keine versteckten Produktionsschalter.
- Production Builds erzeugen standardmäßig keine dauerhaft lokal angesammelten Source Maps.
- Releases enthalten Versionsnummer, Daten-/Migrationseffekt, bekannte Grenzen und Restore-Weg.

## 14. Teststrategie

### 14.1 Testpyramide

| Ebene | Schwerpunkt | Werkzeug |
|---|---|---|
| Unit | Value Objects, Invarianten, Parser, Rules, Projektionen | Vitest |
| Property | Würfel-, Modifikator-, Ressourcen-, Idempotenz- und Roundtrip-Invarianten | fast-check + Vitest |
| Contract | Repositories, Unit of Work, Clock/ID/Dice, Content-/Rule-Ports | gemeinsame Suites aus `testkit` |
| Integration | IndexedDB, Migration, Import/Export, Snapshot/Recovery | Vitest, fake-indexeddb plus echte Browsertests |
| Component | Formulare, Fehler, Fokus, Tastatur und sichtbare Zustände | React Testing Library + user-event |
| E2E | Character-, Campaign-, Session- und Backup-Kernpfade | Playwright |
| Accessibility | semantische Abfragen, axe, manuelle Tastatur-/Screenreaderprüfung | Testing Library, axe-core, Playwright |
| Visual | wenige stabile Kernansichten und Theme-Zustände | Playwright Screenshots in CI |

### 14.2 Qualitätsregeln

- Kein v1-P0-Regelpfad bleibt ohne positiven, negativen und relevanten Grenzfalltest.
- Domain und Rules Engine erhalten hohe Branch-Abdeckung; Prozentwerte ersetzen keine Rule-Matrix.
- Alle unterstützten Migrationspfade besitzen Erfolgs-, Abbruch- und Recovery-Test.
- Jeder neue player-facing Feld-/Eventtyp benötigt einen Negativtest gegen DM-only Datenlecks.
- Import/Export besteht semantischen Roundtrip, Prüfsummen- und Versionskonflikttests.
- Zufall, Uhr und IDs sind injizierbar; Tests bleiben deterministisch.
- UI-Tests bevorzugen Rollen, Namen und echte Interaktionen statt `data-testid` oder Implementierungsdetails.

### 14.3 Lokale Browserstrategie

Playwright verwendet lokal standardmäßig den installierten Edge-Kanal. Vollständige Chromium-/Firefox-/WebKit-Binaries werden nicht als lokale Standardvoraussetzung installiert. Die vollständige Matrix läuft in CI; ein einzelner lokaler Browserdownload bleibt eine bewusste Ausnahme für Reproduktion.

## 15. CI- und Quality-Gate-Plan

GitHub Actions ruft ausschließlich lokal reproduzierbare pnpm-Skripte auf:

1. Lockfile und Installation prüfen.
2. Markdown-Links, Dokumentstruktur und private-Datei-Grenzen prüfen.
3. Format, ESLint, Importgrenzen und zyklische Abhängigkeiten prüfen.
4. TypeScript mit `--noEmit` prüfen.
5. Unit-, Property-, Contract-, Migrations- und Component-Tests ausführen.
6. Production-/PWA-Build erzeugen und Größenbudgets prüfen.
7. Kritische E2E-, Offline- und Accessibility-Tests ausführen.
8. Dependency-, Lizenz- und Secret-Prüfung durchführen.

Schnelle Gates laufen auf jedem Pull Request. Teure Browsermatrix, längere Recovery- und Performance-Szenarien dürfen auf `main`, nachts oder vor Releases laufen. Fehlerscreenshots und Videos werden nur bei Bedarf mit kurzer `retention-days`-Dauer gespeichert. Private Daten und Secrets sind von Cache und Artefakten ausgeschlossen.

## 16. Speicher- und Performancebudgets

### 16.1 Lokaler Entwicklungsplatz

| Bereich | Ziel/Grenze vor erneuter Entscheidung |
|---|---:|
| Production Build ohne optionale Medien | Ziel maximal 50 MB |
| Vite-/Transform-Caches | Warnung ab 300 MB |
| Testreports, Screenshots und Videos | maximal 250 MB, automatisch bereinigbar |
| tatsächliche projektspezifische Dependencies | Ziel unter 1 GB |
| gemeinsam genutzter pnpm-Store | Warnung ab 2 GB; unreferenzierte Pakete prüfbar/prunebar |
| Derived PDF-/Suchcache | Standardlimit 250 MB, nutzerseitig löschbar |
| private Referenzbibliothek | außerhalb dieser Budgets; nie dupliziert |

P-01 hat diese Budgets am 2026-08-28 bestätigt: Production Build 1,43 MiB, projektlokale Dependencies 178,87 MiB, gemeinsamer pnpm-Store 170,64 MiB sowie jeweils 0,00 MiB für Vite-/Transform-Caches und Testartefakte nach dem Neuaufbau. Einzelheiten und Befehle stehen im [Toolchain Validation Report](../research/v0.1-toolchain-validation-report.md). Ein künftig überschrittenes Budget verlangt Ursache, Nutzen und Entscheidung; es wird nicht durch stilles Anheben „gelöst“.

### 16.2 Bereinigungsbefehle

```text
pnpm clean          # dist und sichere generierte Outputs
pnpm clean:test     # Reports, Videos, Screenshots, Coverage
pnpm clean:cache    # projektlokale, reproduzierbare Toolcaches
pnpm clean:deep     # alle reproduzierbaren lokalen Projektartefakte
pnpm disk:report    # Größen je kontrolliertem Bereich
pnpm run doctor     # Versionen, Lockfile, Browser, Speicher und Konfiguration
```

Keiner dieser Befehle darf Quellcode, `private-library`, Nutzerdaten oder nicht reproduzierbare Dateien löschen. Pfade werden explizit validiert.

### 16.3 Bewusst vermiedene Speicherverursacher

- keine Docker-Images oder lokale Cloud-Stack-Emulation in v1;
- kein Electron/Chromium pro App;
- kein Android SDK, Emulator oder MAUI-Workload;
- kein Rust-/Tauri-Toolchain ohne Native-Decision;
- keine standardmäßigen Playwright-Browserdownloads lokal;
- kein Storybook-, Cypress-, Nx- oder Turborepo-Cache ohne nachgewiesenen Nutzen;
- keine historischen Builds oder automatisch heruntergeladenen CI-Artefakte.

## 17. Kosten- und Providerstrategie

v1 benötigt keinen laufenden kostenpflichtigen Dienst. Statisches Hosting darf einen geeigneten Free Tier verwenden; lokaler Betrieb bleibt vollständig möglich.

Ab Cloud-/Account-Releases gilt:

- Free-first, aber nicht auf Kosten von Datenportabilität, Sicherheit oder Zuverlässigkeit;
- SQL hinter einem eigenen Adapter; D1/Workers ist derzeit der führende, nicht bindende Kandidat;
- PostgreSQL bleibt der primäre Fallback bei komplexerer relationaler oder betrieblicher Anforderung;
- Durable Objects sind Kandidat für aktive Realtime-Räume, nicht automatisch für jede Datenart;
- R2 oder gleichwertiger Object Storage nur für notwendige Nutzerdateien, nie für proprietäre Projektquellen;
- Paid Plan, AI API oder variable Abrechnung benötigt Budget, Monitoring, Warnschwelle und Kill Switch;
- Anbieterpreise werden unmittelbar vor Einführung neu geprüft und nicht als dauerhafte Annahme behandelt.

## 18. Reproduzierbarer Bootstrap

### 18.1 Validierte Voraussetzungen

- Git;
- Node.js 24.11.0 oder neuer innerhalb der Node-24-Linie; `.node-version` und CI referenzieren 24.20.0;
- über Corepack exakt gepinntes pnpm 11.19.0;
- ein vorhandener moderner Browser, lokal bevorzugt Microsoft Edge;
- keine globale Installation projektspezifischer CLI-Pakete.

### 18.2 Validierter Foundation-Ablauf

Der Bootstrap erfolgt zunächst in einem leeren temporären Testverzeichnis und danach reproduzierbar im Repository:

```text
1. Node-/Corepack-/pnpm-Versionen erfassen und pinnen.
2. pnpm Workspace und React-TypeScript-Vite-App initialisieren.
3. Package-Grenzen und gemeinsame TypeScript-Konfiguration einrichten.
4. minimales Design Token + React-Aria-Element integrieren.
5. minimale Domainfunktion und In-Memory-Adapter testen.
6. Dexie-Transaktion, Migration und Recovery im Browser beweisen.
7. PWA installieren, offline starten und Updatefluss prüfen.
8. lokalen Edge-E2E-Test und CI-Browsermatrix beweisen.
9. Production Build, node_modules, Store und Caches messen.
10. Messergebnisse und exakt geprüfte Versionen in Blueprint/Lockfile übernehmen.
```

Die Schritte 1 bis 3 sowie 9 und 10 wurden in P-01 technisch bestätigt. Die Punkte 4 bis 8 bleiben absichtlich in P-04, P-02, P-03 und P-05 getrennt; sie sind keine stillschweigende Voraussetzung des nun nutzbaren Foundation-Workspaces. Die copy-paste-fähigen Befehle stehen in `code/README.md`, die vollständige Evidenz im [Toolchain Validation Report](../research/v0.1-toolchain-validation-report.md).

## 19. Verbindliche Spikes vor Produktcode

| Spike | Frage | Exit-Kriterium |
|---|---|---|
| P-01 Toolchain — **Passed 2026-08-28** | Lassen sich gepinnte Node/pnpm/Vite/React-Versionen sauber installieren, bauen und bereinigen? | erfüllt: Frozen Lockfile, 22 Tests, Build und alle Größenbudgets bestanden |
| P-02 Persistenz | Erfüllen Dexie/IndexedDB Unit-of-Work-, Migration-, Crash- und Multi-Tab-Annahmen? | atomarer Referenzfall, simulierte Unterbrechung, Recovery und Contract Test |
| P-03 PWA | Funktionieren Install, Offline-Start, sicherer Updatehinweis und Cachetrennung? | Browsernachweis für Website und installierte PWA |
| P-04 UI/Quality | Bleiben React Aria, Motion, Fonts und Teststack innerhalb Bundle-/A11y-/Diskbudget? | UI-Lab-Minimum, Reduced Motion, Tastaturtest und Messbericht |
| P-05 SRD Import | Ist der offizielle SRD-Weg reproduzierbar, lizenzkonform und validierbar? | versioniertes Manifest, Parser-Prototyp und Vergleichsnachweis gemäß Issue #21 |

Ein Spike erzeugt Wegwerf- oder Foundation-Code, Messergebnisse und eine Entscheidung. Er darf keinen halb fertigen Produkt-Slice als dauerhafte Architektur verstecken.

## 20. Umsetzungsreihenfolge nach Gate

1. Workspace, Quality Gates, Design Tokens und App Shell minimal bootstrappen.
2. `core`, `domain`, `application` und `testkit` mit einem kleinen vertikalen Contract beweisen.
3. Content Source Registry und reproduzierbaren SRD-Import liefern.
4. IndexedDB-Adapter, Migration, Storage Health und Backup-Grundvertrag integrieren.
5. Rules Engine Foundation gemäß v0.3-Spec implementieren.
6. Character Creator als ersten sichtbaren vertikalen Slice liefern.
7. Campaign Creator und Player Preview anbinden.
8. Adventure-/Session-Runtime, Audit/Recovery und Referenzkampf ausbauen.
9. v1-Scope integrieren, feature-complete machen und stabilisieren.
10. Erst danach Settings/Homebrew, Accounts, Cloud, Realtime, Visual/VTT und KI in ihren Releases ergänzen.

Ein Release-Slice liefert Domain, Application, Adapter, UI, Tests, Dokumentation und Migration gemeinsam. Horizontale „alle Interfaces zuerst“-Implementierung ohne nutzbaren vertikalen Nachweis ist ausgeschlossen.

## 21. Startfreigabe und Definition of Done des Blueprint-Gates

Der Blueprint ist erst vollständig operationalisiert, wenn:

- der Nutzer diese Design-Baseline abgenommen hat;
- DEC-008 bis DEC-010 akzeptiert und verlinkt sind;
- P-01 bis P-04 mit exakten Versionen und Messwerten bestanden sind;
- der SRD-Importpfad entweder bestanden oder als klarer v0.2-Blocker dokumentiert ist;
- Package-Grenzen und mindestens ein Contract Test technisch nachgewiesen sind;
- Website, installierte PWA, Offline-Start und sicherer Updateweg reproduzierbar sind;
- Persistenz, Migration, Recovery und Exportvertrag keine offene Critical-Lücke besitzen;
- lokale Speicherbudgets eingehalten oder ausdrücklich neu entschieden wurden;
- GitHub-Issues aus dem Blueprint Definition of Ready erfüllen.

P-01 ist bestanden; bis P-02 bis P-05 entschieden sind, bleibt das gesamte Blueprint-Gate teilweise offen. Das ist kein offener Architekturgrundsatz, sondern ein Satz messbarer v0.1-Ausführungsgates.

## 22. Offizielle Referenzen der Entscheidung

- React und TypeScript: <https://react.dev/learn/typescript>
- Vite Guide: <https://vite.dev/guide/>
- pnpm Speicherprinzip: <https://pnpm.io/motivation>
- pnpm Storepflege: <https://pnpm.io/cli/store>
- Blazor PWA als bewertete Alternative: <https://learn.microsoft.com/en-us/aspnet/core/blazor/progressive-web-app/>
- Ionic React als bewertete Alternative: <https://ionicframework.com/react>
- Tauri als spätere Option: <https://tauri.app/start/frontend/>
- Dexie/IndexedDB: <https://dexie.org/docs>
- Browser Storage Persistence und Eviction: <https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria>
- React Aria: <https://react-spectrum.adobe.com/react-aria/getting-started.html>
- Motion for React: <https://motion.dev/docs/react>
- Material Design 3: <https://m3.material.io/>
- WCAG 2.2: <https://www.w3.org/TR/WCAG22/>
- Vitest: <https://vitest.dev/guide/>
- React Testing Library: <https://testing-library.com/docs/react-testing-library/intro/>
- Playwright Browserverwaltung: <https://playwright.dev/docs/browsers>
- GitHub Actions Dependency Caching: <https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching>
- GitHub Actions Artifacts: <https://docs.github.com/en/actions/tutorials/store-and-share-data>
- Azure Microservices Trade-offs: <https://learn.microsoft.com/en-us/azure/architecture/microservices/>
- Cloudflare Workers Pricing: <https://developers.cloudflare.com/workers/platform/pricing/>
- Cloudflare D1 Pricing: <https://developers.cloudflare.com/d1/platform/pricing/>
- Cloudflare R2 Pricing: <https://developers.cloudflare.com/r2/pricing/>

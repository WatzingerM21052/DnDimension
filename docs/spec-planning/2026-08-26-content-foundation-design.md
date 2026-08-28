# Sub-Projekt 1: Content-Foundation

**Status:** Accepted Content Baseline; Domain-Verträge in der [v0.2 Domain & Data Model Specification](v0.2-domain-data-model-spec.md)<br>
**Erstellt:** 2026-08-26<br>
**Aktualisiert:** 2026-08-28
**Vorgänger:** [Master Vision](2026-08-26-master-vision-design.md)

## 1. Zweck

Die strukturierte Content-Basis für die gesamte App: SRD-Inhalte werden lizenzsauber getaggt, ruleset-versioniert und zunächst local-first verfügbar gemacht. Das offizielle SRD 5.2.1 beziehungsweise 5.1 ist fachlich maßgeblich. [Open5e](https://open5e.com) ist ein möglicher strukturierter Importkandidat, nicht die alleinige Quelle der Wahrheit.

Für den v1.0-Character-Creator gilt [DEC-002](../decisions/DEC-002-v1-character-content-boundary.md): Fest eingebaut wird ausschließlich veröffentlichbarer SRD-5.2.1-Content. Proprietäre Buchoptionen und private Dateien sind weder Build-Quelle noch Laufzeitvoraussetzung.

**Bewusst außerhalb des Scopes dieses Sub-Projekts:** die Homebrew-**Eingabe-UI** (Formular zum Eintragen eigener Inhalte). Das Datenmodell lässt dafür von Anfang an Platz (`source: "homebrew"` beziehungsweise kampagnengebundene Herkunft); die kontrollierte UI folgt gemäß Roadmap erst mit v1.1 Settings & Homebrew nach dem stabilen lokalen v1-Kern.

## 2. Fachliches Content-Modell

Die verbindlichen Identitäts-, Versions-, Referenz-, Migrations- und Adapterverträge stehen in der [v0.2 Domain & Data Model Specification](v0.2-domain-data-model-spec.md) und [DEC-006](../decisions/DEC-006-hybrid-aggregate-snapshot-audit-model.md). Die folgende Darstellung beschreibt die logischen Content-Typen und legt keine SQL-, IndexedDB- oder D1-Tabellen fest:

```
source_manifest (
  id, ruleset, origin, license, attribution_text,
  import_snapshot_version, transform_version
)

spells (id, source_id, name, level, school, casting_time, range, components,
         duration, description, classes[], ...)
species (id, source_id, name, traits[], ...)
classes (id, source_id, name, hit_die, proficiencies, features_by_level, subclasses[])
backgrounds (id, source_id, name, skills, features, ...)
items (id, source_id, name, type, rarity, description, ...)
creatures (id, source_id, name, cr, stat_block_json, ...)
rules_glossary (id, source_id, term, description)
```

Jeder `ContentEntry` verweist über eine versionierte `ContentRef` auf Source Manifest, Ruleset, Content-Typ und Content-Revision. Jede Repository-Abfrage kann nach `origin`/`license` filtern, sodass private beziehungsweise proprietäre Homebrew-Inhalte nie versehentlich in einen geteilten oder veröffentlichten Kontext gelangen.

Für kampagnenspezifisches Homebrew gilt `origin = "campaign:<campaign_id>"` statt globalem `homebrew`, damit Inhalte sauber pro Kampagne isoliert sind. Veröffentlichte Content-Pakete sind unveränderlich; eine fachliche Änderung erzeugt eine neue Paket-/Content-Revision.

## 3. Import-Prozess

- **Kein Laufzeit-Proxy zu Open5e.** Import ist ein versionierter, wiederholbarer Build-Schritt. Ein Open5e-Adapter darf nur explizit zugelassene Dokument-Keys übernehmen und muss den Snapshot gegen offizielle SRD-Referenzen validieren.
- Jeder Import-Lauf bekommt `import_snapshot_version`, Quell-URL/-Version, Abrufdatum, Lizenz und Transformationsversion.
- Import ist idempotent: erneutes Laufen überschreibt bestehende `srd-2024`/`srd-2014`-Einträge des jeweiligen Snapshots, fasst `homebrew`/`campaign:*`-Einträge nicht an.
- 2024 / SRD 5.2.1 wird zuerst umgesetzt. 2014 / SRD 5.1 kann später über denselben Adaptervertrag folgen, benötigt aber ein eigenes Release-Gate und getrennte Validierungsfixtures; es ist kein impliziter v1.0-Scope.

## 4. Lese-API

Eine UI-unabhängige Content-Repository-Schnittstelle bietet Filter nach `ruleset`, Quelle, Klasse, Stufe und Typ. In v0.x bedient sie ein lokales, versioniertes Datenpaket; ab v1.2 kann ein D1-/Worker-Adapter dieselbe Schnittstelle implementieren.

## 5. Attribution

Fester Footer-Hinweis in der App:
> "This work includes material taken from the System Reference Document 5.1 and 5.2.1 ('SRD') by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd, licensed under CC-BY-4.0."

Der sichtbare Hinweis wird zentral als Konstante gepflegt. Source-Registry und Importmetadaten bewahren zusätzlich Quelle, Lizenz, Snapshot und Änderungen; die konkrete Attribution wird vor einer Veröffentlichung nochmals gegen die dann aktuelle offizielle SRD-Vorgabe geprüft.

## 6. Testing

- Import-Skript: Unit-Tests mit gemockten Open5e-Responses (Fixtures), prüfen korrektes Filtern nach `document.key` und korrektes Schreiben der Lizenz-Felder.
- Nach echtem Import: vollständige Schema-/Lizenzprüfung, stabile Zählwerte pro Quellsnapshot und gezielte inhaltliche Stichproben gegen das offizielle SRD.

## 7. Risiken / offene Punkte

- Open5e könnte seine API-Struktur ändern → Import-Skript ist bewusst isoliert (ein Modul), damit Anpassungen nicht in die Rules Engine durchschlagen.
- Open5e-Datenqualität für `srd-2024` ist neuer/weniger battle-tested als die etablierten 2014-Daten — erste Importe stichprobenartig gegen die tatsächliche SRD-5.2.1-PDF gegenprüfen (nur zum Verifizieren, nicht als Datenquelle).

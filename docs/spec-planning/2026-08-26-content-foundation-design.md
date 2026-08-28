# Sub-Projekt 1: Content-Foundation

**Status:** Überarbeitung für v0.2 erforderlich<br>
**Erstellt:** 2026-08-26<br>
**Aktualisiert:** 2026-08-28
**Vorgänger:** [Master Vision](2026-08-26-master-vision-design.md)

## 1. Zweck

Die strukturierte Content-Basis für die gesamte App: SRD-Inhalte werden lizenzsauber getaggt, ruleset-versioniert und zunächst local-first verfügbar gemacht. Das offizielle SRD 5.2.1 beziehungsweise 5.1 ist fachlich maßgeblich. [Open5e](https://open5e.com) ist ein möglicher strukturierter Importkandidat, nicht die alleinige Quelle der Wahrheit.

**Bewusst außerhalb des Scopes dieses Sub-Projekts:** die Homebrew-**Eingabe-UI** (Formular zum Eintragen eigener Inhalte). Das Datenmodell lässt dafür von Anfang an Platz (`source: "homebrew"`), aber das UI-Slice kommt erst mit Sub-Projekt 3 (Charaktererstellung), wenn klar ist, was Spieler:innen tatsächlich selbst eintragen wollen.

## 2. Datenmodell (portables Domain-Schema; D1 erst ab Cloud-Ausbau)

Eine Tabelle pro Content-Typ, gemeinsames Grundschema:

```
content_source (
  id, ruleset ('2024'|'2014'), origin ('srd-2024'|'srd-2014'|'homebrew'|'campaign:<id>'),
  license ('CC-BY-4.0'|'private'), attribution_text, imported_at, import_snapshot_version
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

`source_id` verweist immer auf `content_source` — dort steht die Lizenz. Jede Abfrage der Content-API kann nach `origin`/`license` filtern, sodass proprietäre bzw. private Homebrew-Inhalte eines Nutzers nie versehentlich in einen "geteilten" Kontext (z.B. andere Kampagnen) durchsickern.

Für Kampagnen-spezifisches Homebrew: `origin = "campaign:<campaign_id>"` statt global `"homebrew"`, damit Inhalte sauber pro Kampagne isoliert sind.

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

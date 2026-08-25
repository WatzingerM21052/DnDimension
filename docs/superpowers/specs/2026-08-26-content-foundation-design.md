# Sub-Projekt 1: Content-Foundation

**Status:** Entwurf zur Review
**Datum:** 2026-08-26
**Vorgänger:** [Master Vision](2026-08-26-master-vision-design.md)

## 1. Zweck

Die strukturierte Content-Basis für die gesamte App: SRD-Inhalte (Zauber, Klassen, Rassen/Species, Items, Monster, Regel-Glossar) importiert, lizenzsauber getaggt und lesbar über eine interne API. Kein PDF-Parsing — Import aus [Open5e](https://open5e.com).

**Bewusst außerhalb des Scopes dieses Sub-Projekts:** die Homebrew-**Eingabe-UI** (Formular zum Eintragen eigener Inhalte). Das Datenmodell lässt dafür von Anfang an Platz (`source: "homebrew"`), aber das UI-Slice kommt erst mit Sub-Projekt 3 (Charaktererstellung), wenn klar ist, was Spieler:innen tatsächlich selbst eintragen wollen.

## 2. Datenmodell (D1 / SQL)

Eine Tabelle pro Content-Typ, gemeinsames Grundschema:

```
content_source (
  id, ruleset ('2024'|'2014'), origin ('srd-2024'|'wotc-srd'|'homebrew'|'campaign:<id>'),
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

- **Kein Laufzeit-Proxy zu Open5e.** Import ist ein versionierter, wiederholbarer Skript-Lauf (Node/TS-Script), der die Open5e-v2-API abfragt, filtert auf `document__key__in=srd-2024,wotc-srd`, und Ergebnisse in D1 schreibt (via Seed-Migration oder Wrangler D1-Import).
- Jeder Import-Lauf bekommt eine `import_snapshot_version` (Datum + Open5e-Datenstand), damit spätere Re-Importe diffbar sind und wir merken, wenn Open5e seine Daten aktualisiert.
- Import ist idempotent: erneutes Laufen überschreibt bestehende `srd-2024`/`wotc-srd`-Einträge, fasst `homebrew`/`campaign:*`-Einträge nicht an.
- 2024 (`srd-2024`) wird zuerst importiert; 2014 (`wotc-srd`) folgt als zweiter Lauf, sobald der Importer steht — beide nutzen denselben Code-Pfad (nur anderer `document.key`-Filter).

## 4. Lese-API

Interne Worker-Route (`GET /content/spells`, `/content/classes`, etc.) mit Filterparametern (`ruleset`, `class`, `level`, ...). Wird von Rules Engine (Sub-Projekt 2) und Charaktererstellung (Sub-Projekt 3) konsumiert. Kein öffentlich dokumentiertes API nötig in dieser Phase — nur intern vom eigenen Frontend genutzt.

## 5. Attribution

Fester Footer-Hinweis in der App:
> "This work includes material taken from the System Reference Document 5.1 and 5.2 ('SRD') by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd, licensed under CC-BY-4.0."

Wird als Konstante gepflegt, nicht pro Content-Eintrag wiederholt (reicht laut CC-BY-4.0-Anforderung als einmaliger Hinweis im Werk).

## 6. Testing

- Import-Skript: Unit-Tests mit gemockten Open5e-Responses (Fixtures), prüfen korrektes Filtern nach `document.key` und korrektes Schreiben der Lizenz-Felder.
- Nach echtem Import: Stichproben-Zählung (z.B. "339 Spells importiert, alle mit `license = CC-BY-4.0`") als Sanity-Check, kein Snapshot-Test über den vollen Datensatz.

## 7. Risiken / offene Punkte

- Open5e könnte seine API-Struktur ändern → Import-Skript ist bewusst isoliert (ein Modul), damit Anpassungen nicht in die Rules Engine durchschlagen.
- Open5e-Datenqualität für `srd-2024` ist neuer/weniger battle-tested als die etablierten 2014-Daten — erste Importe stichprobenartig gegen die tatsächliche SRD-5.2-PDF gegenprüfen (nur zum Verifizieren, nicht als Datenquelle).

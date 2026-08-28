# AI-DM Quellenstrategie

**Stand:** 2026-08-28<br>
**Zweck:** Quellenhierarchie für Prompt-Tests und die spätere v3.x-Implementierung

## Grundsatz

Ein Quellenname ist kein Quellenzugriff. Ein Modell darf nur behaupten, eine Datei oder Website verwendet zu haben, wenn die aktuelle Umgebung sie tatsächlich öffnen konnte. Regeln, Abenteuerwissen, Karten und reine Spielleitungs-Inspiration werden getrennt behandelt.

## Autoritätsebenen

| Stufe | Quelle | Nutzung |
|---|---|---|
| A | zugängliche, vom Nutzer freigegebene offizielle Regelquelle der aktiven Edition | konkrete Regel, Zahl, Option und Ausnahme |
| B | offizielles SRD / offizielle Free Rules der aktiven Edition | bevorzugter frei nutzbarer Regel-Fallback |
| C | andere offizielle D&D-Quellen derselben Edition | ergänzende Regel- oder Kampagneninformation, nur bei tatsächlichem Zugriff |
| D | offizielle D&D-Webseiten | aktuelle Erläuterung, Konvertierung und Produktstruktur |
| E | Drittanbieter- und DM-Ratgeber | Inspiration für Vorbereitung, Taktik und Dramaturgie; nicht maßgeblich für offizielle Regeln |
| F | Modellwissen / spontane Entscheidung | nur als gekennzeichneter Fallback oder Hausentscheidung |

Ein spezifischer Regeltext schlägt die allgemeine Regel. Kampagnenspezifische Ausnahmen bleiben kampagnenspezifisch. 2014 und 2024 werden nicht automatisch kombiniert.

## Lokale Referenzmatrix

### Regelkern 2024

- `DnD-5e-2024-SRD-5.2.1-DE.pdf`: freie, lokalisierte Referenz für Spielregeln, Charaktergrundlagen, Klassen, Zauber, Kreaturen und Glossar.
- `DnD-5e-2024-Players-Handbook-EN.pdf`: private Referenz für vollständige Charakteroptionen und den offiziellen Erstellungsfluss.
- `DnD-5e-2024-Monster-Manual-EN-Alternate-Cover-Scan.pdf`: private Monsterreferenz; bildbasierter Scan, daher Zugriff/Lesbarkeit ausdrücklich prüfen.
- Ein lokales 2024 Dungeon Master's Guide ist derzeit nicht katalogisiert. Fehlende DMG-Inhalte dürfen nicht erfunden werden.

### Regelkern und Erweiterungen 2014

- SRD 5.1 DE/EN und Spielerhandbuch DE für Grundregeln.
- Xanathar und Tasha für Charakteroptionen, Session Zero und optionale DM-Werkzeuge.
- Mordenkainen-, Fizban- und Bigby-Werke für thematische Monster-/Weltreferenz; Scan und OCR-Version dürfen unterschiedliche Zugriffsvorteile haben.

### Kampagnen- und Abenteuerstruktur

- `Curse of Strahd`, `Van Richten's Guide to Ravenloft`, `Dragons of Stormwreck Isle`, `Lost Mine of Phandelver`, `Candlekeep Mysteries` und `Keys from the Golden Vault` dienen als private Referenz für Aufbau, Ton, Orte, Hooks und Abschlussformen.
- Abenteuerinhalte bleiben hinter dem DM-Schirm. Keine ungefragten Spoiler und keine umfangreiche Reproduktion.

### Vorbereitung, Gegner und Taktik

- Sly-Flourish-Werke inspirieren charakterzentrierte Vorbereitung, starken Einstieg, mögliche Szenen, Hinweise, Orte, NPCs, Monster und Tempo.
- Keith-Ammann-Werke inspirieren Motivation, Aktionsökonomie, Rollen, Positionierung, Moral, Rückzug, Versteckverteidigung und nicht-tödliche Ziele.
- Random-Encounter- und Forge-of-Foes-Werke inspirieren Begegnungsformen, Umgebungsziele und flexible Schwierigkeit.

Diese Techniken werden als eigene, allgemeine Arbeitsprinzipien paraphrasiert. Proprietäre Tabellen, Statblocks und längere Passagen werden nicht in Prompts oder Repository übernommen.

## Offizielle Online-Quellen

- [SRD 5.2.1 und lokalisierte Downloads](https://www.dndbeyond.com/srd)
- [D&D 2024 Free Rules: Creating a Character](https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character)
- [D&D 2024 Free Rules: Playing the Game](https://www.dndbeyond.com/sources/dnd/br-2024/playing-the-game)
- [D&D 2024 Free Rules: Rules Glossary](https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary)
- [Offizielle Übersicht der Änderungen im Dungeon Master's Guide 2024](https://www.dndbeyond.com/posts/1916-updates-in-the-dungeon-masters-guide-2024)
- [Offizielle Kampagnenplanung mit dem Dungeon Master's Guide 2024](https://www.dndbeyond.com/posts/1850-creating-your-first-campaign-using-the-2024)
- [Offizieller Session-Zero-Leitfaden](https://www.dndbeyond.com/posts/929-how-to-run-a-session-0-for-your-d-d-game)

## Laufzeit-Fallback

```text
1. Aktive Edition und angefragten Inhalt bestimmen.
2. Tatsächlich zugängliche Quellen inventarisieren.
3. Höchste passende Autoritätsstufe wählen.
4. Konflikte und Editionsabweichungen erkennen.
5. Regel paraphrasieren und Quelle intern protokollieren.
6. Bei fehlender Quelle: Datei anfordern oder SRD-Alternative anbieten.
7. Nur wenn Spielfluss wichtiger ist: vorläufiges RULING kennzeichnen und speichern.
```

## Source Manifest

```yaml
ruleset: "2024"
sources:
  - id: srd-5.2.1-de
    title: D&D SRD 5.2.1 DE
    kind: official-rules
    accessible: true
    authority: A
    purpose: rules-and-validation
conflicts: []
fallback_used: false
```

## Qualitätskontrolle

- Jede Regel-Evaluation speichert erwartete Edition und Referenzquelle.
- Tests enthalten bewusst gleich benannte 2014-/2024-Konzepte.
- Das Modell wird darauf getestet, fehlenden Zugriff ehrlich zu melden.
- Quellenzitate werden auf Existenz und tatsächliche Unterstützung der Aussage geprüft.
- Proprietäre Quellen werden nie automatisch in Trainings-, Log- oder Repository-Daten übernommen.

# DnDimension - Private Referenzbibliothek

**Stand:** 2026-08-28<br>
**Ablage:** `private-library/` (vollständig durch `.gitignore` ausgeschlossen)<br>
**Zweck:** Private Recherche für Produktplanung, UX, Datenmodell und Regelvergleich. Inhalte aus proprietären Werken werden nicht in das Repository oder eine veröffentlichte App übernommen.

## 1. Aktueller Bestand

Nach der Bereinigung enthält die Bibliothek:

| Format | Anzahl | Größe |
|---|---:|---:|
| PDF | 59 | 2.216 MiB |
| EPUB | 1 | 22 MiB |
| DOCX | 1 | 1,4 MiB |
| JPG | 7 | 12,5 MiB |
| PNG | 2 | 5 MiB |
| WebP | 5 | 1,2 MiB |
| ZIP-Originalarchive | 2 | 23,4 MiB |

Die ZIP-Inhalte wurden zusätzlich zur nutzbaren Bibliothek extrahiert. Die Originalarchive bleiben vorerst unter `98_Original_Archives/`, damit die ursprüngliche Paketstruktur nachvollziehbar bleibt.

Zwei leere Zukunftsordner werden bewusst lokal vorgehalten:

- `98_Derived_Versions/` für künftig erzeugte OCR-, komprimierte oder anderweitig abgeleitete Arbeitsfassungen, sofern sie nicht sinnvoll direkt beim Werk liegen.
- `99_Quarantine/` nur für wirklich ungeklärte, beschädigte oder noch nicht klassifizierte Dateien. Nützliche Standalone-, Scan- und OCR-Varianten bleiben im fachlich passenden Ordner.

## 2. Ablage- und Namensregeln

Neue Downloads kommen zuerst nach `private-library/00_Inbox/`. Nach der Prüfung werden sie nach System, Edition und Inhaltstyp einsortiert.

Dateinamen folgen grundsätzlich diesem Schema:

```text
<System>-<Edition>-<Titel>-<Sprache>-<Variante>.<format>
```

Beispiele:

```text
DnD-5e-2024-Players-Handbook-EN.pdf
DnD-5e-2024-SRD-5.2.1-DE.pdf
DnD-5e-2014-Bigby-Presents-Glory-of-the-Giants-EN-Scan.pdf
```

Varianten werden nicht automatisch als Duplikate behandelt. Scan, OCR-/Textfassung, Sprache, Cover, Einzelauszug und Dateiformat können einen legitimen Grund für mehrere Dateien desselben Werks darstellen. Nutzbare Varianten liegen direkt gemeinsam im fachlich passenden Ordner; ihre Funktion wird im Dateinamen kenntlich gemacht, beispielsweise mit `Scan`, `Text-OCR` oder `Standalone`.

## 3. Offene und offizielle Regelquellen

| Werk | Sprache | Seiten | Ablage | Herkunft |
|---|---|---:|---|---|
| SRD 5.2.1 | DE | 412 | `01_Open_Content/SRD/2024/DE/` | Wizards of the Coast / offizieller SRD-Download |
| SRD 5.1 | DE | 450 | `01_Open_Content/SRD/2014/DE/` | Wizards of the Coast / offizieller SRD-Download |
| SRD 5.1, bookmarked | EN | 403 | `01_Open_Content/SRD/2014/EN/` | CC-BY-basierte, mit Bookmarks versehene Fassung |
| SRD 5.1 Auszüge | EN | 5 Dateien | `01_Open_Content/SRD/2014/EN/Extracts/` | Aus derselben Bookmarked-Sammlung |

Offizielle Bezugsseite: <https://www.dndbeyond.com/srd>

## 4. D&D 5e - Regelstand 2024

| Werk | Sprache | Seiten | Variante | Herkunftsnotiz |
|---|---|---:|---|---|
| Player's Handbook | EN | 387 | reguläre PDF-Fassung | vorheriger lokaler Bestand; genaue Downloadquelle unbekannt |
| Monster Manual | EN | 390 | Alternate Cover, Scan | vorheriger lokaler Bestand; genaue Downloadquelle unbekannt |

Noch nicht vorhanden: Dungeon Master's Guide 2024 und deutsche Fassungen der beiden vorhandenen Grundregelwerke.

## 5. D&D 5e - Regelstand 2014

### Grundregelwerk und Erweiterungen

| Werk | Sprache | Seiten | Herkunftsnotiz |
|---|---|---:|---|
| Spielerhandbuch | DE | 320 | vorheriger lokaler Bestand; genaue Downloadquelle unbekannt |
| Xanathars Ratgeber für Alles | DE | 192 | vorheriger Dateiname ohne eindeutige Herkunft |
| Bigby Presents: Glory of the Giants | EN | 200 | bildbasierter Buchscan; genaue Downloadquelle unbekannt |
| Fizban's Treasury of Dragons | EN | 227 | `dokumen.pub` laut ursprünglichem Dateinamen |
| Mordenkainen's Tome of Foes | EN | 258 | `PDFCoffee` laut ursprünglichem Dateinamen |
| Mordenkainen Presents: Monsters of the Multiverse | EN | 291 | `PDFCoffee` laut ursprünglichem Dateinamen |
| Tasha's Cauldron of Everything | EN | 194 | vorheriger Dateiname ohne eindeutige Herkunft |

Die 112-seitige textbasierte Bigby-Fassung liegt gemeinsam mit dem 200-seitigen Buchscan unter `03_DnD_5e_2014/Rules_Expansions/`. Sie ist kein bitgenaues Duplikat und dient als schnell durchsuchbare OCR-/Textfassung.

### Kampagnensettings und Abenteuer

| Werk | Sprache | Seiten | Herkunftsnotiz |
|---|---|---:|---|
| Sword Coast Adventurer's Guide | EN | 161 | `PDFCoffee` laut ursprünglichem Dateinamen |
| Van Richten's Guide to Ravenloft | EN | 259 | vorheriger Dateiname ohne eindeutige Herkunft |
| Curse of Strahd | EN | 258 | vorheriger Dateiname ohne eindeutige Herkunft |
| Candlekeep Mysteries | EN | 227 | `PDFCoffee` laut ursprünglichem Dateinamen |
| Dragons of Stormwreck Isle | EN | 93 | `PDFCoffee` laut ursprünglichem Dateinamen |
| Keys from the Golden Vault | EN | 206 | `PDFCoffee` laut ursprünglichem Dateinamen |
| Lost Mine of Phandelver | EN | 64 | vorheriger Dateiname ohne eindeutige Herkunft |

### DM-Ressourcen und Homebrew

| Ressource | Sprache | Umfang | Herkunftsnotiz |
|---|---|---:|---|
| Icewind Dale: Tome of Adventures | EN | 57 Seiten | `PDFCoffee` laut ursprünglichem Dateinamen |
| Icewind Dale: Monster Loot | EN | 35 Seiten | `PDFCoffee` laut ursprünglichem Dateinamen |
| Waterdeep City Encounters v1.2 | EN | 38 Seiten | `PDFCoffee`; Werk nennt DMsGuild Community Content Agreement |
| Sword Coast Adventurer's Guide Revised v1.71 | EN | 30 Seiten | Homebrew-/Revised-Fassung; `PDFCoffee` laut ursprünglichem Dateinamen |
| Phandelver and Below - Cragmaw Hideout | EN | 5 Encounter-PDFs, 1 DOCX, 2 Karten | Google-Drive-Export einer „AAA Collection“ laut Archivname |

Die beiden Sword-Coast-Dateien sind unterschiedliche Werke: das 161-seitige offizielle Buch und eine 30-seitige überarbeitete Homebrew-Fassung.

## 6. Ältere Editionen

| Werk | Edition | Sprache | Seiten | Herkunftsnotiz |
|---|---|---|---:|---|
| Forgotten Realms FR1-FR16 Complete | AD&D 2e | EN | 1.434 | vorheriger lokaler Bestand |
| Waterdeep and the North, TSR 9213 | AD&D 2e | EN | 78 | praktische Standalone-Fassung des in FR1-FR16 enthaltenen Buchs |
| Waterdeep, TSR 9249 | AD&D 2e | EN | 62 | eigenständiges Abenteuer; kein Duplikat der FR1-Datei |
| Eberron Campaign Setting | D&D 3.5e | EN | 303 | vorheriger lokaler Bestand |
| Eberron: The Forge of War | D&D 3.5e | EN | 162 | vorheriger lokaler Bestand |
| Dragons of Faerûn | D&D 3.5e | EN | 162 | vorheriger lokaler Bestand |

Der extrahierte Seiteninhalt der 78-seitigen Standalone-Fassung von `Waterdeep and the North`, TSR 9213, stimmt auf allen 78 Seiten mit dem Anfang der Sammlung `FR1-FR16 Complete` überein. Sie bleibt trotzdem direkt unter `04_Older_Editions/ADnD_2e/`, weil sie wesentlich schneller einzeln geöffnet und durchsucht werden kann.

## 7. Drittanbieter-Bücher

| Werk | Autor/Verlag | Format | Sprache | Herkunftsnotiz |
|---|---|---|---|---|
| The Monsters Know What They're Doing | Keith Ammann | PDF + EPUB | EN | `OceanofPDF` laut ursprünglichen Dateinamen |
| MOAR! Monsters Know What They're Doing | Keith Ammann | PDF | EN | `OceanofPDF` laut ursprünglichem Dateinamen |
| Live to Tell the Tale | Keith Ammann | PDF | EN | `OceanofPDF` laut ursprünglichem Dateinamen |
| How to Defend Your Lair | Keith Ammann | PDF | EN | `OceanofPDF` laut ursprünglichem Dateinamen |
| Making Enemies | Keith Ammann | PDF | EN | `OceanofPDF` laut ursprünglichem Dateinamen |
| Return of the Lazy Dungeon Master | Sly Flourish | PDF | EN | `PDFCoffee` laut ursprünglichem Dateinamen |
| The Lazy DM's Forge of Foes v1.2.4 | Sly Flourish | PDF | EN | `PDFCoffee` laut ursprünglichem Dateinamen |
| Tome of Beasts | Kobold Press | PDF | EN | `PDFCoffee` laut ursprünglichem Dateinamen |
| The Game Master's Book of Random Encounters | Diverse | PDF | EN | `PDFCoffee` laut ursprünglichem Dateinamen |

Herkunftsangaben dokumentieren nur den vorgefundenen Dateinamen beziehungsweise eingebettete Metadaten. Der Katalog speichert keine Links zu unbestätigten Downloadportalen.

## 8. Handouts und Karten

- Acht deutsche Zauberkarten-Sammlungen: Barde, Druide, Hexenmeister, Kleriker, Magier, Paladin, Waldläufer und Zauberer. Die PDF-Metadaten weisen auf einen lokalen Export über `localhost:3000` hin.
- Tome-of-Strahd-Handout: 4 Seiten; genaue Herkunft unbekannt.
- Radiant-Citadel-Namenslisten: 3 Seiten; Justin Alexander / The Alexandrian laut PDF-Metadaten.
- Vier `Written in Blood`-Karten: Farmhaus/Höhle und Festival, jeweils Tag und Nacht; Reddit-Dateinamen und Morovoi-Wasserzeichen.
- Sieben Siabsungkoh-Karten aus einem als Reddit-Ressource benannten Google-Drive-Archiv.
- Zwei Cragmaw-Hideout-Karten aus dem Phandelver-Archiv.
- Eine Battle-Prawn-Challenge-Arenakarte; Reddit-Dateiname und Nesima-Wasserzeichen.

## 9. Duplikat- und Qualitätsregeln

Vor einer Löschung wird immer zuerst SHA-256 verglichen. Gleicher Titel allein reicht nicht aus.

```powershell
Get-ChildItem private-library -Recurse -File |
  ForEach-Object {
    [PSCustomObject]@{
      Path = $_.FullName
      Hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $_.FullName).Hash
    }
  } |
  Group-Object Hash |
  Where-Object Count -gt 1
```

Zusätzlich werden semantische Überschneidungen geprüft, beispielsweise Einzel-PDFs, die vollständig in einer Sammlung enthalten sind. Wenn eine Variante einen praktischen Nutzen hat - etwa schnellere Suche, eingebetteten Text, eine andere Sprache oder den direkten Zugriff auf ein Einzelbuch - bleibt sie im passenden Fachordner und erhält einen erklärenden Varianten-Zusatz im Dateinamen. Dateien werden nicht allein wegen gleicher Titel oder überlappender Inhalte ausgesondert oder automatisch gelöscht.

PDFs werden beim Einsortieren nicht komprimiert, neu exportiert oder anderweitig verändert. OCR und Kompression erfolgen nur an Arbeitskopien und erst nach visueller Qualitätskontrolle.

## 10. Speicherstrategie

Aktuelle Entscheidung: Die Bibliothek bleibt vorerst lokal.

Für eine spätere Auslagerung sind diese Möglichkeiten vorgemerkt:

1. Google Drive mit „Dateien streamen“ für geringen lokalen Speicherbedarf.
2. OneDrive mit Files On-Demand als Windows-nahe Alternative.
3. Proton Drive für Ende-zu-Ende-verschlüsselte Cloudablage.
4. Externe SSD/HDD als unabhängige Offline-Kopie.

Cloud-Synchronisation ersetzt kein Backup. Langfristiges Ziel ist eine 3-2-1-Strategie: drei Kopien, zwei unabhängige Speicher beziehungsweise Geräte und eine Kopie außer Haus. Bei einer späteren Migration müssen Inaktivitätsregeln, Wiederherstellungsfristen und die Aktualisierung der Katalogpfade erneut geprüft werden.

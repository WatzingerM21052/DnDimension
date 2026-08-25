# DnDimension — Master Vision & Architektur

**Status:** Entwurf zur Review
**Datum:** 2026-08-26
**Scope:** Dieses Dokument beschreibt die Gesamtvision, Architektur und den Sub-Projekt-Fahrplan. Es ist bewusst hoch-level — jedes Sub-Projekt bekommt sein eigenes, tieferes Spec-Dokument in diesem Ordner, bevor es implementiert wird.

## 1. Vision

Eine Web-App, mit der D&D 5e gespielt werden kann — solo mit KI-DM, in der Gruppe mit KI-DM, oder in der Gruppe mit menschlichem DM — ohne dass man das Regelwerk auswendig kennen muss. Die App übernimmt Buchhaltung (Werte, Zauberslots, Initiative, Regeln) und macht das Erlebnis immersiv statt Zettel-und-Taschenrechner.

**Leitprinzip: Zugänglichkeit vor Regelkenntnis.** Jede Design-Entscheidung wird daran gemessen, ob sie jemandem ohne D&D-Erfahrung hilft, trotzdem ein "echtes" Regel-korrektes Spiel zu erleben. Die KI erklärt, schlägt vor, führt — der Mensch bleibt aber jederzeit in der Lage, einzugreifen (z.B. eigene NPC-Beschreibungen, eigene Weltentscheidungen).

Nutzer:innen können mehrere Kampagnen parallel anlegen und verwalten, mit jeweils eigenem Regelwerk (2014 oder 2024), eigener Welt, eigenen Charakteren.

## 2. Abgrenzung zum Markt

| Plattform | Stärke | Lücke, die wir füllen |
|---|---|---|
| D&D Beyond | Offizielle Regel-Datenbank, digitaler Charakterbogen | Kein KI-DM, kein Battle-Map, Fokus auf Nachschlagewerk statt Spiel-Erlebnis |
| Everweave / AI-Game-Master-Apps | Freies KI-Storytelling, niedrige Einstiegshürde | Kein echtes 5e-Regelgerüst, meist Solo/mobil, keine Gruppensessions mit echten Freunden, kein Battle-Map |
| Roll20 / Foundry VTT | Battle-Map, Token, etablierte Kampagnen-Tools | Kein KI-DM, Charakterbogen fühlt sich wie Papier am Bildschirm an, hohe Einstiegshürde für Regel-Laien |

Wir kombinieren: echtes 5e-Regelgerüst + KI-DM mit Adjudikation + (später) Battle-Map — zugänglich für Neulinge.

## 3. Content- & Lizenzstrategie

- **SRD 5.1** (2014er Inhalte) und **SRD 5.2** (2024er Inhalte, seit April 2025) stehen beide unter **CC-BY-4.0** — unwiderruflich, permanent, auch kommerziell/öffentlich nutzbar mit Attribution. Das ist unsere Basis-Content-Quelle, strukturiert aufbereitet (nicht als PDF-Volltext, sondern als Daten: Racen, Klassen, Zauber, Monster, Items).
- **Datenquelle:** Statt die PDFs selbst zu parsen, importieren wir aus [Open5e](https://open5e.com) (`api.open5e.com`), das SRD-Inhalte bereits strukturiert bereitstellt und pro Datensatz ein `document.key`-Feld führt (z.B. `srd-2024`, `wotc-srd`). Der Import filtert **ausschließlich** auf diese beiden offiziellen WotC-CC-BY-4.0-Quellen — Open5e führt zusätzlich Drittanbieter-Inhalte (z.B. Kobold Press, andere OGL-Lizenzen), die wir bewusst nicht importieren, da sie eine andere Lizenz haben.
- **Bekannte Einschränkung:** SRD 5.2 ist eine Teilmenge des PHB 2024 (u.a. 339 Zauber, 330 Kreaturen, meist eine Unterklasse pro Klasse, begrenzte Species/Backgrounds-Auswahl). Der Charaktereditor wird also anfangs sichtbar weniger Optionen bieten als das volle PHB — das ist ein bewusster Trade-off, kein Bug. Homebrew-Eingabe ist der vorgesehene Weg, die Lücke zu schließen.
- **PHB-PDFs (2014 & 2024)** bleiben strikt proprietär. Volltext daraus wandert **nie** ins Repo — unabhängig davon, ob das Repo privat oder öffentlich ist. Sie dienen uns nur als Referenz beim manuellen Nacharbeiten von Strukturen/Konzepten, nicht als Datenquelle zum Kopieren.
- **Homebrew/eigene Inhalte** (z.B. selbst erfundene NPCs, Encounter, Hausregeln) leben ausschließlich in der Laufzeit-Datenbank (D1), nie als Git-Commit. Damit bleibt das Repo unabhängig vom Sichtbarkeits-Status sauber.
- Attribution-Hinweis für SRD-Inhalte wird fest im Footer/Impressum der App verankert.
- **Repo ist aktuell privat.** Ein späterer Wechsel zu public ist möglich, ohne Architektur zu ändern, weil Content-Trennung von Anfang an sauber ist.

## 4. Architektur

**Frontend:** React + TypeScript SPA (Cloudflare Pages). Kommuniziert per REST/RPC für normale Anfragen, per WebSocket für Live-Session-Zustand.

**Backend:** Cloudflare Workers.
- **Durable Object pro aktiver Session** = Quelle der Wahrheit für alles Live: Initiative, HP, verbundene Spieler, Chat-/Erzähl-Log. Ein "Raum" pro laufender Kampagnen-Sitzung.
- **D1** (SQL) für dauerhafte Daten: User, Kampagnen, Charaktere, Welt-Einträge, Bestiary, Content-Bibliothek (SRD + Homebrew, mit Lizenz-Flag pro Eintrag).
- **R2** für Dateien: Charakterbilder, Kartenbilder (relevant ab Battle-Map-Sub-Projekt).
- **KI-DM:** Cloudflare Agents SDK als Wrapper um die Claude API (Anthropic). Kontext wird aus D1 + aktuellem Session-Zustand zusammengestellt, Antwort wird live an alle Clients gestreamt.

**Datenfluss-Beispiel:**
Spieler-Aktion → Session-Durable-Object aktualisiert State → KI-DM (oder wartender Mensch-DM) generiert Reaktion → Live-Stream an alle verbundenen Clients → periodischer Snapshot nach D1.

**Token-Kosten-Strategie (kritisch für Hobby-Projekt-Budget):** Niemals die komplette Kampagnenhistorie pro KI-Zug mitschicken. Kontext = aktuelle Szene + zusammengefasste Vorgeschichte (Summarization) + gezielt relevante Lore-Einträge. Zusätzlich ein Token-Budget pro Session/Tag als Sicherheitsnetz gegen Kostenexplosion.

**Regelwerk-Versionierung:** Jede Kampagne trägt ein `ruleset`-Feld (`2024` | `2014`). Content-Einträge (Zauber, Klassenfeatures etc.) sind an ein Ruleset gebunden. Die reinen *Daten* für beide Regelwerke sind über Open5e (siehe Abschnitt 5, Sub-Projekt 1) fast gleichzeitig verfügbar — der eigentliche Aufwand liegt in der *Regel-Berechnungslogik* pro Ruleset (Sub-Projekt 2), deshalb bleibt der Start-Fokus dort klar auf 2024.

## 5. Sub-Projekte & Reihenfolge

Jedes Sub-Projekt bekommt eigenen Spec (`docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`) vor Implementierung.

1. **Content-Foundation** — SRD 5.2 (+ später 5.1) strukturiert einlesen (via Open5e), Lizenz-Flag pro Content-Eintrag, Datenmodell-Platz für Homebrew (Eingabe-UI folgt erst in Sub-Projekt 3)
2. **Rules Engine** — Berechnungslogik (Modifier, AC, Zauberslots, Proficiency), reine/testbare Funktionen, ruleset-versioniert
3. **Charaktererstellung & -verwaltung** — Char-Sheet-UI, Level-Up-Flow, Inventar
4. **Kampagnen- & Weltverwaltung** — mehrere Kampagnen, NPCs, Orte, Fraktionen, Lore
5. **Encounter & Bestiary** — Gegner-Datenbank, Encounter-Builder
6. **Dice & Combat-Tracker** — Würfelwürfe, Initiative, Status-Effekte (textbasiert, kein Grid)
7. **KI-Dungeon-Master** — Story-/NPC-Generierung, Adjudikation, mit Möglichkeit zum Mensch-Override
8. **Sessions & Multiplayer** — Accounts, Rollen (DM/Spieler/KI-DM), Echtzeit-Sync über mehrere Clients
9. **Battle-Map (VTT)** — Grid, Tokens, Fog-of-War, Karten-Upload — bewusst spät, eigenständiges Großprojekt

**Warum diese Reihenfolge:** Solo-first. Erst die Datenbasis, dann ein einzelner Charakter spielbar, dann die Welt drumherum, dann Kampf-Mechanik, dann KI-DM draufsetzen, dann erst Mehrbenutzer-Komplexität, Battle-Map ganz zuletzt, weil sie ohne Charaktere/Kampagnen/Encounter nichts hat, worauf sie zeigen kann.

## 6. Testing-Strategie (grob)

- Rules Engine: reine Funktionen, isoliert unit-testbar (kein Infra-Bezug)
- Worker-Endpunkte: Vitest + Miniflare (lokale Cloudflare-Simulation)
- KI-DM-Qualität: nicht automatisierbar, manuelles Playtesting

## 7. Offene Punkte für spätere Sub-Projekt-Specs

- Auth-Methode (Sub-Projekt 8)
- Genaues Datenmodell für Content-Einträge inkl. Lizenz-Flag (Sub-Projekt 1)
- Summarization-Strategie für KI-Kontext im Detail (Sub-Projekt 7)

# DnDimension — Master Vision & Architektur

**Status:** Aktualisierte Master Vision<br>
**Erstellt:** 2026-08-26<br>
**Aktualisiert:** 2026-08-28<br>
**Scope:** Gesamtvision und Architekturprinzipien. Verbindliche Release-Gates stehen in der [Release-Roadmap](../product/roadmap.md); konkrete Features erhalten eigene Specs.

## 1. Vision

Eine Web-App, die Spieler und menschliche Dungeon Master beim vollständigen D&D-5e-Ablauf unterstützt, ohne dass sie das Regelwerk auswendig kennen müssen. Die App übernimmt Buchhaltung wie Werte, Ressourcen, Initiative und Regeln. Das erste stabile Produkt v1.0 funktioniert local-first, ohne Accountzwang und ohne KI. Accounts und Gruppen folgen in v1.x, visuelle/VTT-Funktionen in v2.x und ein quellengebundener KI-DM erst in v3.x.

**Leitprinzip: Zugänglichkeit vor Regelkenntnis.** Jede Design-Entscheidung wird daran gemessen, ob sie jemandem ohne D&D-Erfahrung hilft, trotzdem ein regelkonformes Spiel zu erleben. Die App erklärt progressiv und übernimmt Rechen-/Zustandsarbeit; kreative Entscheidungen bleiben bei Spielern und DM. Spätere KI schlägt vor und führt, wird aber nie unbemerkt zur Quelle der Wahrheit.

**Erlebnisprinzip: Tabletop first, digital clarity second.** DnDimension strebt gemäß [DEC-003](../decisions/DEC-003-tabletop-authenticity-and-inspiration.md) die Glaubwürdigkeit einer echten D&D-Sitzung an. Digitale Rollenspiele und Mods dürfen Klarheit, Feedback und Komfort inspirieren, aber keine Regeln unmarkiert verändern und keine geschützten Inhalte oder markanten Gestaltungen liefern.

Nutzer:innen können mehrere Kampagnen parallel anlegen und verwalten, mit eigener Welt und eigenen Charakteren. v1.0 ist fachlich **2024-first**. Jede Kampagne und jeder Content-Eintrag trägt trotzdem von Beginn an einen Regelstand. Eine spätere 2014-Kompatibilität wird erst nach Stabilisierung des 2024-Kerns als vollständig geprüfte, kampagnenspezifische Einstellung angeboten; ein halbfertiger Auswahlpunkt ist ausgeschlossen.

## 2. Abgrenzung zum Markt

| Plattform | Stärke | Lücke, die wir füllen |
|---|---|---|
| Offizielle digitale Regeltools | verlässliche Inhalte und Charakterverwaltung | DnDimension fokussiert einen durchgängigen Player-/DM-Arbeitsablauf |
| AI-Game-Master-Apps | niedrigschwelliges Storytelling | DnDimension plant strukturierte Regeln, Quellen und portablen Kampagnenzustand |
| Etablierte VTTs | starke Karten-, Token- und Erweiterungssysteme | DnDimension priorisiert zunächst Zugänglichkeit und integrierte Buchhaltung |

Die Abgrenzung ist eine Produkt-Hypothese und wird vor v1.0 durch aktuelle Marktanalyse und Nutzertests überprüft. Zielbild: regelbewusste Kern-App, später visuelles Spiel und erst danach kontrollierte KI.

## 3. Content- & Lizenzstrategie

- **SRD 5.1** und **SRD 5.2.1** stehen unter **CC-BY-4.0** und bilden mit korrekter Attribution die veröffentlichbare Basis. Inhalte werden als strukturierte Daten, nicht als PDF-Volltext, gepflegt.
- Die offizielle SRD-Fassung ist fachlich maßgeblich. Open5e kann als strukturierter Importkandidat dienen, wird aber versioniert importiert und gegen das offizielle SRD geprüft. Drittanbieter-Dokumente werden nicht durch einen breiten Open5e-Import eingeschleppt.
- Das SRD ist bewusst nicht identisch mit allen Optionen kommerzieller Regelbücher. Fehlende Optionen werden sichtbar als nicht verfügbar behandelt; private Referenzen werden nicht kopiert. Homebrew und private Eingaben folgen kontrolliert ab v1.1.
- Der v1.0-Character-Creator liefert gemäß [DEC-002](../decisions/DEC-002-v1-character-content-boundary.md) ausschließlich eingebauten SRD-5.2.1-Content; private PDFs sind weder Build-Quelle noch Laufzeitvoraussetzung.
- **PHB-PDFs (2014 & 2024)** bleiben strikt proprietär. Volltext daraus wandert **nie** ins Repo — unabhängig davon, ob das Repo privat oder öffentlich ist. Sie dienen uns nur als Referenz beim manuellen Nacharbeiten von Strukturen/Konzepten, nicht als Datenquelle zum Kopieren.
- **Homebrew/eigene Inhalte** (z.B. selbst erfundene NPCs, Encounter, Hausregeln) leben ausschließlich im Laufzeitspeicher des Nutzers (lokal; ab v1.2 optional im Cloud-Adapter), nie als Git-Commit. Damit bleibt das Repo unabhängig vom Sichtbarkeits-Status sauber.
- Attribution-Hinweis für SRD-Inhalte wird fest im Footer/Impressum der App verankert.
- **Repo ist aktuell privat.** Ein späterer Wechsel zu public ist möglich, ohne Architektur zu ändern, weil Content-Trennung von Anfang an sauber ist.

## 4. Architektur

**v0.x-v1.1 Frontend:** React + TypeScript mit local-first Persistenz. Regeln und Domainlogik bleiben in eigenen Paketen; die App muss für Kernfunktionen nicht online sein.

**Backend ab v1.2:** Cloudflare Workers oder eine gleichwertige Adapterimplementierung.
- **Durable Object pro aktiver Session** = Quelle der Wahrheit für alles Live: Initiative, HP, verbundene Spieler, Chat-/Erzähl-Log. Ein "Raum" pro laufender Kampagnen-Sitzung.
- **D1** (SQL) für dauerhafte Daten: User, Kampagnen, Charaktere, Welt-Einträge, Bestiary, Content-Bibliothek (SRD + Homebrew, mit Lizenz-Flag pro Eintrag).
- **R2** für Dateien: Charakterbilder, Kartenbilder (relevant ab Battle-Map-Sub-Projekt).
- **KI ab v3.0:** Provider-Adapter statt harter Bindung an ein einzelnes Modell. Kontext wird aus strukturiertem Zustand und zugelassenem Retrieval zusammengestellt.

**Datenfluss local-first:** Nutzeraktion → validierter Domain-Command → lokaler State/Events → persistenter Snapshot/Export.<br>
**Datenfluss Multiplayer:** Client-Command → serverseitig autorisierter Session-State → Live-Update → persistenter Snapshot.<br>
**Datenfluss KI:** bestätigter Zustand → gezieltes Retrieval → Modellvorschlag → Validierung/Override → State-Änderung.

**Token-Kosten-Strategie (kritisch für Hobby-Projekt-Budget):** Niemals die komplette Kampagnenhistorie pro KI-Zug mitschicken. Kontext = aktuelle Szene + zusammengefasste Vorgeschichte (Summarization) + gezielt relevante Lore-Einträge. Zusätzlich ein Token-Budget pro Session/Tag als Sicherheitsnetz gegen Kostenexplosion.

**Regelwerk-Versionierung:** Jede Kampagne trägt ein `ruleset`-Feld; v1.0 akzeptiert zunächst `2024`. Content-Einträge (Zauber, Klassenfeatures etc.) sind an einen Regelstand gebunden. Ein späterer Wert `2014` benötigt einen eigenen, geprüften Content-Adapter und eigene Regeltests; das Datenmodell bereitet ihn vor, verspricht ihn aber nicht automatisch für v1.0.

## 5. Capability-Reihenfolge

Die exakten Versionen und Exit-Kriterien stehen in der Roadmap. Capability-Specs liegen in `docs/spec-planning/`.

1. Project, Content und Data Foundation (v0.1-v0.2)
2. Rules Engine (v0.3)
3. Charakter-Slice (v0.4)
4. Kampagnen-/DM- und Session-Slices (v0.5-v0.6)
5. integrierte Alpha, Beta und stabiles local-first Release (v0.7-v1.0)
6. Settings/Homebrew, Accounts, Sharing und Gruppen (v1.1-v1.5)
7. visuelle Experience und VTT (v2.x)
8. AI Foundation, Solo-DM und Qualitätshärtung (v3.x)
9. optionale Plattformfähigkeiten erst bei validiertem Bedarf (v4.0)

**Warum diese Reihenfolge:** Erst stabile Daten und Regeln, dann sichtbare vertikale Slices. Das lokale Produkt validiert den Nutzen ohne Account-, Realtime-, Visual- oder KI-Komplexität. Multiplayer, VTT und KI bauen anschließend auf denselben bestätigten Zustandsmodellen auf.

## 6. Testing-Strategie (grob)

- Rules Engine: reine Funktionen, isoliert unit-testbar (kein Infra-Bezug)
- Worker-Endpunkte: Vitest + Miniflare (lokale Cloudflare-Simulation)
- KI-DM-Qualität: automatisierte Szenario-Evals plus manuelles Playtesting ab v3.0

## 7. Offene Punkte für spätere Sub-Projekt-Specs

- Auth- und Sync-Methode (v1.2-Spec)
- genaues Datenmodell für Content-Einträge inkl. Lizenz-Flag (v0.2-Spec)
- Summarization-, Retrieval- und Eval-Strategie (v3.0-Spec)

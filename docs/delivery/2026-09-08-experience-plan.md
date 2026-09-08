# Ausbauplan: vom Designsystem zum Kampagnenraum

**Stand:** 2026-09-08 · **Status:** vorgeschlagene Arbeitspakete; keine geänderten Milestones, neuen Kalenderzusagen oder abgeschlossenen Implementierungsissues

**Design:** [Lebendiger Kampagnenraum](../superpowers/specs/2026-09-08-immersive-experience-design.md) · **Evidenz:** [September-Review](../research/2026-09-08-experience-review.md)

## 1. Anschluss an die vorhandene Roadmap

DEC-001 bis DEC-010 und die [Release-Roadmap](../product/roadmap.md) bleiben die akzeptierte Baseline. Die räumliche Gestaltung wird jetzt konkreter geplant. Produktives Vorziehen von 3D oder KI ist damit nicht automatisch beschlossen.

Die vorhandene UI-Foundation #69 ist bereits in einem separaten Worktree bearbeitet. Vor weiterer Umsetzung dort sind dessen aktueller Diff, Tests und offene Befunde zu prüfen. Der September-Plan überschreibt oder merged diesen Stand nicht.

## 2. Nächste überprüfbare Pakete

| ID | Ergebnis | Umfang und Abhängigkeit | Abnahme |
|---|---|---|---|
| EXP-01 | visuelles Storyboard | sechs Bilder aus dem Design; eigene Beispielkampagne; zunächst 2D | Raum, Charakter und Session bilden erkennbar denselben Kontext |
| EXP-02 | begrenzter Navigationsprototyp | nach Storyboard-Review; Raum → Figurenbuch → Fortsetzen, synthetische Daten | Direktnavigation, Zurück und reduzierte Bewegung funktionieren; klar als Demo gekennzeichnet |
| EXP-03 | Nutzertest Raum/Atlas | gleicher Inhalt, gleiche Aufgaben; mindestens fünf Testpersonen, darunter Neulinge | Aufgabenzeit, Fehlwege, Bewegungsverträglichkeit und Immersion dokumentiert |
| EXP-04 | Foundation anschließen | #69 nach dessen eigenen Gates prüfen; Komponenten des Prototyps darauf abbilden | keine zweite Palette, Buttonfamilie oder Fokuslogik |
| EXP-05 | echter Character Slice | nach Content-, Domain-, Persistenz- und Rules-Gates | gültige Figur, erklärbare Werte, Entwurf fortsetzen; keine Demo-Logik in Produktionszustand |
| EXP-06 | echter Campaign-/Session-Pfad | bestehende v0.5/v0.6-Abhängigkeiten | anlegen → vorbereiten → spielen → pausieren → identisch fortsetzen |
| EXP-07 | optionaler 3D-Nachweis | erst nach positivem Raumtest; eine kleine Szene, feste Kamerapositionen | gleiche Aufgaben wie DOM, Budgets und Grafikfehler-Fallback bestanden |

EXP-01 bis EXP-03 prüfen das Erlebnis früh. Sie ersetzen weder die Fachspikes noch die bestehenden Release-Gates. EXP-07 erhält erst nach Nutzennachweis eine verbindliche Release-Zuordnung.

## 3. Konkrete Aufgaben im Designvergleich

1. Die zuletzt gespielte Kampagne finden und fortsetzen.
2. Einen Charakterentwurf öffnen, eine Wahl ändern und die Folgen erklären.
3. Einen bekannten NPC und dessen Verbindung zu einem Ort finden.
4. Als DM einen Hinweis vorbereiten und bewusst freigeben.
5. Nach Unterbrechung erkennen, wer handelt und welche Entscheidung offen ist.

Beide Varianten erhalten dieselben Inhalte. Gemessen werden Erfolg, Zeit, Umwege und Hilfebedarf. Nach jeder Variante werden Orientierung und Atmosphäre kurz bewertet. Die Reihenfolge der Varianten wird gewechselt, damit Lerneffekte nicht nur einer Variante helfen.

Vorgeschlagenes Gate: mindestens vier von fünf Personen schaffen jede Kernaufgabe ohne externe Hilfe; keine Aufgabe ist im Raum im Median mehr als 20 % langsamer als in der direkten Ansicht. Das ist ein erster Entscheidungstest, kein statistischer Nachweis für alle Nutzer. Negative Ergebnisse führen zu Anpassung oder zur 2D-Variante.

## 4. Technische Abnahme des späteren Prototyps

- Gleiche Route und gleiche sichtbare Daten bei Raumobjekt, Link und Browser-Zurück.
- Mehrfachklick und unterbrochene Kameraanimation erzeugen keine doppelte Aktion.
- Tastatur und Touch erreichen alle Ziele; kein Drag oder Hover ist zwingend erforderlich.
- Reduced Motion entfernt räumliche Bewegung, ohne Inhalte zu verlieren.
- Fehlende Bilder, deaktiviertes WebGL und verlorener Grafik-Kontext führen zur einfachen Ansicht.
- DM- und Spieleransicht bleiben auch bei Übergängen und Suchvorschlägen getrennt.
- Intro wird übersprungen; aktive Sitzung kann direkt geladen werden.
- Größe, Startzeit und Framezeiten werden gemessen, nicht aus der Gestaltung geschätzt.

## 5. Fachlicher Nachweis des ersten echten Spiels

Eine eigens verfasste kleine Referenzsitzung muss Social, Exploration und Combat verbinden. Sie enthält einen bekannten NPC, einen verborgenen Hinweis, eine freie Spielerhandlung, einen nachvollziehbaren Wurf, eine Ressourcenänderung und ein mögliches Ende ohne vollständige Vernichtung der Gegner.

Der Zustand wird vor und nach Reload verglichen. Eine bestätigte Korrektur bewahrt ihre Herkunft. Der Abschluss zeigt getrennte Rückblicke und übernimmt Fortschritt genau einmal. Raumdekoration, Bilder und Animationen können vollständig abgeschaltet sein, während derselbe Nachweis besteht.

## 6. Asset- und Wartungsplan

Zuerst ein Raum, wenige feste Blickwinkel und eine eigene Beispielkampagne. Dafür werden eine Raumsilhouette, Tisch/Instrumente, Lichtregie und klar beschriftete Interaktionspunkte benötigt. Die erste Fassung verwendet keine große Sammlung von Figurenmodellen, Biomen, animierten NPCs oder pro Kampagne generierten Räumen.

Jedes Produktionsasset erhält Urheber-/Lizenz- beziehungsweise Erstellungsnachweis, Quelldatei, optimierte Ableitung und Größenangabe. Ein neues Theme ändert zunächst Palette und Hintergrund; ein völlig anderer Raum ist ein eigenes Assetpaket. Textlabels und Daten werden weiterhin als DOM gerendert.

## 7. Risiken und Gegenmaßnahmen

| Risiko | Gegenmaßnahme | Bestehender Bezug |
|---|---|---|
| Der Raum wird ein langwieriges eigenes Spielprojekt. | feste Ansichten, ein Raum, frühe Aufgabenprüfung | R-01/R-15 |
| Die Oberfläche ist schön, aber im Alltag langsam. | direkter Zugang und Vergleich mit Atlasansicht | R-08/R-26 |
| Bewegung verursacht Unwohlsein oder erschwert Lesen. | unabhängiger einfacher Modus; OS-Präferenz respektieren | R-12/R-26 |
| Grafik verursacht große Downloads oder Dauerauslastung. | lazy loading, kleine Pakete, bedarfsabhängiges Rendern | R-23/R-26 |
| Übergänge zeigen geheime Informationen. | sichere Projektionen; Rollenwechsel ohne Screenshots der alten Ansicht | R-17 |
| Die visuelle Demo wird für eine fertige App gehalten. | Demo-Zustand sichtbar; fachliche Abnahme separat | R-19/R-20 |

## 8. Dokumentationspflege bei Freigabe

Wenn der Raum als produktiver Slice freigegeben wird, werden eine neue Decision und gezielte Ergänzungen zu NFR-019 sowie erforderlichen Navigationsanforderungen angelegt. Dann werden Roadmap, betroffene Creator-/Session-Specs, Risiko- und Traceability-Matrix konsistent aktualisiert. EXP-IDs sind bis dahin lokale Planungskennungen, keine bereits angelegten GitHub-Issues.

Ein Vorziehen der KI benötigt einen eigenen Scope-Entscheid. Technisch muss KI auf Regeln, Quellen und Sessionzustand aufsetzen; eine Advanced-VTT-Engine ist dafür keine Voraussetzung. Releasepriorität und technische Abhängigkeit sollen im nächsten Roadmap-Refinement getrennt dargestellt werden.

## 9. Empfohlener nächster Schritt

EXP-01: sechs konkrete Ansichten ausarbeiten und Raum versus Atlas sichtbar vergleichen. Danach kann ein eng begrenzter Navigationsprototyp umgesetzt werden. Die September-Dokumente sind das prüfbare Planungsergebnis; neue Produktimplementierung wurde hierfür nicht vorgenommen.

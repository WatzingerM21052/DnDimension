# September-Review: Produkt, Quellen und Erlebnis

**Stand:** 2026-09-08 · **Zweck:** nachvollziehbare Grundlage für den [Kampagnenraum-Entwurf](../superpowers/specs/2026-09-08-immersive-experience-design.md).

## 1. Tatsächlich vorgefundener Stand

Der Hauptcheckout stand zu Beginn auf `7b7d7c9`, lokal einen Commit vor `origin/master`. Unter `code/` existiert der technische Bootstrap. Ein weiterer Worktree auf `codex/ui-quality-foundation` stand bei Prüfung auf `744b1cd` und enthält umfangreiche UI-Arbeit. Diese Prüfung ist kein Test- oder Fertigstellungsnachweis dieses Branches.

Der ältere `docs`-Branch zeigte auf `9dadac8` und enthielt damit nicht die gesamte neuere Dokumentation. Er ist ein historischer Stand, kein automatisch mitlaufendes Backup. Ein neuer Planungsbranch bewahrt die September-Arbeit separat.

Im Hauptcheckout wurden 49 Markdown-Dateien unter `docs/` und `prompts/` erfasst. Produktunterlagen, Architekturentscheidungen, Domain-/Rules-/Creator-/Session-Specs, Designbasis, Governance, Forschungsnotizen und Prompts wurden für diese Überarbeitung herangezogen. Die langen Ausführungspläne wurden abschnittsweise geprüft; teilweise gekürzte Toolausgaben sind keine vollständige Zeile-für-Zeile-Codeprüfung. Die Änderung ist eine Produkt-/Designplanung, kein vollständiges Repository-Audit.

## 2. Lesetiefe der Bibliothek

Die technische Inventur hat **100 PDFs mit insgesamt 21.473 PDF-Seiten** geöffnet. Darin stecken auch alternative Fassungen, Auszüge, Karten und ältere Editionen; die Zahl entspricht nicht 100 unabhängigen Kernregelbüchern.

Pro Datei wurden bis zu fünf Anfangsseiten auf extrahierbaren Text untersucht. Das ermittelt Zugang und grobe Einordnung, nicht die inhaltliche Prüfung des gesamten Werks. Die erzeugten lokalen Arbeitsdaten liegen ausschließlich unter dem ignorierten `tmp/research-september/`.

| Quelle | In diesem Review tatsächlich verwendet | Grenze |
|---|---|---|
| PHB 2024, reguläre EN-PDF | ausgewählte extrahierte Passagen von PDF-Seite 3 und 35–40: Rollenverständnis und Charaktererstellung | Ausgabe teilweise gekürzt; OCR-Fehler möglich; keine Gesamtlektüre |
| DMG 2024, EN-Weblayout | PDF-Seiten 1–5: Inhaltsübersicht, DM-Rollen, Hilfsmittel und Spielumgebung | keine vollständige Kapitelprüfung zu Kampagnen, Bastions oder Encounters |
| SRD 5.2.1 DE | technische Öffnung und Anfangsseitenprobe; vorhandene SRD-basierte Specs als Planungsgrundlage | keine neue vollständige Regelverifikation |
| Kernbücher 2014 und weitere 2024-Fassungen | Seitenzahl und Textzugang geprüft | keine neue mechanische Editionsvergleichsmatrix |
| Abenteuer, ältere Editionen, Drittanbieter, Handouts und Karten | inventarisiert, Anfangsseiten auf Textzugang geprüft | nicht als vollständig gelesen oder als autoritative 2024-Regeln behandelt |

Bei mehreren Scan-Dateien war in den untersuchten Anfangsseiten kein Text extrahierbar, unter anderem bei Curse of Strahd, Keys from the Golden Vault und Lost Mine of Phandelver. Dies beweist weder, dass alle Seiten unlesbar sind, noch ersetzt es eine visuelle Prüfung. OCR oder gezieltes Rendern wird erst beim passenden fachlichen Slice vorgenommen.

Weitere Nicht-PDF-Formate wurden in diesem Durchgang nicht inhaltlich geprüft. Die Aussage „alle Bücher gelesen“ wäre daher falsch.

## 3. Erkenntnisse und Konsequenzen

| Befund | Produktkonsequenz |
|---|---|
| Das PHB verbindet Klassenwahl, Herkunft und spätere Detailentscheidungen. | Ein geführter Creator erklärt Abhängigkeiten und zeigt Auswirkungen; ein schöner Portraitgenerator genügt nicht. |
| Der DM ist unter anderem Erzähler, Schiedsrichter, Lehrender und Weltgestalter. | Die Oberfläche braucht Vorbereitung, Erklärung und flexible Auflösung neben Kampfverwaltung. |
| Das DMG unterscheidet gemeinsames Material und verborgene DM-Informationen. | Raumobjekte, Suche, Medien, Vorschauen und animierte Übergänge müssen dieselben Wissensgrenzen einhalten. |
| Die vorhandenen Specs modellieren alle drei Spielsäulen und Wiederaufnahme bereits ausführlich. | Neue Gestaltung sollte diese Modelle sichtbar machen; zusätzliche konkurrierende Datenmodelle sind unnötig. |
| Die vorhandene Designbasis schließt Parallax ausdrücklich nur im kleinen Foundation-Slice aus. | Ein späterer Raum-Slice ist möglich, ohne #69 mit 3D aufzublähen. |

## 4. Marktcheck, September 2026

Die folgenden Aussagen stammen aus öffentlich zugänglichen Produktseiten. Kein bezahlter Funktionsumfang und keine komplette Spielsession wurden praktisch getestet.

| Angebot | Belegt | Schluss für DnDimension |
|---|---|---|
| [D&D Beyond Maps](https://www.dndbeyond.com/games) | eigenes browserbasiertes VTT, Tokens, Initiative, Würfel und Fog of War | Die frühere Aussage „kein Battle-Map/VTT“ war falsch. Karten allein sind keine Differenzierung. |
| [Everweave](https://everweave.ai/) | bewirbt freie Handlungen, Würfel, Klassen, Fortschritt und eine reagierende Kampagnenwelt; nennt ein September-Update vom 03.09.2026 | Vorbild für niedrige Einstiegshürde; pauschales „kein echtes Regelgerüst“ ist durch diese Recherche nicht belegbar. Vollständige Regeltreue und Langzeitqualität bleiben ungetestet. |
| [Awwwards: 3D](https://www.awwwards.com/websites/3d/) | Sammlung räumlicher Webgestaltung | Referenzsammlung für visuelle Exploration; keine Evidenz für Bedienbarkeit einer mehrstündigen D&D-Sitzung. |

Unsere Differenzierung ist eine zu prüfende Hypothese: zusammenhängendes Kampagnenerlebnis, nachvollziehbare Regeln, zugängliche Bedienung und portable Zustände. Ein Marktvergleich darf Wettbewerbern keine ungeprüften Fähigkeiten absprechen.

## 5. Technische Referenzen

- [MDN: View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API): animierte Ansichtswechsel; progressive Nutzung und Browserprüfung im konkreten Spike.
- [MDN: Scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations): Bezug zwischen Scrollposition und Animation; mögliche Grundlage für optionale Tiefenwirkung.
- [Motion: useReducedMotion](https://motion.dev/docs/react-use-reduced-motion): Betriebssystempräferenz in React auswerten.
- [React Three Fiber: Scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance): bedarfsabhängiges Rendern und Performanceanpassung.

Keine neuen Paketversionen wurden installiert oder ohne Messung als geeigneter Ersatz für den bestehenden Stack festgelegt.

## 6. Planungsprobleme, die sichtbar bleiben müssen

1. **Erlebnisnachweis fehlt:** Viel Architektur ist beschrieben, aber ein Aufgabenvergleich von Raum und direkter Oberfläche fehlt. Ein kleiner Storyboard-/Prototyp-Test liefert hierfür bessere Evidenz als weitere allgemeine Featurelisten.
2. **Priorisierung und Abhängigkeit vermischt:** Der Delivery-Graph führt Advanced VTT vor AI Foundation. Das ist keine technische Voraussetzung; der Objektstrukturplan nennt passendere Abhängigkeiten. Vor dem KI-Refinement ist die Darstellung zu vereinheitlichen.
3. **Content-Unveränderlichkeit uneindeutig:** Content-Foundation erlaubt Überschreiben innerhalb eines Snapshots, während DEC-006 unveränderliche veröffentlichte Pakete fordert. Beim Import-Refinement muss gelten: identischer Input ist No-op, abweichender veröffentlichter Inhalt benötigt neue Revision.
4. **Review ist nicht Release-Abnahme:** Vorhandene Pläne und ein UI-Branch beweisen weder aktuelle CI-Ergebnisse noch funktionierende Charakter-, Kampagnen- oder KI-Flows.

## 7. Gezielter weiterer Leseplan

| Arbeitspaket | Nächste Primärlektüre | Verwertbares Ergebnis |
|---|---|---|
| Character Slice | vollständiger Erstellungsabschnitt des aktiven PHB plus SRD-Abgleich der tatsächlich ausgelieferten Optionen | editionsgetrennte Entscheidungs- und Abdeckungsmatrix mit genauen Seiten |
| Session Slice | DMG-Kapitel zu Spielleitung, Social, Exploration und Combat; SRD-Regelstellen | konkrete Szenen- und Grenzfalltests |
| Vorbereitung/Welt | DMG-Kampagnen-/Adventure-Kapitel und gezielt ein Abenteuer | eigenständig formulierter Vorbereitungspfad ohne Spoilerübernahme |
| Gegner | Monster-Manual-Einführung und ausgewählte SRD-Statblocks | Daten- und Aktionsvertrag; kein Import des gesamten privaten Bestiariums |
| 2014 später | PHB/SRD 2014 direkt gegen den freigegebenen 2024-Umfang | klare Unterschiede und Regressionstests |

Das Vorgehen spart Kontext und vermeidet die Verwechslung einer großen Textmenge mit geprüfter Regelabdeckung.

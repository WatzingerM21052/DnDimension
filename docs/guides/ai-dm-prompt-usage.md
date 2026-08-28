# Anleitung: AI-DM Prompts verwenden

## Empfohlener Prompt

Für Solo-Spiel wird [DnDimension Solo AI-DM Master Prompt v2](../../prompts/dnd-solo-ai-dm-master-prompt-v2.md) verwendet. Der [Gruppenmodus](../../prompts/dnd-group-ai-dm-master-prompt-experimental.md) ist ein Zusatz und bleibt experimentell, bis die App Identitäten, getrenntes Wissen, Realtime und dauerhaften Zustand technisch bereitstellt.

## Schnellstart

1. Neuen Chat mit möglichst großem Kontextfenster öffnen.
2. Solo-Master-Prompt vollständig als System- oder erste Nachricht einfügen.
3. Nur die für die Kampagne relevanten Dateien anhängen: Regelwerk, Charakterbogen, Abenteuer, Karten oder Handouts.
4. Prüfen, ob die KI die Dateien ausdrücklich als zugänglich bestätigt.
5. Session Zero und Charaktererstellung durchführen.
6. Nach längeren Abschnitten `/save` verwenden und den Speicherblock lokal sichern.

## Lokale Bibliothek

Ein normaler Webchat sieht `private-library/` nicht automatisch. Drei mögliche Betriebsarten:

| Umgebung | Vorgehen |
|---|---|
| Chat mit Dateianhang | benötigte PDFs/Bilder gezielt anhängen |
| lokaler Agent mit Workspace-Zugriff | Agent darf Bibliothek inventarisieren, muss tatsächlichen Zugriff melden |
| spätere DnDimension-App | nur zugelassene strukturierte Inhalte und Retrieval-Ergebnisse an die KI geben |

Nicht die gesamte 2+ GiB-Bibliothek gleichzeitig in einen Chat laden. Für Charaktererstellung genügt normalerweise das passende Regelwerk. Abenteuer, Karte und relevante DM-Ressource werden bei Bedarf ergänzt.

## Empfohlene Dateisets

### 2024 freie Kampagne

- SRD 5.2.1 DE;
- optional das private Player's Handbook für eigene vollständige Optionen;
- eigene Kampagnennotizen und Karte.

### 2014 veröffentlichte Kampagne

- 2014 Spielerhandbuch/SRD;
- genau das verwendete Abenteuer;
- benötigte Handouts und Karten;
- optionale Erweiterung nur, wenn daraus Optionen zugelassen sind.

## Speichern und Fortsetzen

1. `/save` ausführen.
2. Speicherblock unverändert als `.md` sichern.
3. In einem neuen Chat zuerst Prompts, dann benötigte Quellen und anschließend `/load` mit Speicherblock einfügen.
4. Den von der KI rekonstruierten Zustand prüfen und erst danach bestätigen.

Der Speicherblock enthält keine vollständigen Buchinhalte. Er speichert nur Kampagnenzustand, Entscheidungen, Werte und Quellenkennungen.

## Quellenfehler erkennen

Warnsignale:

- Die KI behauptet, einen lokalen Pfad gelesen zu haben, obwohl kein Dateizugriff besteht.
- Sie nennt keine Edition oder vermischt 2014- und 2024-Begriffe.
- Sie gibt exakte Werte aus einer nicht zugänglichen proprietären Option aus.
- Eine Quellenangabe unterstützt die Aussage nicht.

Dann `/sources` und anschließend `/rule <Frage>` verwenden. Bei weiterem Konflikt die konkrete Quelle anhängen oder eine SRD-kompatible Entscheidung wählen.

## Gruppenmodus

Für einen Test zuerst den Solo-Prompt, danach das Gruppen-Overlay einfügen. Alle Spieler verwenden eindeutige Namenspräfixe. Ein gemeinsamer Chat bietet keine echte Geheimhaltung; persönliche Geheimnisse oder sensible Grenzen gehören nicht ungeschützt in denselben Kanal.

## Prompt-Änderungen

- Version im Prompt erhöhen.
- Änderung und Motivation im Prompt-System-Design dokumentieren.
- mindestens Charaktererstellung, Regelkonflikt, Kampf, Save/Load und Sicherheitsbefehl testen.
- Stable Candidate erst nach mehreren vollständigen Playtests zu Stable erklären.

# DEC-004: Campaign as Rules and Knowledge Boundary

**Status:** Accepted<br>
**Datum:** 2026-08-28<br>
**Owner:** WatzingerM21052<br>
**Betroffene Releases/Requirements:** v0.2-v3.5; Z-03, Z-05, Z-11 bis Z-13; FR-004, FR-021, FR-023 bis FR-028; NFR-012; CON-003, CON-010, CON-012, CON-013

## Kontext

Eine Kampagne verbindet Regeln, Charaktere, Erwartungen, Weltwissen und Sitzungszustand. Würden diese Informationen nur als lose Notizen gespeichert, könnten Regeländerungen Charaktere unbemerkt ungültig machen, DM-Geheimnisse in Spieleransichten erscheinen und spätere Gruppen- oder KI-Funktionen keinen verlässlichen Kontext erhalten.

v1.0 bleibt local-first und wird von einem menschlichen DM auf einem lokalen Gerät verwaltet. Das Datenmodell muss die fachlichen Grenzen trotzdem von Beginn an durchsetzen, statt sie erst mit Accounts oder KI nachzurüsten.

## Entscheidung

Jede Kampagne ist eine eigenständige, versionierte Fach- und Wissensgrenze mit stabiler ID.

### Verbindliche Bestandteile

- **Kampagnenidentität:** Name, Kurzbeschreibung, Format, Status und zeitliche Metadaten.
- **Regelprofil:** stabiler Ruleset-Identifier, Content-/Source-Snapshot, unterstützter Startlevel, Fortschrittsart und aktivierte Kampagnenregeln.
- **Session-Zero-Vereinbarung:** Ton, Themen, Spielschwerpunkte, Tischkonventionen, Grenzen und weitere gemeinsam getroffene Absprachen mit Revisionsstand.
- **Wissenssichtbarkeit:** mindestens `player_facing` und `dm_only`; DM-Inhalte dürfen niemals allein durch UI-Konventionen geschützt sein.
- **Lokale Gruppe:** Verweise auf lokale Charaktere und optionale Teilnehmerbezeichnungen, ohne Charakterdaten zu duplizieren.
- **Lebenszyklus:** Draft, Active, Paused, Completed und Archived; Zustandswechsel sind bewusst und nachvollziehbar.

### Regel- und Änderungsprinzipien

- v1.0 erstellt ausschließlich Kampagnen mit dem vollständig unterstützten 2024-Regelprofil und SRD-5.2.1-Source-Snapshot.
- Ruleset, Quellenprofil oder kompatibilitätsrelevante Regeln ändern sich nach Aktivierung nicht still. Eine Änderung erzeugt eine Vorschau der Auswirkungen und eine neue Revision.
- Zugeordnete Charaktere werden gegen das Kampagnenprofil geprüft. Abweichungen werden erklärt; sie werden weder automatisch umgebaut noch gelöscht.
- Session Zero ist kein einmaliges, unveränderliches Formular. Vereinbarungen können später bewusst überarbeitet werden, wobei der vorherige Stand nachvollziehbar bleibt.
- Ein Kampagnenarchiv bewahrt alle abhängigen Daten. Endgültiges Löschen ist eine getrennte, ausdrücklich bestätigte Aktion mit vorherigem Exporthinweis.

### Veröffentlichte Abenteuer und private Quellen

Eine Kampagne darf Titel, eigene Zusammenfassung, Quellenkennung und privaten Ablagehinweis eines veröffentlichten Abenteuers speichern. Proprietärer Abenteuertext, Karten oder Handouts werden nicht in veröffentlichte App-Daten kopiert oder automatisch aus privaten PDFs importiert.

### Vorbereitung späterer Capabilities

- Accounts und Gruppen erhalten später Berechtigungen auf denselben Wissensgrenzen; sie definieren keine zweite Kampagnenwahrheit.
- Das VTT referenziert Kampagnen-, Szenen- und Encounter-Zustand, ohne parallele Regeln zu führen.
- Eine spätere KI sieht nur den für ihre Rolle erlaubten Kampagnenkontext und darf DM-Wissen nicht in Spielerantworten offenlegen.

## Abnahmekriterien

- Eine gespeicherte und erneut geöffnete Kampagne besitzt identische Regel-, Sichtbarkeits- und Session-Zero-Revisionen.
- Eine Player Preview enthält in automatisierten Negativtests keine `dm_only`-Felder.
- Das Zuweisen eines inkompatiblen Charakters erzeugt eine verständliche Abweichungsliste und keine stille Mutation.
- Eine Regelprofiländerung zeigt betroffene Charaktere und Einstellungen vor Bestätigung.
- Archivieren erhält verknüpfte Charakter-, Notiz- und spätere Sitzungsreferenzen.
- Export und Restore bewahren IDs, Revisionen und Wissensgrenzen.

## Folgen und Trade-offs

- Der v0.5-Datenentwurf ist anspruchsvoller als ein freies Kampagnen-Notizfeld.
- Versionierte Regeln und Sichtbarkeitsgrenzen reduzieren spätere Migrations-, Multiplayer- und KI-Risiken deutlich.
- Tiefer Weltbau bleibt ein eigener Ausbau; der Campaign Creator liefert zunächst einen spielbaren Ausgangspunkt.
- Datenschutz für individuelle Gruppenmitglieder folgt mit Accounts. v0.5 speichert keine vertraulichen personenbezogenen Profile als Ersatz dafür.

## Ersetzt / ersetzt durch

Keine vorherige Decision. Diese Entscheidung konkretisiert DEC-001 und DEC-003 für Kampagnen.

# Business Case

**Status:** Hypothesen- und Entscheidungsgrundlage, keine Umsatzprognose<br>
**Bewertungszeitpunkt:** vor v1.0 und erneut vor v3.0

## Nutzenhypothese

DnDimension reduziert Regelhürden und Verwaltungsarbeit, ohne den menschlichen Dungeon Master zu ersetzen. Differenzierung entsteht durch eine durchgängige Player-/DM-Experience, klare Editionstrennung, local-first Datenkontrolle und später eine quellengebundene KI.

## Zielgruppen

1. Neue Spieler, die einen verständlichen Charakter- und Regelassistenten benötigen.
2. Bestehende Spieler, die Charakter, Ressourcen und Kampagnen übersichtlich verwalten wollen.
3. Neue und erfahrene Dungeon Master, die Vorbereitung und Sitzungszustand bündeln möchten.
4. Später Solo-Spieler und Gruppen mit KI-Unterstützung.

## Kostenmodell

Die Rechnung wird pro Monat und pro aktivem Nutzer geführt:

```text
Monatliche Gesamtkosten =
  fixe Infrastruktur
  + Datenbank/Storage
  + Requests und Echtzeit-Verbindungen
  + E-Mail/Authentifizierung
  + Monitoring/Backups
  + KI-Eingabe- und Ausgabetokens
  + Entwicklungs- und Wartungszeit × interner Stundensatz
```

```text
Deckungsbeitrag pro zahlendem Nutzer =
  Nettoerlös pro Nutzer
  - variable Infrastrukturkosten
  - variable KI-Kosten
  - Zahlungs-/Vertriebskosten
```

```text
Break-even-Nutzer =
  monatliche Fixkosten / Deckungsbeitrag pro zahlendem Nutzer
```

## Szenarien

| Szenario | Produktumfang | Hauptkosten | Finanzielle Entscheidung |
|---|---|---|---|
| A: Privat/local-first | v0.1-v1.1 | Entwicklungszeit, minimale Hosting-/Domainkosten | Nutzen und Lernwert rechtfertigen Aufwand |
| B: Kleine geschlossene Gruppe | v1.2-v2.5 | Auth, Datenbank, Realtime, Storage, Support | monatliches persönliches Budgetlimit definieren |
| C: KI-gestütztes Produkt | v3.0-v3.5 | Tokens, Retrieval, Monitoring, Missbrauchsschutz | harte Nutzer-/Session-Limits und Preisexperiment erforderlich |
| D: Plattform | v4.0+ | Moderation, Compliance, Support, Partner-/Zahlungsprozesse | eigener Investitionsentscheid und rechtliche Prüfung |

## Erforderliche Eingabewerte vor einer belastbaren Rechnung

- verfügbare Entwicklungsstunden pro Monat;
- kalkulatorischer Stundensatz oder bewusst angesetzter Hobbywert;
- erwartete aktive Nutzer und Sitzungen;
- durchschnittliche Sitzungsdauer und KI-Tokenverbrauch;
- aktuelle Anbieterpreise zum Entscheidungszeitpunkt;
- gewünschtes Monatsbudget und maximal akzeptierter Verlust;
- Monetarisierungsmodell: kostenlos, Spende, Einmalkauf oder Abonnement.

## Go-/No-Go-Gates

- **v1.0:** Kernnutzen in Tests bestätigt; lokale Daten stabil; laufende Kosten innerhalb Hobbybudget.
- **v1.2:** Datenschutz- und Betriebskonzept akzeptiert; Cloudkosten messbar und begrenzt.
- **v3.0:** KI-Basissystem, Evals und Kostenmessung funktionieren; noch kein stabiler autonomer DM versprochen.
- **v3.5:** Tokenkosten pro Sitzung bekannt; Budgetlimit technisch erzwungen; Solo-DM-Qualitätsgates erfüllt.
- **v4.0:** Markt-, Lizenz-, Moderations- und Supportaufwand rechtfertigen Plattformausbau.

# DEC-003: Tabletop Authenticity and Inspiration Boundary

**Status:** Accepted<br>
**Datum:** 2026-08-28<br>
**Owner:** WatzingerM21052<br>
**Betroffene Releases/Requirements:** v0.3-v3.5; Z-02, Z-03, Z-11; FR-006, FR-008, FR-020 bis FR-022; NFR-011; CON-010, CON-011

## Kontext

DnDimension soll sich langfristig so detailgetreu wie sinnvoll wie eine echte D&D-Sitzung anfühlen. Digitale Rollenspiele wie Baldur's Gate 3 und deren Mod-Ökosystem zeigen zugleich, wie komplexe Charakterentscheidungen, Konsequenzen und Aktionen zugänglich präsentiert werden können. Tabletop-Regeln und Videospieladaptionen sind jedoch nicht identisch; unmarkiertes Vermischen würde Regeltreue, Spielerautonomie und rechtliche Abgrenzung gefährden.

## Entscheidung

DnDimension folgt dem Prinzip **Tabletop first, digital clarity second**.

### Verbindliche Produktprinzipien

- Der aktive D&D-Regelstand und die kampagnenspezifischen Entscheidungen sind die fachliche Wahrheit.
- Würfe, Modifikatoren, Quellen und Zustandsänderungen bleiben nachvollziehbar.
- Spielerhandlungen werden nicht automatisch erfunden oder vorweggenommen.
- Der menschliche DM behält kreative Kontrolle und kann automatisierte Zustände begründet korrigieren; Korrekturen werden protokolliert.
- Regelvarianten, Komfortregeln und Hausregeln sind explizite Kampagneneinstellungen und niemals stiller Standard.
- Detailtreue wird über Releases aufgebaut; sie hebt die Scope-Grenzen aus DEC-001 nicht auf.

### Zulässige Inspiration

DnDimension darf sich allgemein inspirieren lassen durch:

- klare Build-Vorschau und erkennbare Konsequenzen von Charakterentscheidungen;
- kontextuelle Erklärungen statt dauerhafter Informationsüberladung;
- sichtbare Aktionskosten, Erfolgsbedingungen und Zustände;
- schnelle, aber nachvollziehbare Würfel- und Kampfauflösung;
- optionale Komfort- und Kampagnenregeln mit klaren Auswirkungen;
- später eine atmosphärische, responsive und zugängliche Präsentation.

### Nicht zulässige Übernahme

- keine kopierten Assets, Texte, Charaktere, Geschichten, Sounds oder markanten UI-Kompositionen;
- keine als offizielle D&D-Regel dargestellte Videospiel- oder Mod-Mechanik;
- keine Abhängigkeit von Baldur's Gate 3, dessen Spieldateien oder Mods;
- keine stillschweigende Vereinfachung einer Tabletop-Regel nur für schnellere digitale Abläufe.

## Regel für optionale Mechaniken

Eine BG3-/Mod-inspirierte Mechanik kann später nur aufgenommen werden, wenn sie:

1. eigenständig formuliert und technisch unabhängig implementiert ist;
2. als optionale Haus- oder Komfortregel gekennzeichnet ist;
3. pro Kampagne aktivierbar und wieder deaktivierbar ist;
4. Auswirkungen vor Aktivierung erklärt;
5. nicht mit RAW-Tests und offiziellen Content-Daten vermischt wird;
6. einen Migrations- und Exportpfad besitzt.

## Abnahmekriterien

- Für jede automatische Regelentscheidung lässt sich Ursache, Quelle oder Kampagnenregel anzeigen.
- Kein optionales Regelprofil verändert eine bestehende Kampagne ohne Bestätigung.
- Ein DM-Override bewahrt vorherigen Wert, neuen Wert, Grund und Zeitpunkt im Sitzungslog.
- RAW- und Varianten-Tests laufen getrennt.
- Product- und Design-Reviews prüfen Inspiration auf Regelverwechslung und zu enge gestalterische Übernahme.

## Folgen und Trade-offs

- Manche Abläufe bleiben bewusster und erklärender als in einem reinen Videospiel.
- Komfortfunktionen benötigen zusätzliche Transparenz-, Einstellungs- und Testarbeit.
- Visuelle/cineastische Qualität wird v2-Aufgabe; v1 muss funktional und zugänglich sein, aber kein BG3-artiges Erscheinungsbild liefern.
- „Mit allem“ wird als langfristige Capability-Roadmap interpretiert, nicht als unbeschränkter v1.0-Scope.

## Ersetzt / ersetzt durch

Keine vorherige Decision. Diese Entscheidung konkretisiert die Vision, ohne DEC-001 oder DEC-002 zu erweitern.

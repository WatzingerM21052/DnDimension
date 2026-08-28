# Zielekatalog

## Zielsystem

| ID | Ziel | Messgröße | Zielwert / Gate | Priorität |
|---|---|---|---|---|
| Z-01 | Regel-Neulinge können starten | Abschlussrate geführter Charaktererstellung | ≥ 80 % in Usability-Tests ab v1.0 | Muss |
| Z-02 | Regelkonforme Charaktere | Validierungsfehler nach Abschluss | 0 bekannte P0-Regelfehler | Muss |
| Z-03 | Weniger DM-Buchhaltung | subjektive Vorbereitungs-/Verwaltungsentlastung | im Test mehrheitlich als hilfreich bewertet | Soll |
| Z-04 | Editionen bleiben getrennt | automatisierte Cross-Ruleset-Tests | 100 % der kritischen Regeln besitzen Ruleset-Kontext | Muss |
| Z-05 | Nutzerdaten bleiben kontrollierbar | Export-/Restore-Test | vollständiger Roundtrip ohne Datenverlust | Muss |
| Z-06 | Barrierearme Kernflüsse | WCAG-Prüfung | v1.0-Kernflüsse zielen auf WCAG 2.2 AA | Muss |
| Z-07 | Nachvollziehbare Quellen | Content ohne Herkunft/Lizenz | 0 veröffentlichte Datensätze ohne Source-Metadaten | Muss |
| Z-08 | Planbare Produktentwicklung | Issues mit Kriterien vor Sprint | 100 % der Ready-Issues erfüllen Definition of Ready | Muss |
| Z-09 | Kontrollierbare KI | unbelegte Regelbehauptungen in Eval-Suite | definierter Grenzwert vor v3-Release, keine kritischen Halluzinationen | Muss für v3 |
| Z-10 | Begrenzbare Betriebskosten | Budgetüberschreitung | harte Limits und Warnung vor v3-Release | Muss für v3 |
| Z-11 | Glaubwürdige Tabletop-Erfahrung | nicht erklärbare Regel-/Zustandsänderungen in Kernflüssen | 0 kritische Änderungen ohne sichtbare Ursache, Quelle oder bestätigte Kampagnenregel | Muss |
| Z-12 | Niedrige Einstiegshürde für neue DMs | Abschlussrate einer einfachen Kampagnenerstellung | ≥ 80 % ohne externe Hilfe in höchstens 15 Minuten im v0.5-Usability-Test | Muss |
| Z-13 | Verlässliche DM-Geheimhaltung | kritische `dm_only`-Information in Player-Preview-Tests | 0 Offenlegungen | Muss |

## Zielkonflikte

- **Regeltreue vs. Zugänglichkeit:** Oberfläche erklärt progressiv, die Rules Engine bleibt exakt.
- **Funktionsumfang vs. Lieferfähigkeit:** v0.5 bildet einen vertikalen Slice; Vollständigkeit folgt in v1.0.
- **Lokale Kontrolle vs. Multiplayer-Komfort:** local-first bis v1.0, optionale Accounts/Cloud ab v1.2 und Realtime-Gruppen ab v1.4.
- **Immersion vs. Informationsdichte:** Spielansicht bleibt fokussiert; Details sind kontextuell abrufbar.
- **KI-Qualität vs. Kosten:** Quellenabruf und Kontextbudget werden vor freien Langkontexten bevorzugt.

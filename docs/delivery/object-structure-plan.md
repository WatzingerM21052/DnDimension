# Objektstrukturplan

Der Objektstrukturplan beschreibt, **was** das Produkt am Ende umfasst. Er ist keine zeitliche Reihenfolge.

```text
DnDimension
├── Product Experience
│   ├── App Shell, Navigation und Onboarding
│   ├── Accessibility und Einstellungen
│   └── Designsystem und visuelle Sprache
├── Player Tools
│   ├── Charaktererstellung
│   ├── Charakterbogen und Level-up
│   ├── Inventar, Ressourcen und Zauber
│   └── Würfel und persönliche Notizen
├── Dungeon Master Tools
│   ├── Kampagnen- und Weltverwaltung
│   ├── NPCs, Fraktionen, Orte und Quests
│   ├── Bestiary und Encounter Builder
│   └── Session- und Combat-Tracker
├── Rules & Content
│   ├── Content-Registry und Quellenmetadaten
│   ├── Rules Engine 2024 (v1-Kern)
│   ├── optionale 2014-Kompatibilität
│   └── Homebrew und Hausregeln
├── Data & Platform
│   ├── lokale Persistenz und Migration
│   ├── Import, Export und Backup
│   ├── Accounts, Rollen und Cloud-Sync
│   └── Realtime-Gruppensitzungen
├── Visual Tabletop
│   ├── Medien und Handouts
│   ├── Karten, Grid und Tokens
│   ├── Fog of War und Sicht
│   └── taktische Automatisierung
├── AI
│   ├── Quellen-Retrieval und Regelassistent
│   ├── DM-Copilot
│   ├── Solo AI-DM und Gedächtnis
│   └── Evaluation, Guardrails und Kostenkontrolle
└── Operations & Governance
    ├── Tests, CI/CD und Observability
    ├── Sicherheit, Datenschutz und Lizenz
    ├── Requirements, Roadmap und Risiko
    └── Support, Releases und Projektkommunikation
```

## Abgrenzungsregel

Jedes Feature muss genau einem primären Produktobjekt gehören. Querschnittsthemen werden als Abhängigkeit verlinkt, nicht in mehreren Bereichen doppelt geplant.

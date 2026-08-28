# DnDimension Code Workspace

Dieser Ordner enthält die gesamte ausführbare Anwendung und ihr Entwicklungs-Tooling. Dokumentation, Prompts und private Referenzdateien bleiben absichtlich in den getrennten Ordnern der Repositorywurzel.

## Voraussetzungen

- Node.js 24 LTS (`.node-version` ist die Referenz für CI und neue Setups)
- pnpm 11.19.0 über Corepack

## Befehle

Alle Befehle werden aus `code/` ausgeführt:

```powershell
pnpm install --frozen-lockfile
pnpm verify
pnpm run doctor
pnpm disk:report
pnpm --filter @dndimension/web dev
```

Zusätzliche Frameworks, Browser-Runtimes oder native SDKs werden nur aufgenommen, wenn ein konkreter Release-Slice sie benötigt.

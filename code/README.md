# DnDimension Code Workspace

Dieser Ordner enthält die gesamte ausführbare Anwendung und ihr Entwicklungs-Tooling. Dokumentation, Prompts und private Referenzdateien bleiben absichtlich in den getrennten Ordnern der Repositorywurzel.

## Voraussetzungen

- Node.js 24 LTS (`.node-version` ist die Referenz für CI und neue Setups)
- pnpm 11.19.0 über Corepack

## Befehle

Alle Befehle werden aus `code/` ausgeführt:

```powershell
pnpm install --frozen-lockfile
pnpm exec playwright install chromium   # einmalig für pnpm test:e2e
pnpm verify
pnpm run doctor
pnpm disk:report
pnpm --filter @dndimension/web dev
```

`pnpm verify` baut die App und führt danach die Playwright-Tests (`pnpm test:e2e`) gegen den Production-Build aus, inklusive Offline-Start und Updatefluss der PWA. Mit einem bereits installierten Chromium genügt `PLAYWRIGHT_CHROMIUM_EXECUTABLE=<Pfad>` statt des Browser-Downloads.

Zusätzliche Frameworks, Browser-Runtimes oder native SDKs werden nur aufgenommen, wenn ein konkreter Release-Slice sie benötigt.

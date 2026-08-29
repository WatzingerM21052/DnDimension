# UI and Quality Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Issue #69/P-04 durch ein kleines, produktionsfähiges Arcane-Cartographer-Design-System, ein Development-only UI-Lab sowie reproduzierbare Accessibility-, Edge- und Größenprüfungen bestehen.

**Architecture:** Ein neues Workspace-Package `@dndimension/ui` kapselt Theme-Vertrag, Tokens, Assets, Primitives, Components und das integrierte `WaypointDraftPattern`; die Web-App konsumiert ausschließlich dessen öffentlichen Einstiegspunkt. Eine statisch entfernbare Development-Route zeigt den vertikalen UI-Pfad, während Node-Tooling Production-Inhalte und Budgets prüft und Playwright ausschließlich den lokal installierten Edge verwendet.

**Tech Stack:** TypeScript 6.0.2, React 19.2.8, Vite 8.2.2, Vitest 4.1.11, React Testing Library, `react-aria-components@1.20.0`, `motion@13.1.1`, `axe-core@4.13.0`, `@playwright/test@1.62.1`, CSS Modules, semantische CSS Custom Properties, lokale Google-Fonts-WOFF2-Dateien.

**Spec:** [UI Design System Foundation](../specs/2026-08-29-ui-design-system-foundation-design.md)

## Global Constraints

- Ausführung erfolgt aus `code/` mit Node `>=24.11.0 <25`, Referenzversion `24.20.0`, und pnpm `11.19.0`.
- `night-chart` ist der einzige produktive Standard; `vellum-study` ist in diesem Slice ausschließlich eine nicht persistierte Development-Vorschau.
- Komponenten konsumieren semantische Tokens und enthalten keine Theme-Namen oder direkten Farbwerte.
- WCAG 2.2 AA ist Mindestziel; sichtbarer Fokus, semantischer Name, Tastaturbedienung, 200-Prozent-Zoom und mindestens `44 × 44` CSS-Pixel große Aktionsziele sind verbindlich.
- CSS übernimmt einfache Übergänge; Motion for React wird ausschließlich für das Shared-Layout-Sigil verwendet.
- `prefers-reduced-motion: reduce` ersetzt nicht notwendige Bewegung durch unmittelbare verständliche Zustandswechsel.
- Die Production-Budgets sind: JavaScript raw `650 KiB`, JavaScript gzip `180 KiB`, CSS `50 KiB`, WOFF2 `500 KiB`, SVG `25 KiB`, gesamter Build `50 MiB`, projektlokale Dependencies `1 GiB`, Testartefakte `250 MiB`.
- Kein Material UI, Storybook, Cypress, Docker, Electron, Android SDK oder lokaler Playwright-Browserdownload wird ergänzt.
- Fonts und SVGs werden lokal ausgeliefert; es gibt keine externe Font-, Icon- oder Bildanfrage zur Laufzeit.
- UI-Tests verwenden Rollen, Namen und echte Interaktionen statt `data-testid`; ein Diagnoseattribut ist nur für den expliziten Reduced-Motion-Nachweis erlaubt.
- Keine geschützten D&D-/Baldur's-Gate-Assets, Logos oder markanten UI-Kompositionen werden übernommen.
- Jedes Task folgt Red -> Green -> vollständiger relevanter Gate-Lauf -> Commit. Ein fehlschlagender erwarteter Red-Lauf wird nicht committed.

---

## File Map

### Workspace und Tooling

- `code/package.json`: neue Quality-Skripte und exakt gepinnte Testabhängigkeiten.
- `code/pnpm-lock.yaml`: reproduzierbarer Dependency-Lock ohne Browserbinary.
- `code/tsconfig.json`: Project Reference für `packages/ui`.
- `code/vitest.config.ts`: TSX-Tests aus `packages/` in die bestehende Suite aufnehmen.
- `code/apps/web/package.json`: öffentliche Workspace-Abhängigkeit auf `@dndimension/ui`.
- `code/apps/web/tsconfig.json`: Project Reference auf `packages/ui`.
- `code/packages/ui/package.json`: öffentliche Package-Grenze und Runtime-Abhängigkeiten.
- `code/packages/ui/tsconfig.json`: strikter JSX-/Declaration-Build des UI-Packages.
- `code/tooling/scripts/ui-budget.mjs`: getrennte Buildgrößenmessung und harte Spike-Budgets.
- `code/tooling/scripts/ui-budget.test.mjs`: Klassifizierungs-, gzip- und Budgettests.
- `code/tooling/scripts/check-production-ui.mjs`: Production-Ausschluss des UI-Labs.
- `code/tooling/scripts/check-production-ui.test.mjs`: Positiv-/Negativtest für verbotene Development-Inhalte.
- `code/tooling/scripts/{doctor,disk-report,clean,safe-paths}*.mjs`: UI-Package und neue Reports in bestehende Schutzmechanismen aufnehmen.
- `code/playwright.config.ts`: Edge-only Local-/CI-Konfiguration ohne Download.
- `.github/workflows/ci.yml`: Browserdownload explizit verhindern und dieselben lokalen Gates ausführen.

### UI-Package

- `code/packages/ui/src/styles/fonts.css`: drei lokale WOFF2-Faces.
- `code/packages/ui/src/styles/tokens.css`: primitive Größen-, Abstands-, Typografie-, Layer- und Motion-Skalen.
- `code/packages/ui/src/styles/themes.css`: semantische Werte für `night-chart` und `vellum-study`.
- `code/packages/ui/src/styles/motion.css`: globale Reduced-Motion-Regel.
- `code/packages/ui/src/styles/global.css`: Reset, globale Basis und Style-Imports.
- `code/packages/ui/src/styles/theme.ts`: stabiler Theme-Typ und sicherer Fallback.
- `code/packages/ui/src/styles/theme-contract.test.ts`: Theme-Vollständigkeit und echte Kontrastberechnung.
- `code/packages/ui/src/assets/fonts/*`: drei WOFF2-Dateien und beide OFL-Lizenzen.
- `code/packages/ui/src/icons/wayfinder.svg`: eigenes einfarbiges Wegfinder-/D20-Maskenasset.
- `code/packages/ui/THIRD_PARTY_NOTICES.md`: Provenienz, offizielle URLs, Schriftschnitte und Lizenzen.
- `code/packages/ui/src/primitives/*`: `Text`, `Surface`, `Stack`, `Icon`, `VisuallyHidden` und lokales CSS Module.
- `code/packages/ui/src/components/*`: `ActionButton`, `TextField`, `ModalDialog` und komponentennahe CSS Modules.
- `code/packages/ui/src/patterns/*`: `ConstellationLedger`, `WaypointDraftPattern` und Pattern-CSS.
- `code/packages/ui/src/index.ts`: einziger öffentlicher TS-Einstiegspunkt und globaler Style-Import.

### Web, Tests und Dokumentation

- `code/apps/web/src/app/App.tsx`: produktiver Foundation-Screen und statisch entfernbare Development-Route.
- `code/apps/web/src/app/App.test.tsx`: bestehende Routen plus Development-Route.
- `code/apps/web/src/dev/ui-lab/UiLab.tsx`: Token-, Theme-, Komponenten- und Pattern-Nachweis.
- `code/apps/web/src/dev/ui-lab/UiLab.module.css`: ausschließlich UI-Lab-spezifisches Layout.
- `code/apps/web/e2e/ui-lab.spec.ts`: echter Edge-, A11y-, Touch-, Dialog- und Reduced-Motion-Nachweis.
- `code/apps/web/src/styles/global.css`: durch den UI-Package-Stylevertrag ersetzen und anschließend entfernen.
- `code/README.md`: neue UI-, E2E-, Budget- und Cleanup-Befehle.
- `docs/research/v0.1-ui-quality-validation-report.md`: exakte Messwerte, Testevidenz und Entscheidung zu P-04.
- `docs/README.md`, `docs/decisions/DEC-010-custom-design-system-and-lean-quality-toolchain.md`, `docs/spec-planning/pre-code-engineering-blueprint.md`, `docs/delivery/initial-backlog.md`, `docs/delivery/risk-register.md`: Abschlussstatus und Evidenz verlinken.

## Execution Preflight

- [ ] Lies diese Plan-Datei und die verlinkte Spec vollständig.
- [ ] Prüfe `git status --short --branch`; beginne nur mit einem bekannten sauberen Stand.
- [ ] Setze Issue #69 im bestehenden Project auf `In Progress`:

```powershell
gh project item-edit --id PVTI_lAHOCKRynM4BhsOczg4eUf0 --project-id PVT_kwHOCKRynM4BhsOc --field-id PVTSSF_lAHOCKRynM4BhsOczhgnDBo --single-select-option-id 47fc9ee4
```

- [ ] Erfasse die Baseline, ohne sie zu verändern:

```powershell
pnpm verify
pnpm disk:report
```

Erwartung: alle bestehenden Gates bestehen; der Production Build liegt ungefähr bei der zuletzt dokumentierten Größenordnung von `1.43 MiB`, Dependencies ungefähr bei `178.87 MiB`. Abweichungen werden vor Task 1 erklärt.

---

### Task 1: UI-Package und gepinnte Quality-Abhängigkeiten verdrahten

**Files:**

- Create: `code/packages/ui/package.json`
- Create: `code/packages/ui/tsconfig.json`
- Create: `code/packages/ui/src/index.ts`
- Modify: `code/package.json`
- Modify: `code/pnpm-lock.yaml`
- Modify: `code/tsconfig.json`
- Modify: `code/vitest.config.ts`
- Modify: `code/apps/web/package.json`
- Modify: `code/apps/web/tsconfig.json`
- Modify: `code/tooling/scripts/doctor.mjs`
- Modify: `code/tooling/scripts/doctor.test.mjs`

**Interfaces:**

- Consumes: bestehende pnpm-Workspace-Konvention und TypeScript-Project-References.
- Produces: öffentlich importierbares `@dndimension/ui`; exakt gepinnte Runtime-/Testpakete; Doctor verlangt alle drei Foundation-Packages.

- [ ] **Step 1: Schreibe den fehlschlagenden Doctor-Test**

Ersetze in `healthyFacts` das bisherige Boolean durch `missingWorkspacePackages: []` und ergänze diesen Negativtest:

```javascript
test("reports every missing required workspace package", () => {
  const result = evaluateDoctor({
    ...healthyFacts,
    missingWorkspacePackages: ["packages/ui/package.json"],
  });

  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /packages\/ui\/package\.json/);
});
```

- [ ] **Step 2: Verifiziere den Red-Zustand**

Run: `pnpm test:tooling`

Expected: FAIL, weil `evaluateDoctor` noch `workspacePackagesExist` statt `missingWorkspacePackages` auswertet.

- [ ] **Step 3: Lege Package-Vertrag und References an**

`packages/ui/package.json` erhält exakt:

```json
{
  "name": "@dndimension/ui",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "sideEffects": ["./src/styles/global.css"],
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "motion": "13.1.1",
    "react-aria-components": "1.20.0"
  },
  "peerDependencies": {
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "react": "19.2.8",
    "react-dom": "19.2.8"
  }
}
```

`packages/ui/tsconfig.json` erhält:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "emitDeclarationOnly": true,
    "jsx": "react-jsx",
    "outDir": "dist/types",
    "rootDir": "src",
    "types": ["vite/client", "vitest/globals"]
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["src/**/*.test.ts", "src/**/*.test.tsx"]
}
```

`src/index.ts` bleibt zunächst ein gültiges leeres Modul:

```typescript
export {};
```

Füge `packages/ui` vor `apps/web` in `code/tsconfig.json` ein, referenziere es in `apps/web/tsconfig.json` und ergänze in `apps/web/package.json`:

```json
"@dndimension/ui": "workspace:*"
```

Erweitere die Vitest-Include-Liste, ohne die bestehende Node-Defaultumgebung zu ändern:

```typescript
include: [
  "packages/**/*.test.ts",
  "packages/**/*.test.tsx",
  "apps/**/*.test.ts",
  "apps/**/*.test.tsx",
],
```

Jede neue UI-Testdatei mit React-DOM beginnt ausdrücklich mit `// @vitest-environment jsdom`; der Theme-Vertrag und alle `.mjs`-Toolingtests bleiben in Node.

Ergänze im Root unter `devDependencies`:

```json
"@playwright/test": "1.62.1",
"axe-core": "4.13.0"
```

- [ ] **Step 4: Implementiere die präzise Doctor-Auswertung**

`collectDoctorFacts` berechnet:

```javascript
const requiredWorkspacePackages = [
  "apps/web/package.json",
  "packages/core/package.json",
  "packages/ui/package.json",
];

missingWorkspacePackages: requiredWorkspacePackages.filter(
  (relative) => !fs.existsSync(path.join(root, relative)),
),
```

`evaluateDoctor` verwendet:

```javascript
if (facts.missingWorkspacePackages.length > 0) {
  errors.push(
    `Required workspace package manifests are missing: ${facts.missingWorkspacePackages.join(", ")}`,
  );
}
```

Passe `healthyFacts` auf `missingWorkspacePackages: []` an.

- [ ] **Step 5: Installiere ohne Browserdownload und prüfe den Green-Zustand**

```powershell
$env:PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "1"
pnpm install --no-frozen-lockfile
pnpm test:tooling
pnpm typecheck
pnpm check:boundaries
```

Expected: PASS; `pnpm-lock.yaml` enthält die vier exakt gepinnten Pakete, aber kein heruntergeladenes Browserverzeichnis im Workspace.

- [ ] **Step 6: Commit**

```powershell
git add package.json pnpm-lock.yaml tsconfig.json vitest.config.ts apps/web/package.json apps/web/tsconfig.json packages/ui tooling/scripts/doctor.mjs tooling/scripts/doctor.test.mjs
git commit -m "build: add lean UI quality workspace"
```

---

### Task 2: UI-Budgetreport und sichere Bereinigung ergänzen

**Files:**

- Create: `code/tooling/scripts/ui-budget.mjs`
- Create: `code/tooling/scripts/ui-budget.test.mjs`
- Modify: `code/package.json`
- Modify: `code/tooling/scripts/disk-report.mjs`
- Modify: `code/tooling/scripts/disk-report.test.mjs`
- Modify: `code/tooling/scripts/clean.mjs`
- Modify: `code/tooling/scripts/clean.test.mjs`
- Modify: `code/tooling/scripts/safe-paths.test.mjs`

**Interfaces:**

- Consumes: Vite-Ausgabe unter `apps/web/dist` und vorhandene `measurePath`-/Cleanup-Konventionen.
- Produces: `createUiBudgetReport({ distRoot, budgets? })`, `UI_BUDGETS`, `pnpm budget:ui`; sichere Targets für `packages/ui/dist` und `.cache`.

- [ ] **Step 1: Schreibe fehlschlagende Budgettests**

Teste mit einem temporären `dist` je eine `.js`, `.css`, `.woff2`, `.svg` und `.map`:

```javascript
test("reports JavaScript raw and gzip separately from CSS, fonts and SVG", () => {
  const generousBudgets = {
    javascriptRaw: 1_000,
    javascriptGzip: 1_000,
    css: 1_000,
    fonts: 1_000,
    svg: 1_000,
    total: 10_000,
  };
  const report = createUiBudgetReport({ distRoot, budgets: generousBudgets });

  assert.equal(
    report.rows.find(({ key }) => key === "javascriptRaw").bytes,
    200,
  );
  assert.ok(
    report.rows.find(({ key }) => key === "javascriptGzip").bytes < 200,
  );
  assert.equal(report.rows.find(({ key }) => key === "css").bytes, 30);
  assert.equal(report.rows.find(({ key }) => key === "fonts").bytes, 40);
  assert.equal(report.rows.find(({ key }) => key === "svg").bytes, 50);
  assert.equal(report.sourceMapsBytes, 60);
});

test("marks an exact budget as pass and one byte above as warning", () => {
  assert.equal(evaluateUiBudget(180 * 1024, 180 * 1024), "pass");
  assert.equal(evaluateUiBudget(180 * 1024 + 1, 180 * 1024), "warning");
});
```

Erweitere die Cleanup-/Safe-Path-Tests um `packages/ui/dist` und `packages/ui/.cache` und den Disk-Test um die UI-Declaration-Ausgabe.

- [ ] **Step 2: Verifiziere Red**

Run: `pnpm test:tooling`

Expected: FAIL, weil `ui-budget.mjs` und die UI-Targets fehlen.

- [ ] **Step 3: Implementiere den Reporter**

`ui-budget.mjs` exportiert exakt:

```javascript
import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

export const UI_BUDGETS = Object.freeze({
  javascriptRaw: 650 * 1024,
  javascriptGzip: 180 * 1024,
  css: 50 * 1024,
  fonts: 500 * 1024,
  svg: 25 * 1024,
  total: 50 * 1024 * 1024,
});

export const evaluateUiBudget = (bytes, budgetBytes) =>
  bytes > budgetBytes ? "warning" : "pass";

const collectFiles = (root) => {
  const files = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) visit(target);
      else if (entry.isFile()) files.push(target);
    }
  };
  visit(root);
  return files.sort((left, right) => left.localeCompare(right));
};

export const createUiBudgetReport = ({ distRoot, budgets = UI_BUDGETS }) => {
  if (!fs.existsSync(distRoot))
    throw new Error(`Production build is missing: ${distRoot}`);
  const files = collectFiles(distRoot);
  const bytesFor = (predicate) =>
    files
      .filter(predicate)
      .reduce((sum, file) => sum + fs.statSync(file).size, 0);
  const javascriptFiles = files.filter((file) => file.endsWith(".js"));
  const javascriptRaw = javascriptFiles.reduce(
    (sum, file) => sum + fs.statSync(file).size,
    0,
  );
  const javascriptGzip = javascriptFiles.reduce(
    (sum, file) => sum + gzipSync(fs.readFileSync(file)).byteLength,
    0,
  );
  const values = {
    javascriptRaw,
    javascriptGzip,
    css: bytesFor((file) => file.endsWith(".css")),
    fonts: bytesFor((file) => file.endsWith(".woff2")),
    svg: bytesFor((file) => file.endsWith(".svg")),
    total: bytesFor((file) => !file.endsWith(".map")),
  };
  const rows = Object.entries(values).map(([key, bytes]) => ({
    key,
    bytes,
    budgetBytes: budgets[key],
    status: evaluateUiBudget(bytes, budgets[key]),
  }));
  return {
    rows,
    sourceMapsBytes: bytesFor((file) => file.endsWith(".map")),
  };
};
```

`collectFiles` traversiert rekursiv, ignoriert Symlinks und sortiert Pfade. Der CLI-Modus druckt jede Zeile in KiB, weist Source Maps separat aus und beendet bei einer Warnung mit Exitcode `2`.

- [ ] **Step 4: Integriere Reporter und sichere Pfade**

Ergänze in `package.json`:

```json
"budget:ui": "node tooling/scripts/ui-budget.mjs"
```

Nimm `packages/ui/dist` in Build/Disk und `packages/ui/.cache` in Cache auf. Erweitere ausschließlich die bestehende Allowlist; verallgemeinere keine löschbaren Pfade.

- [ ] **Step 5: Verifiziere Green**

```powershell
pnpm test:tooling
pnpm build
pnpm budget:ui
pnpm disk:report
```

Expected: PASS; der noch UI-arme Baseline-Build liegt deutlich innerhalb aller Limits.

- [ ] **Step 6: Commit**

```powershell
git add package.json tooling/scripts
git commit -m "test: enforce UI and asset budgets"
```

---

### Task 3: Theme-Vertrag, lokale Fonts und eigenes SVG etablieren

**Files:**

- Create: `code/packages/ui/src/styles/fonts.css`
- Create: `code/packages/ui/src/styles/tokens.css`
- Create: `code/packages/ui/src/styles/themes.css`
- Create: `code/packages/ui/src/styles/motion.css`
- Create: `code/packages/ui/src/styles/global.css`
- Create: `code/packages/ui/src/styles/theme.ts`
- Create: `code/packages/ui/src/styles/theme-contract.test.ts`
- Create: `code/packages/ui/src/assets/fonts/alegreya-sans-sc-500-latin.woff2`
- Create: `code/packages/ui/src/assets/fonts/alegreya-sans-sc-700-latin.woff2`
- Create: `code/packages/ui/src/assets/fonts/atkinson-hyperlegible-next-latin-variable.woff2`
- Create: `code/packages/ui/src/assets/fonts/licenses/alegreya-sans-sc-OFL.txt`
- Create: `code/packages/ui/src/assets/fonts/licenses/atkinson-hyperlegible-next-OFL.txt`
- Create: `code/packages/ui/src/icons/wayfinder.svg`
- Create: `code/packages/ui/THIRD_PARTY_NOTICES.md`
- Modify: `code/packages/ui/src/index.ts`

**Interfaces:**

- Consumes: offizielle Google-Fonts-Dateien und Theme-Regeln der Spec.
- Produces: `ThemeName`, `themeNames`, `resolveThemeName(value)`, `applyTheme(root, value)`; globale semantische Tokens; lokales `wayfinder.svg`.

- [ ] **Step 1: Schreibe fehlschlagende Theme- und Kontrasttests**

Der Test liest `themes.css`, extrahiert beide Selektorblöcke und verlangt je Theme alle Variablen aus diesem Vertrag:

```typescript
const requiredTokens = [
  "--color-surface-canvas",
  "--color-surface-workspace",
  "--color-surface-reading",
  "--color-text-primary",
  "--color-text-muted",
  "--color-text-on-reading",
  "--color-accent-action",
  "--color-accent-action-text",
  "--color-accent-structure",
  "--color-status-danger",
  "--color-status-danger-text",
  "--color-border-subtle",
  "--color-border-strong",
  "--color-border-focus",
  "--shadow-raised",
  "--shadow-overlay",
] as const;
```

Berechne sRGB-Luminanz aus den geparsten Hexwerten und prüfe:

```typescript
expect(contrast(theme.textPrimary, theme.surfaceCanvas)).toBeGreaterThanOrEqual(
  4.5,
);
expect(
  contrast(theme.textOnReading, theme.surfaceReading),
).toBeGreaterThanOrEqual(7);
expect(
  contrast(theme.accentActionText, theme.accentAction),
).toBeGreaterThanOrEqual(4.5);
expect(
  contrast(theme.statusDangerText, theme.statusDanger),
).toBeGreaterThanOrEqual(4.5);
expect(contrast(theme.borderFocus, theme.surfaceCanvas)).toBeGreaterThanOrEqual(
  3,
);
```

Prüfe zusätzlich den Fallback:

```typescript
expect(resolveThemeName("vellum-study")).toBe("vellum-study");
expect(resolveThemeName("unknown-theme")).toBe("night-chart");
expect(resolveThemeName(null)).toBe("night-chart");
```

- [ ] **Step 2: Verifiziere Red**

Run: `pnpm test:unit -- packages/ui/src/styles/theme-contract.test.ts`

Expected: FAIL, weil Theme-Dateien und Exports fehlen.

- [ ] **Step 3: Lade exakt drei offizielle WOFF2-Dateien und zwei Lizenzen**

```powershell
New-Item -ItemType Directory -Force "packages/ui/src/assets/fonts/licenses"
Invoke-WebRequest "https://fonts.gstatic.com/s/alegreyasanssc/v26/mtGm4-RGJqfMvt7P8FUr0Q1j-Hf1DrpG4iNhMA.woff2" -OutFile "packages/ui/src/assets/fonts/alegreya-sans-sc-500-latin.woff2"
Invoke-WebRequest "https://fonts.gstatic.com/s/alegreyasanssc/v26/mtGm4-RGJqfMvt7P8FUr0Q1j-Hf1DvJA4iNhMA.woff2" -OutFile "packages/ui/src/assets/fonts/alegreya-sans-sc-700-latin.woff2"
Invoke-WebRequest "https://fonts.gstatic.com/s/atkinsonhyperlegiblenext/v7/NaPNcYPdHfdVxJw0IfIP0lvYFqijb-UxCtm5_wdGseiJn3o.woff2" -OutFile "packages/ui/src/assets/fonts/atkinson-hyperlegible-next-latin-variable.woff2"
Invoke-WebRequest "https://raw.githubusercontent.com/google/fonts/main/ofl/alegreyasanssc/OFL.txt" -OutFile "packages/ui/src/assets/fonts/licenses/alegreya-sans-sc-OFL.txt"
Invoke-WebRequest "https://raw.githubusercontent.com/google/fonts/main/ofl/atkinsonhyperlegiblenext/OFL.txt" -OutFile "packages/ui/src/assets/fonts/licenses/atkinson-hyperlegible-next-OFL.txt"
Get-FileHash "packages/ui/src/assets/fonts/*.woff2" -Algorithm SHA256
```

Dokumentiere URL, Abrufdatum `2026-08-29`, Gewicht und ausgegebenen SHA-256-Wert in `THIRD_PARTY_NOTICES.md`. Es werden keine kyrillischen, griechischen oder vietnamesischen Subsets geladen.

- [ ] **Step 4: Implementiere den Theme-Typ**

```typescript
export const themeNames = ["night-chart", "vellum-study"] as const;
export type ThemeName = (typeof themeNames)[number];

export const resolveThemeName = (value: unknown): ThemeName =>
  typeof value === "string" && themeNames.some((theme) => theme === value)
    ? (value as ThemeName)
    : "night-chart";

export const applyTheme = (root: HTMLElement, value: unknown): ThemeName => {
  const theme = resolveThemeName(value);
  root.dataset.theme = theme;
  return theme;
};
```

- [ ] **Step 5: Implementiere Token-, Theme-, Font- und Motion-CSS**

`tokens.css` definiert mindestens diese stabilen Skalen:

```css
:root {
  --font-display: "Alegreya Sans SC", "Segoe UI", sans-serif;
  --font-body: "Atkinson Hyperlegible Next", "Segoe UI", sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: clamp(2rem, 6vw, 4.5rem);
  --line-body: 1.55;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --target-min: 2.75rem;
  --radius-sm: 0.375rem;
  --radius-md: 0.75rem;
  --radius-lg: 1.25rem;
  --border-thin: 0.0625rem;
  --border-focus: 0.1875rem;
  --layer-base: 0;
  --layer-overlay: 40;
  --motion-fast: 120ms;
  --motion-standard: 240ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --content-reading: 70ch;
  --content-wide: 90rem;
}
```

`night-chart` nutzt die freigegebenen Referenzfarben und `vellum-study` passende helle Kontrastwerte:

```css
:root,
[data-theme="night-chart"] {
  color-scheme: dark;
  --color-surface-canvas: #0b1620;
  --color-surface-workspace: #132631;
  --color-surface-reading: #e8e0cf;
  --color-text-primary: #f5f1e8;
  --color-text-muted: #b7c2c7;
  --color-text-on-reading: #1a242a;
  --color-accent-action: #4fc3b5;
  --color-accent-action-text: #071519;
  --color-accent-structure: #d6a85f;
  --color-status-danger: #e68184;
  --color-status-danger-text: #071519;
  --color-border-subtle: #36505d;
  --color-border-strong: #8ba0a8;
  --color-border-focus: #7de3d6;
  --shadow-raised: 0 0.5rem 1.5rem rgb(0 0 0 / 28%);
  --shadow-overlay: 0 1rem 4rem rgb(0 0 0 / 52%);
}

[data-theme="vellum-study"] {
  color-scheme: light;
  --color-surface-canvas: #e6d8be;
  --color-surface-workspace: #f6efdf;
  --color-surface-reading: #fff9ec;
  --color-text-primary: #251c16;
  --color-text-muted: #695544;
  --color-text-on-reading: #17110d;
  --color-accent-action: #0b7067;
  --color-accent-action-text: #ffffff;
  --color-accent-structure: #79531d;
  --color-status-danger: #962e37;
  --color-status-danger-text: #ffffff;
  --color-border-subtle: #b7a589;
  --color-border-strong: #715d46;
  --color-border-focus: #075f58;
  --shadow-raised: 0 0.5rem 1.5rem rgb(59 42 23 / 18%);
  --shadow-overlay: 0 1rem 4rem rgb(37 25 13 / 32%);
}
```

`fonts.css` mappt Alegreya auf `500` und `700`, Atkinson auf `400 700`, jeweils `font-display: swap`. `motion.css` setzt unter Reduced Motion beide Dauern auf `1ms` und `scroll-behavior: auto`. `global.css` importiert die vier Style-Dateien, setzt `box-sizing`, Body-Basis und einen sichtbaren `:focus-visible`-Perimeter ausschließlich mit Tokens.

- [ ] **Step 6: Erstelle das eigene SVG und den öffentlichen Style-Export**

`wayfinder.svg` bleibt einfarbig und für CSS-Masking geeignet:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path fill="#000" fill-rule="evenodd" d="M12 1.5 21 7v10l-9 5.5L3 17V7l9-5.5Zm0 2.3L5.2 8v8L12 20.2 18.8 16V8L12 3.8Zm0 2.6 4.4 2.7-1.7 5.1-5.4 0-1.7-5.1L12 6.4Zm0 2.2-2.1 1.3.8 2.4h2.6l.8-2.4L12 8.6Z"/>
</svg>
```

`src/index.ts` importiert `./styles/global.css` und exportiert Theme-Vertrag. Es exportiert noch keine internen Dateien, die erst in späteren Tasks entstehen.

- [ ] **Step 7: Verifiziere Green und Assetbudget**

```powershell
pnpm test:unit -- packages/ui/src/styles/theme-contract.test.ts
pnpm typecheck
pnpm build
pnpm budget:ui
```

Expected: beide Theme-Verträge und alle Kontrastpaare bestehen; drei WOFF2-Dateien zusammen bleiben unter `500 KiB`, SVG unter `25 KiB`.

- [ ] **Step 8: Commit**

```powershell
git add packages/ui
git commit -m "feat: establish arcane cartographer themes"
```

---

### Task 4: Semantische UI-Primitives liefern

**Files:**

- Create: `code/packages/ui/src/utils/merge-class-names.ts`
- Create: `code/packages/ui/src/primitives/Text.tsx`
- Create: `code/packages/ui/src/primitives/Surface.tsx`
- Create: `code/packages/ui/src/primitives/Stack.tsx`
- Create: `code/packages/ui/src/primitives/Icon.tsx`
- Create: `code/packages/ui/src/primitives/WayfinderIcon.tsx`
- Create: `code/packages/ui/src/primitives/VisuallyHidden.tsx`
- Create: `code/packages/ui/src/primitives/Primitives.module.css`
- Create: `code/packages/ui/src/primitives/primitives.test.tsx`
- Modify: `code/packages/ui/src/index.ts`

**Interfaces:**

- Consumes: semantische Tokens und `wayfinder.svg` aus Task 3.
- Produces: `Text`, `Surface`, `Stack`, `Icon`, `WayfinderIcon`, `VisuallyHidden`; `mergeClassNames(...values)` bleibt package-intern.

- [ ] **Step 1: Schreibe fehlschlagende semantische Tests**

```tsx
it("renders semantic text and reading surfaces without losing caller classes", () => {
  render(
    <Surface as="article" variant="reading" className="caller-surface">
      <Text as="h2" variant="title" tone="on-reading">
        Reisejournal
      </Text>
    </Surface>,
  );

  expect(screen.getByRole("article")).toHaveClass("caller-surface");
  expect(
    screen.getByRole("heading", { name: "Reisejournal" }),
  ).toBeInTheDocument();
});

it("hides decorative icons and names informative icons", () => {
  const { rerender } = render(<WayfinderIcon />);
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  rerender(<WayfinderIcon label="Aktive Wegmarke" />);
  expect(
    screen.getByRole("img", { name: "Aktive Wegmarke" }),
  ).toBeInTheDocument();
});
```

Prüfe außerdem `Stack` als `section` und den zugänglichen Text von `VisuallyHidden`.

- [ ] **Step 2: Verifiziere Red**

Run: `pnpm test:unit -- packages/ui/src/primitives/primitives.test.tsx`

Expected: FAIL, weil die Primitives nicht existieren.

- [ ] **Step 3: Implementiere die kleinen Primitives**

Verwende diese öffentlichen Props:

```typescript
export type TextProps = Omit<ComponentPropsWithoutRef<"p">, "color"> & {
  as?: "p" | "span" | "h1" | "h2" | "h3";
  variant?: "body" | "label" | "title" | "display";
  tone?: "primary" | "muted" | "on-reading";
};

export type SurfaceProps = ComponentPropsWithoutRef<"div"> & {
  as?: "div" | "main" | "section" | "article" | "aside";
  variant?: "canvas" | "workspace" | "reading" | "overlay";
};

export type StackProps = ComponentPropsWithoutRef<"div"> & {
  as?: "div" | "section" | "form";
  gap?: "xs" | "sm" | "md" | "lg";
  align?: "start" | "center" | "stretch";
};

export type IconProps = Omit<ComponentPropsWithoutRef<"span">, "children"> & {
  source: string;
  label?: string;
  size?: "sm" | "md" | "lg";
};
```

`Icon` rendert ein maskiertes `span`; ohne Label setzt es `aria-hidden="true"`, mit Label `role="img"` und `aria-label`. Die Masken-URL liegt in einer typisierten Custom Property:

```tsx
const style = {
  ...callerStyle,
  "--icon-source": `url("${source}")`,
} as CSSProperties;
```

`mergeClassNames` filtert nur Strings mit Inhalt und verbindet sie mit einem Leerzeichen. Alle Varianten werden über feste CSS-Module-Maps gewählt; unbekannte Tokenwerte sind durch die Union-Typen ausgeschlossen.

- [ ] **Step 4: Implementiere lokale, tokenbasierte Styles**

`Primitives.module.css` setzt Surface-Farben, Textrollen, Stack-Gaps und Icon-Größen ausschließlich über Variablen. `reading` verwendet `--color-surface-reading` und `--color-text-on-reading`; das Icon nutzt `mask: var(--icon-source) center / contain no-repeat` und `background: currentColor`.

- [ ] **Step 5: Exportiere und verifiziere Green**

```powershell
pnpm test:unit -- packages/ui/src/primitives/primitives.test.tsx
pnpm typecheck
pnpm lint
pnpm check:boundaries
```

Expected: PASS; die Web-App verwendet noch keinen Tiefenimport.

- [ ] **Step 6: Commit**

```powershell
git add packages/ui/src
git commit -m "feat: add semantic UI primitives"
```

---

### Task 5: Zugänglichen ActionButton implementieren

**Files:**

- Create: `code/packages/ui/src/components/ActionButton.tsx`
- Create: `code/packages/ui/src/components/ActionButton.module.css`
- Create: `code/packages/ui/src/components/ActionButton.test.tsx`
- Modify: `code/packages/ui/src/index.ts`

**Interfaces:**

- Consumes: `Button` und `ButtonProps` aus React Aria sowie semantische Tokens.
- Produces: `ActionButtonProps extends ButtonProps` mit `variant: "primary" | "secondary" | "quiet" | "danger"`.

- [ ] **Step 1: Schreibe den fehlschlagenden Interaktionstest**

```tsx
it("activates by keyboard and exposes its visible name", async () => {
  const user = userEvent.setup();
  const onPress = vi.fn();
  render(<ActionButton onPress={onPress}>Wegmarke anlegen</ActionButton>);

  await user.tab();
  expect(
    screen.getByRole("button", { name: "Wegmarke anlegen" }),
  ).toHaveFocus();
  await user.keyboard("{Enter}");
  expect(onPress).toHaveBeenCalledOnce();
});

it("preserves React Aria disabled semantics", () => {
  render(<ActionButton isDisabled>Gesperrt</ActionButton>);
  expect(screen.getByRole("button", { name: "Gesperrt" })).toBeDisabled();
});
```

- [ ] **Step 2: Verifiziere Red**

Run: `pnpm test:unit -- packages/ui/src/components/ActionButton.test.tsx`

Expected: FAIL, weil `ActionButton` fehlt.

- [ ] **Step 3: Implementiere die React-Aria-Hülle**

```tsx
export interface ActionButtonProps extends ButtonProps {
  variant?: "primary" | "secondary" | "quiet" | "danger";
}

export const ActionButton = ({
  variant = "primary",
  className,
  ...props
}: ActionButtonProps) => (
  <Button
    {...props}
    data-variant={variant}
    className={(renderProps) =>
      mergeClassNames(
        styles.button,
        styles[variant],
        typeof className === "function" ? className(renderProps) : className,
      )
    }
  />
);
```

Damit wird auch ein funktionaler React-Aria-`className` vor dem Merge ausgewertet; die öffentliche Signatur von `ButtonProps` wird nicht verengt.

- [ ] **Step 4: Implementiere Zustands- und Größenstyles**

Die Basis besitzt `min-inline-size` und `min-block-size: var(--target-min)`, klaren Fokus, Disabled-State sowie `[data-hovered]`, `[data-pressed]` und `[data-focus-visible]`. Primary, Secondary, Quiet und Danger nutzen ausschließlich Theme-Tokens. Hover/Pressed dauern `var(--motion-fast)`.

- [ ] **Step 5: Verifiziere Green**

```powershell
pnpm test:unit -- packages/ui/src/components/ActionButton.test.tsx
pnpm typecheck
pnpm lint
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add packages/ui/src/components packages/ui/src/index.ts
git commit -m "feat: add accessible action button"
```

---

### Task 6: TextField und ModalDialog mit Fokusvertrag liefern

**Files:**

- Create: `code/packages/ui/src/components/TextField.tsx`
- Create: `code/packages/ui/src/components/TextField.module.css`
- Create: `code/packages/ui/src/components/ModalDialog.tsx`
- Create: `code/packages/ui/src/components/ModalDialog.module.css`
- Create: `code/packages/ui/src/components/form-dialog.test.tsx`
- Modify: `code/packages/ui/src/index.ts`

**Interfaces:**

- Consumes: `ActionButton`, React-Aria-Field-/Dialog-Primitives.
- Produces: `TextFieldProps` mit sichtbarem Label/Fehler/Input-Ref; `ModalDialogProps` mit Render-Callback `children({ close })`.

- [ ] **Step 1: Schreibe fehlschlagende Feld- und Fokus-Tests**

```tsx
it("associates label, description and concrete validation error", () => {
  render(
    <TextField
      label="Name der Wegmarke"
      description="Für das Reisetagebuch"
      isInvalid
      errorMessage="Gib einen Namen für die Wegmarke ein."
    />,
  );

  const input = screen.getByRole("textbox", { name: "Name der Wegmarke" });
  expect(input).toHaveAccessibleDescription(/Für das Reisetagebuch/);
  expect(
    screen.getByText("Gib einen Namen für die Wegmarke ein."),
  ).toBeInTheDocument();
});

it("closes with Escape and restores focus to the trigger", async () => {
  const user = userEvent.setup();
  render(
    <ModalDialog triggerLabel="Dialog öffnen" title="Wegmarke">
      {() => <p>Dialoginhalt</p>}
    </ModalDialog>,
  );
  const trigger = screen.getByRole("button", { name: "Dialog öffnen" });
  await user.click(trigger);
  expect(screen.getByRole("dialog", { name: "Wegmarke" })).toBeInTheDocument();
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});
```

- [ ] **Step 2: Verifiziere Red**

Run: `pnpm test:unit -- packages/ui/src/components/form-dialog.test.tsx`

Expected: FAIL, weil beide Komponenten fehlen.

- [ ] **Step 3: Implementiere TextField**

```typescript
export interface TextFieldProps extends Omit<AriaTextFieldProps, "children"> {
  label: string;
  description?: string;
  errorMessage?: string;
  inputRef?: Ref<HTMLInputElement>;
}
```

Rendere `AriaTextField`, `Label`, `Input`, optional `Text slot="description"` und `FieldError`. `FieldError` zeigt exakt `errorMessage`; Required/Invalid werden aus React Aria übernommen. CSS markiert `[data-invalid]` zusätzlich zu Text und Icon, niemals nur über Farbe.

- [ ] **Step 4: Implementiere ModalDialog**

```typescript
export interface ModalDialogProps {
  triggerLabel: string;
  title: string;
  children: (controls: { close: () => void }) => ReactNode;
}
```

Komponiere `DialogTrigger`, `ActionButton`, `ModalOverlay isDismissable`, `Modal`, `Dialog` und `Heading slot="title"`. Der Render-Callback des React-Aria-Dialogs reicht `close` typisiert an `children` weiter. Overlay und Modal nutzen `--layer-overlay`, `--shadow-overlay`, responsive Innenabstände und maximal `min(34rem, calc(100vw - 2rem))` Breite.

- [ ] **Step 5: Verifiziere Green**

```powershell
pnpm test:unit -- packages/ui/src/components/form-dialog.test.tsx
pnpm typecheck
pnpm lint
```

Expected: PASS; Escape schließt, Fokus kehrt zurück und Feldtexte sind zugänglich verknüpft.

- [ ] **Step 6: Commit**

```powershell
git add packages/ui/src/components packages/ui/src/index.ts
git commit -m "feat: add accessible field and dialog"
```

---

### Task 7: Constellation Ledger mit echter Reduced-Motion-Alternative bauen

**Files:**

- Create: `code/packages/ui/src/patterns/ConstellationLedger.tsx`
- Create: `code/packages/ui/src/patterns/ConstellationLedger.module.css`
- Create: `code/packages/ui/src/patterns/ConstellationLedger.test.tsx`
- Create: `code/packages/ui/src/test/install-match-media.ts`
- Modify: `code/packages/ui/src/index.ts`

**Interfaces:**

- Consumes: `ActionButton`, `WayfinderIcon`, `motion`, `LayoutGroup`, `useReducedMotion`.
- Produces: `LedgerNode { id: string; label: string }`; `ConstellationLedgerProps { label; nodes; activeId; onActiveChange }`.

- [ ] **Step 1: Schreibe fehlschlagende Auswahl-/Reduced-Motion-Tests**

```tsx
it("moves the selected state through named buttons", async () => {
  const user = userEvent.setup();
  const onActiveChange = vi.fn();
  render(
    <ConstellationLedger
      label="Wegmarkenstatus"
      nodes={ledgerNodes}
      activeId="unmapped"
      onActiveChange={onActiveChange}
    />,
  );
  await user.click(screen.getByRole("button", { name: "Entwurf" }));
  expect(onActiveChange).toHaveBeenCalledWith("drafted");
});

it("uses an immediate marker when reduced motion is requested", () => {
  installMatchMedia({ reducedMotion: true });
  render(
    <ConstellationLedger
      label="Wegmarkenstatus"
      nodes={ledgerNodes}
      activeId="unmapped"
      onActiveChange={() => undefined}
    />,
  );
  expect(document.querySelector('[data-motion="reduced"]')).not.toBeNull();
  expect(screen.getByRole("button", { name: "Unkartiert" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
```

`installMatchMedia` liefert dieses rücksetzbare `MediaQueryList`-Fixture:

```typescript
export const installMatchMedia = ({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) => {
  const original = window.matchMedia;
  window.matchMedia = vi.fn((query: string) => ({
    matches: query === "(prefers-reduced-motion: reduce)" && reducedMotion,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
  }));
  return () => {
    window.matchMedia = original;
  };
};
```

Jeder Test ruft die zurückgegebene Restore-Funktion in `finally` oder `afterEach` auf.

- [ ] **Step 2: Verifiziere Red**

Run: `pnpm test:unit -- packages/ui/src/patterns/ConstellationLedger.test.tsx`

Expected: FAIL, weil Ledger und Fixture fehlen.

- [ ] **Step 3: Implementiere den zustandsgebundenen Ledger**

```typescript
export interface LedgerNode {
  id: string;
  label: string;
}

export interface ConstellationLedgerProps {
  label: string;
  nodes: readonly LedgerNode[];
  activeId: string;
  onActiveChange: (id: string) => void;
}
```

Rendere eine benannte Gruppe von Quiet-Buttons mit `aria-pressed`. Nur der aktive Knoten enthält den Marker. Bei normaler Bewegung ist er:

```tsx
<motion.span
  layoutId="constellation-ledger-active"
  data-motion="animated"
  transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
  className={styles.marker}
>
  <WayfinderIcon />
</motion.span>
```

Bei `useReducedMotion() === true` wird stattdessen ein normales `span data-motion="reduced"` mit identischem Inhalt gerendert. Es gibt keine Schleife und keine Bewegung ohne Nutzeraktion.

- [ ] **Step 4: Implementiere die kartographische Formsprache**

Das CSS verbindet Knoten mit einer dünnen `--color-border-subtle`-Linie, nutzt Brass nur für aktive Struktur und hält alle Buttons bei `44 × 44` oder größer. Das Sigil liegt neben dem Label und niemals hinter Text.

- [ ] **Step 5: Verifiziere Green**

```powershell
pnpm test:unit -- packages/ui/src/patterns/ConstellationLedger.test.tsx
pnpm typecheck
pnpm lint
pnpm build
pnpm budget:ui
```

Expected: PASS; Motion ist der einzige komplexe Runtime-Motion-Nachweis.

- [ ] **Step 6: Commit**

```powershell
git add packages/ui/src
git commit -m "feat: add reduced-motion constellation ledger"
```

---

### Task 8: WaypointDraftPattern als vollständigen UI-Pfad integrieren

**Files:**

- Create: `code/packages/ui/src/patterns/WaypointDraftPattern.tsx`
- Create: `code/packages/ui/src/patterns/WaypointDraftPattern.module.css`
- Create: `code/packages/ui/src/patterns/WaypointDraftPattern.test.tsx`
- Modify: `code/packages/ui/src/index.ts`

**Interfaces:**

- Consumes: alle Primitives, `ActionButton`, `TextField`, `ModalDialog`, `ConstellationLedger`, `axe-core` im Test.
- Produces: `WaypointDraftPattern` ohne externe Props oder Persistenz; sichtbarer Demo-Zustand und integrierter Accessibility-Nachweis.

- [ ] **Step 1: Schreibe den fehlschlagenden vertikalen Verhaltenstest**

```tsx
it("keeps invalid input in the dialog and confirms a valid waypoint", async () => {
  const user = userEvent.setup();
  render(<WaypointDraftPattern />);

  await user.click(screen.getByRole("button", { name: "Wegmarke anlegen" }));
  const input = screen.getByRole("textbox", { name: "Name der Wegmarke" });
  await user.type(input, "   ");
  await user.click(screen.getByRole("button", { name: "Wegmarke speichern" }));

  expect(
    screen.getByText("Gib einen Namen für die Wegmarke ein."),
  ).toBeInTheDocument();
  expect(input).toHaveFocus();
  expect(screen.getByRole("dialog")).toBeInTheDocument();

  await user.clear(input);
  await user.type(input, "Mondbrücke");
  await user.click(screen.getByRole("button", { name: "Wegmarke speichern" }));

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent(
    "Wegmarke „Mondbrücke“ wurde vorgemerkt.",
  );
});
```

Ergänze einen axe-Test mit deaktivierter jsdom-Farbregel:

```tsx
const results = await axe.run(container, {
  rules: { "color-contrast": { enabled: false } },
});
expect(results.violations).toEqual([]);
```

- [ ] **Step 2: Verifiziere Red**

Run: `pnpm test:unit -- packages/ui/src/patterns/WaypointDraftPattern.test.tsx`

Expected: FAIL, weil das integrierte Pattern fehlt.

- [ ] **Step 3: Implementiere kontrollierten Draft und konkrete Validierung**

Halte `draftName`, `errorMessage`, `savedName` und `activeId` lokal. Der Submit-Handler lautet fachlich vollständig:

```tsx
const submitDraft = (event: FormEvent<HTMLFormElement>, close: () => void) => {
  event.preventDefault();
  const normalizedName = draftName.trim();
  if (normalizedName.length === 0) {
    setErrorMessage("Gib einen Namen für die Wegmarke ein.");
    inputRef.current?.focus();
    return;
  }
  setErrorMessage(undefined);
  setSavedName(normalizedName);
  setActiveId("drafted");
  close();
};
```

Das Formular enthält genau zwei Aktionen: `Abbrechen` als Secondary-Button und `Wegmarke speichern` mit `type="submit"`. Der Ledger besitzt `Unkartiert` und `Entwurf`. Die Statusmeldung erscheint nur nach erfolgreichem Speichern.

- [ ] **Step 4: Implementiere responsive Pattern-Styles**

Verwende eine Container Query: bei ausreichender Patternbreite stehen Lesefläche und Ledger nebeneinander, sonst untereinander. Pergament erscheint nur in der erklärenden Lesefläche. Eine Brass-Kapitelkante markiert den Beginn; es gibt kein Ornament hinter Formularfeldern.

- [ ] **Step 5: Verifiziere Green und vollständige UI-Suite**

```powershell
pnpm test:unit -- packages/ui/src/patterns/WaypointDraftPattern.test.tsx
pnpm test:unit
pnpm typecheck
pnpm lint
```

Expected: PASS; axe meldet keine nicht farbbezogene Violation, Validierung verliert weder Fokus noch Inhalt.

- [ ] **Step 6: Commit**

```powershell
git add packages/ui/src
git commit -m "feat: integrate waypoint draft pattern"
```

---

### Task 9: Development-only UI-Lab und Production-Ausschluss beweisen

**Files:**

- Create: `code/apps/web/src/dev/ui-lab/UiLab.tsx`
- Create: `code/apps/web/src/dev/ui-lab/UiLab.module.css`
- Create: `code/tooling/scripts/check-production-ui.mjs`
- Create: `code/tooling/scripts/check-production-ui.test.mjs`
- Modify: `code/apps/web/src/app/App.tsx`
- Modify: `code/apps/web/src/app/App.test.tsx`
- Modify: `code/apps/web/src/main.tsx`
- Delete: `code/apps/web/src/styles/global.css`
- Modify: `code/package.json`

**Interfaces:**

- Consumes: ausschließlich öffentliche Exports aus `@dndimension/ui`.
- Produces: `/dev/ui` nur unter `import.meta.env.DEV`; `assertProductionUiLabExcluded(distRoot)`; produktiver Home-/Health-Pfad bleibt funktionsfähig.

- [ ] **Step 1: Schreibe fehlschlagende App- und Production-Checker-Tests**

Ergänze in `App.test.tsx`:

```tsx
it("renders the development UI lab through its named route", async () => {
  render(
    <MemoryRouter initialEntries={["/dev/ui"]}>
      <App />
    </MemoryRouter>,
  );
  expect(
    await screen.findByRole("heading", { name: "DnDimension UI Lab" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Wegmarke anlegen" }),
  ).toBeInTheDocument();
});
```

Der Node-Test erstellt einmal ein sauberes Dist und einmal eine Datei mit `DnDimension UI Lab`:

```javascript
assert.deepEqual(findForbiddenUiLabContent(cleanDist), []);
assert.deepEqual(findForbiddenUiLabContent(dirtyDist), [
  { file: "assets/demo.js", marker: "DnDimension UI Lab" },
]);

const namedChunk = createDist({
  "assets/ui-lab-ab12.js": "production-safe text",
});
assert.deepEqual(findForbiddenUiLabContent(namedChunk), [
  { file: "assets/ui-lab-ab12.js", marker: "ui-lab-filename" },
]);
```

- [ ] **Step 2: Verifiziere Red**

```powershell
pnpm test:unit -- apps/web/src/app/App.test.tsx
pnpm test:tooling
```

Expected: beide Läufe FAIL an den neuen Assertions.

- [ ] **Step 3: Baue den UI-Lab-Screen**

`UiLab.tsx` zeigt:

- Überschrift `DnDimension UI Lab` und Status `Development only`;
- Palette, Typografie, Abstands- und Surface-Proben;
- alle vier `ActionButton`-Varianten und Disabled-State;
- zwei getrennte Vorschauflächen `data-theme="night-chart"` und `data-theme="vellum-study"` mit identischem Primitives-Markup;
- genau eine interaktive Instanz von `WaypointDraftPattern`;
- knappe Hinweise zu Reduced Motion, Fokus und Ornamentdichte.

Es gibt keinen produktiven Theme-Schalter und keine Speicherung. Das CSS ist nur Layout; Farben kommen aus Tokens.

- [ ] **Step 4: Isoliere die Route statisch vom Production-Build**

`App.tsx` verwendet:

```tsx
const DevelopmentUiLab = import.meta.env.DEV
  ? lazy(() =>
      import("../dev/ui-lab/UiLab").then(({ UiLab }) => ({ default: UiLab })),
    )
  : null;
```

Die Route wird nur gerendert, wenn `DevelopmentUiLab !== null`. Home und Health werden mit `Surface`, `Stack` und `Text` aus dem öffentlichen UI-Package aufgebaut. `main.tsx` entfernt den alten Web-CSS-Import; `src/styles/global.css` wird gelöscht, weil der Package-Einstieg seine globale Basis importiert.

- [ ] **Step 5: Implementiere den Production-Checker**

Suche rekursiv nur in `.html`, `.js` und `.css` nach:

```javascript
export const FORBIDDEN_UI_LAB_MARKERS = Object.freeze([
  "DnDimension UI Lab",
  "Development only",
  "Wegmarke anlegen",
]);

export const findForbiddenUiLabContent = (distRoot) => {
  const files = collectTextBuildFiles(distRoot);
  return files.flatMap((file) => {
    const relativeFile = path.relative(distRoot, file).replaceAll("\\", "/");
    const content = fs.readFileSync(file, "utf8");
    const findings = FORBIDDEN_UI_LAB_MARKERS.filter((marker) =>
      content.includes(marker),
    ).map((marker) => ({ file: relativeFile, marker }));
    if (/ui[-_.]?lab/i.test(relativeFile)) {
      findings.push({ file: relativeFile, marker: "ui-lab-filename" });
    }
    return findings;
  });
};

export const assertProductionUiLabExcluded = (distRoot) => {
  const findings = findForbiddenUiLabContent(distRoot);
  if (findings.length > 0) {
    throw new Error(
      `Development UI leaked into production: ${findings
        .map(({ file, marker }) => `${file} (${marker})`)
        .join(", ")}`,
    );
  }
};
```

`collectTextBuildFiles` verwendet dieselbe sortierte, symlinkfreie Rekursion wie Task 2 und filtert mit `/\.(html|js|css)$/`. Der CLI-Modus prüft `apps/web/dist`, listet Datei plus Marker und beendet bei einem Treffer mit Exitcode `1`. Ergänze:

```json
"check:production-ui": "node tooling/scripts/check-production-ui.mjs",
"build": "pnpm --filter @dndimension/web build && pnpm check:production-ui && pnpm budget:ui"
```

- [ ] **Step 6: Verifiziere Green und echte Tree-Shaking-Grenze**

```powershell
pnpm test:tooling
pnpm test:unit
pnpm typecheck
pnpm lint
pnpm check:boundaries
pnpm build
```

Expected: PASS; `apps/web/dist` enthält keinen der drei Marker und keinen eigenen UI-Lab-Chunknamen.

- [ ] **Step 7: Commit**

```powershell
git add package.json apps/web packages/ui tooling/scripts
git commit -m "feat: add development-only UI lab"
```

---

### Task 10: Edge-E2E, Browser-Axe und CI-Gate ergänzen

**Files:**

- Create: `code/playwright.config.ts`
- Create: `code/apps/web/e2e/ui-lab.spec.ts`
- Modify: `code/package.json`
- Modify: `.github/workflows/ci.yml`

**Interfaces:**

- Consumes: Development-Route aus Task 9, installierten System-Edge, `axe.source`.
- Produces: `pnpm test:e2e`; echter Browsernachweis für Dialog, Tastatur, Fokus, Touchziel, Kontrast und Reduced Motion.

- [ ] **Step 1: Schreibe zuerst die Browser-Spec**

Die Spec enthält drei Tests:

```typescript
test("completes the waypoint dialog by keyboard", async ({ page }) => {
  await page.goto("/dev/ui");
  const trigger = page.getByRole("button", { name: "Wegmarke anlegen" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const input = page.getByRole("textbox", { name: "Name der Wegmarke" });
  await input.fill("   ");
  await page.getByRole("button", { name: "Wegmarke speichern" }).click();
  await expect(input).toBeFocused();
  await expect(
    page.getByText("Gib einen Namen für die Wegmarke ein."),
  ).toBeVisible();
  await input.fill("Mondbrücke");
  await page.getByRole("button", { name: "Wegmarke speichern" }).click();
  await expect(page.getByRole("status")).toContainText("Mondbrücke");
  await expect(trigger).toBeFocused();
});

test("meets browser accessibility and touch-target gates", async ({ page }) => {
  await page.goto("/dev/ui");
  await page.addScriptTag({ content: axe.source });
  const violations = await page.evaluate(async () => {
    const axeWindow = window as unknown as {
      axe: {
        run: (root: Document) => Promise<{ violations: { id: string }[] }>;
      };
    };
    return (await axeWindow.axe.run(document)).violations.map(({ id }) => id);
  });
  expect(violations).toEqual([]);
  const box = await page
    .getByRole("button", { name: "Wegmarke anlegen" })
    .boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
});

test("replaces layout motion when the operating system requests reduction", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/dev/ui");
  await expect(page.locator('[data-motion="reduced"]').first()).toBeVisible();
  await expect(page.locator('[data-motion="animated"]')).toHaveCount(0);
});
```

- [ ] **Step 2: Verifiziere den Red-Zustand**

Run: `pnpm test:e2e`

Expected: FAIL mit fehlendem Skript oder fehlender Playwright-Konfiguration; es wird kein Browser installiert.

- [ ] **Step 3: Implementiere die Edge-only-Konfiguration**

```typescript
export default defineConfig({
  testDir: "./apps/web/e2e",
  outputDir: "./test-results",
  reporter: [
    ["line"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  use: {
    baseURL: "http://127.0.0.1:4174",
    channel: "msedge",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "off",
  },
  webServer: {
    command: "pnpm --filter @dndimension/web dev --host 127.0.0.1 --port 4174",
    url: "http://127.0.0.1:4174/dev/ui",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

Importiere `axe` aus `axe-core`, `test/expect` aus `@playwright/test` und `defineConfig` ebenfalls dort. Ergänze Root-Skripte:

```json
"test:e2e": "playwright test",
"verify": "pnpm format:check && pnpm lint && pnpm check:boundaries && pnpm run doctor && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e && pnpm disk:report"
```

- [ ] **Step 4: Härte CI gegen Browserdownloads**

Setze am Install-Step in `.github/workflows/ci.yml`:

```yaml
env:
  PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: "1"
```

Der Windows-Runner verwendet seinen vorhandenen Microsoft Edge. Füge weder `playwright install` noch einen Browsercache hinzu. Bestehende `permissions: contents: read`, Timeout und `pnpm verify` bleiben erhalten.

- [ ] **Step 5: Verifiziere Green im echten lokalen Edge**

```powershell
$env:PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "1"
pnpm test:e2e
pnpm build
pnpm clean:test
pnpm disk:report
```

Expected: drei Edge-Tests PASS; axe einschließlich echter Farbkontrastregel meldet null Violations; Testartefakte sind nach Cleanup `0.00 MiB`.

- [ ] **Step 6: Führe die nicht zuverlässig automatisierbaren visuellen Checks aus**

```powershell
pnpm --filter @dndimension/web dev --host 127.0.0.1 --port 4174
```

Öffne `http://127.0.0.1:4174/dev/ui` im System-Edge und protokolliere im späteren Validation Report:

1. Browserzoom auf `200 %`: kein horizontales Seitenscrolling auf Desktopbreite, Dialog und Status bleiben erreichbar.
2. Responsive DevTools auf `320 × 800`: Einzelspaltenlayout, kein abgeschnittener Text, alle Aktionen erreichbar.
3. Vollständiger Tab-/Shift-Tab-Durchlauf: Fokus ist immer sichtbar und nicht vom Dialog verdeckt.
4. Windows-Kontrastmodus oder Edge-Emulation `forced-colors: active`: Namen, Umrisse, Auswahl und Fehler bleiben erkennbar.
5. Beide Theme-Vorschauen: identische Reihenfolge und Semantik; Pergament nur auf Leseflächen; höchstens ein dominantes Ornament je Komponente.
6. Betriebssystempräferenz „Animationen deaktivieren“: kein wanderndes Sigil, kein Informationsverlust.

- [ ] **Step 7: Commit**

```powershell
git add package.json playwright.config.ts apps/web/e2e .github/workflows/ci.yml
git commit -m "test: validate UI foundation in system Edge"
```

---

### Task 11: Gesamtnachweis dokumentieren und Issue #69 abschließen

**Files:**

- Create: `docs/research/v0.1-ui-quality-validation-report.md`
- Modify: `code/README.md`
- Modify: `docs/README.md`
- Modify: `docs/decisions/DEC-010-custom-design-system-and-lean-quality-toolchain.md`
- Modify: `docs/spec-planning/pre-code-engineering-blueprint.md`
- Modify: `docs/delivery/initial-backlog.md`
- Modify: `docs/delivery/risk-register.md`

**Interfaces:**

- Consumes: alle Test-, Build-, Budget-, Disk- und CI-Ergebnisse der Tasks 1 bis 10.
- Produces: reproduzierbaren P-04-Report, bestätigte oder evidenzbasiert angepasste DEC-010, konsistente Docs und geschlossenes GitHub-Issue #69.

- [ ] **Step 1: Führe den vollständigen reproduzierbaren Nachweis aus**

```powershell
pnpm clean:deep
$env:PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "1"
pnpm install --frozen-lockfile
pnpm verify
pnpm budget:ui
pnpm disk:report
git diff --check
```

Expected: alle Befehle PASS; keine Budgetzeile ist `WARNING`; `playwright-report`, `test-results`, `coverage` und `blob-report` lassen sich anschließend mit `pnpm clean:test` auf null zurückführen.

- [ ] **Step 2: Schreibe den Validation Report mit echten Werten**

Der Report enthält ausschließlich tatsächlich gemessene Daten und diese Abschnitte:

1. Ergebnis `P-04 Passed` oder begründetes `Failed`;
2. Datum, Betriebssystem, Node-, pnpm-, React-Aria-, Motion-, axe- und Playwright-Version;
3. getesteter Pfad `Token -> Primitive -> Component -> Pattern -> UI-Lab`;
4. Component-/axe-/Edge-Testanzahl und exakte Befehle;
5. Tabelle mit JS raw/gzip, CSS, WOFF2, SVG, Production Build, Dependencies, pnpm Store, Cache und Testartefakten jeweils als Istwert, Grenze und Status;
6. Font- und SVG-Provenienz;
7. Accessibility-/Reduced-Motion-/Touch-/Zoom-/Forced-Colors-Checkliste;
8. Production-Ausschlussnachweis für `/dev/ui`;
9. Abweichungen, Restrisiken und Entscheidung zu DEC-010;
10. sichere Cleanup-Befehle.

Zahlen werden direkt aus den beiden Reportern übertragen und nicht gerundet, bevor deren eigene formatierte Ausgabe dokumentiert wurde.

- [ ] **Step 3: Synchronisiere die autoritativen Dokumente**

- `code/README.md`: `pnpm test:e2e`, `pnpm budget:ui`, UI-Lab-URL und Hinweis auf System-Edge ergänzen.
- `docs/README.md`: Plan und Validation Report verlinken.
- `DEC-010`: Abschnitt `Validation` mit exakten Versionen, Ergebnis und Reportlink ergänzen; nur bei einer tatsächlichen Überschreitung die Entscheidung ändern.
- Blueprint: P-04-Zeile und operationalisiertes Gate als bestanden markieren, falls alle Exit-Kriterien erfüllt sind.
- Initial Backlog: #69 auf Done setzen; #19/#26 bleiben offen, solange #20/#21/#71 offen sind.
- Risk Register: R-26 nach bestandenem Nachweis auf `Monitoring` setzen und den Report als Evidenz nennen; bei Fehlschlag Status `Open` beibehalten.

- [ ] **Step 4: Prüfe Links, Platzhalter und Konsistenz**

```powershell
rg -n -i "T[B]D|T[O]DO|place[h]older|implement l[a]ter|open qu[e]stion|offene fr[a]ge" docs code/README.md
git diff --check
pnpm format:check
pnpm verify
```

Expected: keine neuen Platzhaltertreffer, keine toten relativen Links in den geänderten Dokumenten, alle Gates PASS.

- [ ] **Step 5: Committe und pushe den vollständigen Spike**

```powershell
git add code/README.md docs
git commit -m "docs: record UI quality spike evidence"
git status --short --branch
git -c http.sslBackend=schannel push origin master
gh project item-edit --id PVTI_lAHOCKRynM4BhsOczg4eUf0 --project-id PVT_kwHOCKRynM4BhsOc --field-id PVTSSF_lAHOCKRynM4BhsOczhgnDBo --single-select-option-id 1abb244f
```

Expected: `master` und `origin/master` zeigen auf denselben Commit; der Arbeitsbaum ist sauber.

- [ ] **Step 6: Warte auf CI und schließe GitHub erst bei Grün**

```powershell
$ciRunId = gh run list --workflow CI --branch master --limit 1 --json databaseId --jq ".[0].databaseId"
gh run watch $ciRunId --exit-status
gh issue comment 69 --repo WatzingerM21052/DnDimension --body "P-04 ist bestanden. Der Token-zu-UI-Lab-Pfad, React-Aria-Dialog, Reduced Motion, System-Edge, Accessibility und getrennte Größenbudgets sind reproduzierbar grün. Der vollständige Nachweis steht unter docs/research/v0.1-ui-quality-validation-report.md; DEC-010 und der Engineering Blueprint wurden synchronisiert."
gh issue close 69 --repo WatzingerM21052/DnDimension --reason completed
gh project item-edit --id PVTI_lAHOCKRynM4BhsOczg4eUf0 --project-id PVT_kwHOCKRynM4BhsOc --field-id PVTSSF_lAHOCKRynM4BhsOczhgnDBo --single-select-option-id 98236657
```

Falls CI fehlschlägt, bleibt #69 offen und im Status `Testing`; die Ursache wird behoben und der vollständige Nachweis wiederholt.

## Final Review Gate

- [ ] Jeder Abschnitt 1 bis 18 der Design-Spec besitzt mindestens einen Implementierungs- oder Verifikationsschritt in diesem Plan.
- [ ] `@dndimension/ui` importiert keine Character-, Campaign-, Session-, Persistenz- oder Cloudlogik.
- [ ] Die Production-App enthält weder UI-Lab-Route noch Demo-Strings oder einen UI-Lab-Chunk.
- [ ] Beide Themes verwenden denselben Komponentenbaum; keine Einstellung wird persistiert.
- [ ] Pergament bleibt Lesefläche, Ornamente bleiben zustands- oder hierarchiegebunden.
- [ ] System-Edge wurde verwendet; kein Playwright-Browser wurde lokal heruntergeladen.
- [ ] Component-, axe-, Reduced-Motion-, Production-, Budget- und Edge-Tests sind grün.
- [ ] Alle Größen liegen innerhalb der Global Constraints oder #69 bleibt offen.
- [ ] `pnpm clean:test` entfernt nur validierte generierte Artefakte.
- [ ] Working Tree, GitHub-Issue, Project-Status, DEC-010, Blueprint und Validation Report sind konsistent.

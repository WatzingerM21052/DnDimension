# DEC-010: Eigenes Design-System und schlanker Qualitäts-Toolchain

**Status:** Accepted<br>
**Datum:** 2026-08-28<br>
**Owner:** WatzingerM21052<br>
**Betroffene Releases/Requirements:** v0.1-v2.5; NFR-001/002/004/012/016/019; CON-011/015/020

## Kontext

DnDimension soll langfristig eine professionelle, immersive und dynamische Fantasy-Anwendung sein, ohne Bedienbarkeit, Barrierefreiheit, Performance oder Festplattenspeicher für Effekte zu opfern. Ein vollständiges Standard-UI-Kit würde die Umsetzung beschleunigen, kann aber eine generische Produkterscheinung und tiefes Theme-Override erzeugen. Umfangreiche lokale UI-/E2E-Toolchains können zudem mehrere Browser, Caches und Builds duplizieren.

## Optionen

1. **Eigenes CSS-Token-System mit React Aria und gezieltem Motion:** volle visuelle Kontrolle, zugängliches Verhalten und kleiner Runtime-Overhead; benötigt konsequente Komponentenpflege.
2. **Material UI als vollständige Oberfläche:** viele fertige Komponenten und schneller Start, aber überwiegend Material-2-Ästhetik sowie zusätzlicher Override-Aufwand für die gewünschte Identität.
3. **Tailwind plus fertiges UI-Kit:** hohe Entwicklungsgeschwindigkeit, aber Risiko eines Template-Looks, Utility-Streuung und paralleler Designwahrheiten.
4. **Storybook, Cypress und lokale Browsermatrix ab Start:** umfangreiche Werkzeuge, aber hohe Installations-/Cachekosten vor ausreichender UI-Größe.

## Entscheidung

DnDimension baut ein eigenes Design-System aus modernen CSS-Funktionen, CSS Modules und semantischen Design Tokens. React Aria Components liefern zugängliche Interaktionsprimitive; CSS übernimmt einfache Übergänge und Motion for React ausschließlich komplexe Layout-, Gesten- und geteilte Übergänge. Material 3/Expressive ist Gestaltungsreferenz, keine kopierte Oberfläche.

WCAG 2.2 AA, Tastaturbedienung, Screenreader-Semantik, Zoom, Touch-Ziele und Reduced Motion sind Komponentenverträge. Eine interne Development-only UI-Lab-Route ersetzt Storybook, bis dessen Nutzen den zusätzlichen Tool- und Speicheraufwand belegt.

Der Qualitätsstack verwendet TypeScript strict, ESLint, Prettier, Vitest, React Testing Library, gezielte Property Tests, axe-core und Playwright. Lokal verwendet Playwright standardmäßig den installierten Edge; die vollständige Browsermatrix läuft in GitHub Actions. Docker, Cypress, Electron, Android SDK, Storybook, Nx und Turborepo sind keine v0.1-Standardabhängigkeiten.

## Folgen und Trade-offs

- Die App kann eine eigenständige Fantasy-Identität entwickeln, ohne ein UI-Kit zu bekämpfen.
- Design Tokens und Komponenten benötigen Governance, UI-Lab-Beispiele, Accessibility-Tests und visuelle Regressionen.
- Wenige gezielte Animationen und responsive Medien werden gegen Performance-/Bundlebudgets geprüft.
- Der lokale Toolchain bleibt klein; CI übernimmt teure Browserkombinationen.
- Ein späteres Tool darf ergänzt werden, wenn gemessene Wartungs- oder Qualitätsvorteile seinen Speicher-, Build- und Pflegeaufwand überwiegen.

## Validierung

Spike P-04 (#69) bestätigt die Entscheidung am 2026-09-27, siehe [P-04 Report](../research/v0.1-ui-quality-spike-report.md). Eine Browser-Probe prüft das UI-Lab in beiden Themes mit axe inklusive Kontrast, misst Touchziele gegen `--target-min`, testet Dialog-Tastaturbedienung und `prefers-reduced-motion`. Dabei wurde ein Kontrastfehler der `vellum-study`-Akzentfarbe gefunden und korrigiert; der Theme-Vertragstest deckt dieses Farbpaar jetzt ab.

## Ersetzt / ersetzt durch

Keine vorherige Decision. Diese Entscheidung konkretisiert DEC-003 für die technische UI-Umsetzung.

# UI Design System Foundation – Arcane Cartographer

**Status:** Approved Design Direction / Implementation Pending<br>
**Stand:** 2026-08-29<br>
**Owner:** WatzingerM21052<br>
**Scope:** GitHub #69, P-04 UI/Quality<br>
**Entscheidungsbasis:** [DEC-010](../../decisions/DEC-010-custom-design-system-and-lean-quality-toolchain.md), [Engineering Blueprint](../../spec-planning/pre-code-engineering-blueprint.md)

## 1. Zweck

Dieser Slice beweist, dass DnDimension eine eigenständige, immersive und zugängliche Fantasy-Oberfläche als schlankes eigenes Design-System tragen kann. Der Nachweis umfasst den Pfad `Tokens -> Primitives -> Components -> Pattern -> Screen`, eine Development-only UI-Lab-Route, React-Aria-Verhalten, gezielte Motion, lokale Fonts und ein eigenes SVG-Symbol. Er liefert noch keinen Character Creator, Campaign Creator, Settings-Bereich oder produktiven Theme-Umschalter.

Das Design darf an einen echten Spieltisch, Kartographie, Feldnotizen und ein lebendiges Regelbuch erinnern. Es darf weder wie ein generisches Admin-Dashboard noch wie eine kopierte D&D-/Baldur's-Gate-Oberfläche wirken.

## 2. Bewertete Richtungen

| Richtung | Stärke | Risiko | Entscheidung |
|---|---|---|---|
| **Arcane Cartographer** | moderner Kartographen- und Spielleitertisch; gute Balance aus Atmosphäre und langer Nutzbarkeit | benötigt disziplinierte Material- und Ornamentregeln | **gewählt** |
| Scholarly Codex | warm, ruhig und sehr lesefreundlich | schnell generische Pergament-/Fantasy-Website | nicht als Hauptidentität; bleibt Theme-Kandidat |
| Tactical Astral | starke Dynamik für spätere VTT- und Combat-Flächen | zu videospielartig und für lange Texte anstrengend | nur als spätere spezialisierte Theme-/Workspace-Inspiration |

## 3. Visuelle Identität

### 3.1 Leitbild

DnDimension ist ein **lebendiger Kartographentisch zwischen den Sitzungen**. Die dunkle Grundfläche erinnert an gefärbtes Kartenpapier und Tinte, helle Leseflächen an hochwertiges Pergament, Metalltöne an Messinstrumente und das Türkis an magische Wegmarken. Die Oberfläche bleibt klar, präzise und ruhig genug für mehrstündige Sessions.

### 3.2 Basispalette

| Name | Referenzwert | Semantische Hauptrolle |
|---|---|---|
| Cartographer Ink | `#0B1620` | App-Hintergrund und tiefste Fläche |
| Slate Vault | `#132631` | erhöhte Arbeitsfläche und Navigation |
| Moon Parchment | `#E8E0CF` | Primärtext auf dunklen Flächen und helle Lesefläche |
| Brass Signal | `#D6A85F` | ausgewählte Struktur, wichtige Markierung, Ornament |
| Wayfinder Teal | `#4FC3B5` | interaktive Hauptaktion, Fokus und positiver Status |
| Crimson Warning | `#C96568` | Fehler, Gefahr und destruktive Aktion |

Diese Werte sind Referenzfarben des Standard-Themes und keine in Komponenten erlaubten Direktwerte. Komponenten konsumieren ausschließlich semantische Tokens. Für Text werden Kontrastpaare mit mindestens 4,5:1 angestrebt; für zentrale Lesetexte 7:1, für UI-Grenzen und Fokus mindestens 3:1.

### 3.3 Typografie

- **Display:** `Alegreya Sans SC`, lokal als benötigtes WOFF2-Subset und nur für Marke, Seitenüberschrift und kurze Kapitelmarker.
- **Body/UI:** `Atkinson Hyperlegible Next`, lokal als benötigtes WOFF2-Subset für Fließtext, Formulare, Navigation und Daten.
- **Fallback:** systemnahe Sans-Serif-Kette; die App bleibt ohne geladenen Font vollständig bedienbar und ohne Layoutblocker lesbar.
- Maximal zwei primäre Schriftfamilien. Gewichte werden auf die tatsächlich verwendeten Schnitte begrenzt; keine dritte dekorative Schrift im Foundation-Slice.

### 3.4 Signatur: Constellation Ledger

Die wiedererkennbare Signatur ist ein **Constellation Ledger**: feine kartographische Verbindungslinien, ein abstrahiertes D20-/Wegfinder-Sigil und kleine Zustandsknoten verbinden ausgewählte Inhalte. Das Sigil darf bei einem bewusst ausgelösten Kontextwechsel zwischen Elementen wandern. Es ist Informationsträger für Auswahl oder Fortschritt und keine dauerhafte Hintergrundanimation.

### 3.5 Selbstkritik und Abgrenzung

Die Richtung wurde bewusst gegen naheliegende Fantasy-Standardlösungen geprüft:

- vollflächiges Pergament wurde verworfen, weil es Lesbarkeit, Kontrast und professionelle Arbeitsflächen schwächt;
- nahezu schwarzer Hintergrund mit Neonakzenten wurde verworfen, weil er wie eine austauschbare Gaming-Oberfläche wirkt;
- Ornamente werden nicht als beliebige Dekoration verteilt, sondern markieren Hierarchie, Auswahl oder Abschluss;
- das Constellation Ledger bleibt zustandsgebunden und unterscheidet DnDimension dadurch stärker als ein bloßes Wappen oder D20-Wasserzeichen;
- Inspiration aus D&D und Baldur's Gate 3 betrifft Atmosphäre und Bedienqualität, niemals geschützte Gestaltung, Begriffe oder Assets.

## 4. Pergament und Ornamente

Pergament ist eine semantische Lesefläche, keine globale Textur:

- geeignet für Regelzusammenfassungen, Journal, Handouts, Charakterzusammenfassung und längere erklärende Texte;
- nicht als App-Hintergrund, Dialogstandard oder Fläche hinter jeder Karte;
- im Standard-Theme als ruhige warme Fläche ohne fotorealistische Papiergrafik;
- Textur, falls später ergänzt, ausschließlich als sehr kleine optionale CSS-/SVG-Schicht und niemals Voraussetzung für Kontrast oder Bedeutung.

Ornamente folgen einer einzigen kartographischen Formsprache:

- erlaubt als Kapitelkante, aktiver Auswahlmarker, Trenner, Fokusverstärkung oder Abschlussmarke;
- als eigenes SVG oder CSS-Geometrie, nicht als großes Iconpaket;
- maximal ein dominantes Ornamentmotiv pro Komponente und wenige sichtbare Motive pro Viewport;
- niemals hinter Fließtext, über Formcontrols oder als Ersatz für Label, Status oder Fokus;
- dekorative SVG-Teile erhalten `aria-hidden="true"`; bedeutungstragende Symbole besitzen einen zugänglichen Namen.

## 5. Theme-Architektur und spätere Settings

### 5.1 Semantischer Vertrag

Themes überschreiben semantische Custom Properties auf einem Root-Element:

```text
data-theme="night-chart"
  -> surface-canvas
  -> surface-workspace
  -> surface-reading
  -> text-primary / text-muted / text-on-reading
  -> accent-action / accent-structure / status-danger
  -> border-subtle / border-strong / border-focus
  -> shadow-raised / shadow-overlay
```

Komponenten kennen weder Theme-Namen noch konkrete Palette. Kritische Bedienmuster, Reihenfolge, Semantik und Fokus bleiben über Themes identisch.

### 5.2 Umfang von #69

- `night-chart` ist der produktive Standard und vollständig geprüft.
- `vellum-study` wird als kleine Development-only UI-Lab-Vorschau umgesetzt, um den Tokenvertrag ohne dupliziertes Komponentenmarkup zu beweisen.
- Die UI-Lab-Auswahl wird nicht persistiert und ist kein produktiver Settings-Screen.
- Betriebssystempräferenzen für Reduced Motion werden unabhängig vom visuellen Theme respektiert.

### 5.3 Späterer Settings-Slice

Ein späterer Settings-Slice registriert Themes mit stabiler ID, Anzeigename, Version und Capability-Metadaten. Er speichert die Auswahl lokal, unterstützt System-/Nutzerpräferenz und kann weitere geprüfte Themes wie `vellum-study`, `high-contrast` oder spezialisierte Campaign-Themes anbieten. Themes dürfen ausschließlich nach Kontrast-, Fokus-, Reduced-Motion- und Screenshot-Gates freigegeben werden.

## 6. Responsive Layoutsystem

Desktop verwendet langfristig drei klar getrennte Arbeitszonen:

```text
┌ Navigation ┬ Aktiver Spielbereich ┬ Kontextbuch ┐
│ Kampagnen  │ Charakter / Szene    │ Regeln     │
│ Charaktere │ Hauptaktionen        │ Verlauf    │
└─────────────┴──────────────────────┴─────────────┘
```

Tablet reduziert das Kontextbuch auf eine einblendbare zweite Ebene. Smartphone zeigt eine fokussierte Einzelansicht mit Aktionen und danach Kontextdetails. Der Foundation-Screen verwendet denselben Container-, Spacing- und Breakpointvertrag, ohne die noch nicht existierende Produktnavigation vorzutäuschen.

Container Queries dürfen für eigenständige Patterns verwendet werden. Globale Media Queries steuern App-Rahmen, Eingabemodus und Reduced Motion. Inhalte bleiben bei 200 Prozent Zoom und schmaler Breite ohne horizontales Seitenscrolling bedienbar.

## 7. Paket- und Dateigrenzen

```text
code/packages/ui/
|-- src/
|   |-- primitives/
|   |-- components/          # TSX plus komponentennahe *.module.css
|   |-- patterns/            # TSX plus patternnahe *.module.css
|   |-- icons/
|   |-- styles/
|   |   |-- tokens.css
|   |   |-- themes.css
|   |   |-- motion.css
|   |   `-- global.css
|   `-- index.ts
`-- package.json

code/apps/web/src/
|-- app/
|-- dev/ui-lab/
`-- styles/
```

`@dndimension/ui` darf React und React Aria verwenden, aber keine Character-, Campaign-, Session-, Persistenz- oder Cloudlogik enthalten. `apps/web` komponiert die öffentliche UI-API. Feature-Code importiert keine internen UI-Dateien per Tiefenpfad.

Komponenten- und Pattern-Stile liegen als CSS Modules direkt bei ihrer Implementierung. Die globalen Stylesheets enthalten ausschließlich Reset, Font-Faces, Token-/Theme-Definitionen und wirklich appweite Grundregeln. So bleiben Selektoren lokal, während alle visuellen Entscheidungen weiterhin aus semantischen Tokens stammen.

## 8. Foundation-Ebenen

### 8.1 Tokens

Der Slice definiert primitive Skalen und semantische Aliase für Farbe, Typografie, Abstand, Größe, Radius, Grenze, Schatten, z-Index, Container, Breakpoint und Motion. Neue Komponenten dürfen keine willkürlichen Hexwerte, Abstände oder Animationsdauern einführen.

### 8.2 Primitives

- `Text`: semantisches HTML-Element plus typografische Rolle;
- `Surface`: semantische Oberflächenrolle einschließlich Lesefläche;
- `Stack`: einachsige, tokenbasierte Anordnung;
- `Icon`: einheitliche Größe und zugängliche Dekorationsregel;
- `VisuallyHidden`: visuell verborgener, für Assistenztechnik verfügbarer Inhalt.

### 8.3 Components

- `ActionButton`: React-Aria-Button mit `primary`, `secondary`, `quiet` und `danger`; mindestens 44 × 44 CSS-Pixel;
- `TextField`: sichtbares Label, Beschreibung, Fehlertext und Required-/Invalid-Vertrag;
- `ModalDialog`: React-Aria-Trigger, Modal, Dialog, Heading, Fokusmanagement und Escape-Verhalten.

### 8.4 Pattern

`WaypointDraftPattern` demonstriert den vollständigen Pfad: Ein Button öffnet einen Dialog, ein benanntes Feld nimmt eine Wegmarke auf, leere Eingabe erzeugt eine konkrete Inline-Fehlermeldung und eine gültige Bestätigung aktualisiert den sichtbaren UI-Lab-Zustand. Dieser Zustand ist reine Demonstration und wird nicht persistiert.

Das Constellation Ledger bewegt sein aktives Sigil bei einer bewusst ausgelösten Auswahl über ein Shared-Layout-Pattern. Ohne Motion oder bei Reduced Motion wechselt der Zustand unmittelbar und vollständig verständlich.

## 9. UI-Lab und Production-Grenze

- `/dev/ui` existiert ausschließlich, wenn `import.meta.env.DEV` wahr ist.
- Das UI-Lab erscheint weder in Production-Navigation noch Production-Routen.
- Der Production-Build enthält keine UI-Lab-Überschrift, Demo-Texte oder eigene UI-Lab-Chunks.
- Das UI-Lab zeigt Palette, Typografie, Abstände, Oberflächen, Buttonzustände, Field/Dialog-Pattern, Ornamentdichte, beide Theme-Vorschauen und Reduced-Motion-Verhalten.
- Storybook wird nicht installiert.

## 10. Bewegung

- CSS übernimmt Hover, Pressed, Fokus, einfache Sichtbarkeit und Farb-/Schattenübergänge.
- Motion for React wird ausschließlich für das wandernde Shared-Layout-Sigil des Constellation Ledger aufgenommen.
- Keine Endlosschleife, Parallaxe, automatisch bewegte Hintergrundfläche oder dekorative Partikel im Foundation-Slice.
- `prefers-reduced-motion: reduce` setzt nicht notwendige CSS-Dauern praktisch auf null und ersetzt die Shared-Layout-Bewegung durch einen unmittelbaren Zustandswechsel.
- Bewegung kommuniziert Auswahl und räumlichen Zusammenhang; sie darf keine Eingabe blockieren.

## 11. Fehler- und Fallbackverhalten

- Ungültige Formeingaben bleiben im Dialog, fokussieren beziehungsweise benennen den Fehler verständlich und verlieren keine Eingabe.
- Fehlende Fonts fallen auf die definierte Systemkette zurück.
- Fehlende dekorative SVGs verändern weder Text noch Interaktion.
- Deaktiviertes JavaScript ist kein v1-Kernmodus; der statische Dokumenttitel und App-Root bleiben dennoch verständlich.
- Ein unbekannter Theme-Wert fällt auf `night-chart` zurück und erzeugt keinen ungestylten Screen.

## 12. Accessibility-Vertrag

- WCAG 2.2 AA ist Mindestziel; Fokus wird zusätzlich mit einem mindestens zwei CSS-Pixel starken, kontrastreichen Perimeter ausgeführt.
- Jede Aktion ist per Tab erreichbar und mit Enter beziehungsweise Space auslösbar.
- Dialoge besitzen zugänglichen Namen, kontrollierten Fokus, Escape-Schließen und Fokus-Rückgabe an den Trigger.
- Validierungsfehler sind nicht ausschließlich farbcodiert und mit dem Feld verknüpft.
- Pointer-Ziele sind mindestens 44 × 44 CSS-Pixel und übertreffen damit das WCAG-2.2-AA-Minimum.
- Semantische HTML-Elemente und Rollenabfragen haben Vorrang vor Test-IDs.
- Zoom, schmale Viewports, Forced Colors und Reduced Motion werden als manuelle oder automatisierte Checks dokumentiert.

## 13. Assets und Lizenzen

- Die zwei Fontfamilien werden ausschließlich aus einer offiziellen Google-Fonts-Quelle bezogen, lokal als WOFF2 gespeichert und mit ihrer OFL-Lizenz dokumentiert.
- Nur deutsche und benötigte lateinische Zeichen sowie tatsächlich verwendete Gewichte werden ausgeliefert.
- Das Wayfinder-/D20-SVG ist eine eigene geometrische Konstruktion ohne geschützte D&D-/BG3-Grafik.
- Keine Rastertextur, kein Bildpaket und keine externe Font- oder Icon-Anfrage zur Laufzeit.

## 14. Tests und Nachweise

### 14.1 Automatisiert

- Component Tests prüfen sichtbaren Namen, Keyboard-Aktivierung, Dialogöffnung, Fokus, Fehlerzustand, gültige Bestätigung und Fokus-Rückgabe.
- axe-core prüft den gerenderten UI-Lab-Patternbaum; Farbkontrast wird zusätzlich über einen realen Browser-/Tokenaudit nachgewiesen, weil jsdom keine verlässliche Pixelberechnung liefert.
- Reduced-Motion-Test simuliert `matchMedia` und prüft den unmittelbaren, weiterhin sichtbaren Zustandswechsel.
- Architekturtest bestätigt öffentliche `@dndimension/ui`-Imports und verhindert Tiefenimporte.
- Production-Build-Test bestätigt die Abwesenheit der Development-only UI-Lab-Route und ihrer Demo-Texte.
- Playwright verwendet lokal den installierten Edge-Kanal; es wird kein Browser heruntergeladen.

### 14.2 Manuell

- vollständiger Tastaturdurchlauf;
- Fokus sichtbar und nicht verdeckt;
- 200-Prozent-Zoom und Smartphonebreite;
- Default- und Pergamentvorschau;
- Reduced Motion und Forced Colors;
- visuelle Prüfung gegen übermäßige Ornamente, Textur und Videospielnähe.

## 15. Messbudgets des Spikes

Die bestehenden Blueprint-Grenzen bleiben verbindlich. Zusätzlich berichtet #69 getrennt:

| Bereich | Spike-Grenze |
|---|---:|
| gesamtes Production-JavaScript, raw | maximal 650 KiB |
| gesamtes Production-JavaScript, gzip | maximal 180 KiB |
| Production-CSS | maximal 50 KiB |
| lokale WOFF2-Fonts zusammen | maximal 500 KiB |
| eigene SVG-Assets zusammen | maximal 25 KiB |
| gesamter Production-Build | weiterhin maximal 50 MiB |
| projektlokale Dependencies | weiterhin unter 1 GiB |
| Testartefakte | weiterhin maximal 250 MiB und bereinigbar |

Überschreitungen blockieren den Spike-Abschluss, bis Nutzen, Ursache und eine neue Entscheidung dokumentiert sind. Source Maps werden für die Messung separat ausgewiesen und nach dem Foundation-Spike für Production neu bewertet.

## 16. Nichtziele

- kein produktiver Settings-Screen oder persistierter Theme-Wechsel;
- kein vollständiger Komponentenbaukasten;
- kein Character-/Campaign-/Session-Feature;
- kein PWA-Service-Worker;
- kein Storybook, Material UI, Tailwind-UI-Kit, Cypress oder lokaler Browserdownload;
- keine geschützten D&D-/BG3-Assets und keine nachgeahmte markante Spieloberfläche;
- keine dauerhaften Ambient-Animationen oder große Medienbibliothek.

## 17. Akzeptanzabbildung für #69

| Kriterium | Designnachweis |
|---|---|
| Token -> Primitive -> Component -> Pattern | Abschnitte 7 und 8; `WaypointDraftPattern` |
| Tastatur, Fokus, Name, Kontrast, Touch | Abschnitt 12 und Component-/Browserchecks |
| Reduced Motion | Abschnitt 10 und automatisierter MatchMedia-/Edge-Test |
| UI-Lab nicht in Production | Abschnitt 9 plus Build-Inhaltsprüfung |
| kein schweres UI-/Testtool | Abschnitte 13, 15 und 16 |
| JS, CSS, Font, Asset, Test getrennt messen | Abschnitt 15 und Validation Report |
| DEC-010 bestätigen oder anpassen | Abschlussreport vergleicht Messung und Verhalten mit DEC-010 |

## 18. Exit-Kriterium

P-04/#69 ist bestanden, wenn der vollständige UI-Lab-Pfad in Component Tests und lokalem Edge funktioniert, die Production-Grenze technisch nachgewiesen ist, alle Accessibility-/Reduced-Motion-Mindestchecks dokumentiert sind, sämtliche Größenbudgets bestehen und DEC-010 ohne offene kritische Abweichung bestätigt oder aktualisiert wurde.

# Navigation Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ein isolierter klickbarer Designprototyp verbindet Raum, Figurenbuch, Karte und Sitzung mit synthetischen Daten.

**Architecture:** Eine unabhängige statische Browserdemo unter `docs/design/prototype` nutzt Hash-Navigation, semantisches HTML, CSS und einen kleinen getesteten Zustandskern. Kein Import aus der produktiven App, keine Veränderung des separaten UI-Foundation-Worktrees. Die PNG-Studien dienen zunächst als ausdrücklich erkennbare visuelle Referenzflächen, nicht als fertige UI-Assets.

**Tech Stack:** HTML, CSS, JavaScript-Module, Node.js 24 für Tests und einen ausschließlich an Loopback gebundenen lokalen Vorschau-Server. Keine neuen Pakete.

**Spec:** [Übergangsabläufe](../../design/2026-09-08-transition-flows.md) und [Designreferenz](../../design/2026-09-08-visual-direction-and-interaction.md).

## Global Constraints

- Kennzeichnung: „Design-Demo – keine echten Spielstände“ dauerhaft sichtbar.
- Keine Regelengine, KI, Accounts, Multiplayer, echten Ressourcenänderungen oder Produktionspersistenz.
- Raum → Station: bevorzugt 350–450 ms, niemals über 600 ms; Arbeitsansichten/Panel 180–240 ms.
- Reduced Motion: keine räumliche Bewegung. Beschriftete Direktlinks bleiben verfügbar.
- Die Demo hält Eingaben nur im Arbeitsspeicher; Reload verwirft sie mit vorher sichtbarem Hinweis.
- Produktcode unter `code/` und vorhandener UI-Foundation-Worktree bleiben unverändert.
- Keine Produktionsintegration oder vollständige Erfüllung sämtlicher TR-Szenarien behaupten.

## Dateigrenzen

| Datei unter `docs/design/prototype/` | Verantwortung |
|---|---|
| `index.html` | Demo-Hinweis, Navigation und semantische Ansichtsbereiche |
| `styles.css` | responsive Darstellung, Fokus und reduzierte Bewegung |
| `state.mjs` | Navigation und temporärer Zustand ohne DOM |
| `state.test.mjs` | Verhalten des Zustandskerns |
| `app.mjs` | DOM-Ereignisse, Hash-Navigation, Fokus und Darstellung |
| `serve.mjs` | lokaler statischer Vorschau-Server mit begrenztem Dokumentenroot |
| `README.md` | Start, Umfang, Grenzen und tatsächlich erfolgte Prüfungen |

## Task 1: Zustandskern und Demo-Navigation

**Interfaces:** `createState()` erzeugt `{route:'room', draft:'', panel:null, reading:false, place:null}`. `transition(state, event)` liefert einen neuen Zustand. Ereignisse: `{type:'navigate', route}`, `{type:'draft', value}`, `{type:'panel', panel}`, `{type:'reading', value}`, `{type:'place', place}`. Erlaubte Routen: `room`, `character`, `world`, `session`. Ungültige Routen führen zu `room`. Bereichswechsel schließt temporäre Panels, bewahrt Entwurf, Lesemodus und Ortsauswahl.

- [ ] Testdatei mit realen Zustandsübergängen zuerst schreiben. Beispiele:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, transition } from './state.mjs';
test('navigation preserves an action draft and closes context', () => {
  const before = {...createState(), draft:'Ich frage Mira.', panel:'figures'};
  const after = transition(before, {type:'navigate', route:'world'});
  assert.equal(after.route, 'world');
  assert.equal(after.draft, 'Ich frage Mira.');
  assert.equal(after.panel, null);
  assert.equal(before.panel, 'figures');
});
test('unknown routes recover to the room', () => {
  assert.equal(transition(createState(), {type:'navigate', route:'missing'}).route, 'room');
});
```

- [ ] `node --test docs/design/prototype/state.test.mjs` ausführen und fehlendes Verhalten nachweisen.
- [ ] Zustandskern gemäß obigem Vertrag implementieren; Events dürfen keine Spielfolgen erzeugen. Unbekannte Events behalten den alten Zustand.
- [ ] Weitere unabhängige Tests: Text ändern und wieder löschen; Panel wechseln/schließen; Lesemodus und Ortsauswahl über Navigation erhalten; Eingabeobjekt nicht verändern.
- [ ] Tests erneut ausführen; erst bei Grün UI anbinden.

## Task 2: Vier verbundene Ansichten

**Consumes:** `createState`, `transition`. **Produces:** dieselben vier Ansichten über Direktlinks und Browser-History.

- [ ] HTML-Grundstruktur mit `lang="de"`, Viewport, Skip-Link, Demo-Hinweis und Links `#room`, `#character`, `#world`, `#session` erstellen.
- [ ] Ansichten als echte HTML-Bereiche anlegen. Die Bildstudien dürfen nur als Referenzbilder mit entsprechender Beschreibung erscheinen; sichtbare Bildbuttons werden nicht als funktionierende Controls ausgegeben. Tatsächliche Navigation und Inputs liegen klar getrennt daneben.
- [ ] Hash auslesen, über `transition` validieren und genau einen Bereich zeigen. Ungültige Hashes per `history.replaceState` auf `#room` normalisieren; Browser-Zurück über `hashchange` verarbeiten.
- [ ] Fokus nach Navigation auf die jeweilige Überschrift setzen. Aktiven Link mit `aria-current="page"` markieren. Raumrückkehr fokussiert den passenden Stationslink, sofern vorhanden.
- [ ] Charakteransicht als begrenzten Neris-Demoentwurf kennzeichnen. Kein Regelabschluss oder Speicherversprechen.
- [ ] Weltansicht bietet echte beschriftete Ortsauswahl und schließbares Dossier für Nordtor/Alter Steg. Kartengesten sind in dieser ersten Demo ausdrücklich nicht implementiert; das Referenzbild bleibt nicht-interaktiv.
- [ ] Sitzung bietet bearbeitbaren Entwurf, umschaltbaren Lesemodus und ein Figurenpanel. Panelzustand nicht in History aufnehmen. Schließen stellt Auslöserfokus wieder her. Im ersten Slice bleibt das Panel auf allen Breiten nicht-modal im Inhaltsfluss; die spätere mobile Modalvariante ist nicht vorzutäuschen.
- [ ] „Auflösung vorbereiten“ öffnet nur eine Vorschau des eingegebenen Texts mit dem Hinweis „Simulation – keine Spielfolgen“. Nutzereingabe über `textContent` ausgeben, nicht als HTML.
- [ ] Leseposition vor Kontextwechsel erfassen und wiederherstellen. Keine automatische Schriftverkleinerung oder Animation hinter dem Lesetext.
- [ ] CSS aus der vorhandenen Palette ableiten; System-Fallbackschriften verwenden und Abweichung von endgültigen Foundation-Fonts dokumentieren. Keine Remote-Fonts oder zusätzlichen Libraries laden.

## Task 3: Lokal öffnen und ehrlich verifizieren

**Consumes:** HTML/JS/CSS und bestehende `docs/design/assets`. **Produces:** lokale Vorschau und Prüfbericht.

- [ ] `serve.mjs` nur an `127.0.0.1` binden. Dokumentenroot ausschließlich `docs/design`; normalisierte URL-Pfade gegen Root prüfen, Traversal ablehnen, unbekannte Dateien mit 404 beantworten. HTML/CSS/JS/PNG korrekt ausliefern. Keine Verzeichnisauflistung oder privaten PDFs zugänglich machen.
- [ ] Startbefehl dokumentieren: `node docs/design/prototype/serve.mjs`; Vorschau `http://127.0.0.1:4178/prototype/`.
- [ ] Syntaxprüfungen: `node --check` für jedes Modul. Zustandsprüfungen mit `node --test` ausführen.
- [ ] Browser prüfen: alle vier Direktlinks; Browser-Zurück; Entwurf nach Bereichswechsel; Panel öffnen/schließen; Lesefokus; unbekannter Hash; leere Handlung; Text mit HTML-Zeichen; 390-Pixel-Ansicht; Reduced Motion.
- [ ] Dokumentieren, welche Prüfungen wirklich ausgeführt wurden und welche offen sind. Keine vollständige Accessibility-/Performance-Abnahme aus wenigen Stichproben ableiten.
- [ ] README und Designindex verlinken; Diff kontrollieren und nur Demo-/Planungsdateien committen. GitHub-Sicherung auf separatem Prototypbranch bevorzugen; Dokumentationsbranch nicht unbemerkt als Produktbranch umwidmen.

## Abgrenzung zu EXP-02

Dieser erste Durchstich prüft Navigation und einfache Zustandskontinuität. Eine bildgetreue, vollständig responsive Oberfläche, echte Kartenbedienung, mobile Modalfokusführung und Speicherfehler-Simulation bleiben gesonderte nächste Teilaufgaben. EXP-02 wird dadurch nicht pauschal als abgeschlossen markiert.

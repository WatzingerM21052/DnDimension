import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import {
  assertProductionSourceMapsExcludeSources,
  assertProductionUiFoundations,
  findForbiddenUiLabContent,
} from "./check-production-ui.mjs";

const createDist = (files) => {
  const distRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dndimension-production-ui-"));

  for (const [relativeFile, content] of Object.entries(files)) {
    const target = path.join(distRoot, relativeFile);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }

  return distRoot;
};

test("finds UI lab markers in production text assets and chunk names", () => {
  const cleanDist = createDist({ "assets/app.js": "production-safe text" });
  const dirtyDist = createDist({ "assets/demo.js": "DnDimension UI Lab" });
  const namedChunk = createDist({ "assets/ui-lab-ab12.js": "production-safe text" });

  try {
    assert.deepEqual(findForbiddenUiLabContent(cleanDist), []);
    assert.deepEqual(findForbiddenUiLabContent(dirtyDist), [
      { file: "assets/demo.js", marker: "DnDimension UI Lab" },
    ]);
    assert.deepEqual(findForbiddenUiLabContent(namedChunk), [
      { file: "assets/ui-lab-ab12.js", marker: "ui-lab-filename" },
    ]);
  } finally {
    fs.rmSync(cleanDist, { force: true, recursive: true });
    fs.rmSync(dirtyDist, { force: true, recursive: true });
    fs.rmSync(namedChunk, { force: true, recursive: true });
  }
});

test("requires production CSS to retain font faces, font files, and both theme foundations", () => {
  const completeDist = createDist({
    "assets/app.css": `
      @font-face { font-family: Test; src: url("/assets/test.woff2") format("woff2"); }
      :root, [data-theme="night-chart"] { --font-body: Test; --color-surface-canvas: #000; }
      [data-theme="vellum-study"] { --color-surface-canvas: #fff; }
    `,
  });
  const incompleteDist = createDist({
    "assets/app.css": ":root { --font-body: Test; --color-surface-canvas: #000; }",
  });

  try {
    assert.doesNotThrow(() => assertProductionUiFoundations(completeDist));
    assert.throws(
      () => assertProductionUiFoundations(incompleteDist),
      /Production UI foundations missing: font-face, woff2-url, night-chart-theme, vellum-study-theme/,
    );
  } finally {
    fs.rmSync(completeDist, { force: true, recursive: true });
    fs.rmSync(incompleteDist, { force: true, recursive: true });
  }
});

test("requires source maps without embedded source text", () => {
  const safeDist = createDist({
    "assets/app.js.map": JSON.stringify({ version: 3, sources: ["src/App.tsx"], mappings: "" }),
  });
  const leakingDist = createDist({
    "assets/app.js.map": JSON.stringify({
      version: 3,
      sources: ["src/dev/ui-lab/UiLab.tsx"],
      sourcesContent: ["export const UiLab = () => null;"],
      mappings: "",
    }),
  });

  try {
    assert.doesNotThrow(() => assertProductionSourceMapsExcludeSources(safeDist));
    assert.throws(
      () => assertProductionSourceMapsExcludeSources(leakingDist),
      /Production source maps embed source text: assets\/app\.js\.map/,
    );
  } finally {
    fs.rmSync(safeDist, { force: true, recursive: true });
    fs.rmSync(leakingDist, { force: true, recursive: true });
  }
});

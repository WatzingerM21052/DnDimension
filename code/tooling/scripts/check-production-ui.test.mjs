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

const completeFoundationCss = `
  @font-face { font-family: "Body Face"; src: url("/assets/body.woff2") format("woff2"); }
  @font-face { font-family: "Display Face"; src: url("/assets/display.woff2") format("woff2"); }
  :root, [data-theme="night-chart"] {
    --font-body: "Body Face", serif;
    --font-display: "Display Face", serif;
    --color-surface-canvas: #000;
  }
  [data-theme="vellum-study"] { --color-surface-canvas: #fff; }
  body { font-family: var(--font-body); }
  .title { font-family: var(--font-display); }
`;

const createFoundationDist = (css = completeFoundationCss, files = {}) =>
  createDist({
    "assets/app.css": css,
    "assets/body.woff2": "body font",
    "assets/display.woff2": "display font",
    ...files,
  });

const removeDist = (distRoot) => fs.rmSync(distRoot, { force: true, recursive: true });

test("accepts linked body and display token font chains with emitted WOFF2 files", () => {
  const distRoot = createFoundationDist();

  try {
    assert.doesNotThrow(() => assertProductionUiFoundations(distRoot));
  } finally {
    removeDist(distRoot);
  }
});

test("rejects CSS when body does not use the body font token", () => {
  const distRoot = createFoundationDist(
    completeFoundationCss.replace("font-family: var(--font-body)", "font-family: serif"),
  );

  try {
    assert.throws(() => assertProductionUiFoundations(distRoot), /body-font-usage-missing/);
  } finally {
    removeDist(distRoot);
  }
});

test("rejects token usage on a body-named class when body uses a serif fallback", () => {
  const distRoot = createFoundationDist(
    completeFoundationCss
      .replace("body { font-family: var(--font-body); }", "body { font-family: serif; }")
      .concat(".body-copy { font-family: var(--font-body); }"),
  );

  try {
    assert.throws(() => assertProductionUiFoundations(distRoot), /body-font-usage-missing/);
  } finally {
    removeDist(distRoot);
  }
});

test("rejects body and display token prefixes instead of the exact token names", () => {
  const distRoot = createFoundationDist(
    completeFoundationCss
      .replace("var(--font-body)", "var(--font-body-alt)")
      .replace("var(--font-display)", "var(--font-display-alt)"),
  );

  try {
    assert.throws(() => assertProductionUiFoundations(distRoot), /body-font-usage-missing/);
    assert.throws(() => assertProductionUiFoundations(distRoot), /display-font-usage-missing/);
  } finally {
    removeDist(distRoot);
  }
});

test("rejects a non-ASCII identifier suffix on the body font token", () => {
  const distRoot = createFoundationDist(
    completeFoundationCss.replace("var(--font-body)", "var(--font-bodyé, serif)"),
  );

  try {
    assert.throws(() => assertProductionUiFoundations(distRoot), /body-font-usage-missing/);
  } finally {
    removeDist(distRoot);
  }
});

test("rejects a non-ASCII identifier suffix on the display font token", () => {
  const distRoot = createFoundationDist(
    completeFoundationCss.replace("var(--font-display)", "var(--font-displayé, serif)"),
  );

  try {
    assert.throws(() => assertProductionUiFoundations(distRoot), /display-font-usage-missing/);
  } finally {
    removeDist(distRoot);
  }
});

test("rejects body text found only inside selector strings and comments", () => {
  const distRoot = createFoundationDist(
    completeFoundationCss.replace(
      "body { font-family: var(--font-body); }",
      `/* body.app { font-family: var(--font-body); } */
      [data-label=" body.foo"], [data-path='html>body.app'] {
        font-family: var(--font-body);
      }`,
    ),
  );

  try {
    assert.throws(() => assertProductionUiFoundations(distRoot), /body-font-usage-missing/);
  } finally {
    removeDist(distRoot);
  }
});

test("accepts exact tokens with fallbacks in minified compound and comma-separated rules", () => {
  const distRoot = createFoundationDist(
    completeFoundationCss
      .replace(
        "body { font-family: var(--font-body); }",
        "html>body.app,html body#shell{font-family:var(--font-body,serif)}",
      )
      .replace(
        ".title { font-family: var(--font-display); }",
        '.title,.heading{font-family:var(--font-display,"Display Face")}',
      ),
  );

  try {
    assert.doesNotThrow(() => assertProductionUiFoundations(distRoot));
  } finally {
    removeDist(distRoot);
  }
});

test("rejects CSS when a token family has no matching font face", () => {
  const distRoot = createFoundationDist(
    completeFoundationCss.replace(
      '@font-face { font-family: "Body Face"; src: url("/assets/body.woff2") format("woff2"); }',
      "",
    ),
  );

  try {
    assert.throws(() => assertProductionUiFoundations(distRoot), /body-font-face-missing/);
  } finally {
    removeDist(distRoot);
  }
});

test("rejects a WOFF2 URL outside the matching font face block", () => {
  const distRoot = createFoundationDist(
    completeFoundationCss.replace(
      'src: url("/assets/body.woff2") format("woff2")',
      'src: local("Body Face")',
    ),
  );

  try {
    assert.throws(() => assertProductionUiFoundations(distRoot), /body-font-face-woff2-missing/);
  } finally {
    removeDist(distRoot);
  }
});

test("rejects a matching font face when its WOFF2 target is absent from dist", () => {
  const distRoot = createFoundationDist();
  fs.rmSync(path.join(distRoot, "assets/body.woff2"));

  try {
    assert.throws(
      () => assertProductionUiFoundations(distRoot),
      /body-woff2-target-missing: assets\/body\.woff2/,
    );
  } finally {
    removeDist(distRoot);
  }
});

test("rejects matching font-face URLs that escape the production dist", () => {
  const distRoot = createFoundationDist(
    completeFoundationCss.replace('url("/assets/body.woff2")', 'url("../../outside.woff2")'),
  );

  try {
    assert.throws(
      () => assertProductionUiFoundations(distRoot),
      /body-woff2-target-invalid: path-outside-dist/,
    );
  } finally {
    removeDist(distRoot);
  }
});

test("rejects font targets reached through an external linked assets directory", (t) => {
  const distRoot = createFoundationDist();
  const externalRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dndimension-external-fonts-"));
  const linkedAssets = path.join(distRoot, "assets");
  const externalAssets = path.join(externalRoot, "assets");
  fs.mkdirSync(externalAssets);
  fs.writeFileSync(path.join(externalAssets, "body.woff2"), "external body font");
  fs.writeFileSync(path.join(externalAssets, "display.woff2"), "external display font");
  fs.renameSync(path.join(linkedAssets, "app.css"), path.join(distRoot, "app.css"));
  fs.rmSync(linkedAssets, { force: true, recursive: true });

  try {
    fs.symlinkSync(externalAssets, linkedAssets, process.platform === "win32" ? "junction" : "dir");
  } catch (error) {
    removeDist(distRoot);
    fs.rmSync(externalRoot, { force: true, recursive: true });
    t.skip(`Could not create a directory link: ${error instanceof Error ? error.message : error}`);
    return;
  }

  try {
    assert.throws(
      () => assertProductionUiFoundations(distRoot),
      /body-woff2-target-invalid: path-outside-real-dist/,
    );
  } finally {
    removeDist(distRoot);
    fs.rmSync(externalRoot, { force: true, recursive: true });
  }
});

test("rejects a missing WOFF2 sibling even when another matching face target exists", () => {
  const distRoot = createFoundationDist(
    completeFoundationCss.replace(
      '@font-face { font-family: "Display Face"; src: url("/assets/display.woff2") format("woff2"); }',
      `@font-face { font-family: "Display Face"; src: url("/assets/display.woff2") format("woff2"); }
      @font-face { font-family: "Display Face"; src: url("/assets/display-missing.woff2") format("woff2"); }`,
    ),
  );

  try {
    assert.throws(
      () => assertProductionUiFoundations(distRoot),
      /display-woff2-target-missing: assets\/display-missing\.woff2/,
    );
  } finally {
    removeDist(distRoot);
  }
});

test("rejects a local-only matching face even when another matching face has WOFF2", () => {
  const distRoot = createFoundationDist(
    completeFoundationCss.replace(
      '@font-face { font-family: "Display Face"; src: url("/assets/display.woff2") format("woff2"); }',
      `@font-face { font-family: "Display Face"; src: url("/assets/display.woff2") format("woff2"); }
      @font-face { font-family: "Display Face"; src: local("Display Face Bold"); font-weight: 700; }`,
    ),
  );

  try {
    assert.throws(() => assertProductionUiFoundations(distRoot), /display-font-face-woff2-missing/);
  } finally {
    removeDist(distRoot);
  }
});

test("rejects a face whose last src declaration is local-only", () => {
  const distRoot = createFoundationDist(
    completeFoundationCss.replace(
      'src: url("/assets/body.woff2") format("woff2")',
      'src: url("/assets/body.woff2") format("woff2"); src: local("Body Face")',
    ),
  );

  try {
    assert.throws(() => assertProductionUiFoundations(distRoot), /body-font-face-woff2-missing/);
  } finally {
    removeDist(distRoot);
  }
});

test("rejects a face whose last src declaration points to a missing WOFF2", () => {
  const distRoot = createFoundationDist(
    completeFoundationCss.replace(
      'src: url("/assets/body.woff2") format("woff2")',
      `src: url("/assets/body.woff2") format("woff2");
      src: url("/assets/body-missing.woff2") format("woff2")`,
    ),
  );

  try {
    assert.throws(
      () => assertProductionUiFoundations(distRoot),
      /body-woff2-target-missing: assets\/body-missing\.woff2/,
    );
  } finally {
    removeDist(distRoot);
  }
});

test("accepts a face whose last src declaration replaces an earlier missing target", () => {
  const distRoot = createFoundationDist(
    completeFoundationCss.replace(
      'src: url("/assets/body.woff2") format("woff2")',
      `src: url("/assets/body-missing.woff2") format("woff2");
      src: url("/assets/body.woff2") format("woff2")`,
    ),
  );

  try {
    assert.doesNotThrow(() => assertProductionUiFoundations(distRoot));
  } finally {
    removeDist(distRoot);
  }
});

test("rejects adversarial unlinked font fragments", () => {
  const distRoot = createFoundationDist(`
    @font-face { }
    .unused { background: url("/assets/body.woff2"); }
    :root, [data-theme="night-chart"] {
      --font-body: "Body Face", serif;
      --font-display: "Display Face", serif;
      --color-surface-canvas: #000;
    }
    [data-theme="vellum-study"] { --color-surface-canvas: #fff; }
    body { font-family: serif; }
    .title { font-family: serif; }
  `);

  try {
    assert.throws(() => assertProductionUiFoundations(distRoot), /body-font-usage-missing/);
  } finally {
    removeDist(distRoot);
  }
});

test("rejects CSS when display text does not use the display font token", () => {
  const distRoot = createFoundationDist(
    completeFoundationCss.replace("font-family: var(--font-display)", "font-family: serif"),
  );

  try {
    assert.throws(() => assertProductionUiFoundations(distRoot), /display-font-usage-missing/);
  } finally {
    removeDist(distRoot);
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

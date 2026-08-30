import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { findForbiddenUiLabContent } from "./check-production-ui.mjs";

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

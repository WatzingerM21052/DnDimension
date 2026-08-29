import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { cleanCategory, cleanTargets } from "./clean.mjs";

const createFile = (target, content = "fixture") => {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
};

test("build cleanup removes build output and preserves source and other categories", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dndimension-clean-"));
  try {
    const build = path.join(root, "apps/web/dist/index.html");
    const cache = path.join(root, ".cache/state");
    const source = path.join(root, "apps/web/src/main.tsx");
    createFile(build);
    createFile(cache);
    createFile(source);

    cleanCategory({ root, category: "build" });

    assert.equal(fs.existsSync(path.dirname(build)), false);
    assert.equal(fs.existsSync(cache), true);
    assert.equal(fs.existsSync(source), true);
  } finally {
    fs.rmSync(root, { force: true, recursive: true });
  }
});

test("build and cache cleanup remove the UI package generated directories", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dndimension-clean-"));
  try {
    const declaration = path.join(root, "packages/ui/dist/index.d.ts");
    const cache = path.join(root, "packages/ui/.cache/state");
    createFile(declaration);
    createFile(cache);

    cleanCategory({ root, category: "build" });
    cleanCategory({ root, category: "cache" });

    assert.equal(fs.existsSync(path.dirname(declaration)), false);
    assert.equal(fs.existsSync(path.dirname(cache)), false);
  } finally {
    fs.rmSync(root, { force: true, recursive: true });
  }
});

test("validates every target before deleting the first one", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dndimension-clean-"));
  try {
    const generated = path.join(root, "dist");
    const protectedSource = path.join(root, "apps/web/src/main.tsx");
    createFile(path.join(generated, "index.html"));
    createFile(protectedSource);

    assert.throws(
      () => cleanTargets({ root, targets: [generated, protectedSource] }),
      /Refusing unsafe generated path/,
    );
    assert.equal(fs.existsSync(generated), true);
    assert.equal(fs.existsSync(protectedSource), true);
  } finally {
    fs.rmSync(root, { force: true, recursive: true });
  }
});

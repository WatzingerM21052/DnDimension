import assert from "node:assert/strict";
import { test } from "node:test";
import path from "node:path";
import { analyzeFiles } from "./check-import-boundaries.mjs";

const root = path.resolve("virtual-dndimension");
const webFile = path.join(root, "apps", "web", "src", "main.ts");

test("allows public package imports", () => {
  const result = analyzeFiles({
    root,
    sources: new Map([[webFile, 'import { ok } from "@dndimension/core";']]),
  });

  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.cycles, []);
});

test("allows the declared public UI stylesheet subpath", () => {
  const result = analyzeFiles({
    root,
    sources: new Map([[webFile, 'import "@dndimension/ui/styles.css";']]),
  });

  assert.deepEqual(result.violations, []);
});

test("rejects package deep imports", () => {
  const result = analyzeFiles({
    root,
    sources: new Map([[webFile, 'import { ok } from "@dndimension/core/src/result";']]),
  });

  assert.equal(result.violations.length, 1);
  assert.match(result.violations[0].specifier, /core\/src\/result/);
});

test("rejects relative imports across workspace units", () => {
  const result = analyzeFiles({
    root,
    sources: new Map([[webFile, 'import { ok } from "../../../packages/core/src/result";']]),
  });

  assert.equal(result.violations[0].code, "cross_unit_relative_import");
});

test("reports package cycles once from their smallest package", () => {
  const result = analyzeFiles({
    root,
    sources: new Map([
      [
        path.join(root, "packages", "core", "src", "index.ts"),
        'export * from "@dndimension/domain";',
      ],
      [
        path.join(root, "packages", "domain", "src", "index.ts"),
        'export * from "@dndimension/core";',
      ],
    ]),
  });

  assert.deepEqual(result.cycles, [
    ["@dndimension/core", "@dndimension/domain", "@dndimension/core"],
  ]);
});

import assert from "node:assert/strict";
import path from "node:path";
import { test } from "node:test";
import { assertAllowedGeneratedPath } from "./safe-paths.mjs";

const root = path.resolve("virtual-safe-root");

test("accepts only known generated directories", () => {
  const allowed = [
    "dist",
    "dev-dist",
    ".vite",
    ".cache",
    "coverage",
    "playwright-report",
    "test-results",
    "blob-report",
    "packages/core/dist",
    "apps/web/dist",
  ];

  for (const relative of allowed) {
    assert.equal(
      assertAllowedGeneratedPath(root, path.join(root, relative)),
      path.join(root, relative),
    );
  }
});

test("rejects repository, parent, sources, docs and private work", () => {
  const rejected = [
    root,
    path.dirname(root),
    path.join(root, "private-library"),
    path.join(root, "tmp"),
    path.join(root, "docs"),
    path.join(root, "apps/web/src"),
    path.join(root, "packages/core/src"),
  ];

  for (const target of rejected) {
    assert.throws(() => assertAllowedGeneratedPath(root, target), /Refusing unsafe generated path/);
  }
});

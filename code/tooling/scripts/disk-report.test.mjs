import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { evaluateBudget, formatMiB, measurePath, resolvePnpmStore } from "./disk-report.mjs";

test("measures recursive file bytes and treats missing paths as zero", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dndimension-disk-"));
  try {
    fs.mkdirSync(path.join(root, "nested"));
    fs.writeFileSync(path.join(root, "first"), "abc");
    fs.writeFileSync(path.join(root, "nested", "second"), "1234");

    assert.equal(measurePath(root), 7);
    assert.equal(measurePath(path.join(root, "missing")), 0);
  } finally {
    fs.rmSync(root, { force: true, recursive: true });
  }
});

test("formats MiB consistently", () => {
  assert.equal(formatMiB(1024 * 1024), "1.00 MiB");
});

test("warns only when a budget is exceeded", () => {
  assert.equal(evaluateBudget(10, 10), "pass");
  assert.equal(evaluateBudget(11, 10), "warning");
});

test("resolves the pnpm store through cmd on Windows", () => {
  const calls = [];
  const result = resolvePnpmStore({
    root: path.resolve("missing-pnpm-metadata"),
    platform: "win32",
    execute: (command, args) => {
      calls.push({ command, args });
      return "M:\\.pnpm-store\\v11\r\n";
    },
  });

  assert.equal(result, "M:\\.pnpm-store\\v11");
  assert.deepEqual(calls, [{ command: "cmd.exe", args: ["/d", "/s", "/c", "pnpm store path"] }]);
});

test("reads the store path from installed pnpm metadata without spawning pnpm", () => {
  const result = resolvePnpmStore({
    root: path.resolve("workspace"),
    readFile: () => JSON.stringify({ storeDir: "M:\\.pnpm-store\\v11" }),
    execute: () => {
      throw new Error("pnpm must not be spawned");
    },
  });

  assert.equal(result, "M:\\.pnpm-store\\v11");
});

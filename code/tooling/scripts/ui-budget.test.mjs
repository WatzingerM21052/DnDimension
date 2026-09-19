import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { createUiBudgetReport, evaluateUiBudget } from "./ui-budget.mjs";

const createFile = (target, bytes) => {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, Buffer.alloc(bytes, "a"));
};

test("reports JavaScript raw and gzip separately from CSS, fonts and SVG", () => {
  const distRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dndimension-ui-budget-"));
  const generousBudgets = {
    javascriptRaw: 1_000,
    javascriptGzip: 1_000,
    css: 1_000,
    fonts: 1_000,
    svg: 1_000,
    total: 10_000,
  };

  try {
    createFile(path.join(distRoot, "assets/app.js"), 200);
    createFile(path.join(distRoot, "assets/app.css"), 30);
    createFile(path.join(distRoot, "assets/app.woff2"), 40);
    createFile(path.join(distRoot, "assets/icon.svg"), 50);
    createFile(path.join(distRoot, "assets/app.js.map"), 60);

    const report = createUiBudgetReport({ distRoot, budgets: generousBudgets });

    assert.equal(report.rows.find(({ key }) => key === "javascriptRaw").bytes, 200);
    assert.ok(report.rows.find(({ key }) => key === "javascriptGzip").bytes < 200);
    assert.equal(report.rows.find(({ key }) => key === "css").bytes, 30);
    assert.equal(report.rows.find(({ key }) => key === "fonts").bytes, 40);
    assert.equal(report.rows.find(({ key }) => key === "svg").bytes, 50);
    assert.equal(report.sourceMapsBytes, 60);
  } finally {
    fs.rmSync(distRoot, { force: true, recursive: true });
  }
});

test("marks an exact budget as pass and one byte above as warning", () => {
  assert.equal(evaluateUiBudget(180 * 1024, 180 * 1024), "pass");
  assert.equal(evaluateUiBudget(180 * 1024 + 1, 180 * 1024), "warning");
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { evaluateDoctor } from "./doctor.mjs";

const healthyFacts = {
  nodeVersion: "24.11.0",
  referenceNodeVersion: "24.20.0",
  pnpmVersion: "11.19.0",
  lockfileExists: true,
  missingWorkspacePackages: [],
  edgeExists: true,
  trackedSensitive: [],
};

test("accepts a compatible local Node patch and explains the reference mismatch", () => {
  const result = evaluateDoctor(healthyFacts);

  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
  assert.match(result.warnings[0], /reference is 24\.20\.0/);
});

test("rejects incompatible runtimes and tracked private paths", () => {
  const result = evaluateDoctor({
    ...healthyFacts,
    nodeVersion: "23.9.0",
    trackedSensitive: ["private-library/book.pdf"],
  });

  assert.equal(result.ok, false);
  assert.equal(result.errors.length, 2);
  assert.match(result.errors.join(" "), /Node 24/);
  assert.match(result.errors.join(" "), /private-library/);
});

test("reports every missing required workspace package", () => {
  const result = evaluateDoctor({
    ...healthyFacts,
    missingWorkspacePackages: ["packages/ui/package.json"],
  });

  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /packages\/ui\/package\.json/);
});

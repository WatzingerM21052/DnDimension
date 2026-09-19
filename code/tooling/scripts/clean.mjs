import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { assertAllowedGeneratedPath } from "./safe-paths.mjs";

const CATEGORY_TARGETS = Object.freeze({
  build: [
    "dist",
    "dev-dist",
    "apps/web/dist",
    "apps/web/dev-dist",
    "packages/core/dist",
    "packages/ui/dist",
  ],
  test: ["coverage", "playwright-report", "test-results", "blob-report"],
  cache: [
    ".vite",
    ".cache",
    "apps/web/.vite",
    "apps/web/.cache",
    "packages/core/.cache",
    "packages/ui/.cache",
  ],
});

export const cleanTargets = ({ root, targets }) => {
  const validated = targets.map((target) => assertAllowedGeneratedPath(root, target));
  for (const target of validated) fs.rmSync(target, { force: true, recursive: true });
  return validated;
};

export const cleanCategory = ({ root, category }) => {
  if (category !== "build" && category !== "test" && category !== "cache" && category !== "deep") {
    throw new Error(`Unknown clean category: ${category}`);
  }

  const names =
    category === "deep"
      ? [...CATEGORY_TARGETS.build, ...CATEGORY_TARGETS.test, ...CATEGORY_TARGETS.cache]
      : CATEGORY_TARGETS[category];
  const targets = [...new Set(names)].map((relative) => path.join(root, relative));
  return cleanTargets({ root, targets });
};

const isCli =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isCli) {
  try {
    const category = process.argv[2];
    const removed = cleanCategory({ root: process.cwd(), category });
    console.log(`Validated and cleaned ${removed.length} generated paths (${category}).`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const workspaceUnit = (root, file) => {
  const relative = path.relative(root, path.resolve(file));
  const parts = relative.split(path.sep);

  if ((parts[0] === "apps" || parts[0] === "packages") && parts[1]) {
    return `@dndimension/${parts[1]}`;
  }

  return null;
};

const findCycles = (graph) => {
  const cycles = [];
  const seen = new Set();
  const nodes = [...graph.keys()].sort();

  const visit = (start, current, trail) => {
    for (const next of [...(graph.get(current) ?? [])].sort()) {
      if (next === start) {
        const cycleNodes = [...trail, start];
        const members = cycleNodes.slice(0, -1);
        if (start !== [...members].sort()[0]) continue;

        const key = cycleNodes.join("->");
        if (!seen.has(key)) {
          seen.add(key);
          cycles.push(cycleNodes);
        }
        continue;
      }

      if (!trail.includes(next)) visit(start, next, [...trail, next]);
    }
  };

  for (const node of nodes) visit(node, node, [node]);
  return cycles.sort((left, right) => left.join("->").localeCompare(right.join("->")));
};

/**
 * @typedef {{
 *   code: "package_deep_import" | "cross_unit_relative_import";
 *   file: string;
 *   specifier: string;
 * }} ImportViolation
 */

export const analyzeFiles = ({ root, sources }) => {
  /** @type {ImportViolation[]} */
  const violations = [];
  const graph = new Map();

  for (const [file, source] of [...sources.entries()].sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    const sourceUnit = workspaceUnit(root, file);
    if (sourceUnit && !graph.has(sourceUnit)) graph.set(sourceUnit, new Set());

    const imports = ts
      .preProcessFile(source, true, true)
      .importedFiles.map(({ fileName }) => fileName);

    for (const specifier of imports) {
      const packageMatch = /^@dndimension\/([^/]+)(\/.*)?$/.exec(specifier);
      if (packageMatch) {
        const targetUnit = `@dndimension/${packageMatch[1]}`;
        if (packageMatch[2]) {
          violations.push({ code: "package_deep_import", file, specifier });
        }
        if (sourceUnit && sourceUnit !== targetUnit) {
          if (!graph.has(targetUnit)) graph.set(targetUnit, new Set());
          graph.get(sourceUnit).add(targetUnit);
        }
        continue;
      }

      if (specifier.startsWith(".")) {
        const target = path.resolve(path.dirname(file), specifier);
        const targetUnit = workspaceUnit(root, target);
        if (sourceUnit && targetUnit && sourceUnit !== targetUnit) {
          violations.push({ code: "cross_unit_relative_import", file, specifier });
        }
      }
    }
  }

  return { violations, cycles: findCycles(graph) };
};

export const collectSources = (root = process.cwd()) => {
  const sources = new Map();

  const visit = (directory) => {
    if (!fs.existsSync(directory)) return;

    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === "dist" || entry.name === "node_modules") continue;
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(target);
      else if (/\.(ts|tsx)$/.test(entry.name)) sources.set(target, fs.readFileSync(target, "utf8"));
    }
  };

  visit(path.join(root, "apps"));
  visit(path.join(root, "packages"));
  return sources;
};

const isCli =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isCli) {
  const root = process.cwd();
  const result = analyzeFiles({ root, sources: collectSources(root) });
  for (const violation of result.violations) {
    console.error(`${violation.code}: ${violation.file} -> ${violation.specifier}`);
  }
  for (const cycle of result.cycles) {
    console.error(`package_cycle: ${cycle.join(" -> ")}`);
  }
  process.exitCode = result.violations.length > 0 || result.cycles.length > 0 ? 1 : 0;
}

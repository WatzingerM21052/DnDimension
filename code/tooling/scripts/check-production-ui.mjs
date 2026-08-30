import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const FORBIDDEN_UI_LAB_MARKERS = Object.freeze([
  "DnDimension UI Lab",
  "Development only",
  "Wegmarke anlegen",
]);

const textBuildFilePattern = /\.(html|js|css)$/;
const sourceMapFilePattern = /\.map$/;

export const collectTextBuildFiles = (distRoot) => {
  const files = [];
  const visit = (directory) => {
    const entries = fs
      .readdirSync(directory, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name));

    for (const entry of entries) {
      const target = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) visit(target);
      else if (entry.isFile() && textBuildFilePattern.test(entry.name)) files.push(target);
    }
  };

  visit(distRoot);
  return files.sort((left, right) => left.localeCompare(right));
};

export const findForbiddenUiLabContent = (distRoot) => {
  const files = collectTextBuildFiles(distRoot);

  return files.flatMap((file) => {
    const relativeFile = path.relative(distRoot, file).replaceAll("\\", "/");
    const content = fs.readFileSync(file, "utf8");
    const findings = FORBIDDEN_UI_LAB_MARKERS.filter((marker) => content.includes(marker)).map(
      (marker) => ({ file: relativeFile, marker }),
    );

    if (/ui[-_.]?lab/i.test(relativeFile)) {
      findings.push({ file: relativeFile, marker: "ui-lab-filename" });
    }

    return findings;
  });
};

export const assertProductionUiLabExcluded = (distRoot) => {
  const findings = findForbiddenUiLabContent(distRoot);

  if (findings.length > 0) {
    throw new Error(
      `Development UI leaked into production: ${findings
        .map(({ file, marker }) => `${file} (${marker})`)
        .join(", ")}`,
    );
  }
};

const productionUiFoundationChecks = Object.freeze([
  ["font-face", (css) => /@font-face\b/.test(css)],
  ["woff2-url", (css) => /url\([^)]*\.woff2/.test(css)],
  ["font-body-token", (css) => /--font-body\s*:/.test(css)],
  [
    "night-chart-theme",
    (css) =>
      /\[data-theme\s*=\s*["']?night-chart["']?\][^{]*\{[^}]*--color-surface-canvas\s*:/.test(css),
  ],
  [
    "vellum-study-theme",
    (css) =>
      /\[data-theme\s*=\s*["']?vellum-study["']?\][^{]*\{[^}]*--color-surface-canvas\s*:/.test(css),
  ],
]);

export const assertProductionUiFoundations = (distRoot) => {
  const css = collectTextBuildFiles(distRoot)
    .filter((file) => file.endsWith(".css"))
    .map((file) => fs.readFileSync(file, "utf8"))
    .join("\n");
  const missing = productionUiFoundationChecks
    .filter(([, isPresent]) => !isPresent(css))
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`Production UI foundations missing: ${missing.join(", ")}`);
  }
};

const collectSourceMapFiles = (distRoot) => {
  const files = [];
  const visit = (directory) => {
    const entries = fs
      .readdirSync(directory, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name));

    for (const entry of entries) {
      const target = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) visit(target);
      else if (entry.isFile() && sourceMapFilePattern.test(entry.name)) files.push(target);
    }
  };

  visit(distRoot);
  return files.sort((left, right) => left.localeCompare(right));
};

export const assertProductionSourceMapsExcludeSources = (distRoot) => {
  const sourceMaps = collectSourceMapFiles(distRoot);

  if (sourceMaps.length === 0) {
    throw new Error("Production source maps are missing.");
  }

  const findings = sourceMaps
    .filter((file) => {
      const sourceMap = JSON.parse(fs.readFileSync(file, "utf8"));
      return sourceMap.sourcesContent?.some(
        (source) => typeof source === "string" && source.length > 0,
      );
    })
    .map((file) => path.relative(distRoot, file).replaceAll("\\", "/"));

  if (findings.length > 0) {
    throw new Error(`Production source maps embed source text: ${findings.join(", ")}`);
  }
};

const isCli =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isCli) {
  try {
    const distRoot = path.join(process.cwd(), "apps/web/dist");
    assertProductionUiLabExcluded(distRoot);
    assertProductionUiFoundations(distRoot);
    assertProductionSourceMapsExcludeSources(distRoot);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

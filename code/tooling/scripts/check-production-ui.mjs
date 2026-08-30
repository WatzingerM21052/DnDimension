import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const FORBIDDEN_UI_LAB_MARKERS = Object.freeze([
  "DnDimension UI Lab",
  "Development only",
  "Wegmarke anlegen",
]);

const textBuildFilePattern = /\.(html|js|css)$/;

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

const isCli =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isCli) {
  try {
    assertProductionUiLabExcluded(path.join(process.cwd(), "apps/web/dist"));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

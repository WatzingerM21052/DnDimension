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

const themeFoundationChecks = Object.freeze([
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

const declarationValue = (declarations, property) => {
  const escapedProperty = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`(?:^|;)\\s*${escapedProperty}\\s*:\\s*([^;}]+)`, "i").exec(
    declarations,
  );

  return match?.[1].trim();
};

const normalizeFontFamily = (value) => {
  const firstFamily = value.trim().split(",", 1)[0].trim();
  const unquoted = firstFamily.replace(/^(["'])(.*)\1$/, "$2");

  return unquoted.toLowerCase();
};

const collectCssRules = (distRoot) =>
  collectTextBuildFiles(distRoot)
    .filter((file) => file.endsWith(".css"))
    .flatMap((file) => {
      const content = fs.readFileSync(file, "utf8").replaceAll(/\/\*[\s\S]*?\*\//g, "");
      const rules = [];
      const blockPattern = /([^{}]+)\{([^{}]*)\}/g;
      let match;

      while ((match = blockPattern.exec(content)) !== null) {
        rules.push({ file, selector: match[1].trim(), declarations: match[2] });
      }

      return rules;
    });

const hasFontTokenUsage = (rules, token, selector = () => true) =>
  rules.some(
    (rule) =>
      selector(rule.selector) &&
      new RegExp(`font-family\\s*:\\s*var\\(\\s*${token}(?![\\w-])`, "i").test(rule.declarations),
  );

const hasBodyElementSelector = (selector) =>
  selector.split(",").some((part) => /(?:^|[\s>+~])body(?=$|[\s>+~:#.[])/i.test(part.trim()));

const collectFontFaces = (rules) =>
  rules
    .filter((rule) => rule.selector.toLowerCase() === "@font-face")
    .map((rule) => ({ ...rule, family: declarationValue(rule.declarations, "font-family") }))
    .filter(({ family }) => family !== undefined);

const woff2Urls = (source) =>
  [...source.matchAll(/url\(\s*(?:"([^"]+)"|'([^']+)'|([^\s)]+))\s*\)/gi)]
    .map((match) => match[1] ?? match[2] ?? match[3])
    .filter((url) => /\.woff2(?:[?#].*)?$/i.test(url));

const isOutsideRoot = (relative) =>
  relative.length === 0 ||
  relative === ".." ||
  relative.startsWith(`..${path.sep}`) ||
  path.isAbsolute(relative);

const resolveLocalWoff2Target = (distRoot, cssFile, url) => {
  const pathname = url.split(/[?#]/, 1)[0].replaceAll("\\", "/");

  if (/^[a-z][a-z\d+.-]*:/i.test(pathname) || pathname.startsWith("//")) {
    return { reason: "non-local-url" };
  }

  const target = pathname.startsWith("/")
    ? path.resolve(distRoot, `.${pathname}`)
    : path.resolve(path.dirname(cssFile), pathname);
  const relative = path.relative(distRoot, target);

  if (isOutsideRoot(relative)) {
    return { reason: "path-outside-dist" };
  }

  try {
    const realDistRoot = fs.realpathSync(distRoot);
    const realTarget = fs.realpathSync(target);
    const realRelative = path.relative(realDistRoot, realTarget);

    if (isOutsideRoot(realRelative)) {
      return { reason: "path-outside-real-dist" };
    }

    if (!fs.statSync(realTarget).isFile()) return { reason: "not-a-regular-file" };
  } catch {
    return { relative: relative.replaceAll("\\", "/"), reason: "missing" };
  }

  return { target };
};

const fontChainFindings = (distRoot, rules) => {
  const findings = [];
  const fontFaces = collectFontFaces(rules);
  const chains = [
    {
      label: "body",
      token: "--font-body",
      used: hasFontTokenUsage(rules, "--font-body", hasBodyElementSelector),
    },
    {
      label: "display",
      token: "--font-display",
      used: hasFontTokenUsage(rules, "--font-display"),
    },
  ];

  for (const { label, token, used } of chains) {
    if (!used) {
      findings.push(`${label}-font-usage-missing`);
      continue;
    }

    const tokenValue = rules
      .filter((rule) => rule.selector.includes(":root"))
      .map((rule) => declarationValue(rule.declarations, token))
      .find((value) => value !== undefined);

    if (tokenValue === undefined) {
      findings.push(`${label}-font-token-missing`);
      continue;
    }

    const family = normalizeFontFamily(tokenValue);
    const matchingFaces = fontFaces.filter((face) => normalizeFontFamily(face.family) === family);

    if (matchingFaces.length === 0) {
      findings.push(`${label}-font-face-missing`);
      continue;
    }

    const faceUrls = matchingFaces.flatMap((face) =>
      woff2Urls(declarationValue(face.declarations, "src") ?? "").map((url) => ({
        file: face.file,
        url,
      })),
    );

    if (faceUrls.length === 0) {
      findings.push(`${label}-font-face-woff2-missing`);
      continue;
    }

    const targets = faceUrls
      .map(({ file, url }) => resolveLocalWoff2Target(distRoot, file, url))
      .filter(({ target }) => target === undefined);

    for (const target of targets) {
      if (target.reason === "missing") {
        findings.push(`${label}-woff2-target-missing: ${target.relative}`);
      } else {
        findings.push(`${label}-woff2-target-invalid: ${target.reason}`);
      }
    }
  }

  return findings;
};

export const assertProductionUiFoundations = (distRoot) => {
  const rules = collectCssRules(distRoot);
  const css = rules.map((rule) => `${rule.selector}{${rule.declarations}}`).join("\n");
  const missing = themeFoundationChecks
    .filter(([, isPresent]) => !isPresent(css))
    .map(([name]) => name)
    .concat(fontChainFindings(distRoot, rules))
    .sort((left, right) => left.localeCompare(right));

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

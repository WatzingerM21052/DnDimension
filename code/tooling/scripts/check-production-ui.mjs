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

// Deliberately limited to the CSS constructs needed by the production font contract.
const isCssWhitespace = (character) =>
  character === " " ||
  character === "\t" ||
  character === "\n" ||
  character === "\r" ||
  character === "\f";

const isCssHexDigit = (character) =>
  character !== undefined &&
  ((character >= "0" && character <= "9") ||
    (character.toLowerCase() >= "a" && character.toLowerCase() <= "f"));

const isCssNameCharacter = (character) => {
  const codePoint = character?.codePointAt(0);
  return (
    character === "-" ||
    character === "_" ||
    (character >= "0" && character <= "9") ||
    (character?.toLowerCase() >= "a" && character?.toLowerCase() <= "z") ||
    (codePoint !== undefined && codePoint >= 0x80)
  );
};

const consumeCssComment = (source, start) => {
  const closing = source.indexOf("*/", start + 2);
  return closing === -1 ? source.length : closing + 2;
};

const consumeCssEscape = (source, start) => {
  let cursor = start + 1;
  if (cursor >= source.length) return { end: cursor, value: "" };

  if (source[cursor] === "\r" || source[cursor] === "\n" || source[cursor] === "\f") {
    if (source[cursor] === "\r" && source[cursor + 1] === "\n") cursor += 1;
    return { end: cursor + 1, value: "" };
  }

  if (!isCssHexDigit(source[cursor])) {
    return { end: cursor + 1, value: source[cursor] };
  }

  let hexadecimal = "";
  while (cursor < source.length && hexadecimal.length < 6 && isCssHexDigit(source[cursor])) {
    hexadecimal += source[cursor];
    cursor += 1;
  }
  if (isCssWhitespace(source[cursor])) cursor += 1;

  const codePoint = Number.parseInt(hexadecimal, 16);
  const value =
    codePoint === 0 || codePoint > 0x10ffff || (codePoint >= 0xd800 && codePoint <= 0xdfff)
      ? "\uFFFD"
      : String.fromCodePoint(codePoint);
  return { end: cursor, value };
};

const consumeCssString = (source, start) => {
  const quote = source[start];
  let cursor = start + 1;
  let value = "";

  while (cursor < source.length && source[cursor] !== quote) {
    if (source[cursor] === "\\") {
      const escaped = consumeCssEscape(source, cursor);
      value += escaped.value;
      cursor = escaped.end;
    } else {
      value += source[cursor];
      cursor += 1;
    }
  }

  return { end: cursor < source.length ? cursor + 1 : cursor, value };
};

const readCssIdentifier = (source, start) => {
  let cursor = start;
  let value = "";

  while (cursor < source.length) {
    if (isCssNameCharacter(source[cursor])) {
      value += source[cursor];
      cursor += 1;
    } else if (source[cursor] === "\\") {
      const escaped = consumeCssEscape(source, cursor);
      value += escaped.value;
      cursor = escaped.end;
    } else {
      break;
    }
  }

  return cursor === start ? undefined : { end: cursor, value };
};

const lexCss = (source) => {
  const tokens = [];
  let cursor = 0;

  while (cursor < source.length) {
    const start = cursor;
    if (isCssWhitespace(source[cursor])) {
      while (isCssWhitespace(source[cursor])) cursor += 1;
      tokens.push({ type: "space", value: " ", start, end: cursor });
    } else if (source.startsWith("/*", cursor)) {
      cursor = consumeCssComment(source, cursor);
      tokens.push({ type: "space", value: " ", start, end: cursor });
    } else if (source[cursor] === '"' || source[cursor] === "'") {
      const string = consumeCssString(source, cursor);
      cursor = string.end;
      tokens.push({ type: "string", value: string.value, start, end: cursor });
    } else {
      const identifier = readCssIdentifier(source, cursor);
      if (identifier !== undefined) {
        cursor = identifier.end;
        tokens.push({ type: "ident", value: identifier.value, start, end: cursor });
      } else {
        cursor += 1;
        tokens.push({ type: "symbol", value: source[start], start, end: cursor });
      }
    }
  }

  return tokens;
};

const significantTokens = (source) => lexCss(source).filter(({ type }) => type !== "space");

const splitCssAtTopLevel = (source, delimiter) => {
  const segments = [];
  const depths = { "(": 0, "[": 0, "{": 0 };
  const closingToOpening = { ")": "(", "]": "[", "}": "{" };
  let start = 0;

  for (const token of lexCss(source)) {
    if (token.type !== "symbol") continue;
    if (depths[token.value] !== undefined) depths[token.value] += 1;
    else if (closingToOpening[token.value] !== undefined) {
      const opening = closingToOpening[token.value];
      depths[opening] = Math.max(0, depths[opening] - 1);
    } else if (
      token.value === delimiter &&
      depths["("] === 0 &&
      depths["["] === 0 &&
      depths["{"] === 0
    ) {
      segments.push(source.slice(start, token.start));
      start = token.end;
    }
  }

  segments.push(source.slice(start));
  return segments;
};

const parseCssDeclarations = (source) =>
  splitCssAtTopLevel(source, ";").flatMap((candidate) => {
    const [propertySource, ...valueParts] = splitCssAtTopLevel(candidate, ":");
    const propertyTokens = significantTokens(propertySource);
    if (propertyTokens.length !== 1 || propertyTokens[0].type !== "ident") return [];

    return [{ property: propertyTokens[0].value, value: valueParts.join(":").trim() }];
  });

const atRuleName = (prelude) => {
  const tokens = significantTokens(prelude);
  return tokens[0]?.value === "@" && tokens[1]?.type === "ident"
    ? tokens[1].value.toLowerCase()
    : undefined;
};

const groupingAtRules = new Set([
  "container",
  "document",
  "layer",
  "media",
  "scope",
  "starting-style",
  "supports",
]);

const closingTokenIndex = (tokens, start, opening, closing) => {
  let depth = 0;
  for (let index = start; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.type !== "symbol") continue;
    if (token.value === opening) depth += 1;
    else if (token.value === closing && --depth === 0) return index;
  }
  return tokens.length;
};

const collectRulesFromCss = (source, file) => {
  const rules = [];
  const tokens = lexCss(source);
  let statementStart = 0;

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.type !== "symbol") continue;
    if (token.value === ";") {
      statementStart = token.end;
      continue;
    }
    if (token.value !== "{") continue;

    const closingIndex = closingTokenIndex(tokens, index, "{", "}");
    const closing = tokens[closingIndex];
    const prelude = source.slice(statementStart, token.start).trim();
    const bodyEnd = closing?.start ?? source.length;
    const body = source.slice(token.end, bodyEnd);
    const name = atRuleName(prelude);

    if (groupingAtRules.has(name)) rules.push(...collectRulesFromCss(body, file));
    else if (prelude.length > 0) {
      rules.push({ file, selector: prelude, declarations: parseCssDeclarations(body) });
    }

    statementStart = closing?.end ?? source.length;
    index = closingIndex;
  }

  return rules;
};

const collectCssRules = (distRoot) =>
  collectTextBuildFiles(distRoot)
    .filter((file) => file.endsWith(".css"))
    .flatMap((file) => collectRulesFromCss(fs.readFileSync(file, "utf8"), file));

const declarationValue = (declarations, property) => {
  const customProperty = property.startsWith("--");
  let value;

  for (const declaration of declarations) {
    const matches = customProperty
      ? declaration.property === property
      : declaration.property.toLowerCase() === property.toLowerCase();
    if (matches) value = declaration.value;
  }

  return value;
};

const selectorHasBodyElement = (selector) => {
  let attributeDepth = 0;
  let functionDepth = 0;
  let compoundStart = true;

  for (const token of lexCss(selector)) {
    if (token.type === "symbol" && token.value === "[") {
      attributeDepth += 1;
      compoundStart = false;
    } else if (token.type === "symbol" && token.value === "]" && attributeDepth > 0) {
      attributeDepth -= 1;
    } else if (attributeDepth > 0) {
      continue;
    } else if (token.type === "symbol" && token.value === "(") {
      functionDepth += 1;
      compoundStart = false;
    } else if (token.type === "symbol" && token.value === ")" && functionDepth > 0) {
      functionDepth -= 1;
    } else if (functionDepth > 0) {
      continue;
    } else if (token.type === "space") {
      compoundStart = true;
    } else if (
      token.type === "symbol" &&
      (token.value === "," || token.value === ">" || token.value === "+" || token.value === "~")
    ) {
      compoundStart = true;
    } else if (token.type === "ident") {
      if (compoundStart && token.value.toLowerCase() === "body") return true;
      compoundStart = false;
    } else {
      compoundStart = false;
    }
  }

  return false;
};

const selectorHasPseudoClass = (selector, expectedName) => {
  const tokens = lexCss(selector);
  let attributeDepth = 0;
  let functionDepth = 0;

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.type === "symbol" && token.value === "[") attributeDepth += 1;
    else if (token.type === "symbol" && token.value === "]") attributeDepth -= 1;
    else if (attributeDepth === 0 && token.type === "symbol" && token.value === "(") {
      functionDepth += 1;
    } else if (attributeDepth === 0 && token.type === "symbol" && token.value === ")") {
      functionDepth -= 1;
    } else if (
      attributeDepth === 0 &&
      functionDepth === 0 &&
      token.type === "symbol" &&
      token.value === ":"
    ) {
      const next = tokens.slice(index + 1).find(({ type }) => type !== "space");
      if (next?.type === "ident" && next.value.toLowerCase() === expectedName) return true;
    }
  }

  return false;
};

const selectorHasTheme = (selector, expectedTheme) => {
  const tokens = lexCss(selector);

  for (let index = 0; index < tokens.length; index += 1) {
    if (tokens[index].type !== "symbol" || tokens[index].value !== "[") continue;
    const closingIndex = closingTokenIndex(tokens, index, "[", "]");
    const attribute = tokens.slice(index + 1, closingIndex).filter(({ type }) => type !== "space");
    if (
      attribute.length === 3 &&
      attribute[0].type === "ident" &&
      attribute[0].value.toLowerCase() === "data-theme" &&
      attribute[1].type === "symbol" &&
      attribute[1].value === "=" &&
      (attribute[2].type === "ident" || attribute[2].type === "string") &&
      attribute[2].value === expectedTheme
    ) {
      return true;
    }
    index = closingIndex;
  }

  return false;
};

const containsVarToken = (source, expectedToken) => {
  const tokens = significantTokens(source);

  return tokens.some(
    (token, index) =>
      token.type === "ident" &&
      token.value.toLowerCase() === "var" &&
      tokens[index + 1]?.value === "(" &&
      tokens[index + 2]?.type === "ident" &&
      tokens[index + 2].value === expectedToken &&
      (tokens[index + 3]?.value === "," || tokens[index + 3]?.value === ")"),
  );
};

const hasFontTokenUsage = (rules, token, selector = () => true) =>
  rules.some((rule) => {
    const fontFamily = declarationValue(rule.declarations, "font-family");
    return (
      selector(rule.selector) && fontFamily !== undefined && containsVarToken(fontFamily, token)
    );
  });

const normalizeFontFamily = (value) => {
  const tokens = lexCss(splitCssAtTopLevel(value, ",")[0]);
  if (tokens.find(({ type }) => type !== "space")?.type === "string") {
    return tokens.find(({ type }) => type === "string").value.toLowerCase();
  }

  let normalized = "";
  let needsSpace = false;
  for (const token of tokens) {
    if (token.type === "space") needsSpace = normalized.length > 0;
    else {
      if (needsSpace) normalized += " ";
      normalized += token.value;
      needsSpace = false;
    }
  }
  return normalized.trim().toLowerCase();
};

const collectFontFaces = (rules) =>
  rules
    .filter((rule) => atRuleName(rule.selector) === "font-face")
    .map((rule) => ({ ...rule, family: declarationValue(rule.declarations, "font-family") }))
    .filter(({ family }) => family !== undefined);

const collectCssUrls = (source) => {
  const tokens = significantTokens(source);
  const urls = [];

  for (let index = 0; index < tokens.length; index += 1) {
    if (
      tokens[index].type !== "ident" ||
      tokens[index].value.toLowerCase() !== "url" ||
      tokens[index + 1]?.value !== "("
    ) {
      continue;
    }

    if (tokens[index + 2]?.type === "string" && tokens[index + 3]?.value === ")") {
      urls.push(tokens[index + 2].value);
      index += 3;
      continue;
    }

    const closingIndex = tokens.findIndex(
      (token, candidate) => candidate > index + 1 && token.type === "symbol" && token.value === ")",
    );
    if (closingIndex === -1) continue;
    urls.push(
      tokens
        .slice(index + 2, closingIndex)
        .map(({ value }) => value)
        .join("")
        .trim(),
    );
    index = closingIndex;
  }

  return urls;
};

const woff2Urls = (source) =>
  collectCssUrls(source).filter((url) => url.split(/[?#]/, 1)[0].toLowerCase().endsWith(".woff2"));

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
      used: hasFontTokenUsage(rules, "--font-body", selectorHasBodyElement),
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

    let tokenValue;
    for (const rule of rules) {
      if (!selectorHasPseudoClass(rule.selector, "root")) continue;
      const value = declarationValue(rule.declarations, token);
      if (value !== undefined) tokenValue = value;
    }

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

    for (const face of matchingFaces) {
      const faceUrls = woff2Urls(declarationValue(face.declarations, "src") ?? "");
      if (faceUrls.length === 0) {
        findings.push(`${label}-font-face-woff2-missing`);
        continue;
      }

      for (const url of faceUrls) {
        const target = resolveLocalWoff2Target(distRoot, face.file, url);
        if (target.target !== undefined) continue;

        if (target.reason === "missing") {
          findings.push(`${label}-woff2-target-missing: ${target.relative}`);
        } else {
          findings.push(`${label}-woff2-target-invalid: ${target.reason}`);
        }
      }
    }
  }

  return findings;
};

export const assertProductionUiFoundations = (distRoot) => {
  const rules = collectCssRules(distRoot);
  const themes = [
    ["night-chart-theme", "night-chart"],
    ["vellum-study-theme", "vellum-study"],
  ];
  const missing = themes
    .filter(([, theme]) =>
      rules.every(
        (rule) =>
          !selectorHasTheme(rule.selector, theme) ||
          declarationValue(rule.declarations, "--color-surface-canvas") === undefined,
      ),
    )
    .map(([finding]) => finding)
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

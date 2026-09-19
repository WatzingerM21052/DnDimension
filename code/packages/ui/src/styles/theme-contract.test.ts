import { readdirSync, readFileSync } from "node:fs";

import { describe, expect, test } from "vitest";

import { applyTheme, resolveThemeName } from "./theme";

const requiredTokens = [
  "--color-surface-canvas",
  "--color-surface-workspace",
  "--color-surface-reading",
  "--color-text-primary",
  "--color-text-muted",
  "--color-text-on-reading",
  "--color-accent-action",
  "--color-accent-action-text",
  "--color-accent-structure",
  "--color-status-danger",
  "--color-status-danger-text",
  "--color-border-subtle",
  "--color-border-strong",
  "--color-border-focus",
  "--shadow-raised",
  "--shadow-overlay",
] as const;

type ThemeValues = Record<(typeof requiredTokens)[number], string>;

const themesCss = readFileSync(new URL("./themes.css", import.meta.url), "utf8");

const parseTheme = (selectorPattern: string): ThemeValues => {
  const match = themesCss.match(new RegExp(`${selectorPattern}\\s*\\{([^}]+)\\}`));

  expect(match, `missing CSS block for ${selectorPattern}`).not.toBeNull();

  const declarations = Object.fromEntries(
    [...(match?.[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g) ?? [])].map(([, name, value]) => [
      name,
      value.trim(),
    ]),
  );

  for (const token of requiredTokens) {
    expect(declarations, `${selectorPattern} must define ${token}`).toHaveProperty(token);
  }

  return declarations as ThemeValues;
};

const channelToLinear = (channel: number): number => {
  const normalized = channel / 255;
  return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex: string): number => {
  expect(hex).toMatch(/^#[\da-f]{6}$/i);
  const channels = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map((channel) =>
    channelToLinear(Number.parseInt(channel, 16)),
  );

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

const contrast = (foreground: string, background: string): number => {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort(
    (left, right) => right - left,
  );
  return (lighter + 0.05) / (darker + 0.05);
};

const semanticColors = (theme: ThemeValues) => ({
  accentAction: theme["--color-accent-action"],
  accentActionText: theme["--color-accent-action-text"],
  borderFocus: theme["--color-border-focus"],
  statusDanger: theme["--color-status-danger"],
  statusDangerText: theme["--color-status-danger-text"],
  surfaceCanvas: theme["--color-surface-canvas"],
  surfaceReading: theme["--color-surface-reading"],
  textOnReading: theme["--color-text-on-reading"],
  textPrimary: theme["--color-text-primary"],
});

describe.each([
  [':root,\\s*\\[data-theme="night-chart"\\]', "night-chart"],
  ['\\[data-theme="vellum-study"\\]', "vellum-study"],
] as const)("%s theme", (selector, themeName) => {
  test(`defines the complete ${themeName} semantic token contract`, () => {
    parseTheme(selector);
  });

  test(`keeps ${themeName} semantic color pairs accessible`, () => {
    const theme = semanticColors(parseTheme(selector));

    expect(contrast(theme.textPrimary, theme.surfaceCanvas)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(theme.textOnReading, theme.surfaceReading)).toBeGreaterThanOrEqual(7);
    expect(contrast(theme.accentActionText, theme.accentAction)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(theme.statusDangerText, theme.statusDanger)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(theme.borderFocus, theme.surfaceCanvas)).toBeGreaterThanOrEqual(3);
  });
});

test("unknown or missing theme values fall back to night-chart", () => {
  expect(resolveThemeName("vellum-study")).toBe("vellum-study");
  expect(resolveThemeName("unknown-theme")).toBe("night-chart");
  expect(resolveThemeName(null)).toBe("night-chart");
});

test("applying a theme normalizes the value and updates the root dataset", () => {
  const root = { dataset: {} } as HTMLElement;

  expect(applyTheme(root, "vellum-study")).toBe("vellum-study");
  expect(root.dataset.theme).toBe("vellum-study");
  expect(applyTheme(root, "invented-theme")).toBe("night-chart");
  expect(root.dataset.theme).toBe("night-chart");
});

test("font styles use exactly the three licensed local WOFF2 assets", () => {
  const fontsDirectory = new URL("../assets/fonts/", import.meta.url);
  const fontFiles = readdirSync(fontsDirectory)
    .filter((fileName) => fileName.endsWith(".woff2"))
    .sort();

  expect(fontFiles).toEqual([
    "alegreya-sans-sc-500-latin.woff2",
    "alegreya-sans-sc-700-latin.woff2",
    "atkinson-hyperlegible-next-latin-variable.woff2",
  ]);

  for (const fileName of fontFiles) {
    expect(readFileSync(new URL(fileName, fontsDirectory)).subarray(0, 4).toString()).toBe("wOF2");
  }

  const licenseFiles = readdirSync(new URL("licenses/", fontsDirectory)).sort();
  expect(licenseFiles).toEqual(["alegreya-sans-sc-OFL.txt", "atkinson-hyperlegible-next-OFL.txt"]);

  const fontsCss = readFileSync(new URL("./fonts.css", import.meta.url), "utf8");
  expect(fontsCss).not.toMatch(/url\(\s*["']?https?:/i);
  const fontUrls = [...fontsCss.matchAll(/url\("([^"]+)"\)/g)].map(([, url]) => url).sort();
  expect(fontUrls).toEqual(fontFiles.map((fileName) => `../assets/fonts/${fileName}`));
  expect(fontsCss.match(/format\("woff2"\)/g)).toHaveLength(3);
});

test("the wayfinder icon stays monochrome and suitable for CSS masking", () => {
  const wayfinder = readFileSync(new URL("../icons/wayfinder.svg", import.meta.url), "utf8");

  expect(wayfinder).toContain('viewBox="0 0 24 24"');
  expect(wayfinder.match(/fill=/g)).toHaveLength(1);
  expect(wayfinder).toContain('fill="#000"');
});

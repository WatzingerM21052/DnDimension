export const themeNames = ["night-chart", "vellum-study"] as const;
export type ThemeName = (typeof themeNames)[number];

export const resolveThemeName = (value: unknown): ThemeName =>
  typeof value === "string" && themeNames.some((theme) => theme === value)
    ? (value as ThemeName)
    : "night-chart";

export const applyTheme = (root: HTMLElement, value: unknown): ThemeName => {
  const theme = resolveThemeName(value);
  root.dataset.theme = theme;
  return theme;
};

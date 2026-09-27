import { createRequire } from "node:module";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { expect, test, type Page } from "@playwright/test";
import { build } from "vite";
import { startStaticServer } from "./static-server";

const axeSource = createRequire(import.meta.url)("axe-core").source as string;
const probeDist = path.resolve(import.meta.dirname, "../../../test-results/ui-probe");
/** `--target-min` from packages/ui tokens (2.75rem at the default 16px root size). */
const TARGET_MIN_PX = 44;

let server: Awaited<ReturnType<typeof startStaticServer>>;

test.beforeAll(async () => {
  await build({
    configFile: false,
    logLevel: "silent",
    root: path.join(import.meta.dirname, "ui-probe"),
    base: "/",
    plugins: [react()],
    build: { outDir: probeDist, emptyOutDir: true },
  });
  server = await startStaticServer(probeDist);
});
test.afterAll(async () => server.close());

const runAxe = async (page: Page) => {
  await page.addScriptTag({ content: axeSource });
  return page.evaluate(async () => {
    const { axe } = window as unknown as {
      axe: {
        run(
          context: Document,
          options: object,
        ): Promise<{
          violations: { id: string; nodes: { target: string[]; failureSummary?: string }[] }[];
        }>;
      };
    };
    const result = await axe.run(document, {
      rules: { "color-contrast": { enabled: true }, "target-size": { enabled: true } },
    });
    return result.violations.map(
      ({ id, nodes }) =>
        `${id}: ${nodes.map((node) => `${node.target.join(" ")} (${node.failureSummary ?? ""})`).join("; ")}`,
    );
  });
};

/** Every enabled, visible control must reach the design system's minimum target size. */
const measureTargets = (page: Page) =>
  page.evaluate((minimum) => {
    const selector =
      'button, a[href], input:not([type="hidden"]), select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])';
    return [...document.querySelectorAll<HTMLElement>(selector)]
      .filter((element) => {
        if (element.matches(":disabled") || element.offsetParent === null) return false;
        // Only pointer-reachable controls count. Screen-reader-only controls such as React
        // Aria's dismiss button sit inside a clipped wrapper and are never hit at their centre.
        element.scrollIntoView({ block: "center", inline: "center" });
        const box = element.getBoundingClientRect();
        const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
        return hit !== null && (hit === element || element.contains(hit));
      })
      .map((element) => {
        const { width, height } = element.getBoundingClientRect();
        return {
          name: element.getAttribute("aria-label") ?? element.textContent?.trim(),
          width,
          height,
        };
      })
      .reduce(
        (report, target) => ({
          checked: report.checked + 1,
          undersized:
            target.width < minimum || target.height < minimum
              ? [...report.undersized, target]
              : report.undersized,
        }),
        {
          checked: 0,
          undersized: [] as { name: string | null | undefined; width: number; height: number }[],
        },
      );
  }, TARGET_MIN_PX);

for (const theme of ["night-chart", "vellum-study"] as const) {
  test.describe(`${theme} theme`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${server.url}/?theme=${theme}`);
      await expect(page.getByRole("heading", { name: "DnDimension UI Lab" })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
    });

    test("meets contrast and target-size rules in a real browser", async ({ page }) => {
      expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe(theme);
      expect(await runAxe(page)).toEqual([]);
      const targets = await measureTargets(page);
      expect(targets.checked).toBeGreaterThanOrEqual(5);
      expect(targets.undersized).toEqual([]);
    });

    test("keeps the dialog accessible, keyboard-operable and focus-safe", async ({ page }) => {
      const opener = page.getByRole("button", { name: "Wegmarke anlegen" });
      await opener.focus();
      await page.keyboard.press("Enter");
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      // React Aria focuses the dialog itself so screen readers announce its title first.
      expect(
        await page.evaluate(() => document.activeElement?.closest('[role="dialog"]') !== null),
      ).toBe(true);
      expect(await runAxe(page)).toEqual([]);
      const targets = await measureTargets(page);
      expect(targets.checked).toBeGreaterThanOrEqual(2);
      expect(targets.undersized).toEqual([]);

      await page.keyboard.press("Escape");
      await expect(dialog).toHaveCount(0);
      await expect(opener).toBeFocused();
    });
  });
}

const countAnimatedElements = async (
  browser: import("@playwright/test").Browser,
  reducedMotion: "reduce" | "no-preference",
) => {
  const context = await browser.newContext({ reducedMotion });
  const page = await context.newPage();
  await page.goto(`${server.url}/`);
  await expect(page.getByRole("heading", { name: "DnDimension UI Lab" })).toBeVisible();
  const animated = await page.evaluate(
    () =>
      [...document.querySelectorAll<HTMLElement>("*")]
        .map((element) => getComputedStyle(element))
        .filter(
          (style) =>
            (style.animationName !== "none" && parseFloat(style.animationDuration) > 0.01) ||
            style.transitionDuration.split(",").some((duration) => parseFloat(duration) > 0.01),
        ).length,
  );
  await context.close();
  return animated;
};

test("reduced motion removes non-essential animation", async ({ browser }) => {
  expect(await countAnimatedElements(browser, "no-preference")).toBeGreaterThan(0);
  expect(await countAnimatedElements(browser, "reduce")).toBe(0);
});

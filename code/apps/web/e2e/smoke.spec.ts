import { createRequire } from "node:module";
import { expect, test, type Page } from "@playwright/test";
import { startStaticServer } from "./static-server";

const axeSource = createRequire(import.meta.url)("axe-core").source as string;

let server: Awaited<ReturnType<typeof startStaticServer>>;
test.beforeAll(async () => {
  server = await startStaticServer();
});
test.afterAll(async () => server.close());

const expectNoAxeViolations = async (page: Page) => {
  await page.addScriptTag({ content: axeSource });
  const violations = await page.evaluate(async () => {
    const result = await (
      window as unknown as {
        axe: { run(): Promise<{ violations: { id: string; nodes: unknown[] }[] }> };
      }
    ).axe.run();
    return result.violations.map(({ id, nodes }) => `${id} (${nodes.length})`);
  });
  expect(violations).toEqual([]);
};

test("home renders the project foundation without accessibility violations", async ({ page }) => {
  await page.goto(`${server.url}/`);
  await expect(page.getByRole("heading", { level: 1, name: "DnDimension" })).toBeVisible();
  await expect(page).toHaveTitle("DnDimension");
  await expectNoAxeViolations(page);
});

test("health shows the build identity without accessibility violations", async ({ page }) => {
  await page.goto(`${server.url}/health`);
  await expect(page.getByText(/^Version \d+\.\d+\.\d+, Commit \S+$/)).toBeVisible();
  await expectNoAxeViolations(page);
});

test("development labs are not reachable in the production build", async ({ page }) => {
  for (const route of ["/dev/ui", "/dev/storage"]) {
    await page.goto(`${server.url}${route}`);
    await expect(page.getByRole("heading", { name: "DnDimension UI Lab" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Spielstände unter Prüfung" })).toHaveCount(0);
  }
});

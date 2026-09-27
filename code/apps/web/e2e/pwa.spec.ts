import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { startStaticServer, webDist } from "./static-server";

const NEXT_COMMIT = "e2e-next-build";
const nextDist = path.resolve(import.meta.dirname, "../../../test-results/pwa-next-build");

let server: Awaited<ReturnType<typeof startStaticServer>>;
test.beforeAll(async () => {
  server = await startStaticServer();
});
test.afterAll(async () => server.close());

const buildIdentity = (page: Page) => page.getByText(/^Version .+, Commit \S+$/);

/** Loads the app until the service worker controls the page, as after a first visit. */
const installApp = async (page: Page, route = "/health") => {
  await page.goto(`${server.url}${route}`);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  expect(await page.evaluate(() => navigator.serviceWorker.controller !== null)).toBe(true);
};

test("the manifest makes the build installable", async ({ page }) => {
  await page.goto(`${server.url}/`);
  const href = await page.locator('link[rel="manifest"]').getAttribute("href");
  const response = await page.request.get(new URL(href!, server.url).href);
  expect(response.ok()).toBe(true);
  const manifest = await response.json();
  expect(manifest).toMatchObject({ name: "DnDimension", display: "standalone", start_url: "/" });
  for (const icon of manifest.icons as { src: string }[]) {
    const iconResponse = await page.request.get(new URL(icon.src, server.url).href);
    expect(iconResponse.headers()["content-type"]).toBe("image/png");
  }
});

test("starts offline from the same build after the first visit", async ({ page, context }) => {
  await installApp(page);
  const onlineIdentity = await buildIdentity(page).textContent();

  await context.setOffline(true);
  await page.goto(`${server.url}/health`);
  await expect(buildIdentity(page)).toHaveText(onlineIdentity!);
  await page.goto(`${server.url}/`);
  await expect(page.getByRole("heading", { level: 1, name: "DnDimension" })).toBeVisible();
});

test("caches only the static build, never data or development routes", async ({ page }) => {
  await installApp(page);
  const cached = await page.evaluate(async () => {
    const urls: string[] = [];
    for (const key of await caches.keys()) {
      for (const request of await (await caches.open(key)).keys())
        urls.push(new URL(request.url).pathname);
    }
    return urls;
  });
  expect(cached.length).toBeGreaterThan(0);
  for (const url of cached) {
    expect(fs.existsSync(path.join(webDist, url)), `${url} is part of the build`).toBe(true);
    expect(url).not.toMatch(/\.map$|^\/dev\//);
  }
});

test.describe("updates", () => {
  test.beforeAll(() => {
    // A second build of the same source with a different identity stands in for a release.
    execFileSync(
      "pnpm",
      [
        "--filter",
        "@dndimension/web",
        "exec",
        "vite",
        "build",
        "--outDir",
        nextDist,
        "--emptyOutDir",
      ],
      {
        env: { ...process.env, DNDIMENSION_COMMIT: NEXT_COMMIT },
        stdio: "ignore",
        shell: process.platform === "win32",
      },
    );
  });
  test.afterEach(() => server.publish(webDist));

  test("offers a new version and activates it only on request", async ({ page }) => {
    await installApp(page);
    const currentIdentity = await buildIdentity(page).textContent();
    expect(currentIdentity).not.toContain(NEXT_COMMIT);

    server.publish(nextDist);
    await page.evaluate(async () => {
      await (await navigator.serviceWorker.getRegistration())?.update();
    });
    await expect(page.getByText("Neue Version verfügbar")).toBeVisible();
    await expect(buildIdentity(page)).toHaveText(currentIdentity!);

    // A plain reload must not swap versions behind the user's back.
    await page.reload();
    await expect(buildIdentity(page)).toHaveText(currentIdentity!);
    await expect(page.getByText("Neue Version verfügbar")).toBeVisible();

    await page.getByRole("button", { name: "Jetzt aktualisieren" }).click();
    await expect(buildIdentity(page)).toContainText(NEXT_COMMIT);
    await expect(page.getByText("Neue Version verfügbar")).toHaveCount(0);
  });
});

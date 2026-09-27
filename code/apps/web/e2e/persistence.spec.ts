import fs from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { build } from "vite";
import { startStaticServer } from "./static-server";

const probeDist = path.resolve(import.meta.dirname, "../../../test-results/persistence-probe");

let server: Awaited<ReturnType<typeof startStaticServer>>;

test.beforeAll(async () => {
  // Bundles the real @dndimension/persistence (Dexie included) for the browser.
  await build({
    configFile: false,
    logLevel: "silent",
    root: import.meta.dirname,
    build: {
      outDir: probeDist,
      emptyOutDir: true,
      minify: false,
      lib: {
        entry: path.join(import.meta.dirname, "persistence-probe/probe.ts"),
        formats: ["es"],
        fileName: () => "probe.js",
      },
    },
  });
  fs.writeFileSync(
    path.join(probeDist, "index.html"),
    '<!doctype html><meta charset="utf-8"><title>Persistence probe</title><script type="module" src="/probe.js"></script>',
  );
  server = await startStaticServer(probeDist);
});
test.afterAll(async () => server.close());

const openProbe = async (page: Page) => {
  await page.goto(`${server.url}/`);
  await page.waitForFunction(() => "probe" in window);
};

const databaseName = () => `probe-${crypto.randomUUID()}`;

test("tabs coordinate optimistically: change hint, then revision conflict", async ({ context }) => {
  const name = databaseName();
  const [first, second] = [await context.newPage(), await context.newPage()];
  await Promise.all([openProbe(first), openProbe(second)]);

  await first.evaluate(async (name) => {
    const store = window.probe.createIndexedDbAggregateStore(name);
    await store.commit({
      commandId: "create",
      aggregateId: "campaign",
      expectedRevision: 0,
      value: { name: "Coast" },
      event: null,
    });
    Object.assign(window, { store });
  }, name);

  // The second tab loaded revision 1 and starts listening.
  expect(
    await second.evaluate(async (name) => {
      const changes: unknown[] = [];
      const store = window.probe.createIndexedDbAggregateStore(name, {
        onExternalChange: (change) => changes.push(change),
      });
      Object.assign(window, { store, changes });
      return (await store.read("campaign"))?.revision;
    }, name),
  ).toBe(1);

  await first.evaluate(() =>
    (
      window as unknown as { store: ReturnType<Window["probe"]["createIndexedDbAggregateStore"]> }
    ).store.commit({
      commandId: "rename-first",
      aggregateId: "campaign",
      expectedRevision: 1,
      value: { name: "Coast of Ash" },
      event: null,
    }),
  );

  await second.waitForFunction(
    () => (window as unknown as { changes: unknown[] }).changes.length > 0,
  );
  const secondTab = await second.evaluate(async () => {
    const { store, changes } = window as unknown as {
      store: ReturnType<Window["probe"]["createIndexedDbAggregateStore"]>;
      changes: unknown[];
    };
    const stale = await store.commit({
      commandId: "rename-second",
      aggregateId: "campaign",
      expectedRevision: 1,
      value: { name: "Stale edit" },
      event: null,
    });
    return { changes, stale, current: await store.read("campaign") };
  });

  expect(secondTab.changes).toEqual([{ kind: "commit", aggregateId: "campaign", revision: 2 }]);
  expect(secondTab.stale).toEqual({ status: "revision-conflict", revision: 2 });
  expect(secondTab.current).toMatchObject({ revision: 2, value: { name: "Coast of Ash" } });
});

test("committed state survives closing the tab", async ({ context }) => {
  const name = databaseName();
  const writer = await context.newPage();
  await openProbe(writer);
  await writer.evaluate(async (name) => {
    const store = window.probe.createIndexedDbAggregateStore(name);
    await store.commit({
      commandId: "create",
      aggregateId: "campaign",
      expectedRevision: 0,
      value: { name: "Coast" },
      event: { type: "created" },
    });
  }, name);
  await writer.close();

  const reader = await context.newPage();
  await openProbe(reader);
  expect(
    await reader.evaluate(async (name) => {
      const store = window.probe.createIndexedDbAggregateStore(name);
      return { record: await store.read("campaign"), history: await store.history("campaign") };
    }, name),
  ).toEqual({
    record: { aggregateId: "campaign", revision: 1, value: { name: "Coast" } },
    history: [
      { aggregateId: "campaign", revision: 1, commandId: "create", event: { type: "created" } },
    ],
  });
});

test("a tab closed during a schema upgrade leaves the previous version intact", async ({
  context,
}) => {
  const name = databaseName();
  const migrating = await context.newPage();
  await openProbe(migrating);
  await migrating.evaluate(async (name) => {
    const store = window.probe.createIndexedDbAggregateStore(name);
    await store.commit({
      commandId: "create",
      aggregateId: "campaign",
      expectedRevision: 0,
      value: { name: "Coast" },
      event: null,
    });
    store.close();
    // An upgrade that never finishes on its own: each read queues the next one, which keeps
    // the versionchange transaction alive until the tab is closed.
    Object.assign(window, { keepAliveTicks: 0, upgradeOutcome: "none" });
    const request = indexedDB.open(name, 20);
    request.onsuccess = () => Object.assign(window, { upgradeOutcome: "success" });
    request.onerror = () => Object.assign(window, { upgradeOutcome: "error" });
    request.onupgradeneeded = () => {
      const pending = request.result.createObjectStore("pending");
      pending.put({ partial: true }, "marker");
      const keepAlive = () => {
        (window as unknown as { keepAliveTicks: number }).keepAliveTicks += 1;
        pending.get("marker").onsuccess = keepAlive;
      };
      keepAlive();
      Object.assign(window, { upgradeStarted: true });
    };
  }, name);
  await migrating.waitForFunction(() => "upgradeStarted" in window);
  // Still mid-upgrade: the transaction keeps working and has neither committed nor failed.
  const progress = () =>
    migrating.evaluate(() => {
      const state = window as unknown as { keepAliveTicks: number; upgradeOutcome: string };
      return { ticks: state.keepAliveTicks, outcome: state.upgradeOutcome };
    });
  const early = await progress();
  await migrating.waitForTimeout(200);
  const late = await progress();
  expect(late.outcome).toBe("none");
  expect(late.ticks).toBeGreaterThan(early.ticks);
  await migrating.close();

  const after = await context.newPage();
  await openProbe(after);
  const state = await after.evaluate(async (name) => {
    const info = (await indexedDB.databases()).find((database) => database.name === name);
    const store = window.probe.createIndexedDbAggregateStore(name);
    const record = await store.read("campaign");
    store.close();
    const raw = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(name);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const stores = [...raw.objectStoreNames];
    raw.close();
    return { version: info?.version, record, stores };
  }, name);
  expect(state.version).toBe(10);
  expect(state.stores).not.toContain("pending");
  expect(state.record).toMatchObject({ revision: 1, value: { name: "Coast" } });
});

test("a failed upgrade keeps data and a restorable pre-migration backup", async ({ page }) => {
  const name = databaseName();
  await openProbe(page);
  const result = await page.evaluate(async (name) => {
    const store = window.probe.createIndexedDbAggregateStore(name);
    await store.commit({
      commandId: "create",
      aggregateId: "campaign",
      expectedRevision: 0,
      value: { name: "Coast" },
      event: null,
    });
    const vault = window.probe.openBackupVault(name);
    const outcome = await window.probe.migrateWithBackup({
      vault,
      exportBackup: () => store.exportBackup(),
      fromVersion: 10,
      toVersion: 20,
      upgrade: () =>
        new Promise<void>((resolve, reject) => {
          const request = indexedDB.open(name, 20);
          request.onupgradeneeded = () => {
            request.result.createObjectStore("partial");
            request.transaction!.abort();
          };
          request.onsuccess = () => {
            request.result.close();
            resolve();
          };
          request.onerror = () => reject(request.error);
        }),
    });
    const info = (await indexedDB.databases()).find((database) => database.name === name);
    const reopened = window.probe.createIndexedDbAggregateStore(name);
    const recovered = window.probe.createIndexedDbAggregateStore(`${name}-recovered`);
    await recovered.restoreBackup((await vault.latest())!.backup);
    return {
      status: outcome.status,
      version: info?.version,
      current: await reopened.read("campaign"),
      restored: await recovered.read("campaign"),
    };
  }, name);

  expect(result).toMatchObject({
    status: "failed",
    version: 10,
    current: { revision: 1 },
    restored: { revision: 1, value: { name: "Coast" } },
  });
});

test("storage persistence, quota and database size are measured", async ({ page }) => {
  await openProbe(page);
  const report = await page.evaluate(async (name) => {
    const before = await navigator.storage.estimate();
    const persistedBefore = await navigator.storage.persisted();
    const persistGranted = await navigator.storage.persist();
    const store = window.probe.createIndexedDbAggregateStore(name);
    const started = performance.now();
    for (let aggregate = 0; aggregate < 100; aggregate++) {
      for (let revision = 0; revision < 5; revision++) {
        await store.commit({
          commandId: `c-${aggregate}-${revision}`,
          aggregateId: `character-${aggregate}`,
          expectedRevision: revision,
          value: { name: `Character ${aggregate}`, level: revision + 1, notes: "n".repeat(200) },
          event: { type: "leveled", level: revision + 1 },
        });
      }
    }
    const commitMs = performance.now() - started;
    const backupBytes = new TextEncoder().encode(await store.exportBackup()).length;
    const after = await navigator.storage.estimate();
    return {
      quota: after.quota ?? 0,
      usageDelta: (after.usage ?? 0) - (before.usage ?? 0),
      persistedBefore,
      persistGranted,
      commits: 500,
      commitMs: Math.round(commitMs),
      backupBytes,
    };
  }, databaseName());

  console.log(`persistence-measurement ${JSON.stringify(report)}`);
  test.info().annotations.push({ type: "measurement", description: JSON.stringify(report) });
  expect(report.quota).toBeGreaterThan(0);
  expect(typeof report.persistGranted).toBe("boolean");
  // 500 revisions of 100 aggregates stay far below the 10 MiB backup limit.
  expect(report.backupBytes).toBeLessThan(10 * 1024 * 1024);
});

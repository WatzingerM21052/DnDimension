import "fake-indexeddb/auto";
import { afterEach, expect, it, vi } from "vitest";
import { Dexie } from "dexie";
import { createIndexedDbAggregateStore } from "./index";
import { migrateWithBackup, openBackupVault } from "./migration";

const names: string[] = [];
const closers: (() => void)[] = [];
afterEach(async () => {
  for (const close of closers.splice(0)) close();
  for (const name of names.splice(0)) {
    await Dexie.delete(name);
    await Dexie.delete(`${name}__backups`);
  }
});

const open = () => {
  const name = `migration-test-${crypto.randomUUID()}`;
  names.push(name);
  const store = createIndexedDbAggregateStore(name);
  const vault = openBackupVault(name);
  closers.push(
    () => store.close(),
    () => vault.close(),
  );
  return { name, store, vault };
};

const command = {
  commandId: "create",
  aggregateId: "campaign",
  expectedRevision: 0,
  value: { name: "Coast" },
  event: { type: "created" },
};

/** Stands in for a future schema v2 whose upgrade function fails halfway. */
const failingUpgrade = (name: string) => async () => {
  const next = new Dexie(name);
  next.version(1).stores({
    aggregates: "aggregateId",
    events: "[aggregateId+revision], commandId",
    commands: "commandId",
  });
  next
    .version(2)
    .stores({ tags: "id" })
    .upgrade(async (tx) => {
      await tx.table("aggregates").toCollection().modify({ migrated: true });
      await tx.table("tags").add({ id: "partial" });
      throw new Error("upgrade bug");
    });
  try {
    await next.open();
  } finally {
    next.close();
  }
};

it("keeps the previous schema and data intact when an upgrade fails", async () => {
  const { name, store, vault } = open();
  await store.commit(command);

  // The open store closes itself on the upgrade's versionchange event.
  const outcome = await migrateWithBackup({
    vault,
    exportBackup: () => store.exportBackup(),
    upgrade: failingUpgrade(name),
    fromVersion: 10,
    toVersion: 20,
  });

  expect(outcome.status).toBe("failed");
  const reopened = createIndexedDbAggregateStore(name);
  closers.push(() => reopened.close());
  // No partial upgrade: the modify() and the new table were rolled back with the version.
  expect(await reopened.read("campaign")).toEqual({
    aggregateId: "campaign",
    revision: 1,
    value: { name: "Coast" },
  });
  const raw = new Dexie(name);
  closers.push(() => raw.close());
  await raw.open();
  expect(raw.verno).toBe(1);
  expect(raw.tables.map((table) => table.name)).not.toContain("tags");
});

it("stores a restorable backup before every upgrade", async () => {
  const { name, store, vault } = open();
  await store.commit(command);
  const upgrade = vi.fn(async () => {});

  const outcome = await migrateWithBackup({
    vault,
    exportBackup: () => store.exportBackup(),
    upgrade,
    fromVersion: 10,
    toVersion: 20,
    now: () => "2026-09-27T20:00:00.000Z",
  });

  expect(outcome).toEqual({ status: "migrated", backupId: 1 });
  expect(upgrade).toHaveBeenCalledOnce();
  const saved = await vault.latest();
  expect(saved).toMatchObject({
    fromVersion: 10,
    toVersion: 20,
    createdAt: "2026-09-27T20:00:00.000Z",
  });

  const recoveryName = `${name}-recovered`;
  names.push(recoveryName);
  const recovered = createIndexedDbAggregateStore(recoveryName);
  closers.push(() => recovered.close());
  await recovered.restoreBackup(saved!.backup);
  expect((await recovered.read("campaign"))?.revision).toBe(1);
  expect(await recovered.history("campaign")).toHaveLength(1);
});

it("does not start the upgrade when the backup cannot be written", async () => {
  const { store } = open();
  const upgrade = vi.fn(async () => {});
  await expect(
    migrateWithBackup({
      vault: {
        save: async () => {
          throw new Error("quota exceeded");
        },
        latest: async () => undefined,
        close: () => {},
      },
      exportBackup: () => store.exportBackup(),
      upgrade,
      fromVersion: 10,
      toVersion: 20,
    }),
  ).rejects.toThrow("quota exceeded");
  expect(upgrade).not.toHaveBeenCalled();
});

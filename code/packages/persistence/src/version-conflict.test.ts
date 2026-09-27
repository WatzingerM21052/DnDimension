import "fake-indexeddb/auto";
import { afterEach, expect, it, vi } from "vitest";
import { Dexie } from "dexie";
import { createIndexedDbAggregateStore, isNewerSchemaError } from "./index";

const names: string[] = [];
const closers: (() => void)[] = [];
afterEach(async () => {
  for (const close of closers.splice(0)) close();
  for (const name of names.splice(0)) await Dexie.delete(name);
});

const command = {
  commandId: "create",
  aggregateId: "campaign",
  expectedRevision: 0,
  value: { name: "Coast" },
  event: { type: "created" },
};

/** Simulates a newer app build upgrading the same database in another tab. */
const upgradeFromNewerBuild = (name: string) =>
  new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(name, 1000);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("future");
      request.result.deleteObjectStore("commands");
    };
    request.onsuccess = () => {
      request.result.close();
      resolve();
    };
    request.onerror = () => reject(request.error);
  });

it("releases its connection and notifies the app when a newer build upgrades the schema", async () => {
  const name = `version-test-${crypto.randomUUID()}`;
  names.push(name);
  const onVersionChange = vi.fn();
  const current = createIndexedDbAggregateStore(name, { onVersionChange });
  closers.push(() => current.close());
  await current.commit(command);

  await upgradeFromNewerBuild(name);

  expect(onVersionChange).toHaveBeenCalledOnce();
});

it("refuses to touch a schema upgraded by a newer build and keeps its data", async () => {
  const name = `version-test-${crypto.randomUUID()}`;
  names.push(name);
  const first = createIndexedDbAggregateStore(name);
  closers.push(() => first.close());
  await first.commit(command);
  await upgradeFromNewerBuild(name);

  const staleBuild = createIndexedDbAggregateStore(name);
  closers.push(() => staleBuild.close());
  const failure = await staleBuild
    .commit({ ...command, commandId: "rename", expectedRevision: 1 })
    .then(
      () => undefined,
      (error: unknown) => error,
    );

  expect(isNewerSchemaError(failure)).toBe(true);
  const raw = new Dexie(name);
  closers.push(() => raw.close());
  await raw.open();
  expect(await raw.table("aggregates").get("campaign")).toMatchObject({ revision: 1 });
  // The stale build must not have re-created the table the newer build removed.
  expect(raw.tables.map((table) => table.name)).not.toContain("commands");
  expect(raw.verno).toBe(100);
});

it("does not treat unrelated failures as schema conflicts", () => {
  expect(isNewerSchemaError(new Error("quota"))).toBe(false);
  expect(isNewerSchemaError(null)).toBe(false);
  expect(isNewerSchemaError({ name: "QuotaExceededError" })).toBe(false);
});

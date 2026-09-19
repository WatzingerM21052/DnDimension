import "fake-indexeddb/auto";
import { afterEach, expect, it } from "vitest";
import { Dexie } from "dexie";
import { createIndexedDbAggregateStore } from "./index";
import { encodeBackup, type Snapshot } from "./backup";

const stores: ReturnType<typeof createIndexedDbAggregateStore>[] = [];
const names: string[] = [];
const open = () => {
  const name = `backup-test-${crypto.randomUUID()}`;
  names.push(name);
  const store = createIndexedDbAggregateStore(name);
  stores.push(store);
  return store;
};
afterEach(async () => {
  stores.splice(0).forEach((store) => store.close());
  for (const name of names.splice(0)) await Dexie.delete(name);
});
const command = {
  commandId: "create",
  aggregateId: "campaign",
  expectedRevision: 0,
  value: { name: "Coast" },
  event: { type: "created" },
};

it.each(["aggregate", "audit", "command", "missing"])(
  "rejects inconsistent %s data even with a matching checksum",
  async (part) => {
    const source = open();
    await source.commit(command);
    const envelope = JSON.parse(await source.exportBackup());
    const snapshot = JSON.parse(envelope.payload) as Snapshot;
    if (part === "aggregate") snapshot.aggregates[0]!.value = { name: "Forged" };
    if (part === "audit") snapshot.events[0]!.event = { type: "Forged" };
    if (part === "command") snapshot.commands[0]!.revision = 3;
    if (part === "missing") snapshot.events = [];
    const target = open();
    await expect(target.restoreBackup(await encodeBackup(snapshot))).rejects.toThrow();
    expect(await target.read("campaign")).toBeUndefined();
  },
);

it("rejects oversized imports before parsing", async () => {
  const target = open();
  await expect(target.restoreBackup(" ".repeat(10 * 1024 * 1024 + 1))).rejects.toThrow("10 MiB");
});

it("exports a consistent snapshot and restores state, audit and retry identity", async () => {
  const source = open();
  await source.commit(command);
  const backup = await source.exportBackup();
  const target = open();
  await target.restoreBackup(backup);
  expect(await target.read("campaign")).toEqual({
    aggregateId: "campaign",
    revision: 1,
    value: { name: "Coast" },
  });
  expect(await target.history("campaign")).toHaveLength(1);
  expect(await target.commit(command)).toEqual({ status: "replayed", revision: 1 });
});

it("rejects altered backup data without any target writes", async () => {
  const source = open();
  await source.commit(command);
  const backup = await source.exportBackup();
  const target = open();
  await expect(target.restoreBackup(backup.replace("Coast", "Tampered"))).rejects.toThrow();
  expect(await target.read("campaign")).toBeUndefined();
  expect(await target.commit(command)).toEqual({ status: "committed", revision: 1 });
});

it("refuses to overwrite an occupied database", async () => {
  const source = open();
  const target = open();
  await target.commit(command);
  await expect(target.restoreBackup(await source.exportBackup())).rejects.toThrow("empty");
  expect((await target.read("campaign"))?.revision).toBe(1);
});

it("rejects unsupported versions and malformed files", async () => {
  const source = open();
  const backup = JSON.parse(await source.exportBackup());
  const target = open();
  await expect(target.restoreBackup(JSON.stringify({ ...backup, version: 99 }))).rejects.toThrow();
  await expect(target.restoreBackup("not json")).rejects.toThrow();
});

it("allows only one concurrent restore into an empty target", async () => {
  const source = open();
  await source.commit(command);
  const backup = await source.exportBackup();
  const target = open();
  const results = await Promise.allSettled([
    target.restoreBackup(backup),
    target.restoreBackup(backup),
  ]);
  expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
  expect(await target.history("campaign")).toHaveLength(1);
});

import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";
import { createMemoryAggregateStore } from "@dndimension/core";
import { createIndexedDbAggregateStore } from "./index";
import { Dexie } from "dexie";
const databases: string[] = [];
const closers: (() => void)[] = [];
afterEach(async () => {
  for (const close of closers.splice(0)) close();
  for (const name of databases.splice(0)) await Dexie.delete(name);
});

const command = () => ({
  commandId: "command-1",
  aggregateId: "campaign-1",
  expectedRevision: 0,
  value: { name: "Clockwork Coast" },
  event: { type: "CampaignCreated" },
});

const openPair = () => {
  const name = `dndim-test-${crypto.randomUUID()}`;
  databases.push(name);
  const first = createIndexedDbAggregateStore(name);
  const second = createIndexedDbAggregateStore(name);
  closers.push(
    () => first.close(),
    () => second.close(),
  );
  return { name, first, second };
};

describe("IndexedDB transaction integration", () => {
  it("retains state, audit and command identity after closing and reopening", async () => {
    const { first, second } = openPair();
    await first.commit(command());
    first.close();
    expect((await second.read("campaign-1"))?.revision).toBe(1);
    expect(await second.history("campaign-1")).toHaveLength(1);
    expect(await second.commit(command())).toEqual({ status: "replayed", revision: 1 });
  });

  it("serializes competing writes across independent connections", async () => {
    const { first, second } = openPair();
    const results = await Promise.all([
      first.commit(command()),
      second.commit({ ...command(), commandId: "second-connection" }),
    ]);
    expect(results.map((result) => result.status).sort()).toEqual([
      "committed",
      "revision-conflict",
    ]);
    expect(await first.history("campaign-1")).toHaveLength(1);
  });

  it("rolls back the aggregate when a later audit write fails", async () => {
    const { name, first } = openPair();
    await first.commit(command());
    const inspection = new Dexie(name);
    closers.push(() => inspection.close());
    await inspection.open();
    // A test-owned inconsistent row forces a real constraint error after aggregate.put.
    await inspection
      .table("events")
      .add({ aggregateId: "campaign-1", revision: 2, commandId: "injected", event: null });
    const next = { ...command(), commandId: "next", expectedRevision: 1, value: { name: "New" } };
    await expect(first.commit(next)).rejects.toMatchObject({ name: "ConstraintError" });
    expect(await first.read("campaign-1")).toEqual({
      aggregateId: "campaign-1",
      revision: 1,
      value: { name: "Clockwork Coast" },
    });
    expect(await inspection.table("commands").get("next")).toBeUndefined();
    await inspection.table("events").delete(["campaign-1", 2]);
    expect(await first.commit(next)).toEqual({ status: "committed", revision: 2 });
  });
});

describe.each([
  ["memory", createMemoryAggregateStore],
  [
    "IndexedDB",
    () => {
      const name = `dndim-test-${crypto.randomUUID()}`;
      databases.push(name);
      const store = createIndexedDbAggregateStore(name);
      closers.push(() => store.close());
      return store;
    },
  ],
] as const)("%s aggregate store contract", (_name, createStore) => {
  it("publishes a revision and its audit event together", async () => {
    const store = createStore();
    expect(await store.commit(command())).toEqual({ status: "committed", revision: 1 });
    expect(await store.read("campaign-1")).toEqual({
      aggregateId: "campaign-1",
      revision: 1,
      value: { name: "Clockwork Coast" },
    });
    expect(await store.history("campaign-1")).toEqual([
      {
        commandId: "command-1",
        aggregateId: "campaign-1",
        revision: 1,
        event: { type: "CampaignCreated" },
      },
    ]);
  });

  it("replays a command without applying it twice", async () => {
    const store = createStore();
    await store.commit(command());
    expect(await store.commit(command())).toEqual({ status: "replayed", revision: 1 });
    expect(await store.history("campaign-1")).toHaveLength(1);
  });

  it("rejects reuse of a command ID with a different payload", async () => {
    const store = createStore();
    await store.commit(command());
    expect(await store.commit({ ...command(), value: { name: "Changed" } })).toEqual({
      status: "command-conflict",
    });
    expect((await store.read("campaign-1"))?.value).toEqual({ name: "Clockwork Coast" });
  });

  it("rejects stale writes without consuming the command ID", async () => {
    const store = createStore();
    await store.commit(command());
    const next = { ...command(), commandId: "command-2" };
    expect(await store.commit(next)).toEqual({ status: "revision-conflict", revision: 1 });
    expect(await store.commit({ ...next, expectedRevision: 1 })).toEqual({
      status: "committed",
      revision: 2,
    });
    expect(await store.history("campaign-1")).toHaveLength(2);
  });

  it("allows only one writer for a shared expected revision", async () => {
    const store = createStore();
    const results = await Promise.all([
      store.commit(command()),
      store.commit({ ...command(), commandId: "other" }),
    ]);
    expect(results.map((result) => result.status).sort()).toEqual([
      "committed",
      "revision-conflict",
    ]);
    expect(await store.history("campaign-1")).toHaveLength(1);
  });

  it("isolates committed state from input and output mutations", async () => {
    const store = createStore();
    const input = command();
    await store.commit(input);
    input.value.name = "Mutated";
    const record = await store.read("campaign-1");
    if (record) record.value = null;
    const events = await store.history("campaign-1");
    events.splice(0);
    expect((await store.read("campaign-1"))?.value).toEqual({ name: "Clockwork Coast" });
    expect(await store.history("campaign-1")).toHaveLength(1);
  });

  it("treats object key order as irrelevant for retries", async () => {
    const store = createStore();
    await store.commit({ ...command(), value: { a: 1, b: 2 } });
    expect(await store.commit({ ...command(), value: { b: 2, a: 1 } })).toEqual({
      status: "replayed",
      revision: 1,
    });
  });

  it.each([-1, 0.5, Number.MAX_SAFE_INTEGER, NaN])(
    "rejects invalid revision %s without writes",
    async (expectedRevision) => {
      const store = createStore();
      expect(await store.commit({ ...command(), expectedRevision })).toEqual({
        status: "invalid-command",
      });
      expect(await store.read("campaign-1")).toBeUndefined();
      expect(await store.history("campaign-1")).toEqual([]);
    },
  );

  it("rejects non-finite JSON numbers without partial writes", async () => {
    const store = createStore();
    expect(await store.commit({ ...command(), event: { amount: Infinity } })).toEqual({
      status: "invalid-command",
    });
    expect(await store.read("campaign-1")).toBeUndefined();
    expect(await store.commit(command())).toEqual({ status: "committed", revision: 1 });
  });
});

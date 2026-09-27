import "fake-indexeddb/auto";
import { afterEach, expect, it, vi } from "vitest";
import { Dexie } from "dexie";
import { createIndexedDbAggregateStore, type ExternalChange } from "./index";

const names: string[] = [];
const closers: (() => void)[] = [];
afterEach(async () => {
  for (const close of closers.splice(0)) close();
  for (const name of names.splice(0)) await Dexie.delete(name);
});

const waitFor = async (condition: () => boolean) => {
  for (let attempt = 0; attempt < 50 && !condition(); attempt++)
    await new Promise((resolve) => setTimeout(resolve, 10));
};

it("tells other connections about commits and restores, never about rejected commands", async () => {
  const name = `notify-test-${crypto.randomUUID()}`;
  names.push(name);
  const received: ExternalChange[] = [];
  const writer = createIndexedDbAggregateStore(name);
  const reader = createIndexedDbAggregateStore(name, {
    onExternalChange: (change) => received.push(change),
  });
  closers.push(
    () => writer.close(),
    () => reader.close(),
  );

  await writer.commit({
    commandId: "c1",
    aggregateId: "campaign",
    expectedRevision: 0,
    value: { name: "Coast" },
    event: null,
  });
  await writer.commit({
    commandId: "stale",
    aggregateId: "campaign",
    expectedRevision: 0,
    value: { name: "Stale" },
    event: null,
  });
  await waitFor(() => received.length > 0);

  expect(received).toEqual([{ kind: "commit", aggregateId: "campaign", revision: 1 }]);
});

it("stops listening after close", async () => {
  const name = `notify-test-${crypto.randomUUID()}`;
  names.push(name);
  const onExternalChange = vi.fn();
  const writer = createIndexedDbAggregateStore(name);
  const reader = createIndexedDbAggregateStore(name, { onExternalChange });
  closers.push(() => writer.close());
  reader.close();
  await writer.commit({
    commandId: "c1",
    aggregateId: "campaign",
    expectedRevision: 0,
    value: null,
    event: null,
  });
  await new Promise((resolve) => setTimeout(resolve, 50));
  expect(onExternalChange).not.toHaveBeenCalled();
});

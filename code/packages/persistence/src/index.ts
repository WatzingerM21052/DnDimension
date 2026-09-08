import { Dexie, type Table } from "dexie";
import {
  prepareAggregateCommand,
  type AggregateStore,
  type AggregateRecord,
  type AuditRecord,
} from "@dndimension/core";

interface ProcessedCommand {
  commandId: string;
  fingerprint: string;
  revision: number;
}
export interface IndexedDbAggregateStore extends AggregateStore {
  close(): void;
}

/** Experimental P-02 schema, not the production campaign/character schema. */
export const createIndexedDbAggregateStore = (name: string): IndexedDbAggregateStore => {
  const db = new Dexie(name);
  db.version(1).stores({
    aggregates: "aggregateId",
    events: "[aggregateId+revision], commandId",
    commands: "commandId",
  });
  const aggregates: Table<AggregateRecord, string> = db.table("aggregates");
  const events: Table<AuditRecord, [string, number]> = db.table("events");
  const commands: Table<ProcessedCommand, string> = db.table("commands");
  return {
    async commit(input) {
      const prepared = prepareAggregateCommand(input);
      if (!prepared) return { status: "invalid-command" };
      const { command, fingerprint } = prepared;
      return db.transaction("rw", aggregates, events, commands, async () => {
        const previous = await commands.get(command.commandId);
        if (previous)
          return previous.fingerprint === fingerprint
            ? { status: "replayed" as const, revision: previous.revision }
            : { status: "command-conflict" as const };
        const currentRevision = (await aggregates.get(command.aggregateId))?.revision ?? 0;
        if (currentRevision !== command.expectedRevision)
          return { status: "revision-conflict" as const, revision: currentRevision };
        const revision = currentRevision + 1;
        await aggregates.put({ aggregateId: command.aggregateId, revision, value: command.value });
        await events.add({
          aggregateId: command.aggregateId,
          revision,
          commandId: command.commandId,
          event: command.event,
        });
        await commands.add({ commandId: command.commandId, fingerprint, revision });
        return { status: "committed" as const, revision };
      });
    },
    async read(aggregateId) {
      return aggregates.get(aggregateId);
    },
    async history(aggregateId) {
      return events
        .where("[aggregateId+revision]")
        .between([aggregateId, 1], [aggregateId, Number.MAX_SAFE_INTEGER], true, true)
        .toArray();
    },
    close() {
      db.close();
    },
  };
};

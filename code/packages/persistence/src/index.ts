import { Dexie, type Table } from "dexie";
import { encodeBackup, decodeBackup, type ProcessedCommand } from "./backup";
import {
  prepareAggregateCommand,
  type AggregateStore,
  type AggregateRecord,
  type AuditRecord,
} from "@dndimension/core";

export interface IndexedDbAggregateStoreOptions {
  /** Another tab or a newer app version wants to upgrade the schema; this connection closes. */
  onVersionChange?: () => void;
  /**
   * Another tab committed to the same database. Tabs coordinate optimistically: the change
   * is a hint to reload, and stale commands are still rejected by the revision check.
   */
  onExternalChange?: (change: ExternalChange) => void;
}

export type ExternalChange = Readonly<
  { kind: "commit"; aggregateId: string; revision: number } | { kind: "restore" }
>;

const changeChannelName = (name: string) => `dndimension-persistence:${name}`;

const SCHEMA_VERSION = 1;
// Dexie stores declared version n as native IndexedDB version n * 10.
const NATIVE_SCHEMA_VERSION = SCHEMA_VERSION * 10;

/** The database was upgraded by a newer app build than the code currently running. */
export class NewerSchemaError extends Error {
  override name = "NewerSchemaError";
  constructor(readonly installedVersion: number) {
    super(`Database schema ${installedVersion} is newer than supported ${NATIVE_SCHEMA_VERSION}`);
  }
}

/**
 * True when stored data belongs to a newer schema than this code knows. The data is intact;
 * recovery means loading the newer app version, never deleting the database.
 */
export const isNewerSchemaError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "name" in error &&
  (error.name === "NewerSchemaError" || error.name === "VersionError");

export interface IndexedDbAggregateStore extends AggregateStore {
  close(): void;
  exportBackup(): Promise<string>;
  restoreBackup(text: string): Promise<void>;
}

/** Experimental P-02 schema, not the production campaign/character schema. */
export const createIndexedDbAggregateStore = (
  name: string,
  { onVersionChange, onExternalChange }: IndexedDbAggregateStoreOptions = {},
): IndexedDbAggregateStore => {
  const channel =
    typeof BroadcastChannel === "function" ? new BroadcastChannel(changeChannelName(name)) : null;
  if (channel && onExternalChange)
    channel.onmessage = (message: MessageEvent<ExternalChange>) => onExternalChange(message.data);
  const announce = (change: ExternalChange) => channel?.postMessage(change);
  // Opened explicitly: Dexie 4 would otherwise re-create tables a newer build removed.
  const db = new Dexie(name, { autoOpen: false });
  db.on("versionchange", () => {
    // Close so the other connection's upgrade is not blocked, then let the app react.
    db.close();
    onVersionChange?.();
    return false;
  });
  db.version(1).stores({
    aggregates: "aggregateId",
    events: "[aggregateId+revision], commandId",
    commands: "commandId",
  });
  const aggregates: Table<AggregateRecord, string> = db.table("aggregates");
  const events: Table<AuditRecord, [string, number]> = db.table("events");
  const commands: Table<ProcessedCommand, string> = db.table("commands");
  const assertSchemaNotNewer = async () => {
    const factory = Dexie.dependencies.indexedDB;
    if (typeof factory?.databases !== "function") return;
    const installed = (await factory.databases()).find((info) => info.name === name)?.version;
    if (installed !== undefined && installed > NATIVE_SCHEMA_VERSION)
      throw new NewerSchemaError(installed);
  };
  let opening: Promise<void> | undefined;
  const ready = () =>
    (opening ??= assertSchemaNotNewer()
      .then(() => db.open())
      .then(
        () => undefined,
        (error: unknown) => {
          opening = undefined;
          throw error;
        },
      ));
  return {
    async exportBackup() {
      await ready();
      const snapshot = await db.transaction("r", aggregates, events, commands, async () => ({
        aggregates: await aggregates.toArray(),
        events: await events.toArray(),
        commands: await commands.toArray(),
      }));
      return encodeBackup(snapshot);
    },
    async restoreBackup(text) {
      const snapshot = await decodeBackup(text);
      await ready();
      await db.transaction("rw", aggregates, events, commands, async () => {
        if ((await aggregates.count()) || (await events.count()) || (await commands.count()))
          throw new Error("Restore requires an empty database");
        await aggregates.bulkAdd(snapshot.aggregates);
        await events.bulkAdd(snapshot.events);
        await commands.bulkAdd(snapshot.commands);
      });
      announce({ kind: "restore" });
    },
    async commit(input) {
      const prepared = prepareAggregateCommand(input);
      if (!prepared) return { status: "invalid-command" };
      const { command, fingerprint } = prepared;
      await ready();
      const result = await db.transaction("rw", aggregates, events, commands, async () => {
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
      // Announce only after the transaction is durable, never from inside it.
      if (result.status === "committed")
        announce({ kind: "commit", aggregateId: command.aggregateId, revision: result.revision });
      return result;
    },
    async read(aggregateId) {
      await ready();
      return aggregates.get(aggregateId);
    },
    async history(aggregateId) {
      await ready();
      return events
        .where("[aggregateId+revision]")
        .between([aggregateId, 1], [aggregateId, Number.MAX_SAFE_INTEGER], true, true)
        .toArray();
    },
    close() {
      channel?.close();
      db.close();
    },
  };
};

export * from "./migration";

import {
  createMemoryAggregateStore,
  prepareAggregateCommand,
  type AggregateRecord,
  type AuditRecord,
  type AggregateCommand,
} from "@dndimension/core";

export interface ProcessedCommand {
  commandId: string;
  fingerprint: string;
  revision: number;
}
export interface Snapshot {
  aggregates: AggregateRecord[];
  events: AuditRecord[];
  commands: ProcessedCommand[];
}
const MAX_BYTES = 10 * 1024 * 1024;

const digest = async (text: string): Promise<string> => {
  const bytes = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

export const encodeBackup = async (snapshot: Snapshot): Promise<string> => {
  const payload = JSON.stringify(snapshot);
  const result = JSON.stringify({
    format: "dndimension-persistence-spike",
    version: 1,
    payload,
    sha256: await digest(payload),
  });
  if (new TextEncoder().encode(result).length > MAX_BYTES)
    throw new Error("Backup exceeds 10 MiB spike limit");
  return result;
};

/** Validate before any database write. A checksum detects corruption, not authenticity. */
export const decodeBackup = async (text: string): Promise<Snapshot> => {
  if (new TextEncoder().encode(text).length > MAX_BYTES)
    throw new Error("Backup exceeds 10 MiB spike limit");
  const envelope = JSON.parse(text);
  if (
    !envelope ||
    envelope.format !== "dndimension-persistence-spike" ||
    envelope.version !== 1 ||
    typeof envelope.payload !== "string" ||
    typeof envelope.sha256 !== "string"
  )
    throw new Error("Unsupported backup format");
  if ((await digest(envelope.payload)) !== envelope.sha256)
    throw new Error("Backup checksum mismatch");
  const snapshot = JSON.parse(envelope.payload) as Snapshot;
  if (
    !snapshot ||
    !Array.isArray(snapshot.aggregates) ||
    !Array.isArray(snapshot.events) ||
    !Array.isArray(snapshot.commands)
  )
    throw new Error("Invalid backup data");
  const reference = createMemoryAggregateStore();
  const seenCommands = new Set<string>();
  const preparedCommands: { input: AggregateCommand; revision: number }[] = [];
  for (const row of snapshot.commands) {
    if (!row || typeof row.fingerprint !== "string" || seenCommands.has(row.commandId))
      throw new Error("Invalid command history");
    const prepared = prepareAggregateCommand(JSON.parse(row.fingerprint));
    if (
      !prepared ||
      prepared.fingerprint !== row.fingerprint ||
      prepared.command.commandId !== row.commandId ||
      prepared.command.expectedRevision + 1 !== row.revision
    )
      throw new Error("Invalid command history");
    seenCommands.add(row.commandId);
    preparedCommands.push({ input: prepared.command, revision: row.revision });
  }
  preparedCommands.sort((a, b) => a.revision - b.revision);
  for (const { input } of preparedCommands) {
    if ((await reference.commit(input)).status !== "committed")
      throw new Error("Broken revision history");
  }
  const ids = new Set(preparedCommands.map(({ input }) => input.aggregateId));
  if (snapshot.aggregates.length !== ids.size || snapshot.events.length !== preparedCommands.length)
    throw new Error("Incomplete snapshot");
  const seen = new Set<string>();
  for (const row of snapshot.aggregates) {
    if (!row || seen.has(row.aggregateId) || !ids.has(row.aggregateId))
      throw new Error("Invalid aggregate snapshot");
    seen.add(row.aggregateId);
    const expected = await reference.read(row.aggregateId);
    // Validate JSON values through the same normalization used for command identity.
    const normalized = prepareAggregateCommand({
      commandId: "check",
      aggregateId: row.aggregateId,
      expectedRevision: 0,
      value: row.value,
      event: null,
    });
    const expectedNormalized =
      expected &&
      prepareAggregateCommand({
        commandId: "check",
        aggregateId: row.aggregateId,
        expectedRevision: 0,
        value: expected.value,
        event: null,
      });
    if (
      !normalized ||
      !expectedNormalized ||
      row.revision !== expected?.revision ||
      normalized.fingerprint !== expectedNormalized.fingerprint
    )
      throw new Error("Snapshot does not match history");
    const actualEvents = snapshot.events
      .filter((event) => event?.aggregateId === row.aggregateId)
      .sort((a, b) => a.revision - b.revision);
    const expectedEvents = await reference.history(row.aggregateId);
    if (actualEvents.length !== expectedEvents.length) throw new Error("Invalid audit history");
    for (let i = 0; i < actualEvents.length; i++) {
      const event = actualEvents[i]!;
      const expectedEvent = expectedEvents[i]!;
      const actual = prepareAggregateCommand({
        commandId: event.commandId,
        aggregateId: event.aggregateId,
        expectedRevision: event.revision - 1,
        value: null,
        event: event.event,
      });
      const expected = prepareAggregateCommand({
        commandId: expectedEvent.commandId,
        aggregateId: expectedEvent.aggregateId,
        expectedRevision: expectedEvent.revision - 1,
        value: null,
        event: expectedEvent.event,
      });
      if (!actual || actual.fingerprint !== expected?.fingerprint)
        throw new Error("Invalid audit history");
    }
  }
  return snapshot;
};

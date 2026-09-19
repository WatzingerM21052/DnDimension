/** JSON-only application boundary; no UI, browser or database dependency. */
export type JsonValue =
  null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

export interface AggregateCommand {
  commandId: string;
  aggregateId: string;
  expectedRevision: number;
  value: JsonValue;
  event: JsonValue;
}

export interface AggregateRecord {
  aggregateId: string;
  revision: number;
  value: JsonValue;
}

export interface AuditRecord {
  commandId: string;
  aggregateId: string;
  revision: number;
  event: JsonValue;
}

export type CommitResult =
  | { status: "committed" | "replayed" | "revision-conflict"; revision: number }
  | { status: "command-conflict" | "invalid-command" };

export interface AggregateStore {
  commit(command: AggregateCommand): Promise<CommitResult>;
  read(aggregateId: string): Promise<AggregateRecord | undefined>;
  history(aggregateId: string): Promise<AuditRecord[]>;
}

const canonicalJson = (value: JsonValue): string => {
  if (value === null || typeof value === "string" || typeof value === "boolean") {
    return JSON.stringify(value);
  }
  if (typeof value === "number" && Number.isFinite(value)) return JSON.stringify(value);
  if (Array.isArray(value)) return `[${Array.from(value, canonicalJson).join(",")}]`;
  if (typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key]!)}`)
      .join(",")}}`;
  }
  throw new TypeError("Only finite JSON values are supported");
};

export const prepareAggregateCommand = (
  input: AggregateCommand,
): { command: AggregateCommand; fingerprint: string } | undefined => {
  let fingerprint: string;
  let command: AggregateCommand;
  try {
    if (
      typeof input.commandId !== "string" ||
      !input.commandId.trim() ||
      typeof input.aggregateId !== "string" ||
      !input.aggregateId.trim() ||
      !Number.isSafeInteger(input.expectedRevision) ||
      input.expectedRevision < 0 ||
      input.expectedRevision >= Number.MAX_SAFE_INTEGER
    )
      return undefined;
    fingerprint = canonicalJson({
      commandId: input.commandId,
      aggregateId: input.aggregateId,
      expectedRevision: input.expectedRevision,
      value: input.value,
      event: input.event,
    });
    command = JSON.parse(fingerprint) as AggregateCommand;
  } catch {
    return undefined;
  }

  return { command, fingerprint };
};

/** Reference adapter only. Its contents are deliberately not durable. */
export const createMemoryAggregateStore = (): AggregateStore => {
  let state = {
    aggregates: new Map<string, AggregateRecord>(),
    events: [] as AuditRecord[],
    commands: new Map<string, { fingerprint: string; revision: number }>(),
  };

  return {
    async commit(input) {
      const prepared = prepareAggregateCommand(input);
      if (!prepared) return { status: "invalid-command" };
      const { command, fingerprint } = prepared;

      const previous = state.commands.get(command.commandId);
      if (previous) {
        return previous.fingerprint === fingerprint
          ? { status: "replayed", revision: previous.revision }
          : { status: "command-conflict" };
      }
      const currentRevision = state.aggregates.get(command.aggregateId)?.revision ?? 0;
      if (command.expectedRevision !== currentRevision) {
        return { status: "revision-conflict", revision: currentRevision };
      }
      const revision = currentRevision + 1;
      // Prepare everything before publishing; no await may split this atomic section.
      const aggregates = new Map(state.aggregates);
      aggregates.set(command.aggregateId, {
        aggregateId: command.aggregateId,
        revision,
        value: command.value,
      });
      const events = [
        ...state.events,
        {
          commandId: command.commandId,
          aggregateId: command.aggregateId,
          revision,
          event: command.event,
        },
      ];
      const commands = new Map(state.commands);
      commands.set(command.commandId, { fingerprint, revision });
      state = { aggregates, events, commands };
      return { status: "committed", revision };
    },
    async read(aggregateId) {
      return structuredClone(state.aggregates.get(aggregateId));
    },
    async history(aggregateId) {
      return structuredClone(state.events.filter((event) => event.aggregateId === aggregateId));
    },
  };
};

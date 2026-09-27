import { err, ok, type Result } from "./result";

/** Opaque, export-stable identifier. Consumers must not parse or depend on its format. */
export type EntityId = string;

const ENTITY_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/;
const AGGREGATE_TYPE = /^[a-z][a-z0-9-]{0,63}$/;

export const isEntityId = (value: unknown): value is EntityId =>
  typeof value === "string" && ENTITY_ID.test(value);

/** Who performed a change. v1 is local-only; accounts extend this union later. */
export type ActorRef = "local_user" | "system";

export const isActorRef = (value: unknown): value is ActorRef =>
  value === "local_user" || value === "system";

/** Reference to a mutable aggregate; `revision` pins it where reproducibility matters. */
export type EntityRef = Readonly<{
  aggregateType: string;
  id: EntityId;
  revision?: number;
}>;

export type EntityRefError = Readonly<{ code: "invalid_entity_ref"; fields: readonly string[] }>;

export const parseEntityRef = (raw: unknown): Result<EntityRef, EntityRefError> => {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw))
    return err({ code: "invalid_entity_ref", fields: ["root"] });
  const input = raw as Record<string, unknown>;
  const fields = [
    typeof input.aggregateType === "string" && AGGREGATE_TYPE.test(input.aggregateType)
      ? null
      : "aggregateType",
    isEntityId(input.id) ? null : "id",
    input.revision === undefined ||
    (Number.isSafeInteger(input.revision) && (input.revision as number) >= 1)
      ? null
      : "revision",
  ].filter((field): field is string => field !== null);
  if (fields.length > 0) return err({ code: "invalid_entity_ref", fields });
  return ok({
    aggregateType: input.aggregateType as string,
    id: input.id as EntityId,
    ...(input.revision === undefined ? {} : { revision: input.revision as number }),
  });
};

/** Metadata every long-lived aggregate carries (v0.2 spec §6.1). */
export type AggregateMetadata = Readonly<{
  id: EntityId;
  aggregateType: string;
  aggregateRevision: number;
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
  createdBy: ActorRef;
  updatedBy: ActorRef;
  /** Set when this aggregate was deliberately copied; copies always get a new id. */
  copiedFromRef?: EntityRef;
}>;

export const entityRefOf = (metadata: AggregateMetadata, pinRevision = false): EntityRef => ({
  aggregateType: metadata.aggregateType,
  id: metadata.id,
  ...(pinRevision ? { revision: metadata.aggregateRevision } : {}),
});

/** Metadata after one accepted change: next revision, same id and creation facts. */
export const advanceMetadata = (
  metadata: AggregateMetadata,
  { at, by }: { at: string; by: ActorRef },
): AggregateMetadata => ({
  ...metadata,
  aggregateRevision: metadata.aggregateRevision + 1,
  updatedAt: at,
  updatedBy: by,
});

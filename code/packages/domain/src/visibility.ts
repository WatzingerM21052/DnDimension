import { err, isEntityId, ok, type EntityId, type Result } from "@dndimension/core";

/**
 * Who may see a piece of knowledge (v0.2 spec §6.3). Person-specific policies follow with
 * accounts and roles; until then the audience is the DM or the whole local table.
 */
export type VisibilityPolicy =
  | Readonly<{ kind: "dm_only" }>
  | Readonly<{ kind: "player_facing" }>
  | Readonly<{ kind: "revealed"; revealedByEventId: EntityId; revealedAt: string }>;

export type Audience = "dm" | "player";

export type VisibilityPolicyError = Readonly<{ code: "invalid_visibility_policy" }>;

const UTC_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

export const parseVisibilityPolicy = (
  raw: unknown,
): Result<VisibilityPolicy, VisibilityPolicyError> => {
  if (typeof raw !== "object" || raw === null) return err({ code: "invalid_visibility_policy" });
  const input = raw as Record<string, unknown>;
  if (input.kind === "dm_only" || input.kind === "player_facing") return ok({ kind: input.kind });
  if (
    input.kind === "revealed" &&
    isEntityId(input.revealedByEventId) &&
    typeof input.revealedAt === "string" &&
    UTC_TIMESTAMP.test(input.revealedAt)
  )
    return ok({
      kind: "revealed",
      revealedByEventId: input.revealedByEventId,
      revealedAt: input.revealedAt,
    });
  return err({ code: "invalid_visibility_policy" });
};

/**
 * Deny by default: players see only valid `player_facing` or `revealed` policies. A missing,
 * unknown or malformed policy is treated as DM-only; the DM sees everything.
 */
export const isVisibleTo = (policy: unknown, audience: Audience): boolean => {
  if (audience === "dm") return true;
  const parsed = parseVisibilityPolicy(policy);
  return parsed.ok && parsed.value.kind !== "dm_only";
};

/**
 * Reveals DM-only knowledge through a referenced event. Already visible knowledge keeps its
 * policy, so the original reveal time is never overwritten.
 */
export const reveal = (
  policy: VisibilityPolicy,
  { eventId, at }: { eventId: EntityId; at: string },
): VisibilityPolicy =>
  policy.kind === "dm_only"
    ? { kind: "revealed", revealedByEventId: eventId, revealedAt: at }
    : policy;

/** Keeps only the items the audience may see. */
export const projectItems = <TItem extends { readonly visibility?: unknown }>(
  items: readonly TItem[],
  audience: Audience,
): TItem[] => items.filter((item) => isVisibleTo(item.visibility, audience));

/**
 * Field-level projection: for players, a field survives only if its own policy allows it.
 * Fields without a policy are removed, so new fields stay hidden until explicitly classified.
 */
export const projectFields = <TRecord extends Record<string, unknown>>(
  record: TRecord,
  policies: Readonly<Partial<Record<keyof TRecord, VisibilityPolicy>>>,
  audience: Audience,
): Partial<TRecord> => {
  if (audience === "dm") return { ...record };
  const visible: Partial<TRecord> = {};
  for (const key of Object.keys(record) as (keyof TRecord)[]) {
    if (isVisibleTo(policies[key], audience)) visible[key] = record[key];
  }
  return visible;
};

import type { EntityId } from "./entity";

/** Replaceable time source; timestamps are ISO-8601 UTC strings. */
export interface Clock {
  now(): string;
}

/** Replaceable id source. The concrete format stays an adapter decision (spec §21). */
export interface IdGenerator {
  next(): EntityId;
}

export const systemClock: Clock = { now: () => new Date().toISOString() };

export const randomIdGenerator: IdGenerator = { next: () => crypto.randomUUID() };

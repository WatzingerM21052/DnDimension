import { describe, expect, it } from "vitest";
import {
  advanceMetadata,
  entityRefOf,
  isEntityId,
  parseEntityRef,
  type AggregateMetadata,
} from "./entity";
import { domainError } from "./domain-error";

const metadata: AggregateMetadata = {
  id: "campaign-1",
  aggregateType: "campaign",
  aggregateRevision: 3,
  schemaVersion: 1,
  createdAt: "2026-09-01T10:00:00.000Z",
  updatedAt: "2026-09-02T10:00:00.000Z",
  createdBy: "local_user",
  updatedBy: "local_user",
};

describe("entity identity", () => {
  it("accepts opaque ids including UUIDs and rejects unsafe values", () => {
    expect(isEntityId("0b8e2d0e-6c1b-4a1e-9d7e-3f1f0c2a9b11")).toBe(true);
    expect(isEntityId("campaign_1")).toBe(true);
    for (const bad of ["", "../x", "a b", "-leading", "x".repeat(129), 42])
      expect(isEntityId(bad)).toBe(false);
  });

  it("parses references and reports every invalid field", () => {
    expect(parseEntityRef({ aggregateType: "character", id: "c-1", revision: 2 })).toEqual({
      ok: true,
      value: { aggregateType: "character", id: "c-1", revision: 2 },
    });
    expect(parseEntityRef({ aggregateType: "Character", id: "", revision: 0 })).toEqual({
      ok: false,
      error: { code: "invalid_entity_ref", fields: ["aggregateType", "id", "revision"] },
    });
    expect(parseEntityRef(null)).toMatchObject({ ok: false, error: { fields: ["root"] } });
  });

  it("drops unknown properties from references", () => {
    const result = parseEntityRef({ aggregateType: "campaign", id: "c", extra: true });
    expect(result).toEqual({ ok: true, value: { aggregateType: "campaign", id: "c" } });
  });
});

describe("aggregate metadata", () => {
  it("builds floating and pinned references", () => {
    expect(entityRefOf(metadata)).toEqual({ aggregateType: "campaign", id: "campaign-1" });
    expect(entityRefOf(metadata, true)).toMatchObject({ revision: 3 });
  });

  it("advances revision and update facts but keeps identity and creation", () => {
    const next = advanceMetadata(metadata, { at: "2026-09-03T10:00:00.000Z", by: "system" });
    expect(next).toEqual({
      ...metadata,
      aggregateRevision: 4,
      updatedAt: "2026-09-03T10:00:00.000Z",
      updatedBy: "system",
    });
    expect(metadata.aggregateRevision).toBe(3);
  });
});

describe("domainError", () => {
  it("omits empty details", () => {
    expect(domainError("revision_conflict", "stale")).toEqual({
      code: "revision_conflict",
      message: "stale",
    });
    expect(domainError("revision_conflict", "stale", { current: 4 }).details).toEqual({
      current: 4,
    });
  });
});

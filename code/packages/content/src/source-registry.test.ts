import { describe, expect, it } from "vitest";
import type { SourceManifest } from "./source-manifest";
import {
  assertPublishable,
  emptySourceRegistry,
  registerSource,
  resolveSource,
  sourcesForCampaign,
  type SourceRegistry,
} from "./source-registry";
import { SRD_5_2_1_MANIFEST } from "./srd";

const unwrap = <T>(result: { ok: true; value: T } | { ok: false; error: unknown }): T => {
  if (!result.ok) throw new Error(JSON.stringify(result.error));
  return result.value;
};

const campaignSource = (campaignId: string, revision = 1): SourceManifest => ({
  id: `homebrew-${campaignId}`,
  revision,
  title: `${campaignId} homebrew`,
  ruleset: "dnd5e-2024",
  origin: `campaign:${campaignId}`,
  license: { id: "user-owned" },
  snapshot: { version: String(revision), transformVersion: "0" },
});

const withSrd = (): SourceRegistry =>
  unwrap(registerSource(emptySourceRegistry, SRD_5_2_1_MANIFEST));

describe("registerSource", () => {
  it("registers SRD 5.2.1 as an official snapshot", () => {
    const registry = withSrd();
    expect(unwrap(resolveSource(registry, { id: "srd-5.2.1", revision: 1 }))).toBe(
      SRD_5_2_1_MANIFEST,
    );
  });

  it("is idempotent for identical data and does not mutate the input registry", () => {
    const registry = withSrd();
    expect(unwrap(registerSource(registry, { ...SRD_5_2_1_MANIFEST }))).toBe(registry);
    expect(emptySourceRegistry.size).toBe(0);
  });

  it("refuses to change an already registered revision", () => {
    expect(
      registerSource(withSrd(), { ...SRD_5_2_1_MANIFEST, title: "Rewritten history" }),
    ).toEqual({
      ok: false,
      error: { code: "manifest_conflict", ref: { id: "srd-5.2.1", revision: 1 } },
    });
  });

  it("accepts only the next revision of a source", () => {
    const registry = unwrap(registerSource(emptySourceRegistry, campaignSource("coast")));
    expect(registerSource(registry, campaignSource("coast", 3))).toMatchObject({
      ok: false,
      error: { code: "revision_gap", latestRevision: 1 },
    });
    const next = unwrap(registerSource(registry, campaignSource("coast", 2)));
    expect(next.size).toBe(2);
    expect(unwrap(resolveSource(next, { id: "homebrew-coast", revision: 1 })).revision).toBe(1);
  });

  it("never moves a source to another origin", () => {
    const registry = unwrap(registerSource(emptySourceRegistry, campaignSource("coast")));
    expect(
      registerSource(registry, { ...campaignSource("coast", 2), origin: "homebrew" }),
    ).toMatchObject({ ok: false, error: { code: "origin_changed" } });
  });
});

describe("queries and release gate", () => {
  const registry = [campaignSource("coast"), campaignSource("peaks")].reduce(
    (current, manifest) => unwrap(registerSource(current, manifest)),
    withSrd(),
  );

  it("isolates campaign homebrew per campaign", () => {
    expect(sourcesForCampaign(registry, "coast").map((source) => source.id)).toEqual([
      "srd-5.2.1",
      "homebrew-coast",
    ]);
  });

  it("allows publishing SRD references only", () => {
    expect(assertPublishable(registry, [{ id: "srd-5.2.1", revision: 1 }])).toEqual({
      ok: true,
      value: undefined,
    });
    expect(
      assertPublishable(registry, [
        { id: "srd-5.2.1", revision: 1 },
        { id: "homebrew-coast", revision: 1 },
        { id: "never-registered", revision: 1 },
      ]),
    ).toEqual({
      ok: false,
      error: {
        code: "unpublishable_sources",
        refs: [
          { id: "homebrew-coast", revision: 1 },
          { id: "never-registered", revision: 1 },
        ],
      },
    });
  });

  it("reports unknown sources", () => {
    expect(resolveSource(registry, { id: "srd-5.2.1", revision: 2 })).toMatchObject({
      ok: false,
      error: { code: "unknown_source" },
    });
  });
});

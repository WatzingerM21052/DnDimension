import { describe, expect, it } from "vitest";
import {
  isAvailableInCampaign,
  isPublishable,
  parseSourceManifest,
  type SourceManifest,
} from "./source-manifest";
import { SRD_5_2_1_MANIFEST } from "./srd";

const homebrew = (origin: SourceManifest["origin"]): SourceManifest => ({
  id: "coast-homebrew",
  revision: 1,
  title: "Coast Homebrew",
  ruleset: "dnd5e-2024",
  origin,
  license: { id: "user-owned" },
  snapshot: { version: "1", transformVersion: "0" },
});

describe("parseSourceManifest", () => {
  it("accepts the SRD 5.2.1 registration record", () => {
    expect(parseSourceManifest(SRD_5_2_1_MANIFEST)).toEqual({
      ok: true,
      value: SRD_5_2_1_MANIFEST,
    });
  });

  it("rejects a non-object root", () => {
    expect(parseSourceManifest([])).toEqual({
      ok: false,
      error: { code: "invalid_source_manifest", fields: ["root"] },
    });
  });

  it("reports every invalid field", () => {
    const result = parseSourceManifest({
      id: "Bad Id",
      revision: 0,
      title: " ",
      ruleset: "pathfinder",
      origin: "campaign:",
      license: { id: "GPL", url: "http://insecure" },
      snapshot: { retrievedAt: "yesterday", sourceUrl: "ftp://x" },
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.fields).toEqual([
        "id",
        "revision",
        "title",
        "ruleset",
        "origin",
        "license.id",
        "license.url",
        "snapshot.version",
        "snapshot.transformVersion",
        "snapshot.sourceUrl",
        "snapshot.retrievedAt",
      ]);
  });

  it("requires attribution for CC-BY content and an open license for SRD", () => {
    const withoutAttribution: Record<string, unknown> = { ...SRD_5_2_1_MANIFEST };
    delete withoutAttribution.attribution;
    expect(parseSourceManifest(withoutAttribution)).toMatchObject({
      ok: false,
      error: { fields: ["attribution"] },
    });
    expect(
      parseSourceManifest({ ...SRD_5_2_1_MANIFEST, license: { id: "proprietary" } }),
    ).toMatchObject({ ok: false, error: { fields: ["license.id"] } });
  });

  it("drops unknown properties from untrusted input", () => {
    const result = parseSourceManifest({ ...SRD_5_2_1_MANIFEST, injected: "<script>" });
    expect(result.ok && "injected" in result.value).toBe(false);
  });
});

describe("source boundaries", () => {
  it("publishes only openly licensed SRD content", () => {
    expect(isPublishable(SRD_5_2_1_MANIFEST)).toBe(true);
    expect(isPublishable(homebrew("private"))).toBe(false);
    expect(isPublishable(homebrew("homebrew"))).toBe(false);
    expect(isPublishable(homebrew("campaign:coast"))).toBe(false);
  });

  it("keeps campaign homebrew inside its campaign", () => {
    expect(isAvailableInCampaign(homebrew("campaign:coast"), "coast")).toBe(true);
    expect(isAvailableInCampaign(homebrew("campaign:coast"), "coastal")).toBe(false);
    expect(isAvailableInCampaign(homebrew("homebrew"), "anything")).toBe(true);
    expect(isAvailableInCampaign(SRD_5_2_1_MANIFEST, "coast")).toBe(true);
  });
});

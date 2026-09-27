import { describe, expect, it } from "vitest";
import { parseContentRef, verifyContentRef } from "./content-ref";
import type { SourceManifest } from "./source-manifest";
import { emptySourceRegistry, registerSource, type SourceRegistry } from "./source-registry";
import { SRD_5_2_1_MANIFEST } from "./srd";

const legacy: SourceManifest = {
  ...SRD_5_2_1_MANIFEST,
  id: "srd-5.1",
  title: "System Reference Document 5.1",
  ruleset: "dnd5e-2014",
  snapshot: { version: "5.1", transformVersion: "0" },
};

const registry = [SRD_5_2_1_MANIFEST, legacy].reduce<SourceRegistry>((current, manifest) => {
  const result = registerSource(current, manifest);
  if (!result.ok) throw new Error(result.error.code);
  return result.value;
}, emptySourceRegistry);

const ref = {
  contentId: "fireball",
  contentType: "spell",
  rulesetRef: "dnd5e-2024",
  sourceManifestRef: { id: "srd-5.2.1", revision: 1 },
  contentRevision: 1,
} as const;

describe("parseContentRef", () => {
  it("accepts a complete versioned reference", () => {
    expect(parseContentRef(ref)).toEqual({ ok: true, value: ref });
  });

  it("reports every missing version dimension", () => {
    expect(
      parseContentRef({ contentId: "Fireball!", contentType: "feat", sourceManifestRef: {} }),
    ).toEqual({
      ok: false,
      error: {
        code: "invalid_content_ref",
        fields: [
          "contentId",
          "contentType",
          "rulesetRef",
          "sourceManifestRef.id",
          "sourceManifestRef.revision",
          "contentRevision",
        ],
      },
    });
  });
});

describe("verifyContentRef", () => {
  it("accepts a reference whose ruleset matches its source", () => {
    expect(verifyContentRef(registry, ref)).toEqual({ ok: true, value: ref });
  });

  it("rejects silently mixed rulesets", () => {
    expect(
      verifyContentRef(registry, { ...ref, sourceManifestRef: { id: "srd-5.1", revision: 1 } }),
    ).toEqual({
      ok: false,
      error: { code: "ruleset_conflict", rulesetRef: "dnd5e-2024", sourceRuleset: "dnd5e-2014" },
    });
  });

  it("rejects references to unregistered sources", () => {
    expect(
      verifyContentRef(registry, { ...ref, sourceManifestRef: { id: "srd-5.2.1", revision: 9 } }),
    ).toMatchObject({ ok: false, error: { code: "missing_reference" } });
  });
});

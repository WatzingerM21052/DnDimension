import { err, ok, type Result } from "@dndimension/core";
import { isRulesetId, type RulesetId } from "./ruleset";
import type { SourceManifestRef } from "./source-manifest";
import { resolveSource, type SourceRegistry } from "./source-registry";

export const contentTypes = [
  "spell",
  "class",
  "species",
  "background",
  "item",
  "creature",
  "rule-glossary-entry",
] as const;
export type ContentType = (typeof contentTypes)[number];

/** Versioned, reproducible reference to one content revision (spec §6.2). */
export type ContentRef = Readonly<{
  contentId: string;
  contentType: ContentType;
  rulesetRef: RulesetId;
  sourceManifestRef: SourceManifestRef;
  contentRevision: number;
}>;

export type ContentRefError =
  | Readonly<{ code: "invalid_content_ref"; fields: readonly string[] }>
  | Readonly<{ code: "missing_reference"; sourceManifestRef: SourceManifestRef }>
  | Readonly<{
      code: "ruleset_conflict";
      rulesetRef: RulesetId;
      sourceRuleset: RulesetId;
    }>;

const isPositiveInteger = (value: unknown): value is number =>
  Number.isSafeInteger(value) && (value as number) >= 1;

export const parseContentRef = (raw: unknown): Result<ContentRef, ContentRefError> => {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw))
    return err({ code: "invalid_content_ref", fields: ["root"] });
  const input = raw as Record<string, unknown>;
  const source = (
    typeof input.sourceManifestRef === "object" && input.sourceManifestRef !== null
      ? input.sourceManifestRef
      : {}
  ) as Record<string, unknown>;

  const fields = [
    typeof input.contentId === "string" && /^[a-z0-9][a-z0-9-]{0,127}$/.test(input.contentId)
      ? null
      : "contentId",
    (contentTypes as readonly unknown[]).includes(input.contentType) ? null : "contentType",
    isRulesetId(input.rulesetRef) ? null : "rulesetRef",
    typeof source.id === "string" && source.id.length > 0 ? null : "sourceManifestRef.id",
    isPositiveInteger(source.revision) ? null : "sourceManifestRef.revision",
    isPositiveInteger(input.contentRevision) ? null : "contentRevision",
  ].filter((field): field is string => field !== null);
  if (fields.length > 0) return err({ code: "invalid_content_ref", fields });

  return ok({
    contentId: input.contentId as string,
    contentType: input.contentType as ContentType,
    rulesetRef: input.rulesetRef as RulesetId,
    sourceManifestRef: { id: source.id as string, revision: source.revision as number },
    contentRevision: input.contentRevision as number,
  });
};

/** Rulesets never mix silently: a reference must name its source's ruleset. */
export const verifyContentRef = (
  registry: SourceRegistry,
  ref: ContentRef,
): Result<ContentRef, ContentRefError> => {
  const source = resolveSource(registry, ref.sourceManifestRef);
  if (!source.ok)
    return err({ code: "missing_reference", sourceManifestRef: ref.sourceManifestRef });
  if (source.value.ruleset !== ref.rulesetRef)
    return err({
      code: "ruleset_conflict",
      rulesetRef: ref.rulesetRef,
      sourceRuleset: source.value.ruleset,
    });
  return ok(ref);
};

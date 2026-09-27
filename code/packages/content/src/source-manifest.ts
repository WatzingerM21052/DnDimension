import { err, ok, type Result } from "@dndimension/core";
import { isRulesetId, type RulesetId } from "./ruleset";

/**
 * Where content comes from. Only `srd` may ship in a published build; `campaign:<id>`
 * homebrew stays inside its campaign; `private` marks the user's own references.
 */
export type SourceOrigin = "srd" | "homebrew" | "private" | `campaign:${string}`;

export const licenseIds = ["CC-BY-4.0", "proprietary", "user-owned"] as const;
export type LicenseId = (typeof licenseIds)[number];

export type SourceManifestRef = Readonly<{ id: string; revision: number }>;

export type SourceManifest = Readonly<{
  id: string;
  /** Published manifests are immutable; any change is a new revision. */
  revision: number;
  title: string;
  ruleset: RulesetId;
  origin: SourceOrigin;
  license: Readonly<{ id: LicenseId; url?: string }>;
  /** Required for CC-BY content; shown verbatim wherever the content is published. */
  attribution?: string;
  snapshot: Readonly<{
    version: string;
    transformVersion: string;
    sourceUrl?: string;
    retrievedAt?: string;
  }>;
}>;

export type SourceManifestError = Readonly<{
  code: "invalid_source_manifest";
  fields: readonly string[];
}>;

const MANIFEST_ID = /^[a-z0-9][a-z0-9.-]{0,63}$/;
const CAMPAIGN_ORIGIN = /^campaign:[A-Za-z0-9_-]{1,64}$/;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isOrigin = (value: unknown): value is SourceOrigin =>
  value === "srd" ||
  value === "homebrew" ||
  value === "private" ||
  (typeof value === "string" && CAMPAIGN_ORIGIN.test(value));

const isHttpsUrl = (value: unknown) => {
  if (typeof value !== "string") return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};

const isUtcTimestamp = (value: unknown) =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value) &&
  !Number.isNaN(Date.parse(value));

export const sourceManifestRef = (manifest: SourceManifest): SourceManifestRef => ({
  id: manifest.id,
  revision: manifest.revision,
});

export const formatSourceManifestRef = (ref: SourceManifestRef) => `${ref.id}@${ref.revision}`;

/** Validates untrusted manifest data and reports every invalid field at once. */
export const parseSourceManifest = (raw: unknown): Result<SourceManifest, SourceManifestError> => {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw))
    return err({ code: "invalid_source_manifest", fields: ["root"] });

  const input = raw as Record<string, unknown>;
  const license = (
    typeof input.license === "object" && input.license !== null ? input.license : {}
  ) as Record<string, unknown>;
  const snapshot = (
    typeof input.snapshot === "object" && input.snapshot !== null ? input.snapshot : {}
  ) as Record<string, unknown>;

  const fields: string[] = [];
  if (typeof input.id !== "string" || !MANIFEST_ID.test(input.id)) fields.push("id");
  if (!Number.isSafeInteger(input.revision) || (input.revision as number) < 1)
    fields.push("revision");
  if (!isNonEmptyString(input.title)) fields.push("title");
  if (!isRulesetId(input.ruleset)) fields.push("ruleset");
  if (!isOrigin(input.origin)) fields.push("origin");
  if (!(licenseIds as readonly unknown[]).includes(license.id)) fields.push("license.id");
  if (license.url !== undefined && !isHttpsUrl(license.url)) fields.push("license.url");
  if (input.attribution !== undefined && !isNonEmptyString(input.attribution))
    fields.push("attribution");
  if (license.id === "CC-BY-4.0" && !isNonEmptyString(input.attribution))
    fields.push("attribution");
  if (input.origin === "srd" && license.id !== "CC-BY-4.0") fields.push("license.id");
  if (!isNonEmptyString(snapshot.version)) fields.push("snapshot.version");
  if (!isNonEmptyString(snapshot.transformVersion)) fields.push("snapshot.transformVersion");
  if (snapshot.sourceUrl !== undefined && !isHttpsUrl(snapshot.sourceUrl))
    fields.push("snapshot.sourceUrl");
  if (snapshot.retrievedAt !== undefined && !isUtcTimestamp(snapshot.retrievedAt))
    fields.push("snapshot.retrievedAt");

  if (fields.length > 0)
    return err({ code: "invalid_source_manifest", fields: [...new Set(fields)] });

  // Rebuild from known fields only, so unknown input properties never persist.
  return ok({
    id: input.id as string,
    revision: input.revision as number,
    title: (input.title as string).trim(),
    ruleset: input.ruleset as RulesetId,
    origin: input.origin as SourceOrigin,
    license: {
      id: license.id as LicenseId,
      ...(license.url === undefined ? {} : { url: license.url as string }),
    },
    ...(input.attribution === undefined ? {} : { attribution: input.attribution as string }),
    snapshot: {
      version: snapshot.version as string,
      transformVersion: snapshot.transformVersion as string,
      ...(snapshot.sourceUrl === undefined ? {} : { sourceUrl: snapshot.sourceUrl as string }),
      ...(snapshot.retrievedAt === undefined
        ? {}
        : { retrievedAt: snapshot.retrievedAt as string }),
    },
  });
};

/** Only openly licensed official content may be bundled into a published build. */
export const isPublishable = (manifest: SourceManifest): boolean =>
  manifest.origin === "srd" && manifest.license.id === "CC-BY-4.0";

/** Campaign homebrew is visible only inside its own campaign; everything else everywhere. */
export const isAvailableInCampaign = (manifest: SourceManifest, campaignId: string): boolean =>
  !manifest.origin.startsWith("campaign:") || manifest.origin === `campaign:${campaignId}`;

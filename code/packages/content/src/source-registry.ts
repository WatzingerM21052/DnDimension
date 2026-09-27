import { canonicalJson, err, ok, type JsonValue, type Result } from "@dndimension/core";
import {
  formatSourceManifestRef,
  isAvailableInCampaign,
  isPublishable,
  type SourceManifest,
  type SourceManifestRef,
} from "./source-manifest";

/** Immutable registry of admitted source manifests, keyed by `id@revision`. */
export type SourceRegistry = ReadonlyMap<string, SourceManifest>;

export type SourceRegistryError =
  | Readonly<{ code: "manifest_conflict"; ref: SourceManifestRef }>
  | Readonly<{ code: "revision_gap"; ref: SourceManifestRef; latestRevision: number }>
  | Readonly<{ code: "origin_changed"; ref: SourceManifestRef }>
  | Readonly<{ code: "unknown_source"; ref: SourceManifestRef }>
  | Readonly<{ code: "unpublishable_sources"; refs: readonly SourceManifestRef[] }>;

export const emptySourceRegistry: SourceRegistry = new Map();

const fingerprint = (manifest: SourceManifest) => canonicalJson(manifest as unknown as JsonValue);

const latestRevision = (registry: SourceRegistry, id: string) =>
  [...registry.values()]
    .filter((manifest) => manifest.id === id)
    .reduce<SourceManifest | undefined>(
      (latest, manifest) =>
        latest === undefined || manifest.revision > latest.revision ? manifest : latest,
      undefined,
    );

/**
 * Admits a validated manifest. Re-registering identical data is a no-op; changing an
 * already registered revision is rejected, because published sources are immutable.
 */
export const registerSource = (
  registry: SourceRegistry,
  manifest: SourceManifest,
): Result<SourceRegistry, SourceRegistryError> => {
  const ref = { id: manifest.id, revision: manifest.revision };
  const key = formatSourceManifestRef(ref);
  const existing = registry.get(key);
  if (existing)
    return fingerprint(existing) === fingerprint(manifest)
      ? ok(registry)
      : err({ code: "manifest_conflict", ref });

  const latest = latestRevision(registry, manifest.id);
  const expected = (latest?.revision ?? 0) + 1;
  if (manifest.revision !== expected)
    return err({ code: "revision_gap", ref, latestRevision: latest?.revision ?? 0 });
  // A new revision may update data, but never move a source to another origin.
  if (latest && latest.origin !== manifest.origin) return err({ code: "origin_changed", ref });

  const next = new Map(registry);
  next.set(key, manifest);
  return ok(next);
};

export const resolveSource = (
  registry: SourceRegistry,
  ref: SourceManifestRef,
): Result<SourceManifest, SourceRegistryError> => {
  const manifest = registry.get(formatSourceManifestRef(ref));
  return manifest ? ok(manifest) : err({ code: "unknown_source", ref });
};

export const sourcesForCampaign = (registry: SourceRegistry, campaignId: string) =>
  [...registry.values()].filter((manifest) => isAvailableInCampaign(manifest, campaignId));

/**
 * Release gate: every referenced source must be registered and publishable. Unknown
 * sources count as unpublishable (deny by default).
 */
export const assertPublishable = (
  registry: SourceRegistry,
  refs: readonly SourceManifestRef[],
): Result<void, SourceRegistryError> => {
  const blocked = refs.filter((ref) => {
    const manifest = registry.get(formatSourceManifestRef(ref));
    return !manifest || !isPublishable(manifest);
  });
  return blocked.length === 0
    ? ok(undefined)
    : err({ code: "unpublishable_sources", refs: blocked });
};

import type { RulesetId, SourceManifestRef } from "@dndimension/content";

/** Pins the rules a resolution uses (v0.3 spec §7.1). Not the app version. */
export type RuleProfileRef = Readonly<{
  rulesetId: RulesetId;
  rulesetVersion: string;
  sourceManifestRef: SourceManifestRef;
  enabledVariantIds: readonly string[];
  profileRevision: number;
}>;

/** The only productively supported profile in v0.3: 2024 rules from SRD 5.2.1. */
export const SRD_2024_PROFILE: RuleProfileRef = {
  rulesetId: "dnd5e-2024",
  rulesetVersion: "srd-5.2.1",
  sourceManifestRef: { id: "srd-5.2.1", revision: 1 },
  enabledVariantIds: [],
  profileRevision: 1,
};

/**
 * Unknown rulesets, versions or variants are unsupported and never folded back onto the
 * 2024 profile.
 */
export const unsupportedProfileReason = (profile: RuleProfileRef): string | undefined => {
  if (profile.rulesetId !== SRD_2024_PROFILE.rulesetId)
    return `Ruleset ${profile.rulesetId} is not supported`;
  if (profile.rulesetVersion !== SRD_2024_PROFILE.rulesetVersion)
    return `Ruleset version ${profile.rulesetVersion} is not supported`;
  if (profile.enabledVariantIds.length > 0)
    return `Variants are not supported yet: ${profile.enabledVariantIds.join(", ")}`;
  return undefined;
};

import type { SourceManifest } from "./source-manifest";

/**
 * Attribution required by CC-BY-4.0 for SRD 5.2.1. Verify against the official wording
 * at https://www.dndbeyond.com/srd before every public release.
 */
export const SRD_5_2_1_ATTRIBUTION =
  'This work includes material from the System Reference Document 5.2.1 ("SRD 5.2.1") by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the Creative Commons Attribution 4.0 International License, available at https://creativecommons.org/licenses/by/4.0/legalcode.';

/**
 * Registration record for the official SRD 5.2.1 snapshot. It carries provenance only;
 * the content package itself arrives through the reproducible import (#25).
 */
export const SRD_5_2_1_MANIFEST: SourceManifest = {
  id: "srd-5.2.1",
  revision: 1,
  title: "System Reference Document 5.2.1",
  ruleset: "dnd5e-2024",
  origin: "srd",
  license: { id: "CC-BY-4.0", url: "https://creativecommons.org/licenses/by/4.0/legalcode" },
  attribution: SRD_5_2_1_ATTRIBUTION,
  snapshot: {
    version: "5.2.1",
    transformVersion: "0",
    sourceUrl: "https://www.dndbeyond.com/srd",
  },
};

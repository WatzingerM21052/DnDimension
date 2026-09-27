# @dndimension/content

Source registry and versioned content references for v0.2 (story #23). Pure TypeScript on top of `@dndimension/core`: no UI, database or network access.

## Contracts

- `parseSourceManifest(raw)` validates untrusted manifest data, reports every invalid field and rebuilds the manifest from known fields only.
- A manifest names its ruleset (`dnd5e-2024`, `dnd5e-2014`), origin (`srd`, `homebrew`, `private`, `campaign:<id>`), license and import snapshot. CC-BY content requires attribution; `srd` requires CC-BY-4.0.
- `registerSource(registry, manifest)` returns a new immutable registry. Identical re-registration is a no-op; changing a registered revision is a `manifest_conflict`; revisions must be consecutive; a source never changes origin.
- `isPublishable` admits only openly licensed SRD sources. `assertPublishable` is the release gate for referenced sources and treats unknown sources as unpublishable (deny by default).
- `sourcesForCampaign` and `isAvailableInCampaign` keep `campaign:<id>` homebrew inside its campaign.
- `parseContentRef` / `verifyContentRef` implement the `ContentRef` of the [v0.2 spec §6.2](../../../docs/spec-planning/v0.2-domain-data-model-spec.md) and reject references whose ruleset differs from their source's (`ruleset_conflict`).

`SRD_5_2_1_MANIFEST` registers the official SRD 5.2.1 snapshot and `SRD_5_2_1_ATTRIBUTION` is the single source for the in-app attribution notice. Check the wording against https://www.dndbeyond.com/srd before each public release.

## Not yet included

- Content entries and packages themselves; they arrive with the reproducible SRD import (#25, after spike #21).
- Persistence of the registry; adapters will store manifests through the application ports.

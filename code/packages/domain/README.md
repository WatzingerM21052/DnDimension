# @dndimension/domain

Framework-free domain building blocks from the [v0.2 spec](../../../docs/spec-planning/v0.2-domain-data-model-spec.md). Depends only on `@dndimension/core`.

- **Visibility (§6.3):** `VisibilityPolicy` is `dm_only`, `player_facing` or `revealed` (with the revealing event and time). `isVisibleTo`, `projectItems` and `projectFields` are deny-by-default: players see nothing whose policy is missing, unknown or malformed, and unclassified fields are removed. `reveal` never overwrites an earlier reveal.
- **Automation grade (§6.4):** `computed`, `assisted`, `manual_recorded`; only `computed` applies without confirmation, and `manualRecord` requires a reason.

Shared identity types live in `@dndimension/core`: `EntityRef`/`parseEntityRef`, `ActorRef`, `AggregateMetadata` with `advanceMetadata`, the `Clock`/`IdGenerator` ports and the `DomainError` codes of §8.2. IDs stay opaque; the concrete format remains an adapter decision (§21).

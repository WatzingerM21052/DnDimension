# @dndimension/rules

Pure, typed and deterministic rules kernel of the [v0.3 spec](../../../docs/spec-planning/v0.3-rules-engine-foundation-spec.md) and [DEC-007](../../../docs/decisions/DEC-007-typed-deterministic-rule-resolution-kernel.md). Depends only on `@dndimension/core` and `@dndimension/content`; it loads, stores and mutates nothing, and uses no clock, randomness or network (enforced by `purity.test.ts`).

## Contracts

- `RuleProfileRef` pins ruleset, version, source manifest and variants. Only `SRD_2024_PROFILE` (2024 rules, SRD 5.2.1, no variants) is supported; anything else is `unsupported` and never folded back onto it.
- `resolve(request, context)` takes an untyped request and validates it at the boundary: unknown families or payloads are `rejected`, known but unimplemented families (`d20_test`, `resource_transition`, damage, healing, …) are `unsupported`.
- `RuleResolution` is deep-frozen and keeps status, automation grade and roll mode separate. It carries the input fingerprint, applied rules, issues and a trace whose steps name rule, pipeline phase, inputs, intermediate result, SRD source and visibility.
- Rule definitions use declarative building blocks only. The kernel picks exactly one definition per target: a higher `specificity` replaces a general rule, equally specific but different rules end in `conflict` (independent of list order), definitions from sources the profile does not pin are rejected.

## Implemented rules (`derived_value`)

- `ability_modifier`: `floor((score - 10) / 2)` within the profile's score range.
- `proficiency_bonus`: the 2024 progression (+2 at levels 1–4 up to +6 at 17–20) from a versioned definition.
- `check_bonus`: ability modifier plus proficiency applied at most once; expertise replaces the proficiency contribution with bonus × 2 and requires proficiency; additional sources are shown as not stacking.

`SRD_2024_RULE_DEFINITIONS` holds the reference definitions; section names point into SRD 5.2.1 without copying its text.

## Next

D20 tests with advantage/disadvantage and dice expressions (keep/drop, manual and controlled rolls), AC base selection, resource transitions, preview/apply through the application layer.

/** Stable ruleset identifiers. 2014 is reserved for a later, separately gated adapter. */
export const rulesetIds = ["dnd5e-2024", "dnd5e-2014"] as const;
export type RulesetId = (typeof rulesetIds)[number];

export const isRulesetId = (value: unknown): value is RulesetId =>
  typeof value === "string" && (rulesetIds as readonly string[]).includes(value);

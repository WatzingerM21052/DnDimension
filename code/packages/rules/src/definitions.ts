import type { RuleSourceRef } from "./contracts";
import { SRD_2024_PROFILE } from "./profile";

/** What a definition decides; the kernel looks definitions up by this target. */
export type RuleTarget = "ability_modifier" | "proficiency_bonus" | "expertise";

export type ProficiencyBand = Readonly<{ fromLevel: number; toLevel: number; bonus: number }>;

/** Only known declarative building blocks (spec §15); no executable code. */
export type RuleEffect =
  | Readonly<{
      block: "base_calculation";
      formula: "ability_modifier";
      scoreRange: Readonly<{ min: number; max: number }>;
    }>
  | Readonly<{
      block: "base_calculation";
      formula: "proficiency_progression";
      bands: readonly ProficiencyBand[];
    }>
  | Readonly<{ block: "apply_expertise"; multiplier: number }>;

export type RuleDefinition = Readonly<{
  ruleId: string;
  version: number;
  family: "derived_value";
  appliesTo: RuleTarget;
  /** Higher values may replace more general rules; equal values conflict. */
  specificity: number;
  source: RuleSourceRef;
  effect: RuleEffect;
}>;

const srd = (section: string): RuleSourceRef => ({
  sourceManifestRef: SRD_2024_PROFILE.sourceManifestRef,
  section,
});

/** Reference definitions of the 2024 profile; section names point into SRD 5.2.1. */
export const SRD_2024_RULE_DEFINITIONS: readonly RuleDefinition[] = [
  {
    ruleId: "srd2024.ability-modifier",
    version: 1,
    family: "derived_value",
    appliesTo: "ability_modifier",
    specificity: 0,
    source: srd("Playing the Game: Ability Scores and Modifiers"),
    effect: {
      block: "base_calculation",
      formula: "ability_modifier",
      scoreRange: { min: 1, max: 30 },
    },
  },
  {
    ruleId: "srd2024.proficiency-bonus",
    version: 1,
    family: "derived_value",
    appliesTo: "proficiency_bonus",
    specificity: 0,
    source: srd("Character Creation: Proficiency Bonus"),
    effect: {
      block: "base_calculation",
      formula: "proficiency_progression",
      bands: [
        { fromLevel: 1, toLevel: 4, bonus: 2 },
        { fromLevel: 5, toLevel: 8, bonus: 3 },
        { fromLevel: 9, toLevel: 12, bonus: 4 },
        { fromLevel: 13, toLevel: 16, bonus: 5 },
        { fromLevel: 17, toLevel: 20, bonus: 6 },
      ],
    },
  },
  {
    ruleId: "srd2024.expertise",
    version: 1,
    family: "derived_value",
    appliesTo: "expertise",
    specificity: 0,
    source: srd("Rules Glossary: Expertise"),
    effect: { block: "apply_expertise", multiplier: 2 },
  },
];

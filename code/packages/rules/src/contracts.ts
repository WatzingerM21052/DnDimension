import type { SourceManifestRef } from "@dndimension/content";
import type { RuleProfileRef } from "./profile";

export const abilities = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
] as const;
export type Ability = (typeof abilities)[number];

/** Rule families of the v0.3 spec §8; only `derived_value` is implemented so far. */
export const implementedKinds = ["derived_value"] as const;
export const plannedKinds = [
  "d20_test",
  "resource_transition",
  "damage",
  "healing",
  "effect_transition",
  "time_advance",
  "rest",
  "reaction_window",
] as const;
export type ResolutionKind = (typeof implementedKinds)[number] | (typeof plannedKinds)[number];

/** Three separate dimensions (spec §11): outcome, how it came about, whether dice were used. */
export type ResolutionStatus =
  "resolved" | "pending_decision" | "rejected" | "conflict" | "unsupported";
/** Same values as the domain automation grade (v0.2 spec §6.4). */
export type AutomationGrade = "computed" | "assisted" | "manual_recorded";
export type RollMode = "automatic_roll" | "manual_roll" | "controlled_roll" | "not_applicable";

export type TraceVisibility = "public" | "player" | "dm" | "internal";

/** Pipeline phases in their fixed order (spec §9). */
export const pipelinePhases = [
  "profile_check",
  "input_validation",
  "rule_selection",
  "base_calculation",
  "replacement",
  "modifier",
  "limit",
  "dice_state",
  "roll",
  "follow_up",
  "result",
] as const;
export type PipelinePhase = (typeof pipelinePhases)[number];

export type RuleSourceRef = Readonly<{ sourceManifestRef: SourceManifestRef; section: string }>;

export type TraceValue = number | string | boolean | null;

export type TraceStep = Readonly<{
  stepId: string;
  ruleId: string;
  phase: PipelinePhase;
  description: string;
  inputs: Readonly<Record<string, TraceValue | readonly TraceValue[]>>;
  result: TraceValue;
  sourceRefs: readonly RuleSourceRef[];
  visibility: TraceVisibility;
}>;

export type RuleIssueCode =
  "validation_error" | "rule_conflict" | "unsupported_rule" | "invariant_violation";

export type RuleIssue = Readonly<{
  code: RuleIssueCode;
  message: string;
  field?: string;
  ruleIds?: readonly string[];
}>;

export type ProficiencyGrant = Readonly<{ kind: "proficiency" | "expertise"; source: string }>;

export type DerivedValueInput =
  | Readonly<{ derivation: "ability_modifier"; ability: Ability; score: number }>
  | Readonly<{ derivation: "proficiency_bonus"; level: number }>
  | Readonly<{
      /** Bonus of one skill check or saving throw: modifier plus proficiency at most once. */
      derivation: "check_bonus";
      ability: Ability;
      score: number;
      level: number;
      grants: readonly ProficiencyGrant[];
    }>;

export type ResolutionRequest = Readonly<{
  requestId: string;
  kind: "derived_value";
  intent: string;
  input: DerivedValueInput;
  visibility: TraceVisibility;
}>;

export type DerivedValueResult = Readonly<{ value: number }>;

/** Immutable outcome of one request (spec §7.4). Timestamps and actors are added on apply. */
export type RuleResolution = Readonly<{
  resolutionId: string;
  requestId: string;
  kind: ResolutionKind | "unknown";
  status: ResolutionStatus;
  automationGrade: AutomationGrade;
  rollMode: RollMode;
  profileRef: RuleProfileRef;
  inputFingerprint: string;
  result?: DerivedValueResult;
  // Rolls, proposals and follow-ups arrive with the d20 and resource families; empty for now.
  rolls: readonly never[];
  appliedRules: readonly string[];
  traceSteps: readonly TraceStep[];
  proposals: readonly never[];
  issues: readonly RuleIssue[];
  followUpOptions: readonly never[];
  visibility: TraceVisibility;
}>;

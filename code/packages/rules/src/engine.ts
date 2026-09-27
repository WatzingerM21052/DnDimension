import { canonicalJson, type JsonValue } from "@dndimension/core";
import { formatSourceManifestRef } from "@dndimension/content";
import type {
  DerivedValueInput,
  ResolutionKind,
  ResolutionRequest,
  ResolutionStatus,
  RuleIssue,
  RuleResolution,
  TraceStep,
  TraceVisibility,
} from "./contracts";
import type { RuleDefinition, RuleTarget } from "./definitions";
import { unsupportedProfileReason, type RuleProfileRef } from "./profile";
import { parseResolutionRequest } from "./request";

/** Everything a resolution may use (spec §7.2); the kernel never loads anything itself. */
export type RuleContext = Readonly<{
  profileRef: RuleProfileRef;
  ruleDefinitions: readonly RuleDefinition[];
}>;

const deepFreeze = <T>(value: T): T => {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return value;
};

/** Internal early exit of the pipeline; never escapes `resolve`, which returns a value. */
class Outcome extends Error {
  constructor(
    readonly status: Exclude<ResolutionStatus, "resolved">,
    readonly issue: RuleIssue,
  ) {
    super(issue.message);
  }
}

/** Collects trace steps and applied rules in pipeline order for one resolution. */
class Trace {
  readonly steps: TraceStep[] = [];
  readonly applied: string[] = [];
  constructor(private readonly visibility: TraceVisibility) {}

  add(step: Omit<TraceStep, "stepId" | "visibility">, rule?: RuleDefinition) {
    this.steps.push({
      ...step,
      stepId: `step-${this.steps.length + 1}`,
      visibility: this.visibility,
    });
    if (rule && !this.applied.includes(rule.ruleId)) this.applied.push(rule.ruleId);
  }
}

/**
 * Picks exactly one definition for a target. A more specific rule replaces a general one;
 * equally specific but different rules are a conflict, never decided by list order.
 */
const selectRule = (definitions: readonly RuleDefinition[], target: RuleTarget, trace: Trace) => {
  const candidates = definitions.filter((definition) => definition.appliesTo === target);
  if (candidates.length === 0)
    throw new Outcome("unsupported", {
      code: "unsupported_rule",
      message: `No rule definition for ${target} in this profile`,
    });
  const top = Math.max(...candidates.map((definition) => definition.specificity));
  const winners = candidates.filter((definition) => definition.specificity === top);
  const distinct = [
    ...new Map(winners.map((rule) => [`${rule.ruleId}@${rule.version}`, rule])).values(),
  ];
  if (distinct.length > 1)
    throw new Outcome("conflict", {
      code: "rule_conflict",
      message: `Equally specific rules disagree about ${target}`,
      ruleIds: distinct.map((rule) => `${rule.ruleId}@${rule.version}`),
    });
  const rule = distinct[0]!;
  trace.add(
    {
      ruleId: rule.ruleId,
      phase: "rule_selection",
      description: `Selected ${rule.ruleId} v${rule.version} for ${target}`,
      inputs: { candidates: candidates.map((candidate) => candidate.ruleId) },
      result: rule.ruleId,
      sourceRefs: [rule.source],
    },
    rule,
  );
  return rule;
};

const rejected = (field: string, message: string) =>
  new Outcome("rejected", { code: "validation_error", field, message });

const unexpectedBlock = (rule: RuleDefinition) =>
  new Outcome("unsupported", {
    code: "unsupported_rule",
    message: `Unsupported building block in ${rule.ruleId}`,
    ruleIds: [rule.ruleId],
  });

const abilityModifier = (
  input: { ability: string; score: number },
  definitions: readonly RuleDefinition[],
  trace: Trace,
) => {
  const rule = selectRule(definitions, "ability_modifier", trace);
  if (rule.effect.block !== "base_calculation" || rule.effect.formula !== "ability_modifier")
    throw unexpectedBlock(rule);
  const { min, max } = rule.effect.scoreRange;
  if (input.score < min || input.score > max)
    throw rejected("input.score", `Ability score must be between ${min} and ${max}`);
  const value = Math.floor((input.score - 10) / 2);
  trace.add(
    {
      ruleId: rule.ruleId,
      phase: "base_calculation",
      description: `${input.ability} modifier = floor((score - 10) / 2), rounded down`,
      inputs: { ability: input.ability, score: input.score },
      result: value,
      sourceRefs: [rule.source],
    },
    rule,
  );
  return value;
};

const proficiencyBonus = (level: number, definitions: readonly RuleDefinition[], trace: Trace) => {
  const rule = selectRule(definitions, "proficiency_bonus", trace);
  if (rule.effect.block !== "base_calculation" || rule.effect.formula !== "proficiency_progression")
    throw unexpectedBlock(rule);
  const band = rule.effect.bands.find(
    ({ fromLevel, toLevel }) => level >= fromLevel && level <= toLevel,
  );
  if (!band) throw rejected("input.level", `No proficiency bonus defined for level ${level}`);
  trace.add(
    {
      ruleId: rule.ruleId,
      phase: "base_calculation",
      description: `Proficiency bonus for level ${level} (levels ${band.fromLevel}-${band.toLevel})`,
      inputs: { level },
      result: band.bonus,
      sourceRefs: [rule.source],
    },
    rule,
  );
  return band.bonus;
};

const checkBonus = (
  input: Extract<DerivedValueInput, { derivation: "check_bonus" }>,
  definitions: readonly RuleDefinition[],
  trace: Trace,
) => {
  const proficiencySources = input.grants.filter((grant) => grant.kind === "proficiency");
  const expertiseSources = input.grants.filter((grant) => grant.kind === "expertise");
  if (expertiseSources.length > 0 && proficiencySources.length === 0)
    throw rejected("input.grants", "Expertise requires proficiency in the same check");

  const modifier = abilityModifier(input, definitions, trace);
  if (proficiencySources.length === 0) {
    trace.add({
      ruleId: "kernel.no-proficiency",
      phase: "modifier",
      description: "No proficiency applies to this check",
      inputs: {},
      result: 0,
      sourceRefs: [],
    });
    return modifier;
  }

  const bonus = proficiencyBonus(input.level, definitions, trace);
  const proficiencyRule = definitions.find((rule) => rule.appliesTo === "proficiency_bonus")!;
  let contribution = bonus;
  if (expertiseSources.length > 0) {
    const expertise = selectRule(definitions, "expertise", trace);
    if (expertise.effect.block !== "apply_expertise") throw unexpectedBlock(expertise);
    contribution = bonus * expertise.effect.multiplier;
    trace.add(
      {
        ruleId: expertise.ruleId,
        phase: "replacement",
        description: `Expertise replaces the proficiency contribution with bonus x ${expertise.effect.multiplier}`,
        inputs: { proficiencyBonus: bonus, sources: expertiseSources.map((grant) => grant.source) },
        result: contribution,
        sourceRefs: [expertise.source],
      },
      expertise,
    );
  }
  trace.add(
    {
      ruleId: proficiencyRule.ruleId,
      phase: "modifier",
      description: "Proficiency applies once to this check",
      inputs: {
        modifier,
        contribution,
        proficiencySources: proficiencySources.map((grant) => grant.source),
      },
      result: modifier + contribution,
      sourceRefs: [proficiencyRule.source],
    },
    proficiencyRule,
  );
  if (proficiencySources.length > 1 || expertiseSources.length > 1)
    trace.add({
      ruleId: "kernel.no-stacking",
      phase: "limit",
      description: "Additional proficiency or expertise sources do not stack",
      inputs: {
        ignoredProficiency: proficiencySources.slice(1).map((grant) => grant.source),
        ignoredExpertise: expertiseSources.slice(1).map((grant) => grant.source),
      },
      result: modifier + contribution,
      sourceRefs: [],
    });
  return modifier + contribution;
};

const resolveDerivedValue = (
  input: DerivedValueInput,
  definitions: readonly RuleDefinition[],
  trace: Trace,
) => {
  switch (input.derivation) {
    case "ability_modifier":
      return abilityModifier(input, definitions, trace);
    case "proficiency_bonus":
      return proficiencyBonus(input.level, definitions, trace);
    case "check_bonus":
      return checkBonus(input, definitions, trace);
  }
};

const fingerprintOf = (raw: unknown, profileRef: RuleProfileRef) => {
  try {
    return canonicalJson({ request: raw, profileRef } as unknown as JsonValue);
  } catch {
    return "unfingerprintable";
  }
};

/**
 * Pure resolution: the same request, context and profile always give the same frozen
 * result. Nothing is loaded, stored or mutated; proposals are applied elsewhere.
 */
export const resolve = (rawRequest: unknown, context: RuleContext): RuleResolution => {
  const raw = (typeof rawRequest === "object" && rawRequest !== null ? rawRequest : {}) as Record<
    string,
    unknown
  >;
  const requestId = typeof raw.requestId === "string" && raw.requestId ? raw.requestId : "unknown";
  const visibility: TraceVisibility =
    raw.visibility === "public" || raw.visibility === "player" || raw.visibility === "dm"
      ? raw.visibility
      : "internal";
  const trace = new Trace(visibility);
  const base = {
    resolutionId: `resolution:${requestId}`,
    requestId,
    automationGrade: "computed" as const,
    rollMode: "not_applicable" as const,
    profileRef: context.profileRef,
    inputFingerprint: fingerprintOf(rawRequest, context.profileRef),
    rolls: [],
    proposals: [],
    followUpOptions: [],
    visibility,
  };
  const finish = (
    kind: ResolutionKind | "unknown",
    status: ResolutionStatus,
    issues: readonly RuleIssue[],
    value?: number,
  ): RuleResolution =>
    deepFreeze({
      ...base,
      kind,
      status,
      ...(value === undefined ? {} : { result: { value } }),
      appliedRules: trace.applied,
      traceSteps: trace.steps,
      issues,
    });

  const parsed = parseResolutionRequest(rawRequest);
  if (!parsed.ok)
    return parsed.error.kind === "unsupported"
      ? finish(parsed.error.family as ResolutionKind, "unsupported", parsed.error.issues)
      : finish(
          raw.kind === "derived_value" ? "derived_value" : "unknown",
          "rejected",
          parsed.error.issues,
        );
  const request: ResolutionRequest = parsed.value;

  const profileProblem = unsupportedProfileReason(context.profileRef);
  trace.add({
    ruleId: "kernel.profile-check",
    phase: "profile_check",
    description: profileProblem ?? "Profile is supported and pinned",
    inputs: {
      rulesetId: context.profileRef.rulesetId,
      rulesetVersion: context.profileRef.rulesetVersion,
      sourceManifest: formatSourceManifestRef(context.profileRef.sourceManifestRef),
    },
    result: profileProblem === undefined,
    sourceRefs: [],
  });
  if (profileProblem)
    return finish(request.kind, "unsupported", [
      { code: "unsupported_rule", message: profileProblem },
    ]);

  const pinned = formatSourceManifestRef(context.profileRef.sourceManifestRef);
  const foreign = context.ruleDefinitions.filter(
    (rule) => formatSourceManifestRef(rule.source.sourceManifestRef) !== pinned,
  );
  if (foreign.length > 0)
    return finish(request.kind, "rejected", [
      {
        code: "validation_error",
        message: `Rule definitions from sources the profile does not pin: ${foreign.map((rule) => rule.ruleId).join(", ")}`,
        ruleIds: foreign.map((rule) => rule.ruleId),
      },
    ]);

  try {
    const value = resolveDerivedValue(request.input, context.ruleDefinitions, trace);
    trace.add({
      ruleId: "kernel.result",
      phase: "result",
      description: request.intent,
      inputs: { derivation: request.input.derivation },
      result: value,
      sourceRefs: [],
    });
    return finish(request.kind, "resolved", [], value);
  } catch (error) {
    if (error instanceof Outcome) return finish(request.kind, error.status, [error.issue]);
    throw error;
  }
};

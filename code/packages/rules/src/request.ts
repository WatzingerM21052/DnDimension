import { err, ok, type Result } from "@dndimension/core";
import {
  abilities,
  implementedKinds,
  plannedKinds,
  type Ability,
  type DerivedValueInput,
  type ProficiencyGrant,
  type ResolutionRequest,
  type RuleIssue,
  type TraceVisibility,
} from "./contracts";

export type RequestError =
  | Readonly<{ kind: "rejected"; issues: readonly RuleIssue[] }>
  | Readonly<{ kind: "unsupported"; family: string; issues: readonly RuleIssue[] }>;

const visibilities: readonly TraceVisibility[] = ["public", "player", "dm", "internal"];
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isInteger = (value: unknown): value is number => Number.isSafeInteger(value);
const invalid = (field: string, message: string): RuleIssue => ({
  code: "validation_error",
  field,
  message,
});

const parseGrants = (raw: unknown, issues: RuleIssue[]): ProficiencyGrant[] => {
  if (!Array.isArray(raw)) {
    issues.push(invalid("input.grants", "grants must be a list"));
    return [];
  }
  return raw.flatMap((grant, index) => {
    if (
      isRecord(grant) &&
      (grant.kind === "proficiency" || grant.kind === "expertise") &&
      typeof grant.source === "string" &&
      grant.source.trim()
    )
      return [{ kind: grant.kind, source: grant.source }];
    issues.push(invalid(`input.grants.${index}`, "grant needs kind and source"));
    return [];
  });
};

const parseDerivedInput = (raw: unknown, issues: RuleIssue[]): DerivedValueInput | undefined => {
  if (!isRecord(raw)) {
    issues.push(invalid("input", "input must be an object"));
    return undefined;
  }
  const ability = (abilities as readonly unknown[]).includes(raw.ability)
    ? (raw.ability as Ability)
    : undefined;
  switch (raw.derivation) {
    case "ability_modifier":
      if (!ability) issues.push(invalid("input.ability", "unknown ability"));
      if (!isInteger(raw.score)) issues.push(invalid("input.score", "score must be an integer"));
      return ability && isInteger(raw.score)
        ? { derivation: "ability_modifier", ability, score: raw.score }
        : undefined;
    case "proficiency_bonus":
      if (!isInteger(raw.level)) issues.push(invalid("input.level", "level must be an integer"));
      return isInteger(raw.level)
        ? { derivation: "proficiency_bonus", level: raw.level }
        : undefined;
    case "check_bonus": {
      if (!ability) issues.push(invalid("input.ability", "unknown ability"));
      if (!isInteger(raw.score)) issues.push(invalid("input.score", "score must be an integer"));
      if (!isInteger(raw.level)) issues.push(invalid("input.level", "level must be an integer"));
      const grants = parseGrants(raw.grants, issues);
      return ability && isInteger(raw.score) && isInteger(raw.level) && issues.length === 0
        ? { derivation: "check_bonus", ability, score: raw.score, level: raw.level, grants }
        : undefined;
    }
    default:
      issues.push(invalid("input.derivation", "unknown derivation"));
      return undefined;
  }
};

/**
 * Domain boundary (spec §7.3): untyped payloads never reach a resolver. Unknown kinds are
 * rejected; known but unimplemented families are reported as unsupported.
 */
export const parseResolutionRequest = (raw: unknown): Result<ResolutionRequest, RequestError> => {
  if (!isRecord(raw))
    return err({ kind: "rejected", issues: [invalid("root", "request must be an object")] });
  if ((plannedKinds as readonly unknown[]).includes(raw.kind))
    return err({
      kind: "unsupported",
      family: raw.kind as string,
      issues: [
        {
          code: "unsupported_rule",
          message: `Rule family ${String(raw.kind)} is not implemented yet`,
        },
      ],
    });

  const issues: RuleIssue[] = [];
  if (typeof raw.requestId !== "string" || !raw.requestId.trim())
    issues.push(invalid("requestId", "requestId is required"));
  if (!(implementedKinds as readonly unknown[]).includes(raw.kind))
    issues.push(invalid("kind", "unknown rule family"));
  if (typeof raw.intent !== "string" || !raw.intent.trim())
    issues.push(invalid("intent", "intent is required"));
  if (!visibilities.includes(raw.visibility as TraceVisibility))
    issues.push(invalid("visibility", "unknown visibility"));
  const input = raw.kind === "derived_value" ? parseDerivedInput(raw.input, issues) : undefined;

  if (issues.length > 0 || !input) return err({ kind: "rejected", issues });
  return ok({
    requestId: raw.requestId as string,
    kind: "derived_value",
    intent: raw.intent as string,
    input,
    visibility: raw.visibility as TraceVisibility,
  });
};

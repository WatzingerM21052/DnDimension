import { describe, expect, it } from "vitest";
import { SRD_2024_RULE_DEFINITIONS, type RuleDefinition } from "./definitions";
import { resolve, type RuleContext } from "./engine";
import { SRD_2024_PROFILE } from "./profile";

const context: RuleContext = {
  profileRef: SRD_2024_PROFILE,
  ruleDefinitions: SRD_2024_RULE_DEFINITIONS,
};

const request = (input: Record<string, unknown>, overrides: Record<string, unknown> = {}) => ({
  requestId: "req-1",
  kind: "derived_value",
  intent: "Derive a character value",
  input,
  visibility: "player",
  ...overrides,
});

const valueOf = (input: Record<string, unknown>) => resolve(request(input), context).result?.value;

describe("ability modifier", () => {
  it.each([
    [1, -5],
    [3, -4],
    [8, -1],
    [9, -1],
    [10, 0],
    [11, 0],
    [12, 1],
    [15, 2],
    [20, 5],
    [30, 10],
  ])("score %i gives %i, rounding down below 10 as well", (score, modifier) => {
    expect(valueOf({ derivation: "ability_modifier", ability: "strength", score })).toBe(modifier);
  });

  it.each([0, 31])("rejects score %i outside the profile range", (score) => {
    const resolution = resolve(
      request({ derivation: "ability_modifier", ability: "strength", score }),
      context,
    );
    expect(resolution.status).toBe("rejected");
    expect(resolution.issues[0]).toMatchObject({ code: "validation_error", field: "input.score" });
    expect(resolution.result).toBeUndefined();
  });

  it("explains input, formula and result with the SRD source", () => {
    const resolution = resolve(
      request({ derivation: "ability_modifier", ability: "dexterity", score: 7 }),
      context,
    );
    const step = resolution.traceSteps.find((candidate) => candidate.phase === "base_calculation");
    expect(step).toMatchObject({
      ruleId: "srd2024.ability-modifier",
      inputs: { ability: "dexterity", score: 7 },
      result: -2,
      sourceRefs: [{ sourceManifestRef: { id: "srd-5.2.1", revision: 1 } }],
      visibility: "player",
    });
    expect(resolution).toMatchObject({
      status: "resolved",
      automationGrade: "computed",
      rollMode: "not_applicable",
      appliedRules: ["srd2024.ability-modifier"],
    });
  });
});

describe("proficiency bonus", () => {
  it.each([
    [1, 2],
    [4, 2],
    [5, 3],
    [8, 3],
    [9, 4],
    [12, 4],
    [13, 5],
    [16, 5],
    [17, 6],
    [20, 6],
  ])("level %i gives +%i", (level, bonus) => {
    expect(valueOf({ derivation: "proficiency_bonus", level })).toBe(bonus);
  });

  it.each([0, 21])("rejects level %i", (level) => {
    expect(resolve(request({ derivation: "proficiency_bonus", level }), context).status).toBe(
      "rejected",
    );
  });
});

describe("check bonus with proficiency and expertise", () => {
  const check = (grants: { kind: string; source: string }[], score = 14, level = 5) =>
    resolve(
      request({ derivation: "check_bonus", ability: "wisdom", score, level, grants }),
      context,
    );

  it("uses only the ability modifier without proficiency", () => {
    expect(check([]).result?.value).toBe(2);
  });

  it("applies proficiency exactly once even with several sources", () => {
    const resolution = check([
      { kind: "proficiency", source: "background:sage" },
      { kind: "proficiency", source: "class:cleric" },
    ]);
    expect(resolution.result?.value).toBe(2 + 3);
    expect(resolution.traceSteps.find((step) => step.phase === "limit")).toMatchObject({
      ruleId: "kernel.no-stacking",
      inputs: { ignoredProficiency: ["class:cleric"] },
    });
  });

  it("lets expertise modify the proficiency contribution instead of adding a second bonus", () => {
    const resolution = check([
      { kind: "proficiency", source: "class:rogue" },
      { kind: "expertise", source: "class:rogue.expertise" },
      { kind: "expertise", source: "feat:skill-expert" },
    ]);
    // +2 Wisdom, proficiency +3 doubled to +6 once; the second expertise does not stack.
    expect(resolution.result?.value).toBe(8);
    const replacement = resolution.traceSteps.find((step) => step.phase === "replacement");
    expect(replacement).toMatchObject({
      ruleId: "srd2024.expertise",
      inputs: { proficiencyBonus: 3 },
      result: 6,
    });
    expect(resolution.appliedRules).toEqual([
      "srd2024.ability-modifier",
      "srd2024.proficiency-bonus",
      "srd2024.expertise",
    ]);
  });

  it("rejects expertise without proficiency", () => {
    const resolution = check([{ kind: "expertise", source: "class:rogue.expertise" }]);
    expect(resolution.status).toBe("rejected");
    expect(resolution.issues[0]).toMatchObject({ field: "input.grants" });
  });

  it("lists every component with its intermediate value in pipeline order", () => {
    const phases = check([{ kind: "proficiency", source: "class:cleric" }]).traceSteps.map(
      (step) => step.phase,
    );
    expect(phases).toEqual([
      "profile_check",
      "rule_selection",
      "base_calculation",
      "rule_selection",
      "base_calculation",
      "modifier",
      "result",
    ]);
  });
});

describe("determinism and immutability", () => {
  it("returns identical results and fingerprints for identical input", () => {
    const input = { derivation: "check_bonus", ability: "wisdom", score: 14, level: 5, grants: [] };
    expect(resolve(request(input), context)).toEqual(resolve(request(input), context));
    expect(resolve(request(input), context).inputFingerprint).not.toBe(
      resolve(request({ ...input, score: 15 }), context).inputFingerprint,
    );
  });

  it("freezes the whole resolution", () => {
    const resolution = resolve(request({ derivation: "proficiency_bonus", level: 3 }), context);
    expect(Object.isFrozen(resolution)).toBe(true);
    expect(Object.isFrozen(resolution.traceSteps[0])).toBe(true);
    expect(() => {
      (resolution as { status: string }).status = "rejected";
    }).toThrow(TypeError);
  });

  it("does not modify the context it was given", () => {
    const definitions = structuredClone(SRD_2024_RULE_DEFINITIONS);
    resolve(request({ derivation: "proficiency_bonus", level: 9 }), {
      profileRef: SRD_2024_PROFILE,
      ruleDefinitions: definitions,
    });
    expect(definitions).toEqual(SRD_2024_RULE_DEFINITIONS);
  });
});

describe("profiles and rule priority", () => {
  it("does not fall back to 2024 for another ruleset", () => {
    const resolution = resolve(request({ derivation: "proficiency_bonus", level: 3 }), {
      ...context,
      profileRef: { ...SRD_2024_PROFILE, rulesetId: "dnd5e-2014", rulesetVersion: "srd-5.1" },
    });
    expect(resolution.status).toBe("unsupported");
    expect(resolution.result).toBeUndefined();
  });

  it("rejects unsupported variants instead of ignoring them", () => {
    const resolution = resolve(request({ derivation: "proficiency_bonus", level: 3 }), {
      ...context,
      profileRef: { ...SRD_2024_PROFILE, enabledVariantIds: ["gritty-realism"] },
    });
    expect(resolution.status).toBe("unsupported");
    expect(resolution.issues[0]?.message).toContain("gritty-realism");
  });

  it("refuses rule definitions from sources the profile does not pin", () => {
    const foreign: RuleDefinition = {
      ...SRD_2024_RULE_DEFINITIONS[1]!,
      ruleId: "homebrew.proficiency",
      specificity: 1,
      source: { sourceManifestRef: { id: "homebrew-coast", revision: 1 }, section: "House rules" },
    };
    const resolution = resolve(request({ derivation: "proficiency_bonus", level: 3 }), {
      ...context,
      ruleDefinitions: [...SRD_2024_RULE_DEFINITIONS, foreign],
    });
    expect(resolution.status).toBe("rejected");
    expect(resolution.issues[0]?.ruleIds).toEqual(["homebrew.proficiency"]);
  });

  it("lets a more specific rule replace the general one", () => {
    const specific: RuleDefinition = {
      ...SRD_2024_RULE_DEFINITIONS[1]!,
      ruleId: "srd2024.proficiency-bonus.fixed",
      specificity: 1,
      effect: {
        block: "base_calculation",
        formula: "proficiency_progression",
        bands: [{ fromLevel: 1, toLevel: 20, bonus: 4 }],
      },
    };
    const resolution = resolve(request({ derivation: "proficiency_bonus", level: 1 }), {
      ...context,
      ruleDefinitions: [...SRD_2024_RULE_DEFINITIONS, specific],
    });
    expect(resolution.result?.value).toBe(4);
    expect(resolution.appliedRules).toEqual(["srd2024.proficiency-bonus.fixed"]);
  });

  it("reports equally specific, different rules as a conflict regardless of order", () => {
    const rival: RuleDefinition = { ...SRD_2024_RULE_DEFINITIONS[1]!, ruleId: "srd2024.rival" };
    for (const order of [
      [...SRD_2024_RULE_DEFINITIONS, rival],
      [rival, ...SRD_2024_RULE_DEFINITIONS],
    ]) {
      const resolution = resolve(request({ derivation: "proficiency_bonus", level: 1 }), {
        ...context,
        ruleDefinitions: order,
      });
      expect(resolution.status).toBe("conflict");
      expect([...resolution.issues[0]!.ruleIds!].sort()).toEqual([
        "srd2024.proficiency-bonus@1",
        "srd2024.rival@1",
      ]);
    }
  });

  it("marks a missing definition as unsupported", () => {
    const resolution = resolve(request({ derivation: "proficiency_bonus", level: 1 }), {
      ...context,
      ruleDefinitions: SRD_2024_RULE_DEFINITIONS.filter(
        (rule) => rule.appliesTo !== "proficiency_bonus",
      ),
    });
    expect(resolution.status).toBe("unsupported");
  });
});

describe("domain boundary", () => {
  it("reports known but unimplemented families as unsupported", () => {
    const resolution = resolve({ requestId: "r", kind: "d20_test", input: {} }, context);
    expect(resolution).toMatchObject({ status: "unsupported", kind: "d20_test" });
    expect(resolution.issues[0]?.code).toBe("unsupported_rule");
  });

  it.each([
    ["unknown family", { ...request({}), kind: "teleport" }],
    ["unknown derivation", request({ derivation: "initiative" })],
    ["untyped payload", request({ derivation: "ability_modifier", ability: "luck", score: "12" })],
    [
      "missing request id",
      request({ derivation: "proficiency_bonus", level: 1 }, { requestId: "" }),
    ],
    ["not an object", "derive everything"],
  ])("rejects %s without computing", (_label, raw) => {
    const resolution = resolve(raw, context);
    expect(resolution.status).toBe("rejected");
    expect(resolution.result).toBeUndefined();
    expect(resolution.issues.every((issue) => issue.code === "validation_error")).toBe(true);
  });
});

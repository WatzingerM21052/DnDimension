/**
 * How a rule-relevant result came about (v0.2 spec §6.4). It says nothing about importance,
 * only which confirmation and explanation the result needs.
 *
 * Lives in core because both `domain` and `rules` need it, and `rules` must not depend on
 * `domain` (blueprint package boundaries).
 */
export const automationGrades = ["computed", "assisted", "manual_recorded"] as const;
export type AutomationGrade = (typeof automationGrades)[number];

export const isAutomationGrade = (value: unknown): value is AutomationGrade =>
  typeof value === "string" && (automationGrades as readonly string[]).includes(value);

/** Only fully deterministic results apply without a person confirming them. */
export const requiresConfirmation = (grade: AutomationGrade): boolean => grade !== "computed";

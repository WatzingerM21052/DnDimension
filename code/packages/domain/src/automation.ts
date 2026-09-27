/**
 * How a rule-relevant result came about (v0.2 spec §6.4). It says nothing about importance,
 * only which confirmation and explanation the result needs.
 */
export const automationGrades = ["computed", "assisted", "manual_recorded"] as const;
export type AutomationGrade = (typeof automationGrades)[number];

export const isAutomationGrade = (value: unknown): value is AutomationGrade =>
  typeof value === "string" && (automationGrades as readonly string[]).includes(value);

/** Only fully deterministic results apply without a person confirming them. */
export const requiresConfirmation = (grade: AutomationGrade): boolean => grade !== "computed";

/** A manually decided outcome must say why, so the audit log stays explainable. */
export type ManualRecord = Readonly<{
  grade: "manual_recorded";
  reason: string;
}>;

export const manualRecord = (reason: string): ManualRecord | undefined =>
  reason.trim().length > 0 ? { grade: "manual_recorded", reason: reason.trim() } : undefined;

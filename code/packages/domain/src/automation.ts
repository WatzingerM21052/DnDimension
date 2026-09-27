// The grade itself (and its helpers) lives in core, shared with `rules`; re-exported here so
// domain consumers keep a single import site.
export {
  automationGrades,
  isAutomationGrade,
  requiresConfirmation,
  type AutomationGrade,
} from "@dndimension/core";

/** A manually decided outcome must say why, so the audit log stays explainable. */
export type ManualRecord = Readonly<{
  grade: "manual_recorded";
  reason: string;
}>;

export const manualRecord = (reason: string): ManualRecord | undefined =>
  reason.trim().length > 0 ? { grade: "manual_recorded", reason: reason.trim() } : undefined;

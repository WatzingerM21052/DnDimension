import { describe, expect, it } from "vitest";
import { isAutomationGrade, manualRecord, requiresConfirmation } from "./automation";

describe("automation grades", () => {
  it("re-exports the shared grade helpers from core", () => {
    expect(requiresConfirmation("computed")).toBe(false);
    expect(isAutomationGrade("manual_recorded")).toBe(true);
  });

  it("needs a reason for manually recorded outcomes", () => {
    expect(manualRecord("  Improvised grapple ruling ")).toEqual({
      grade: "manual_recorded",
      reason: "Improvised grapple ruling",
    });
    expect(manualRecord("   ")).toBeUndefined();
  });
});

import { describe, expect, it } from "vitest";
import { isAutomationGrade, manualRecord, requiresConfirmation } from "./automation";

describe("automation grades", () => {
  it("requires confirmation for everything but computed results", () => {
    expect(requiresConfirmation("computed")).toBe(false);
    expect(requiresConfirmation("assisted")).toBe(true);
    expect(requiresConfirmation("manual_recorded")).toBe(true);
  });

  it("recognizes only the known grades", () => {
    expect(isAutomationGrade("assisted")).toBe(true);
    expect(isAutomationGrade("automatic")).toBe(false);
  });

  it("needs a reason for manually recorded outcomes", () => {
    expect(manualRecord("  Improvised grapple ruling ")).toEqual({
      grade: "manual_recorded",
      reason: "Improvised grapple ruling",
    });
    expect(manualRecord("   ")).toBeUndefined();
  });
});

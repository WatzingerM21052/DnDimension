import { describe, expect, it } from "vitest";
import { isAutomationGrade, requiresConfirmation } from "./automation";

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
});

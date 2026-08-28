import { describe, expect, it } from "vitest";
import { err, ok } from "./result";

describe("Result", () => {
  it("preserves a successful value", () => {
    expect(ok("ready")).toEqual({ ok: true, value: "ready" });
  });

  it("preserves a typed error", () => {
    expect(err("invalid")).toEqual({ ok: false, error: "invalid" });
  });
});

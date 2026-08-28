import { describe, expect, it } from "vitest";
import { parseBuildInfo } from "./build-info";

describe("parseBuildInfo", () => {
  it("accepts a complete build identity", () => {
    expect(parseBuildInfo({ version: "0.1.0", commit: "local" })).toEqual({
      ok: true,
      value: { version: "0.1.0", commit: "local" },
    });
  });

  it("rejects a non-object root", () => {
    expect(parseBuildInfo(null)).toEqual({
      ok: false,
      error: { code: "invalid_build_info", fields: ["root"] },
    });
  });

  it("reports every invalid field", () => {
    expect(parseBuildInfo({ version: " ", commit: 42 })).toEqual({
      ok: false,
      error: {
        code: "invalid_build_info",
        fields: ["version", "commit"],
      },
    });
  });
});

import { describe, expect, it } from "vitest";
import { buildIdentityDefine, resolveBuildIdentity } from "./build-identity";

const readVersion = () => "9.8.7";

describe("resolveBuildIdentity", () => {
  it("prefers an explicit commit over CI and git", () => {
    expect(
      resolveBuildIdentity({
        env: { DNDIMENSION_COMMIT: "release-7", GITHUB_SHA: "abcdef1234567890" },
        readVersion,
        readGitCommit: () => "unused",
      }),
    ).toEqual({ version: "9.8.7", commit: "release-7" });
  });

  it("shortens the CI commit", () => {
    expect(
      resolveBuildIdentity({ env: { GITHUB_SHA: "abcdef1234567890" }, readVersion }).commit,
    ).toBe("abcdef123456");
  });

  it("falls back to local when git is unavailable", () => {
    expect(
      resolveBuildIdentity({
        env: {},
        readVersion,
        readGitCommit: () => {
          throw new Error("not a git checkout");
        },
      }),
    ).toEqual({ version: "9.8.7", commit: "local" });
  });

  it("reads the web package version by default", () => {
    expect(resolveBuildIdentity({ env: { DNDIMENSION_COMMIT: "x" } }).version).toBe("0.1.0");
  });

  it("serializes the identity for compile-time replacement", () => {
    expect(buildIdentityDefine({ version: "1.0.0", commit: "c" })).toEqual({
      __DNDIMENSION_BUILD__: '{"version":"1.0.0","commit":"c"}',
    });
  });
});

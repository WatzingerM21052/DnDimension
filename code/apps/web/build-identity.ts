import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

export type BuildIdentity = { version: string; commit: string };

type Sources = {
  env?: Record<string, string | undefined>;
  readVersion?: () => string;
  readGitCommit?: () => string;
};

const readPackageVersion = (): string =>
  (
    JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")) as {
      version: string;
    }
  ).version;

const readGitCommit = (): string =>
  execFileSync("git", ["rev-parse", "--short=12", "HEAD"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    timeout: 5000,
  }).trim();

/** Resolved once per build; an unavailable git checkout falls back to "local". */
export const resolveBuildIdentity = ({
  env = process.env,
  readVersion = readPackageVersion,
  readGitCommit: gitCommit = readGitCommit,
}: Sources = {}): BuildIdentity => {
  const explicit = env.DNDIMENSION_COMMIT?.trim() || env.GITHUB_SHA?.trim().slice(0, 12);
  let commit = explicit || "";
  if (!commit) {
    try {
      commit = gitCommit();
    } catch {
      commit = "";
    }
  }
  return { version: readVersion(), commit: commit || "local" };
};

export const buildIdentityDefine = (identity = resolveBuildIdentity()) => ({
  __DNDIMENSION_BUILD__: JSON.stringify(identity),
});

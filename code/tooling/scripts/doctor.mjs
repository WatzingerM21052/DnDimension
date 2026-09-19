import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const parseVersion = (value) => {
  const match = /^v?(\d+)\.(\d+)\.(\d+)/.exec(value.trim());
  return match ? match.slice(1).map(Number) : null;
};

const isCompatibleNode = (version) => {
  const parsed = parseVersion(version);
  if (!parsed) return false;
  const [major, minor, patch] = parsed;
  return major === 24 && (minor > 11 || (minor === 11 && patch >= 0));
};

export const evaluateDoctor = (facts) => {
  const errors = [];
  const warnings = [];

  if (!isCompatibleNode(facts.nodeVersion)) {
    errors.push(`Node 24.11.0 or newer within Node 24 is required; found ${facts.nodeVersion}.`);
  }
  if (facts.nodeVersion.replace(/^v/, "") !== facts.referenceNodeVersion) {
    warnings.push(
      `Local Node is ${facts.nodeVersion.replace(/^v/, "")}; the clean-setup and CI reference is ${facts.referenceNodeVersion}.`,
    );
  }
  if (facts.pnpmVersion !== "11.19.0") {
    errors.push(`pnpm 11.19.0 is required; found ${facts.pnpmVersion}.`);
  }
  if (!facts.lockfileExists) errors.push("pnpm-lock.yaml is missing.");
  if (facts.missingWorkspacePackages.length > 0) {
    errors.push(
      `Required workspace package manifests are missing: ${facts.missingWorkspacePackages.join(", ")}`,
    );
  }
  if (!facts.edgeExists) warnings.push("Microsoft Edge was not found; no browser was downloaded.");
  if (facts.trackedSensitive.length > 0) {
    errors.push(`Private paths are tracked by Git: ${facts.trackedSensitive.join(", ")}`);
  }

  return { ok: errors.length === 0, errors, warnings };
};

const readPnpmVersion = (root) => {
  if (process.platform === "win32") {
    return execFileSync("cmd.exe", ["/d", "/s", "/c", "pnpm --version"], {
      cwd: root,
      encoding: "utf8",
    }).trim();
  }
  return execFileSync("pnpm", ["--version"], { cwd: root, encoding: "utf8" }).trim();
};

const findEdge = () => {
  if (process.platform !== "win32") return false;
  const candidates = [
    process.env["ProgramFiles(x86)"],
    process.env.ProgramFiles,
    process.env.LOCALAPPDATA,
  ]
    .filter(Boolean)
    .map((base) => path.join(base, "Microsoft", "Edge", "Application", "msedge.exe"));
  return candidates.some((candidate) => fs.existsSync(candidate));
};

export const collectDoctorFacts = (root = process.cwd()) => {
  const repositoryRoot = path.resolve(root, "..");
  const requiredWorkspacePackages = [
    "apps/web/package.json",
    "packages/core/package.json",
    "packages/ui/package.json",
  ];
  const tracked = execFileSync(
    "git",
    ["-C", repositoryRoot, "ls-files", "--", "private-library", "tmp"],
    { encoding: "utf8" },
  )
    .split(/\r?\n/)
    .filter(Boolean);

  return {
    nodeVersion: process.version,
    referenceNodeVersion: fs.readFileSync(path.join(root, ".node-version"), "utf8").trim(),
    pnpmVersion: readPnpmVersion(root),
    lockfileExists: fs.existsSync(path.join(root, "pnpm-lock.yaml")),
    missingWorkspacePackages: requiredWorkspacePackages.filter(
      (relative) => !fs.existsSync(path.join(root, relative)),
    ),
    edgeExists: findEdge(),
    trackedSensitive: tracked,
  };
};

const isCli =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isCli) {
  try {
    const facts = collectDoctorFacts();
    const result = evaluateDoctor(facts);
    console.log(`Node ${facts.nodeVersion} (reference ${facts.referenceNodeVersion})`);
    console.log(`pnpm ${facts.pnpmVersion}`);
    for (const warning of result.warnings) console.warn(`WARNING ${warning}`);
    for (const error of result.errors) console.error(`ERROR ${error}`);
    console.log(result.ok ? "Doctor: PASS" : "Doctor: FAIL");
    process.exitCode = result.ok ? 0 : 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

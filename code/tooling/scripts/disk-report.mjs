import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const MIB = 1024 * 1024;

export const measurePath = (target) => {
  if (!fs.existsSync(target)) return 0;

  const stats = fs.lstatSync(target);
  if (stats.isSymbolicLink()) return 0;
  if (stats.isFile()) return stats.size;
  if (!stats.isDirectory()) return 0;

  return fs
    .readdirSync(target)
    .reduce((total, entry) => total + measurePath(path.join(target, entry)), 0);
};

const measurePaths = (targets) => targets.reduce((total, target) => total + measurePath(target), 0);

export const formatMiB = (bytes) => `${(bytes / MIB).toFixed(2)} MiB`;

export const evaluateBudget = (bytes, budgetBytes) => (bytes > budgetBytes ? "warning" : "pass");

export const resolvePnpmStore = ({
  root = process.cwd(),
  platform = process.platform,
  readFile = (target) => fs.readFileSync(target, "utf8"),
  execute = (command, args) => execFileSync(command, args, { encoding: "utf8" }),
} = {}) => {
  try {
    const metadata = JSON.parse(readFile(path.join(root, "node_modules", ".modules.yaml")));
    if (typeof metadata.storeDir === "string" && metadata.storeDir.length > 0)
      return metadata.storeDir;
  } catch {
    // A fresh workspace has no install metadata yet; use pnpm as the fallback.
  }

  return platform === "win32"
    ? execute("cmd.exe", ["/d", "/s", "/c", "pnpm store path"]).trim()
    : execute("pnpm", ["store", "path"]).trim();
};

export const createDiskReport = ({ root, storePath }) => {
  const resolvedStorePath = storePath ?? resolvePnpmStore({ root });
  const rows = [
    {
      label: "Production build",
      bytes: measurePaths([
        path.join(root, "apps/web/dist"),
        path.join(root, "packages/core/dist"),
      ]),
      budgetBytes: 50 * MIB,
    },
    {
      label: "Project dependencies",
      bytes: measurePath(path.join(root, "node_modules")),
      budgetBytes: 1024 * MIB,
    },
    {
      label: "Shared pnpm store",
      bytes: measurePath(resolvedStorePath),
      budgetBytes: 2048 * MIB,
    },
    {
      label: "Vite and transform caches",
      bytes: measurePaths([
        path.join(root, ".vite"),
        path.join(root, ".cache"),
        path.join(root, "apps/web/.vite"),
        path.join(root, "apps/web/.cache"),
      ]),
      budgetBytes: 300 * MIB,
    },
    {
      label: "Test artifacts",
      bytes: measurePaths([
        path.join(root, "coverage"),
        path.join(root, "playwright-report"),
        path.join(root, "test-results"),
        path.join(root, "blob-report"),
      ]),
      budgetBytes: 250 * MIB,
    },
  ].map((row) => ({ ...row, status: evaluateBudget(row.bytes, row.budgetBytes) }));

  return { rows, excluded: ["../private-library", "../tmp"] };
};

const isCli =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isCli) {
  try {
    const report = createDiskReport({ root: process.cwd() });
    for (const row of report.rows) {
      console.log(
        `${row.status.toUpperCase().padEnd(7)} ${row.label}: ${formatMiB(row.bytes)} / ${formatMiB(row.budgetBytes)}`,
      );
    }
    console.log(`EXCLUDED Private/reference paths: ${report.excluded.join(", ")}`);
    process.exitCode = report.rows.some(({ status }) => status === "warning") ? 2 : 0;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

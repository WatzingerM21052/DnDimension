import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";

export const UI_BUDGETS = Object.freeze({
  javascriptRaw: 650 * 1024,
  javascriptGzip: 180 * 1024,
  css: 50 * 1024,
  fonts: 500 * 1024,
  svg: 25 * 1024,
  total: 50 * 1024 * 1024,
});

export const evaluateUiBudget = (bytes, budgetBytes) => (bytes > budgetBytes ? "warning" : "pass");

const collectFiles = (root) => {
  const files = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) visit(target);
      else if (entry.isFile()) files.push(target);
    }
  };
  visit(root);
  return files.sort((left, right) => left.localeCompare(right));
};

export const createUiBudgetReport = ({ distRoot, budgets = UI_BUDGETS }) => {
  if (!fs.existsSync(distRoot)) throw new Error(`Production build is missing: ${distRoot}`);
  const files = collectFiles(distRoot);
  const bytesFor = (predicate) =>
    files.filter(predicate).reduce((sum, file) => sum + fs.statSync(file).size, 0);
  const javascriptFiles = files.filter((file) => file.endsWith(".js"));
  const javascriptRaw = javascriptFiles.reduce((sum, file) => sum + fs.statSync(file).size, 0);
  const javascriptGzip = javascriptFiles.reduce(
    (sum, file) => sum + gzipSync(fs.readFileSync(file)).byteLength,
    0,
  );
  const values = {
    javascriptRaw,
    javascriptGzip,
    css: bytesFor((file) => file.endsWith(".css")),
    fonts: bytesFor((file) => file.endsWith(".woff2")),
    svg: bytesFor((file) => file.endsWith(".svg")),
    total: bytesFor((file) => !file.endsWith(".map")),
  };
  const rows = Object.entries(values).map(([key, bytes]) => ({
    key,
    bytes,
    budgetBytes: budgets[key],
    status: evaluateUiBudget(bytes, budgets[key]),
  }));
  return {
    rows,
    sourceMapsBytes: bytesFor((file) => file.endsWith(".map")),
  };
};

const formatKiB = (bytes) => `${(bytes / 1024).toFixed(2)} KiB`;
const isCli =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isCli) {
  try {
    const report = createUiBudgetReport({
      distRoot: path.join(process.cwd(), "apps/web/dist"),
    });
    for (const row of report.rows) {
      console.log(
        `${row.status.toUpperCase().padEnd(7)} ${row.key}: ${formatKiB(row.bytes)} / ${formatKiB(row.budgetBytes)}`,
      );
    }
    console.log(`SOURCE MAPS: ${formatKiB(report.sourceMapsBytes)}`);
    process.exitCode = report.rows.some(({ status }) => status === "warning") ? 2 : 0;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

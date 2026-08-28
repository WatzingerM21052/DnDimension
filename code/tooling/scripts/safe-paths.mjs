import fs from "node:fs";
import path from "node:path";

const ROOT_GENERATED = new Set([
  "dist",
  "dev-dist",
  ".vite",
  ".cache",
  "coverage",
  "playwright-report",
  "test-results",
  "blob-report",
]);

const normalizeRelative = (relative) => relative.split(path.sep).join("/").toLowerCase();

const isAllowedRelative = (relative) => {
  const normalized = normalizeRelative(relative);
  return (
    ROOT_GENERATED.has(normalized) ||
    /^(apps|packages)\/[^/]+\/(dist|dev-dist|\.vite|\.cache)$/.test(normalized)
  );
};

export const assertAllowedGeneratedPath = (root, target) => {
  const absoluteRoot = path.resolve(root);
  const absoluteTarget = path.resolve(target);
  const relative = path.relative(absoluteRoot, absoluteTarget);

  if (
    !relative ||
    relative.startsWith("..") ||
    path.isAbsolute(relative) ||
    !isAllowedRelative(relative)
  ) {
    throw new Error(`Refusing unsafe generated path: ${absoluteTarget}`);
  }

  if (fs.existsSync(absoluteTarget)) {
    const realTarget = fs.realpathSync.native(absoluteTarget);
    const realRelative = path.relative(fs.realpathSync.native(absoluteRoot), realTarget);
    if (
      !realRelative ||
      realRelative.startsWith("..") ||
      path.isAbsolute(realRelative) ||
      !isAllowedRelative(realRelative)
    ) {
      throw new Error(`Refusing unsafe generated path: ${absoluteTarget}`);
    }
  }

  return absoluteTarget;
};

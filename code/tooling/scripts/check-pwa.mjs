import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

/** Offline cache ceiling for the static app shell; user data never counts here. */
export const PWA_PRECACHE_BUDGET_BYTES = 5 * 1024 * 1024;

const SERVICE_WORKER_FILES = [/^sw\.js$/, /^workbox-[\w-]+\.js$/];
const INSTALLABLE_DISPLAY_MODES = new Set(["standalone", "fullscreen", "minimal-ui"]);

const collectFiles = (root) => {
  const files = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) visit(target);
      else if (entry.isFile()) files.push(path.relative(root, target).replaceAll("\\", "/"));
    }
  };
  visit(root);
  return files.sort((left, right) => left.localeCompare(right));
};

export const readPngSize = (buffer) => {
  const signature = "89504e470d0a1a0a";
  if (buffer.length < 24 || buffer.subarray(0, 8).toString("hex") !== signature) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
};

export const extractPrecacheUrls = (serviceWorkerSource) => {
  const start = serviceWorkerSource.indexOf("precacheAndRoute(");
  if (start === -1) return null;
  const end = serviceWorkerSource.indexOf("]", start);
  const list = serviceWorkerSource.slice(start, end);
  return [...list.matchAll(/url:\s*["'`]([^"'`]+)["'`]/g)].map((match) => match[1]);
};

const checkManifest = (distRoot, findings) => {
  const manifestPath = path.join(distRoot, "manifest.webmanifest");
  if (!fs.existsSync(manifestPath)) {
    findings.push("manifest.webmanifest is missing");
    return;
  }
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch {
    findings.push("manifest.webmanifest is not valid JSON");
    return;
  }
  for (const field of ["name", "short_name", "start_url", "scope", "theme_color"]) {
    if (typeof manifest[field] !== "string" || !manifest[field].trim())
      findings.push(`manifest field ${field} is missing`);
  }
  if (!INSTALLABLE_DISPLAY_MODES.has(manifest.display))
    findings.push(`manifest display "${manifest.display}" is not installable`);

  const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
  const verified = [];
  for (const icon of icons) {
    const file = path.join(distRoot, String(icon.src ?? ""));
    if (!fs.existsSync(file)) {
      findings.push(`manifest icon ${icon.src} is missing from the build`);
      continue;
    }
    const size = readPngSize(fs.readFileSync(file));
    const [width, height] = String(icon.sizes ?? "")
      .split("x")
      .map(Number);
    if (icon.type !== "image/png" || !size || size.width !== width || size.height !== height) {
      findings.push(`manifest icon ${icon.src} does not match its declared PNG size ${icon.sizes}`);
      continue;
    }
    verified.push({ width, purpose: String(icon.purpose ?? "any") });
  }
  for (const width of [192, 512]) {
    if (!verified.some((icon) => icon.width === width && icon.purpose.includes("any")))
      findings.push(`manifest needs a ${width}x${width} PNG icon`);
  }
  if (!verified.some((icon) => icon.purpose.includes("maskable")))
    findings.push("manifest needs a maskable icon");
};

const checkHtml = (distRoot, findings) => {
  const html = fs.readFileSync(path.join(distRoot, "index.html"), "utf8");
  if (!/<link[^>]+rel="manifest"[^>]+href="\/?manifest\.webmanifest"/.test(html))
    findings.push("index.html does not link the manifest");
  if (!/<meta[^>]+name="theme-color"/.test(html)) findings.push("index.html has no theme-color");
};

const checkServiceWorker = (distRoot, files, findings) => {
  const swPath = path.join(distRoot, "sw.js");
  if (!fs.existsSync(swPath)) {
    findings.push("sw.js is missing");
    return 0;
  }
  const source = fs.readFileSync(swPath, "utf8");
  const precached = extractPrecacheUrls(source);
  if (!precached) {
    findings.push("sw.js has no precache manifest");
    return 0;
  }

  const routes = source.match(/registerRoute\(/g)?.length ?? 0;
  if (routes !== 1 || !source.includes("NavigationRoute"))
    findings.push("sw.js must register only the app-shell navigation route (no runtime caching)");
  if (
    /skipWaiting\(\)/.test(source.replace(/addEventListener\("message"[\s\S]*?skipWaiting\(\)/, ""))
  )
    findings.push("sw.js activates new versions without an explicit update request");

  const precachedSet = new Set(precached);
  for (const url of precachedSet) {
    if (url.endsWith(".map")) findings.push(`source map ${url} is precached`);
    if (/(^|\/)dev\//.test(url)) findings.push(`development route ${url} is precached`);
    if (!files.includes(url)) findings.push(`precached ${url} does not exist in the build`);
  }
  const expected = files.filter(
    (file) => !file.endsWith(".map") && !SERVICE_WORKER_FILES.some((pattern) => pattern.test(file)),
  );
  for (const file of expected) {
    if (!precachedSet.has(file)) findings.push(`${file} is not precached for offline start`);
  }
  return [...precachedSet]
    .filter((url) => files.includes(url))
    .reduce((sum, url) => sum + fs.statSync(path.join(distRoot, url)).size, 0);
};

export const checkPwaBuild = ({ distRoot, budgetBytes = PWA_PRECACHE_BUDGET_BYTES }) => {
  if (!fs.existsSync(distRoot)) throw new Error(`Production build is missing: ${distRoot}`);
  const files = collectFiles(distRoot);
  const findings = [];
  checkManifest(distRoot, findings);
  checkHtml(distRoot, findings);
  const precacheBytes = checkServiceWorker(distRoot, files, findings);
  if (precacheBytes > budgetBytes)
    findings.push(`precache ${precacheBytes} bytes exceeds budget ${budgetBytes} bytes`);
  return { findings, precacheBytes };
};

const isCli =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isCli) {
  try {
    const { findings, precacheBytes } = checkPwaBuild({
      distRoot: path.join(process.cwd(), "apps/web/dist"),
    });
    for (const finding of findings) console.error(`FAIL    ${finding}`);
    console.log(
      `${findings.length ? "FAIL" : "PASS"}    pwaPrecache: ${(precacheBytes / 1024).toFixed(2)} KiB / ${(PWA_PRECACHE_BUDGET_BYTES / 1024).toFixed(2)} KiB`,
    );
    process.exitCode = findings.length ? 1 : 0;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

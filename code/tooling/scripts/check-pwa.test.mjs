import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { checkPwaBuild, extractPrecacheUrls, readPngSize } from "./check-pwa.mjs";

const png = (size) => {
  const buffer = Buffer.alloc(33);
  Buffer.from("89504e470d0a1a0a", "hex").copy(buffer);
  buffer.writeUInt32BE(size, 16);
  buffer.writeUInt32BE(size, 20);
  return buffer;
};

const manifest = {
  name: "DnDimension",
  short_name: "DnDimension",
  start_url: "/",
  scope: "/",
  display: "standalone",
  theme_color: "#0b1620",
  icons: [
    { src: "icons/a-192.png", sizes: "192x192", type: "image/png" },
    { src: "icons/a-512.png", sizes: "512x512", type: "image/png" },
    { src: "icons/a-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
  ],
};

const serviceWorker = (urls, extra = "") =>
  `define(["./workbox-1"],function(e){self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),e.precacheAndRoute([${urls
    .map((url) => `{url:"${url}",revision:"1"}`)
    .join(
      ",",
    )}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))${extra}});`;

const createDist = (overrides = {}) => {
  const distRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dndimension-pwa-"));
  const files = {
    "index.html":
      '<meta name="theme-color" content="#000"><link rel="manifest" href="/manifest.webmanifest">',
    "manifest.webmanifest": JSON.stringify(manifest),
    "icons/a-192.png": png(192),
    "icons/a-512.png": png(512),
    "assets/app.js": "console.log(1)",
    "assets/app.js.map": "{}",
    "workbox-1.js": "",
    ...overrides,
  };
  const urls = ["index.html", "manifest.webmanifest", "icons/a-192.png", "icons/a-512.png"];
  files["sw.js"] ??= serviceWorker([...urls, "assets/app.js"]);
  for (const [file, content] of Object.entries(files)) {
    if (content === null) continue;
    fs.mkdirSync(path.dirname(path.join(distRoot, file)), { recursive: true });
    fs.writeFileSync(path.join(distRoot, file), content);
  }
  return distRoot;
};

const findingsFor = (overrides, options = {}) => {
  const distRoot = createDist(overrides);
  try {
    return checkPwaBuild({ distRoot, ...options }).findings;
  } finally {
    fs.rmSync(distRoot, { force: true, recursive: true });
  }
};

test("accepts an installable, fully precached build", () => {
  assert.deepEqual(findingsFor({}), []);
});

test("reads PNG dimensions and rejects other files", () => {
  assert.deepEqual(readPngSize(png(48)), { width: 48, height: 48 });
  assert.equal(readPngSize(Buffer.from("not a png at all, clearly")), null);
});

test("extracts precache URLs from a generated worker", () => {
  assert.deepEqual(extractPrecacheUrls(serviceWorker(["a.js", "b.css"])), ["a.js", "b.css"]);
  assert.equal(extractPrecacheUrls("self.skipWaiting()"), null);
});

test("requires an installable manifest with verified icons", () => {
  const findings = findingsFor({
    "manifest.webmanifest": JSON.stringify({
      ...manifest,
      display: "browser",
      icons: [{ src: "icons/a-512.png", sizes: "192x192", type: "image/png" }],
    }),
  });
  assert.ok(findings.some((finding) => finding.includes('display "browser"')));
  assert.ok(findings.some((finding) => finding.includes("does not match its declared PNG size")));
  assert.ok(findings.some((finding) => finding.includes("maskable")));
});

test("requires the manifest link in index.html", () => {
  const findings = findingsFor({ "index.html": '<meta name="theme-color" content="#000">' });
  assert.ok(findings.includes("index.html does not link the manifest"));
});

test("requires every shipped asset to be precached for offline start", () => {
  const findings = findingsFor({ "assets/late-chunk.js": "1" });
  assert.ok(findings.includes("assets/late-chunk.js is not precached for offline start"));
});

test("rejects precached source maps and missing files", () => {
  const findings = findingsFor({
    "sw.js": serviceWorker([
      "index.html",
      "manifest.webmanifest",
      "icons/a-192.png",
      "icons/a-512.png",
      "assets/app.js",
      "assets/app.js.map",
      "assets/gone.js",
    ]),
  });
  assert.ok(findings.includes("source map assets/app.js.map is precached"));
  assert.ok(findings.includes("precached assets/gone.js does not exist in the build"));
});

test("rejects runtime caching that could capture dynamic data", () => {
  const findings = findingsFor({
    "sw.js": serviceWorker(
      ["index.html", "manifest.webmanifest", "icons/a-192.png", "icons/a-512.png", "assets/app.js"],
      ',e.registerRoute(/\\/api\\//,new e.NetworkFirst({cacheName:"api"}),"GET")',
    ),
  });
  assert.ok(findings.some((finding) => finding.includes("no runtime caching")));
});

test("rejects workers that activate without an explicit update request", () => {
  const findings = findingsFor({
    "sw.js": serviceWorker(
      ["index.html", "manifest.webmanifest", "icons/a-192.png", "icons/a-512.png", "assets/app.js"],
      ",self.skipWaiting()",
    ),
  });
  assert.ok(findings.some((finding) => finding.includes("without an explicit update request")));
});

test("enforces the precache budget", () => {
  const findings = findingsFor({}, { budgetBytes: 10 });
  assert.ok(findings.some((finding) => finding.includes("exceeds budget")));
});

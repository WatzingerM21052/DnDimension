import fs from "node:fs";
import http from "node:http";
import type { AddressInfo } from "node:net";
import path from "node:path";

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".map": "application/json",
};

export const webDist = path.resolve(import.meta.dirname, "../dist");

/**
 * Minimal static host like a production CDN: SPA fallback to index.html and a switchable
 * root, so a test can publish a second build to the same origin.
 */
export const startStaticServer = async (initialRoot = webDist) => {
  if (!fs.existsSync(path.join(initialRoot, "index.html")))
    throw new Error(`No production build at ${initialRoot}; run "pnpm build" first.`);
  let root = initialRoot;
  const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url ?? "/", "http://x").pathname);
    let file = path.join(root, path.normalize(pathname));
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory())
      file = path.join(root, "index.html");
    response.writeHead(200, {
      "Content-Type": CONTENT_TYPES[path.extname(file)] ?? "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as AddressInfo;
  return {
    // localhost counts as a secure context, which service workers require.
    url: `http://localhost:${port}`,
    publish(nextRoot: string) {
      root = nextRoot;
    },
    close: () =>
      new Promise<void>((resolve) => {
        server.closeAllConnections();
        server.close(() => resolve());
      }),
  };
};

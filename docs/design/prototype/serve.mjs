import http from 'node:http';
import {readFile, realpath} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicFiles = new Set(['index.html','styles.css','app.mjs','state.mjs','map.css','map.mjs','map-state.mjs','suite.css','suite.mjs','suite-state.mjs']);
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.png':'image/png'};
export function createServer() {
  return http.createServer(async (req, res) => {
    const reply = (status, body) => { res.writeHead(status, {'Content-Type':'text/plain; charset=utf-8'}); res.end(body); };
    if (!['GET','HEAD'].includes(req.method)) return reply(405, 'Method not allowed');
    try {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      if (urlPath.includes('..') || urlPath.includes('\\') || urlPath.includes('\0')) return reply(403, 'Forbidden');
      const relative = urlPath === '/prototype/' ? 'prototype/index.html' : urlPath.replace(/^\//, '');
      const allowed = (relative.startsWith('prototype/') && publicFiles.has(relative.slice(10))) || /^assets\/[\w-]+\.png$/.test(relative);
      if (!allowed) return reply(404, 'Not found');
      const file = await realpath(path.resolve(root, relative));
      const boundary = path.relative(await realpath(root), file);
      if (boundary.startsWith('..') || path.isAbsolute(boundary)) return reply(403, 'Forbidden');
      const body = await readFile(file);
      res.writeHead(200, {'Content-Type':mime[path.extname(file)], 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff', 'Content-Security-Policy':"default-src 'self'; style-src 'self'; img-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'"});
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch (error) { reply(error instanceof URIError ? 400 : 404, 'Not found or invalid path'); }
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createServer();
  server.on('error', error => { console.error(error.message); process.exitCode=1; });
  server.listen(4178, '127.0.0.1', () => console.log('DnDimension demo: http://127.0.0.1:4178/prototype/'));
}

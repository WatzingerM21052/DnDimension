import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
const module = await import('./serve.mjs').catch(() => ({}));
test('preview server exists', () => assert.equal(typeof module.createServer, 'function'));
test('server serves demo and rejects outside files, malformed paths and writes', async t => {
  const server = module.createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const port = server.address().port;
  const request = (path, method='GET') => new Promise((resolve, reject) => {
    const req = http.request({host:'127.0.0.1', port, path, method}, res => {
      let body=''; res.on('data', c => body+=c); res.on('end', () => resolve({status:res.statusCode, type:res.headers['content-type'], body}));
    }); req.on('error', reject); req.end();
  });
  assert.equal((await request('/prototype/')).status, 200);
  assert.match((await request('/prototype/state.mjs')).type, /javascript/);
  for (const path of ['map-state.mjs','map.mjs']) {
    const response = await request(`/prototype/${path}`);
    assert.equal(response.status, 200);
    assert.match(response.type, /javascript/);
  }
  assert.match((await request('/prototype/map.css')).type, /css/);
  for (const path of ['/../README.md','/%2e%2e/README.md','/private-library/test.pdf','/prototype/missing','/%zz']) {
    assert.notEqual((await request(path)).status, 200, path);
  }
  assert.equal((await request('/prototype/', 'POST')).status, 405);
});

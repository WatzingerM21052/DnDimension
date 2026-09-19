import test from 'node:test';
import assert from 'node:assert/strict';
const {moveMap} = await import('./map-state.mjs').catch(() => ({}));
const initial = {x:0,y:0,zoom:1};
const size = {width:1000,height:600};

test('direction controls move the viewport in the requested direction', () => {
  const state={x:-300,y:-200,zoom:2};
  for(const [direction,x,y] of [['west',-240,-200],['east',-360,-200],['north',-300,-140],['south',-300,-260]]) {
    assert.deepEqual(moveMap(state,{type:'step',direction},size),{x,y,zoom:2});
  }
});
test('direction controls stop at edges and ignore unknown directions', () => {
  const state={x:0,y:0,zoom:2};
  assert.deepEqual(moveMap(state,{type:'step',direction:'north'},size),state);
  assert.deepEqual(moveMap(state,{type:'step',direction:'unknown'},size),state);
  assert.deepEqual(moveMap({x:-980,y:-590,zoom:2},{type:'step',direction:'east'},size),{x:-1000,y:-590,zoom:2});
});

test('focus centers a map point without changing zoom', () => {
  assert.deepEqual(moveMap({x:0,y:0,zoom:2},{type:'focus',point:{x:0.6,y:0.7}},size),{x:-700,y:-540,zoom:2});
});
test('focus near edges stays within the map', () => {
  assert.deepEqual(moveMap({x:-250,y:-150,zoom:2},{type:'focus',point:{x:0.01,y:0.99}},size),{x:0,y:-600,zoom:2});
});

test('zoom preserves the point under the cursor', () => {
  assert.equal(typeof moveMap, 'function');
  assert.deepEqual(moveMap(initial,{type:'zoom',factor:2,anchor:{x:250,y:150}},size),{x:-250,y:-150,zoom:2});
  assert.deepEqual(initial,{x:0,y:0,zoom:1});
});
test('pan is bounded so the map cannot be lost', () => {
  assert.equal(typeof moveMap, 'function');
  assert.deepEqual(moveMap({x:-250,y:-150,zoom:2},{type:'pan',dx:-2000,dy:1000},size),{x:-1000,y:0,zoom:2});
});
test('zoom limits and reset recover the complete map', () => {
  assert.equal(typeof moveMap, 'function');
  const near=moveMap(initial,{type:'zoom',factor:100},size);
  assert.deepEqual(near,{x:-1500,y:-900,zoom:4});
  assert.deepEqual(moveMap(near,{type:'zoom',factor:0.001},size),initial);
  assert.deepEqual(moveMap(near,{type:'reset'},size),initial);
});
test('resize clamps offsets to the new viewport', () => {
  assert.equal(typeof moveMap, 'function');
  assert.deepEqual(moveMap({x:-1000,y:-600,zoom:2},{type:'resize'},{width:300,height:200}),{x:-300,y:-200,zoom:2});
});
test('hidden viewport and invalid zoom input leave state intact', () => {
  assert.equal(typeof moveMap, 'function');
  assert.deepEqual(moveMap(initial,{type:'zoom',factor:2},{width:0,height:0}),initial);
  assert.deepEqual(moveMap(initial,{type:'zoom',factor:NaN},size),initial);
});

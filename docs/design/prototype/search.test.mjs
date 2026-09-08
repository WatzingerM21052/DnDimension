import test from 'node:test';
import assert from 'node:assert/strict';
const {findPlaces} = await import('./map-state.mjs');
const places = ['Nordtor','Alter Steg','Observatorium','Tannwald'];
test('place search ignores surrounding whitespace and case', () => {
  assert.equal(typeof findPlaces,'function');
  assert.deepEqual(findPlaces(places,'  STEG  '),['Alter Steg']);
});
test('empty search restores every place without changing the source', () => {
  assert.equal(typeof findPlaces,'function');
  assert.deepEqual(findPlaces(places,'  '),['Nordtor','Alter Steg','Observatorium','Tannwald']);
  assert.equal(places.length,4);
});
test('unknown and HTML-shaped queries produce no results', () => {
  assert.equal(typeof findPlaces,'function');
  assert.deepEqual(findPlaces(places,'Drachenhöhle'),[]);
  assert.deepEqual(findPlaces(places,'<img>'),[]);
});

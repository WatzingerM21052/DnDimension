import test from 'node:test';
import assert from 'node:assert/strict';
const module = await import('./state.mjs').catch(() => ({}));
test('state API is available', () => assert.equal(typeof module.transition, 'function'));
test('navigation preserves drafts and closes panels without mutating input', () => {
  const before = {...module.createState(), draft:'Ich frage Mira.', panel:'figures'};
  const after = module.transition(before, {type:'navigate', route:'world'});
  assert.equal(after.route, 'world'); assert.equal(after.draft, 'Ich frage Mira.');
  assert.equal(after.panel, null); assert.equal(before.panel, 'figures');
});
test('invalid route recovers to room', () => {
  assert.equal(module.transition(module.createState(), {type:'navigate', route:'missing'}).route, 'room');
});
test('editing and clearing text preserves literal HTML characters', () => {
  const s = module.transition(module.createState(), {type:'draft', value:'<b>Hallo</b>'});
  assert.equal(s.draft, '<b>Hallo</b>');
  assert.equal(module.transition(s, {type:'draft', value:''}).draft, '');
});
test('reading and selection survive route change', () => {
  let s = module.transition(module.createState(), {type:'reading', value:true});
  s = module.transition(s, {type:'place', place:'Nordtor'});
  s = module.transition(s, {type:'navigate', route:'session'});
  assert.equal(s.reading, true); assert.equal(s.place, 'Nordtor');
});
test('panels replace rather than stack, close, and unknown events do nothing', () => {
  let s = module.transition(module.createState(), {type:'panel', panel:'figures'});
  s = module.transition(s, {type:'panel', panel:'preview'});
  assert.equal(s.panel, 'preview');
  s = module.transition(s, {type:'panel', panel:null});
  assert.equal(s.panel, null); assert.equal(module.transition(s, {type:'unknown'}), s);
});

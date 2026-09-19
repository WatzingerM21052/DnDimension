import test from 'node:test';
import assert from 'node:assert/strict';
const api = await import('./suite-state.mjs').catch(()=>({}));
const ready = () => { assert.equal(typeof api.createCampaign,'function'); return api.createCampaign(); };
test('character draft validates required name, edition and bounded attributes',()=>{
  const s=ready();
  assert.throws(()=>api.changeCampaign(s,{type:'character',value:{...s.character,name:' '}}));
  assert.throws(()=>api.changeCampaign(s,{type:'character',value:{...s.character,edition:'unknown'}}));
  assert.throws(()=>api.changeCampaign(s,{type:'character',value:{...s.character,attributes:[99,10,10,10,10,10]}}));
  const next=api.changeCampaign(s,{type:'character',value:{...s.character,name:'Mira',edition:'2014'}});
  assert.equal(next.character.name,'Mira'); assert.equal(s.character.name,'Neris');
});
test('inventory quantities never become negative and equipment toggles independently',()=>{
  let s=ready(); s=api.changeCampaign(s,{type:'item-add',name:'Seil',quantity:2});
  const id=s.inventory.at(-1).id;
  s=api.changeCampaign(s,{type:'item-quantity',id,delta:-8});
  assert.equal(s.inventory.at(-1).quantity,0);
  s=api.changeCampaign(s,{type:'item-equip',id}); assert.equal(s.inventory.at(-1).equipped,true);
  assert.throws(()=>api.changeCampaign(s,{type:'item-add',name:' ',quantity:1}));
});
test('journal preserves literal text and can archive an entry',()=>{
  let s=ready();s=api.changeCampaign(s,{type:'journal-add',title:'Hinweis',text:'<script>test</script>'});
  const entry=s.journal.at(-1);assert.equal(entry.text,'<script>test</script>');
  s=api.changeCampaign(s,{type:'journal-toggle',id:entry.id});assert.equal(s.journal.at(-1).archived,true);
});
test('campaign preparation and resolutions are retained as separate records',()=>{
  let s=ready();s=api.changeCampaign(s,{type:'prepare',value:{title:'Nebel',objective:'Steg finden',scene:'Am Fluss'}});
  assert.equal(s.preparation.title,'Nebel');
  s=api.changeCampaign(s,{type:'resolve',intent:'Ich frage.',text:'Mira antwortet.'});
  assert.equal(s.chronicle.at(-1).text,'Mira antwortet.');
  assert.throws(()=>api.changeCampaign(s,{type:'resolve',intent:'x',text:' '}));
});
test('encounter starts in initiative order, cycles rounds and bounds hit points',()=>{
  let s=ready();s=api.changeCampaign(s,{type:'enemy-add',template:'sentinel'});
  s=api.changeCampaign(s,{type:'initiative',id:s.actors[1].id,value:25});
  s=api.changeCampaign(s,{type:'combat-start'});assert.equal(s.actors[0].name,'Messingwächter');
  assert.equal(s.combat.round,1);
  s=api.changeCampaign(s,{type:'combat-next'});assert.equal(s.combat.turn,1);
  s=api.changeCampaign(s,{type:'combat-next'});assert.equal(s.combat.round,2);
  s=api.changeCampaign(s,{type:'hp',id:s.actors[0].id,delta:-999});assert.equal(s.actors[0].hp,0);
  s=api.changeCampaign(s,{type:'hp',id:s.actors[0].id,delta:999});assert.equal(s.actors[0].hp,s.actors[0].maxHp);
  assert.throws(()=>api.changeCampaign(s,{type:'enemy-add',template:'sentinel'}));
  s=api.changeCampaign(s,{type:'combat-end'});assert.equal(s.combat.active,false);
});
test('dice respect count, faces and modifier and reject invalid inputs',()=>{
  ready();assert.deepEqual(api.rollDice(2,20,3,()=>0),{rolls:[1,1],total:5,sides:20,modifier:3});
  assert.equal(api.rollDice(1,6,-2,()=>0.999).total,4);
  assert.throws(()=>api.rollDice(100,20,0));assert.throws(()=>api.rollDice(1,7,0));
});

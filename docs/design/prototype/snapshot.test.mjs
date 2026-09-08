import test from 'node:test';
import assert from 'node:assert/strict';
import {createCampaign,changeCampaign} from './suite-state.mjs';
const api=await import('./snapshot.mjs').catch(()=>({}));
const ready=()=>assert.equal(typeof api.readSnapshot,'function');
test('export and import preserve an active encounter, inventory and journal',()=>{
  ready();let s=createCampaign();s=changeCampaign(s,{type:'enemy-add',template:'sentinel'});s=changeCampaign(s,{type:'combat-start'});
  s=changeCampaign(s,{type:'journal-add',title:'Hinweis',text:'<b>literal</b>'});
  assert.deepEqual(api.readSnapshot(api.writeSnapshot(s)),s);
});
test('invalid JSON, future versions and oversized input are rejected',()=>{
  ready();assert.throws(()=>api.readSnapshot('{broken'));
  assert.throws(()=>api.readSnapshot(JSON.stringify({format:'dndimension-demo',version:2,campaign:createCampaign()})));
  assert.throws(()=>api.readSnapshot(' '.repeat(1000001)));
});
test('corrupt data cannot introduce bad HP, duplicate IDs or invalid turns',()=>{
  ready();for(const mutate of [s=>s.actors[0].hp=-1,s=>s.inventory[1].id=1,s=>s.combat.turn=9,s=>s.character.attributes=[99],s=>s.serial=0,s=>s.actors=[]]){
    const s=createCampaign();mutate(s);assert.throws(()=>api.readSnapshot(JSON.stringify({format:'dndimension-demo',version:1,campaign:s})));
  }
});
test('unknown fields and invalid flags are rejected, not merged into live state',()=>{
  ready();for(const mutate of [s=>s.extra='surprise',s=>s.inventory[0].equipped='false',s=>s.character.edition='2026',s=>s.actors[0].name='wrong']){
    const s=createCampaign();mutate(s);assert.throws(()=>api.writeSnapshot(s));
  }
});
test('removing a combatant after combat still leaves an exportable campaign',()=>{
  ready();let s=createCampaign();s=changeCampaign(s,{type:'enemy-add',template:'sentinel'});const id=s.actors[1].id;
  for(const type of ['combat-start','combat-next','combat-end'])s=changeCampaign(s,{type});
  s=changeCampaign(s,{type:'enemy-remove',id});assert.doesNotThrow(()=>api.writeSnapshot(s));
});

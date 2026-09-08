const fail=()=>{throw new Error('Ungültige oder nicht unterstützte Demo-Sicherung. Der aktuelle Stand bleibt unverändert.');};
const integer=(v,min,max)=>{if(!Number.isSafeInteger(v)||v<min||v>max)fail();};
const string=(v,empty=false)=>{if(typeof v!=='string'||v.length>20000||(!empty&&!v.trim()))fail();};
const boolean=v=>{if(typeof v!=='boolean')fail();};
function object(v,required,optional=[]) {
  if(!v||typeof v!=='object'||Array.isArray(v)||required.some(k=>!Object.hasOwn(v,k))||Object.keys(v).some(k=>![...required,...optional].includes(k)))fail();
}
function list(v,min=0){if(!Array.isArray(v)||v.length<min||v.length>500)fail();}
function validate(s) {
  object(s,['serial','character','preparation','inventory','journal','actors','combat','chronicle']);
  integer(s.serial,0,Number.MAX_SAFE_INTEGER-1000);
  const ids=new Set();const id=v=>{integer(v,0,s.serial);if(ids.has(v))fail();ids.add(v);};
  const c=s.character;object(c,['name','edition','archetype','origin','notes','attributes','maxHp']);
  for(const k of ['name','archetype','origin'])string(c[k]);string(c.notes,true);
  if(!['2014','2024'].includes(c.edition))fail();if(!Array.isArray(c.attributes)||c.attributes.length!==6)fail();c.attributes.forEach(v=>integer(v,1,20));integer(c.maxHp,1,999);
  object(s.preparation,['title','objective','scene']);Object.values(s.preparation).forEach(v=>string(v));
  list(s.inventory);for(const i of s.inventory){object(i,['id','name','quantity','equipped']);id(i.id);string(i.name);integer(i.quantity,0,999);boolean(i.equipped);}
  list(s.journal);for(const e of s.journal){object(e,['id','title','text','archived']);id(e.id);string(e.title);string(e.text);boolean(e.archived);}
  list(s.chronicle);for(const e of s.chronicle){object(e,['id','intent','text']);id(e.id);string(e.intent);string(e.text);}
  list(s.actors,1);for(const a of s.actors){object(a,['id','name','hp','maxHp','initiative'],['kind','description']);id(a.id);string(a.name);integer(a.maxHp,1,999);integer(a.hp,0,a.maxHp);integer(a.initiative,-20,99);for(const k of ['kind','description'])if(Object.hasOwn(a,k))string(a[k]);}
  const hero=s.actors.find(a=>a.id===0);if(!hero||hero.name!==c.name||hero.maxHp!==c.maxHp)fail();
  object(s.combat,['active','round','turn']);boolean(s.combat.active);integer(s.combat.round,s.combat.active?1:0,1000000);integer(s.combat.turn,0,s.actors.length-1);
  return structuredClone(s);
}
export function readSnapshot(raw) {
  if(typeof raw!=='string'||new TextEncoder().encode(raw).length>1000000)fail();
  let data;try{data=JSON.parse(raw);}catch{fail();}
  object(data,['format','version','campaign']);if(data.format!=='dndimension-demo'||data.version!==1)fail();
  return validate(data.campaign);
}
export function writeSnapshot(campaign) {
  const raw=JSON.stringify({format:'dndimension-demo',version:1,campaign:validate(campaign)},null,2);
  if(new TextEncoder().encode(raw).length>1000000)fail();return raw;
}

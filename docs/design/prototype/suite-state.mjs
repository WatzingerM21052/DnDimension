export const enemies = [
  {id:'sentinel',name:'Messingwächter',maxHp:18,initiative:8,kind:'Konstrukt',description:'Eine vergessene Wachmaschine. Reagiert auf das Sternensiegel und blockiert den Zugang zum Turm.'},
  {id:'moth',name:'Nebelspinner',maxHp:9,initiative:14,kind:'Waldwesen',description:'Sammelt Licht in seinen Flügeln. Im Nebel verrät nur ein leises Klicken seine Nähe.'},
  {id:'scout',name:'Dornenkundschafter',maxHp:12,initiative:12,kind:'Rivale',description:'Sucht dieselbe Karte wie die Gruppe. Verhandlungen sind ebenso möglich wie ein Kampf.'}
];
export function createCampaign() {
  return {
    serial:3,
    character:{name:'Neris',edition:'2024',archetype:'Waldläufer',origin:'Kartografin',notes:'Sucht die verschwundenen Sternenkarten.',attributes:[10,15,13,12,14,8],maxHp:12},
    preparation:{title:'Sternenbruch',objective:'Den Weg zum Observatorium finden.',scene:'Mira wartet am Nordtor mit einer beschädigten Karte.'},
    inventory:[{id:1,name:'Reisepack',quantity:1,equipped:true},{id:2,name:'Laterne',quantity:1,equipped:false}],
    journal:[{id:3,title:'Das Sternensiegel',text:'Mira erkennt das Zeichen auf der beschädigten Karte.',archived:false}],
    actors:[{id:0,name:'Neris',maxHp:12,hp:12,initiative:10}],
    combat:{active:false,round:0,turn:0},chronicle:[]
  };
}
const text = (value, label) => {if(typeof value!=='string'||!value.trim())throw new Error(`${label} fehlt.`);return value.trim();};
const integer = (value,min,max) => {if(!Number.isInteger(value)||value<min||value>max)throw new Error(`Zahl zwischen ${min} und ${max} erforderlich.`);return value;};
export function changeCampaign(state,event) {
  const s=structuredClone(state);
  switch(event.type) {
    case 'character': {
      if(s.combat.active)throw new Error('Beende zuerst die laufende Demo-Begegnung.');
      const c=event.value;
      if(!['2014','2024'].includes(c.edition))throw new Error('Wähle eine Edition.');
      if(!Array.isArray(c.attributes)||c.attributes.length!==6)throw new Error('Sechs Attribute erforderlich.');
      s.character={name:text(c.name,'Name'),edition:c.edition,archetype:text(c.archetype,'Klasse'),origin:text(c.origin,'Herkunft'),notes:String(c.notes??''),attributes:c.attributes.map(v=>integer(v,1,20)),maxHp:integer(c.maxHp,1,999)};
      s.actors=s.actors.map(a=>a.id===0?{...a,name:s.character.name,maxHp:s.character.maxHp,hp:Math.min(a.hp,s.character.maxHp)}:a);break;
    }
    case 'prepare':s.preparation={title:text(event.value.title,'Kampagnentitel'),objective:text(event.value.objective,'Ziel'),scene:text(event.value.scene,'Szene')};break;
    case 'item-add':s.inventory.push({id:++s.serial,name:text(event.name,'Gegenstand'),quantity:integer(event.quantity,1,999),equipped:false});break;
    case 'item-quantity':s.inventory=s.inventory.map(i=>i.id===event.id?{...i,quantity:Math.max(0,Math.min(999,i.quantity+integer(event.delta,-999,999)))}:i);break;
    case 'item-equip':s.inventory=s.inventory.map(i=>i.id===event.id?{...i,equipped:!i.equipped}:i);break;
    case 'journal-add':s.journal.push({id:++s.serial,title:text(event.title,'Titel'),text:text(event.text,'Notiz'),archived:false});break;
    case 'journal-toggle':s.journal=s.journal.map(e=>e.id===event.id?{...e,archived:!e.archived}:e);break;
    case 'enemy-add': {
      if(s.combat.active)throw new Error('Beende zuerst die laufende Demo-Begegnung.');
      const e=enemies.find(e=>e.id===event.template);if(!e)throw new Error('Unbekannte Vorlage.');
      s.actors.push({...e,id:++s.serial,hp:e.maxHp});break;
    }
    case 'enemy-remove':if(s.combat.active)throw new Error('Beende zuerst die laufende Demo-Begegnung.');s.actors=s.actors.filter(a=>a.id===0||a.id!==event.id);s.combat.turn=Math.min(s.combat.turn,s.actors.length-1);break;
    case 'initiative':if(s.combat.active)throw new Error('Initiative ist während der Begegnung gesperrt.');s.actors=s.actors.map(a=>a.id===event.id?{...a,initiative:integer(event.value,-20,99)}:a);break;
    case 'combat-start':if(s.combat.active)throw new Error('Begegnung läuft bereits.');s.actors.sort((a,b)=>b.initiative-a.initiative);s.combat={active:true,round:1,turn:0};break;
    case 'combat-next':if(!s.combat.active)throw new Error('Starte zuerst die Begegnung.');s.combat.turn=(s.combat.turn+1)%s.actors.length;if(s.combat.turn===0)s.combat.round++;break;
    case 'combat-end':s.combat.active=false;break;
    case 'hp':s.actors=s.actors.map(a=>a.id===event.id?{...a,hp:Math.max(0,Math.min(a.maxHp,a.hp+integer(event.delta,-999,999)))}:a);break;
    case 'resolve':s.chronicle.push({id:++s.serial,intent:text(event.intent,'Handlung'),text:text(event.text,'Erzählung')});break;
    default:return state;
  }
  return s;
}
export function rollDice(count,sides,modifier,rng=Math.random) {
  integer(count,1,10);integer(modifier,-20,20);
  if(![4,6,8,10,12,20,100].includes(sides))throw new Error('Ungültiger Würfel.');
  const rolls=Array.from({length:count},()=>Math.floor(rng()*sides)+1);
  return {rolls,total:rolls.reduce((sum,v)=>sum+v,modifier),sides,modifier};
}

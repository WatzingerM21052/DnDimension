import {createState, transition} from './state.mjs';
import {attachMap} from './map.mjs';
let state=createState();
let returnFocus=null;
let chroniclePosition=0;
const byId=id=>document.getElementById(id);
const chronicle=byId('chronicle');
const panels=['place','figures','preview'];
function render() {
  for(const view of document.querySelectorAll('[data-view]')) view.hidden=view.dataset.view!==state.route;
  for(const link of document.querySelectorAll('nav a')) {
    if(link.hash===`#${state.route}`) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
  }
  for(const name of panels) byId(`${name}-panel`).hidden=state.panel!==name;
  byId('figures').setAttribute('aria-expanded',String(state.panel==='figures'));
  byId('reading').setAttribute('aria-pressed',String(state.reading));
  byId('reading').textContent=state.reading?'Szenenfokus einschalten':'Lesefokus einschalten';
  document.body.classList.toggle('reading',state.reading);
  byId('draft').value=state.draft;
  byId('place-title').textContent=state.place??'';
  byId('place-text').textContent=({'Nordtor':'Ausgangspunkt der alten Handelsroute. Hier wartet Mira Venn.','Alter Steg':'Ein alter Übergang über den Fluss. Sein Zustand ist der Gruppe nicht bekannt.','Observatorium':'Ein alter Sternenturm auf den Hügeln nordöstlich der Stadt. Sein Messingdach ist von der Handelsroute aus sichtbar.','Tannwald':'Ein dichter Wald östlich der Handelsroute. Welche Wege heute noch passierbar sind, weiß die Gruppe nicht.'})[state.place]??'';
  byId('proposal').textContent=state.draft;
  for(const button of document.querySelectorAll('[data-place]')) button.setAttribute('aria-pressed',String(button.dataset.place===state.place));
}
function dispatch(event){state=transition(state,event);render();}
function navigate(initial=false){
  const previous=state.route;
  if(previous==='session') chroniclePosition=chronicle.scrollTop;
  state=transition(state,{type:'navigate',route:location.hash.slice(1)});
  if(location.hash!==`#${state.route}`) history.replaceState(null,'',`#${state.route}`);
  render();
  const view=document.querySelector(`[data-view="${state.route}"]`);
  for(const item of document.querySelectorAll('[data-view]')) item.classList.remove('enter','from-room');
  if(!initial){void view.offsetWidth;view.classList.add('enter');if(previous==='room')view.classList.add('from-room');}
  const focus=state.route==='room'&&previous!=='room'?byId(`station-${previous}`):view.querySelector('h1');
  focus?.focus({preventScroll:true});
  if(state.route==='session')chronicle.scrollTop=chroniclePosition;
  if(!initial)window.scrollTo({top:0,behavior:'instant'});
}
function openPanel(name, trigger){
  const position=chronicle.scrollTop;
  returnFocus=trigger;
  dispatch({type:'panel',panel:name});
  chronicle.scrollTop=position;
  byId(`${name}-title`).focus({preventScroll:true});
  byId(`${name}-panel`).scrollIntoView({block:'nearest',behavior:'instant'});
}
function closePanel(){
  const position=chronicle.scrollTop;
  dispatch({type:'panel',panel:null});
  chronicle.scrollTop=position;
  if(returnFocus && !returnFocus.closest('[hidden]'))returnFocus.focus({preventScroll:true});
}
window.addEventListener('hashchange',()=>navigate());
document.querySelector('.skip').addEventListener('click',event=>{
  event.preventDefault();
  const title=document.querySelector(`[data-view="${state.route}"] h1`);
  title.focus({preventScroll:true});
  title.scrollIntoView({block:'start',behavior:'instant'});
});
byId('draft').addEventListener('input',event=>{state=transition(state,{type:'draft',value:event.target.value});event.target.setCustomValidity('');});
byId('reading').addEventListener('click',()=>{const position=chronicle.scrollTop;dispatch({type:'reading',value:!state.reading});chronicle.scrollTop=position;});
byId('figures').addEventListener('click',event=>state.panel==='figures'?closePanel():openPanel('figures',event.currentTarget));
for(const button of document.querySelectorAll('[data-place]'))button.addEventListener('click',()=>{dispatch({type:'place',place:button.dataset.place});openPanel('place',button);});
for(const button of document.querySelectorAll('[data-close]'))button.addEventListener('click',closePanel);
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&state.panel){event.preventDefault();closePanel();}});
byId('action-form').addEventListener('submit',event=>{
  event.preventDefault();
  if(!state.draft.trim()){byId('draft').setCustomValidity('Beschreibe zuerst deine Handlung.');byId('draft').reportValidity();return;}
  openPanel('preview',byId('action-form').querySelector('button'));
});
const preference=matchMedia('(prefers-reduced-motion: reduce)');
byId('motion').checked=preference.matches;
function motion(){document.body.classList.toggle('reduced',byId('motion').checked||preference.matches);}
byId('motion').addEventListener('change',motion);preference.addEventListener('change',motion);motion();navigate(true);attachMap();

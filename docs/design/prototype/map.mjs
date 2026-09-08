import {moveMap} from './map-state.mjs';

export function attachMap() {
  const viewport = document.getElementById('map-viewport');
  const layer = document.getElementById('map-layer');
  const plus = document.getElementById('map-in');
  const minus = document.getElementById('map-out');
  const output = document.getElementById('map-zoom');
  let state = {x:0, y:0, zoom:1};
  let pointer = null;
  let suppressClick = false;
  function update(event) {
    state = moveMap(state, event, {width:viewport.clientWidth, height:viewport.clientHeight});
    layer.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.zoom})`;
    layer.style.setProperty('--marker-scale', 1 / state.zoom);
    const label = `${Math.round(state.zoom * 100)} %`;
    if (output.textContent !== label) output.textContent = label;
    plus.disabled = state.zoom >= 4;
    minus.disabled = state.zoom <= 1;
  }
  plus.addEventListener('click', () => update({type:'zoom', factor:1.25}));
  minus.addEventListener('click', () => update({type:'zoom', factor:0.8}));
  document.getElementById('map-reset').addEventListener('click', () => update({type:'reset'}));
  viewport.addEventListener('wheel', event => {
    // Plain scrolling must still reach the dossier and toolbar after focusing the map.
    if (!event.altKey || document.activeElement !== viewport || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    const rect = viewport.getBoundingClientRect();
    update({type:'zoom', factor:event.deltaY < 0 ? 1.12 : 1 / 1.12, anchor:{x:event.clientX - rect.left, y:event.clientY - rect.top}});
  }, {passive:false});
  viewport.addEventListener('keydown', event => {
    if (event.target !== viewport || event.ctrlKey || event.metaKey || event.altKey) return;
    const actions = {
      ArrowLeft:{type:'pan',dx:60,dy:0}, ArrowRight:{type:'pan',dx:-60,dy:0},
      ArrowUp:{type:'pan',dx:0,dy:60}, ArrowDown:{type:'pan',dx:0,dy:-60},
      '+':{type:'zoom',factor:1.25}, '=':{type:'zoom',factor:1.25},
      '-':{type:'zoom',factor:0.8}, Home:{type:'reset'}
    };
    if (actions[event.key]) {event.preventDefault();update(actions[event.key]);}
  });
  viewport.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    suppressClick = false;
    pointer = {id:event.pointerId,x:event.clientX,y:event.clientY,startX:event.clientX,startY:event.clientY,dragged:false};
    if (!event.target.closest('button')) viewport.focus({preventScroll:true});
  });
  viewport.addEventListener('pointermove', event => {
    if (!pointer || pointer.id !== event.pointerId) return;
    if (!pointer.dragged && Math.hypot(event.clientX-pointer.startX,event.clientY-pointer.startY) < 6) return;
    pointer.dragged = true;
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add('dragging');
    update({type:'pan',dx:event.clientX-pointer.x,dy:event.clientY-pointer.y});
    pointer.x = event.clientX; pointer.y = event.clientY;
  });
  function finish(event) {
    if (!pointer || (event.pointerId !== undefined && pointer.id !== event.pointerId)) return;
    suppressClick = pointer.dragged;
    const id = pointer.id;
    pointer = null;
    viewport.classList.remove('dragging');
    if (viewport.hasPointerCapture(id)) viewport.releasePointerCapture(id);
  }
  window.addEventListener('pointerup', finish);
  window.addEventListener('pointercancel', finish);
  window.addEventListener('blur', finish);
  viewport.addEventListener('lostpointercapture', finish);
  viewport.addEventListener('click', event => {
    if (suppressClick && event.detail !== 0) {event.preventDefault();event.stopPropagation();suppressClick=false;}
  }, true);
  // Keyboard focus must never disappear on an off-screen marker after panning.
  layer.addEventListener('focusin', event => {
    if (!event.target.matches('.map-marker')) return;
    const rect = event.target.getBoundingClientRect();
    const bounds = viewport.getBoundingClientRect();
    if (rect.left < bounds.left || rect.right > bounds.right || rect.top < bounds.top || rect.bottom > bounds.bottom) update({type:'reset'});
    viewport.scrollLeft = 0; viewport.scrollTop = 0;
  });
  new ResizeObserver(() => update({type:'resize'})).observe(viewport);
  update({type:'resize'});
}

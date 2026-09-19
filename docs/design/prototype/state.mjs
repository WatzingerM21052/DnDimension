export const createState = () => ({route:'room', draft:'', panel:null, reading:false, place:null});
export function transition(state, event) {
  switch (event.type) {
    case 'navigate': return {...state, route:['room','character','world','session','campaign','bestiary','inventory','journal'].includes(event.route) ? event.route : 'room', panel:null};
    case 'draft': return {...state, draft:event.value};
    case 'panel': return {...state, panel:event.panel};
    case 'reading': return {...state, reading:event.value};
    case 'place': return {...state, place:event.place};
    default: return state;
  }
}

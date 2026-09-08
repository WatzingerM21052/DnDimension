const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

export function findPlaces(places, query) {
  const term = query.trim().toLocaleLowerCase('de');
  return places.filter(name => name.toLocaleLowerCase('de').includes(term));
}

export function moveMap(state, event, {width, height}) {
  if (event.type === 'reset') return {x:0, y:0, zoom:1};
  if (!(width > 0 && height > 0)) return state;
  let {x, y, zoom} = state;
  if (event.type === 'zoom') {
    if (!Number.isFinite(event.factor) || event.factor <= 0) return state;
    const next = clamp(zoom * event.factor, 1, 4);
    const anchor = event.anchor ?? {x:width / 2, y:height / 2};
    x = anchor.x - (anchor.x - x) * next / zoom;
    y = anchor.y - (anchor.y - y) * next / zoom;
    zoom = next;
  } else if (event.type === 'focus') {
    x = width / 2 - event.point.x * width * zoom;
    y = height / 2 - event.point.y * height * zoom;
  } else if (event.type === 'pan') {
    x += event.dx;
    y += event.dy;
  }
  return {x:clamp(x, width * (1 - zoom), 0), y:clamp(y, height * (1 - zoom), 0), zoom};
}

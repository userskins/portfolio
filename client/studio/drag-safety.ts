// Native click events can fire before a motion library flushes onDragEnd.
// Track pointer travel in the capture phase so releasing a dragged object
// never opens its folder. Keyboard-generated clicks remain untouched.
let gesture: { id: number; x: number; y: number; object: Element; moved: boolean } | null = null;
let suppressed: { object: Element; until: number } | null = null;
const objectFor = (target: EventTarget | null) => target instanceof Element ? target.closest('[data-object]') : null;
document.addEventListener('pointerdown', (event) => {
  const object = objectFor(event.target);
  gesture = object ? { id: event.pointerId, x: event.clientX, y: event.clientY, object, moved: false } : null;
}, true);
document.addEventListener('pointermove', (event) => {
  if (gesture && gesture.id === event.pointerId && Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 7) gesture.moved = true;
}, { capture: true, passive: true });
document.addEventListener('pointerup', (event) => {
  if (gesture?.id !== event.pointerId) return;
  if (gesture.moved) suppressed = { object: gesture.object, until: performance.now() + 450 };
  gesture = null;
}, true);
document.addEventListener('pointercancel', () => { gesture = null; }, true);
document.addEventListener('click', (event) => {
  if (event.detail > 0 && suppressed && performance.now() < suppressed.until && objectFor(event.target) === suppressed.object) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}, true);
export {};

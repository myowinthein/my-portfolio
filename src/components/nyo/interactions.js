export const CONTROL = 'a, button, input, textarea, select, label, [role="button"], [role="tab"], [contenteditable]:not([contenteditable="false"])';

export function selectedRange() {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || !selection.rangeCount) return null;
  const range = selection.getRangeAt(0);
  const node = range.commonAncestorContainer;
  const element = node.nodeType === 1 ? node : node.parentElement;
  if (!element?.closest(".tab-panel_list, .error_page") || element.closest(CONTROL) ||
      document.activeElement?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return null;
  return range.cloneRange();
}

export function selectionSurface(range, pet) {
  if (!range?.commonAncestorContainer.isConnected || range.collapsed) return null;
  const rects = [...range.getClientRects()].filter((r) => r.width >= 20 && r.height > 0 && r.top > 80 && r.bottom < window.innerHeight - 12);
  const rect = rects.sort((a, b) => Math.hypot(a.left + window.scrollX + a.width / 2 - pet.x, a.top + window.scrollY - pet.y) -
    Math.hypot(b.left + window.scrollX + b.width / 2 - pet.x, b.top + window.scrollY - pet.y))[0];
  return rect ? { id: "selection", left: rect.left + window.scrollX, right: rect.right + window.scrollX,
    top: rect.top + window.scrollY, x: rect.left + window.scrollX + rect.width / 2, y: rect.top + window.scrollY } : null;
}

// Never let the small pet hitbox steal a link, field, or navigation click.
// `controls` is a caller-cached snapshot (see Nyo.jsx) refreshed alongside world
// measurement, not re-queried here every frame — querySelectorAll(CONTROL) over
// the whole page is the expensive part, and rects still update every call.
export function safePetHitbox(button, left, top, width, height, controls) {
  button.style.pointerEvents = "none";
  // Catch thin links crossing between the sampled points as well.
  for (const control of controls) {
    if (control === button) continue;
    for (const rect of control.getClientRects()) {
      if (rect.width > 0 && rect.height > 0 && rect.left < left + width && rect.right > left &&
          rect.top < top + height && rect.bottom > top) return false;
    }
  }
  if (!document.elementFromPoint) return true;
  return [[left + width / 2, top + height / 2], [left, top], [left + width, top],
    [left, top + height], [left + width, top + height]].every(([x, y]) =>
    !document.elementFromPoint(x, y)?.closest(CONTROL));
}

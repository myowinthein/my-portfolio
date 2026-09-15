// Measure rendered text and component borders; no invisible waypoint rails.
const TEXT_SURFACES = "h1, h2, h3, h4, h5, h6, p, li, blockquote, span, [data-nyo-text]";
const INTERACTIVE = 'a, button, input, textarea, select, label, [role="button"], [role="tab"], [contenteditable]:not([contenteditable="false"])';

export function createWorldReader() {
  const ids = new WeakMap();
  let sequence = 0;
  const idFor = (element) => {
    if (!ids.has(element)) ids.set(element, `surface-${sequence++}`);
    return ids.get(element);
  };
  return () => {
    const width = document.documentElement.clientWidth;
    const height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
    const platforms = [];
    const walls = [];
    const add = (rect, id, solid = false) => {
      const left = Math.max(24, rect.left + window.scrollX);
      const right = Math.min(width - 105, rect.right + window.scrollX);
      const top = rect.top + window.scrollY;
      if (right - left < 38 || top < 95 || rect.height < 1) return;
      if (platforms.some((p) => Math.abs(p.top - top) < 5 && p.left <= left && p.right >= right)) return;
      platforms.push({ id, left, right, top });
      if (solid && rect.height >= 35) walls.push({ id, left, right, top, bottom: rect.bottom + window.scrollY });
    };
    const root = document.querySelector(".tab-panel_list, .error_page");
    if (root) {
      root.querySelectorAll(".home .bg, .project-item .tab-content, .post-thumb, .button, .credential-item, .box-stats, .edu-list, [data-nyo-solid]").forEach((element) => {
        if (!element.getClientRects().length) return;
        add(element.getBoundingClientRect(), idFor(element), true);
      });
      root.querySelectorAll("[data-nyo-platform]").forEach((element) => {
        if (element.getClientRects().length) add(element.getBoundingClientRect(), idFor(element));
      });
      root.querySelectorAll(TEXT_SURFACES).forEach((element) => {
        if (!element.getClientRects().length || element.closest(".project-item, .post-container") || element.closest(INTERACTIVE)) return;
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        let node;
        let line = 0;
        while ((node = walker.nextNode())) {
          if (!node.textContent.trim() || node.parentElement?.closest(INTERACTIVE)) continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          for (const rect of range.getClientRects()) add(rect, `${idFor(element)}-line-${line++}`);
        }
      });
    }
    // Stored in document coordinates, but always attached to the window bottom.
    platforms.push({ id: "floor", left: 24, right: width - 24, top: window.scrollY + window.innerHeight - 12 });
    platforms.sort((a, b) => a.top - b.top);
    // The ceiling blocks the head; it is not a landing/walking platform.
    return { platforms, walls, width, height, ceiling: window.scrollY + 4 };
  };
}

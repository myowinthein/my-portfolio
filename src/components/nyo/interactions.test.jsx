import { afterEach, describe, expect, it, vi } from "vitest";
import { safePetHitbox, selectedRange, selectionSurface } from "./interactions";

afterEach(() => {
  window.getSelection().removeAllRanges();
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function select(tag = "p", attributes = {}) {
  const root = document.createElement("main"); root.className = "tab-panel_list";
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([k, v]) => element.setAttribute(k, v));
  element.textContent = "A readable project description";
  root.appendChild(element); document.body.appendChild(root);
  const range = document.createRange(); range.selectNodeContents(element);
  const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
  return { range, element, selection };
}

describe("Nyo visitor interaction boundaries", () => {
  it("copies selection geometry without modifying or clearing the user's selection", () => {
    const { range, selection } = select();
    const copy = selectedRange();
    expect(copy).not.toBe(range);
    expect(copy.startContainer).toBe(range.startContainer);
    expect(selection.getRangeAt(0)).toBe(range);
    expect(selection.toString()).toBe("A readable project description");
  });
  it.each([["textarea", {}], ["p", { contenteditable: "true" }], ["a", { href: "/" }]])(
    "ignores selections in %s controls", (tag, attributes) => {
      select(tag, attributes);
      expect(selectedRange()).toBeNull();
    }
  );
  it("does not inspect a selection while a form input has focus", () => {
    select();
    const input = document.createElement("input"); document.body.appendChild(input); input.focus();
    expect(selectedRange()).toBeNull();
  });
  it("selects the nearest visible line and rejects detached content", () => {
    const { range, element } = select();
    range.getClientRects = () => [
      { left: 100, right: 300, top: 200, bottom: 220, width: 200, height: 20 },
      { left: 100, right: 200, top: 240, bottom: 260, width: 100, height: 20 },
    ];
    expect(selectionSurface(range, { x: 150, y: 270 })).toMatchObject({ id: "selection", x: 150, y: 240 });
    element.remove();
    expect(selectionSurface(range, { x: 150, y: 270 })).toBeNull();
  });
  it("keeps the pet hitbox click-through when a link or field is underneath", () => {
    const button = document.createElement("button");
    const link = document.createElement("a"); link.href = "/";
    const hitTest = vi.fn(() => link);
    vi.stubGlobal("document", document);
    Object.defineProperty(document, "elementFromPoint", { configurable: true, value: hitTest });
    expect(safePetHitbox(button, 10, 20, 40, 60, [])).toBe(false);
    expect(button.style.pointerEvents).toBe("none");
    hitTest.mockReturnValue(document.createElement("p"));
    expect(safePetHitbox(button, 10, 20, 40, 60, [])).toBe(true);
    delete document.elementFromPoint;
  });
  it("does not intercept a thin link crossing between the hit-test samples", () => {
    const button = document.createElement("button");
    const link = document.createElement("a"); link.href = "/";
    link.getClientRects = () => [{ left: 10, right: 50, top: 28, bottom: 32, width: 40, height: 4 }];
    document.body.appendChild(link);
    expect(safePetHitbox(button, 10, 20, 40, 60, [link])).toBe(false);
  });
});

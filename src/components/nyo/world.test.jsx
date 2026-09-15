import { afterEach, describe, expect, it, vi } from "vitest";
import { createWorldReader } from "./world";

const rect = (left, top, width, height) => ({ left, top, right: left + width, bottom: top + height, width, height });
function surface(parent, tag, attributes, bounds) {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  element.getBoundingClientRect = () => bounds;
  element.getClientRects = () => bounds ? [bounds] : [];
  parent.appendChild(element);
  return element;
}
function setup() {
  vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(1000);
  const root = document.createElement("main");
  root.className = "tab-panel_list";
  document.body.appendChild(root);
  return root;
}
afterEach(() => { document.body.replaceChildren(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("Nyo rendered surfaces", () => {
  it("pins the floor to the window bottom at every scroll position and height", () => {
    setup();
    vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(3000);
    vi.stubGlobal("innerHeight", 720);
    const read = createWorldReader();
    for (const scrollY of [0, 900, 2280]) {
      vi.stubGlobal("scrollY", scrollY);
      expect(read().platforms.find((p) => p.id === "floor").top - scrollY).toBe(708);
      expect(read().ceiling - scrollY).toBe(4);
      expect(read().platforms.some((p) => p.id === "ceiling")).toBe(false);
    }
    vi.stubGlobal("innerHeight", 600);
    expect(read().platforms.find((p) => p.id === "floor").top - window.scrollY).toBe(588);
  });
  it("distinguishes walkable tops from climbable components and skips hidden ones", () => {
    const root = setup();
    surface(root, "div", { "data-nyo-platform": "" }, rect(100, 200, 250, 40));
    surface(root, "div", { "data-nyo-solid": "" }, rect(400, 300, 250, 180));
    surface(root, "div", { "data-nyo-solid": "" }, null);
    const world = createWorldReader()();
    expect(world.platforms).toHaveLength(3);
    expect(world.walls).toHaveLength(1);
    expect(world.walls[0]).toMatchObject({ left: 400, right: 650, top: 300, bottom: 480 });
  });
  it("allows explicitly marked category tabs to be landing surfaces", () => {
    const root = setup();
    const category = surface(root, "li", { role: "tab", "data-nyo-platform": "" }, rect(100, 200, 120, 28));
    category.textContent = "Education";
    const ordinaryTab = surface(root, "li", { role: "tab" }, rect(260, 200, 180, 28));
    ordinaryTab.textContent = "Main navigation";
    const platforms = createWorldReader()().platforms.filter((platform) => platform.id !== "floor");
    expect(platforms).toHaveLength(1);
    expect(platforms[0]).toMatchObject({ left: 100, right: 220, top: 200 });
  });
  it("keeps stable surface IDs and document positions after scrolling", () => {
    const root = setup();
    const bounds = rect(100, 300, 250, 80);
    surface(root, "div", { "data-nyo-solid": "" }, bounds);
    const read = createWorldReader();
    const before = read().platforms[0];
    vi.stubGlobal("scrollY", 100);
    bounds.top -= 100;
    bounds.bottom -= 100;
    expect(read().platforms[0]).toEqual(before);
    root.replaceChildren();
    expect(read().platforms.map((p) => p.id)).toEqual(["floor"]);
  });
  it("measures wrapped text lines separately instead of using the paragraph box", () => {
    const root = setup();
    const paragraph = surface(root, "p", {}, rect(100, 200, 300, 70));
    paragraph.textContent = "A paragraph that wraps onto a second line.";
    vi.spyOn(document, "createRange").mockReturnValue({
      selectNodeContents: vi.fn(),
      getClientRects: () => [rect(100, 200, 300, 20), rect(100, 235, 150, 20)],
    });
    const world = createWorldReader()();
    expect(world.platforms.slice(0, 2)).toMatchObject([
      { left: 100, right: 400, top: 200 }, { left: 100, right: 250, top: 235 },
    ]);
    expect(world.walls).toHaveLength(0);
  });
  it("makes secondary headings, list text, and spans walkable while ignoring controls", () => {
    const root = setup();
    const heading = surface(root, "h5", {}, rect(100, 200, 180, 20)); heading.textContent = "Technical Lead";
    const item = surface(root, "li", {}, rect(320, 260, 180, 20)); item.textContent = "System architecture";
    const label = surface(root, "span", {}, rect(540, 320, 160, 20)); label.textContent = "Remote work";
    const link = surface(root, "a", { href: "/resume" }, rect(100, 380, 180, 20));
    const linkedText = document.createElement("span"); linkedText.textContent = "View resume"; link.appendChild(linkedText);
    let selected;
    vi.spyOn(document, "createRange").mockImplementation(() => ({
      selectNodeContents: (node) => { selected = node; },
      getClientRects: () => [selected.parentElement.getBoundingClientRect()],
    }));
    const platforms = createWorldReader()().platforms.filter((platform) => platform.id !== "floor");
    expect(platforms).toHaveLength(3);
    expect(platforms.map((platform) => platform.top)).toEqual([200, 260, 320]);
  });
});

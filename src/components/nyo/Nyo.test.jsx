import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Nyo from "./Nyo";

let images;
let media;
let pendingFrame;

beforeEach(() => {
  localStorage.clear();
  images = [];
  media = { desktop: true, reduced: false };
  pendingFrame = null;
  vi.useFakeTimers();
  vi.stubGlobal("matchMedia", (query) => ({
    matches: query.includes("reduced-motion") ? media.reduced : media.desktop,
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
  }));
  vi.stubGlobal("Image", class { constructor() { images.push(this); } });
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  vi.stubGlobal("requestAnimationFrame", vi.fn((callback) => { pendingFrame = callback; return 1; }));
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

function loadSprite() {
  act(() => { images[0].onload(); });
}

describe("Nyo always-on visibility", () => {
  it("waits for selection dragging to finish before considering a visit", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.1);
    vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(1000);
    render(<Nyo sceneKey={0} />);
    loadSprite();
    const now = performance.now();
    for (let i = 0; i < 100; i++) act(() => { pendingFrame(now + i * 16); });
    const root = document.createElement("main"); root.className = "tab-panel_list";
    const paragraph = document.createElement("p"); paragraph.textContent = "Selected project description";
    root.appendChild(paragraph); document.body.appendChild(root);
    const range = document.createRange(); range.selectNodeContents(paragraph);
    range.getClientRects = () => [{ left: 100, right: 280, top: 650, bottom: 670, width: 180, height: 20 }];
    range.cloneRange = () => range;
    vi.spyOn(window, "getSelection").mockReturnValue({ isCollapsed: false, rangeCount: 1, getRangeAt: () => range });
    fireEvent.pointerDown(paragraph);
    fireEvent(document, new Event("selectionchange"));
    act(() => { vi.advanceTimersByTime(500); pendingFrame(now + 1616); });
    expect(document.querySelector(".nyo-sprite").dataset.intention).not.toBe("selection");
    fireEvent.pointerUp(paragraph);
    act(() => { vi.advanceTimersByTime(350); pendingFrame(now + 1632); });
    expect(document.querySelector(".nyo-sprite").dataset.intention).toBe("selection");
    root.remove();
  });
  it("shows an emoji when petted without bringing back visibility controls", () => {
    render(<Nyo sceneKey={0} />);
    loadSprite();
    act(() => { pendingFrame(performance.now()); });
    fireEvent.click(screen.getByRole("button", { name: "Pet Nyo" }));
    act(() => { pendingFrame(performance.now() + 16); });
    expect(document.querySelector(".nyo-reaction").textContent).toMatch(/♥|✨|👋/);
    expect(document.querySelector(".nyo-sprite")).toHaveStyle({ opacity: "1" });
  });
  it("shows a startled reaction when the light/dark theme switches", () => {
    render(<Nyo sceneKey={0} />);
    loadSprite();
    act(() => { pendingFrame(performance.now()); });
    act(() => { window.dispatchEvent(new Event("theme-change")); pendingFrame(performance.now() + 16); });
    expect(document.querySelector(".nyo-reaction").textContent).toBe("😮");
  });
  it.each([0, 900, 2232])("lands on the window floor instead of respawning at scroll position %s", (scrollY) => {
    vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(1000);
    vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(3000);
    vi.stubGlobal("scrollY", scrollY);
    render(<Nyo sceneKey={0} />);
    loadSprite();
    const now = performance.now();
    for (let i = 0; i < 160; i++) act(() => { pendingFrame(now + i * 16); });
    const sprite = document.querySelector(".nyo-sprite");
    expect(sprite.dataset.surface).toBe("floor");
    expect(Number(sprite.dataset.feet) - scrollY).toBe(window.innerHeight - 12);
    expect(sprite.dataset.animation).toBe("walk");
    expect(Number(sprite.dataset.artScale)).toBeCloseTo(1.05, 2);
    vi.stubGlobal("scrollY", scrollY + 100);
    act(() => { window.dispatchEvent(new Event("scroll")); pendingFrame(now + 160 * 16); });
    expect(sprite.dataset.surface).toBe("floor");
    expect(Number(sprite.dataset.feet) - window.scrollY).toBe(window.innerHeight - 12);
  });
  it("requests the core artwork immediately and appears on the first animation frame", () => {
    render(<Nyo sceneKey={0} />);
    expect(images[0].src).toBe("/assets/nyo/spritesheet-core.webp");
    loadSprite();
    act(() => { pendingFrame(performance.now()); });
    expect(document.querySelector(".nyo-sprite")).toHaveStyle({ opacity: "1" });
  });

  it("requests the extra artwork only after the core atlas is ready", () => {
    render(<Nyo sceneKey={0} />);
    expect(images).toHaveLength(1);
    loadSprite();
    expect(images.slice(1).map((image) => image.src)).toEqual(["/assets/nyo/spritesheet-extra.webp"]);
  });

  it("retries failed artwork with backoff and renders the successful retry URL", () => {
    render(<Nyo sceneKey={0} />);
    act(() => { images[0].onerror(); vi.advanceTimersByTime(1000); });
    expect(images).toHaveLength(2);
    act(() => { images[1].onerror(); vi.advanceTimersByTime(1999); });
    expect(images).toHaveLength(2);
    act(() => { vi.advanceTimersByTime(1); images[2].onload(); });
    expect(document.querySelector(".nyo-sprite").style.backgroundImage).toContain("?retry=2");
  });

  it("cancels retries on unmount", () => {
    const view = render(<Nyo sceneKey={0} />);
    act(() => { images[0].onerror(); });
    view.unmount();
    act(() => { vi.advanceTimersByTime(60000); window.dispatchEvent(new Event("online")); });
    expect(images).toHaveLength(1);
  });

  it("stays visible without restarting its controller when sections change", () => {
    const view = render(<Nyo sceneKey={0} />);
    loadSprite();
    act(() => { pendingFrame(performance.now()); });
    const sprite = document.querySelector(".nyo-sprite");
    const position = sprite.style.transform;
    view.rerender(<Nyo sceneKey={1} />);
    expect(sprite).toHaveStyle({ opacity: "1", transform: position });
    expect(cancelAnimationFrame).not.toHaveBeenCalled();
    act(() => { pendingFrame(performance.now() + 16); });
    expect(sprite).toHaveStyle({ opacity: "1" });
  });

  it.each(["input", "textarea", "select"])("stays visible while a %s is focused", (tag) => {
    render(<Nyo sceneKey={0} />);
    loadSprite();
    const input = document.createElement(tag);
    document.body.appendChild(input);
    input.focus();
    act(() => { pendingFrame(performance.now()); });
    expect(document.querySelector(".nyo-sprite")).toHaveStyle({ opacity: "1" });
    input.remove();
  });

  it("returns inside the viewport on the first frame after a large scroll", () => {
    render(<Nyo sceneKey={0} />);
    loadSprite();
    act(() => { pendingFrame(performance.now()); });
    vi.stubGlobal("scrollY", 1500);
    act(() => { window.dispatchEvent(new Event("scroll")); pendingFrame(performance.now() + 16); });
    const feet = Number(document.querySelector(".nyo-sprite").dataset.feet);
    expect(feet).toBeGreaterThan(1500);
    expect(feet).toBeLessThan(1500 + window.innerHeight);
  });
  it("loads and displays on mobile without a visibility toggle", () => {
    media.desktop = false;
    render(<Nyo sceneKey={0} />);
    loadSprite();
    act(() => { pendingFrame(performance.now() + 2000); });
    expect(document.querySelector(".nyo-sprite")).toHaveStyle({ opacity: "1" });
    expect(screen.queryByRole("button", { name: /Show Nyo|Hide Nyo/ })).not.toBeInTheDocument();
  });

  it("ignores an old hidden preference and cleans up on unmount", () => {
    localStorage.setItem("portfolio-nyo-visible", "false");
    const view = render(<Nyo sceneKey={0} />);
    loadSprite();
    expect(document.querySelector(".nyo-sprite")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Show Nyo|Hide Nyo/ })).not.toBeInTheDocument();
    view.unmount();
    expect(document.querySelector(".nyo-sprite")).not.toBeInTheDocument();
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });

  it("keeps the pet stationary when reduced motion is requested", () => {
    media.reduced = true;
    render(<Nyo sceneKey={0} />);
    loadSprite();
    act(() => { pendingFrame(performance.now() + 2000); });
    const sprite = document.querySelector(".nyo-sprite");
    const position = sprite.style.transform;
    act(() => { pendingFrame(performance.now() + 12000); });
    expect(sprite.style.transform).toBe(position);
    expect(sprite.style.backgroundPosition).toBe("0px 0px");
  });

  it("keeps the pet in place behind a dialog without changing his behavior", () => {
    media.reduced = true;
    render(<Nyo sceneKey={0} />);
    loadSprite();
    act(() => { pendingFrame(performance.now() + 2000); });
    const sprite = document.querySelector(".nyo-sprite");
    const reaction = document.querySelector(".nyo-reaction");
    const hitbox = screen.getByRole("button", { name: "Pet Nyo" });
    const position = sprite.style.transform;
    const animation = sprite.dataset.animation;
    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    dialog.getClientRects = () => [{ left: 0, top: 0, width: 1000, height: 768 }];
    document.body.appendChild(dialog);
    act(() => { pendingFrame(performance.now() + 3000); });
    expect(sprite).toHaveStyle({ opacity: "1", zIndex: "98" });
    expect(sprite.style.transform).toBe(position);
    expect(sprite.dataset.animation).toBe(animation);
    expect(sprite.dataset.behindDialog).toBe("true");
    expect(reaction).toHaveStyle({ zIndex: "98" });
    expect(hitbox).toHaveStyle({ zIndex: "98", pointerEvents: "none" });
    expect(hitbox).toHaveAttribute("tabindex", "-1");
    dialog.remove();
    act(() => { pendingFrame(performance.now() + 3016); });
    expect(sprite.dataset.behindDialog).toBe("false");
    expect(sprite.style.zIndex).toBe("");
    expect(reaction.style.zIndex).toBe("");
    expect(hitbox.style.zIndex).toBe("");
  });
});

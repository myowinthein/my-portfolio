import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createPet, footOffset, gazeCell, NYO_HEIGHT, NYO_WIDTH, petCell, stepPet } from "../../../utils/nyo";
import { createWorldReader } from "./world";
import { petReaction, requestInterest } from "../../../utils/nyo-behavior";
import { CONTROL, safePetHitbox, selectedRange, selectionSurface } from "./interactions";

const ASSET = "/assets/nyo/spritesheet.webp";
const SLEEP_ASSETS = Array.from({ length: 6 }, (_, frame) => `/assets/nyo/sleep/${String(frame).padStart(2, "0")}.png`);
const CLIMB_ASSETS = Array.from({ length: 6 }, (_, frame) => `/assets/nyo/climb/${String(frame).padStart(2, "0")}.png?v=2`);
const CUSTOM_ASSETS = [...SLEEP_ASSETS, ...CLIMB_ASSETS];
const SLEEP_FOOT_OFFSET = 72;
const SIDE_ART_SCALE = 1.05;
const CLIMB_ART_SCALE = 1.06;
const customSource = (cell) => cell.asset === "sleep" ? SLEEP_ASSETS[cell.frame] : cell.asset === "climb" ? CLIMB_ASSETS[cell.frame] : null;
export default function Nyo({ sceneKey, lost = false }) {
  const [loaded, setLoaded] = useState(null);
  const spriteRef = useRef(null);
  const reactionRef = useRef(null);
  const hitboxRef = useRef(null);
  const reactRef = useRef(() => {});
  const readyAssetsRef = useRef(new Set());
  const preloadImagesRef = useRef([]);
  const sceneRef = useRef(sceneKey);
  useEffect(() => { sceneRef.current = sceneKey; }, [sceneKey]);

  useEffect(() => {
    let image;
    let timer;
    let attempts = 0;
    let complete = false;
    let disposed = false;
    const readyAssets = readyAssetsRef.current;
    const load = () => {
      if (complete) return;
      window.clearTimeout(timer);
      if (image) { image.onload = null; image.onerror = null; }
      image = new window.Image();
      const url = attempts ? `${ASSET}?retry=${attempts}` : ASSET;
      image.onload = () => {
        complete = true;
        setLoaded(url);
        // Retain and decode custom frames before the renderer switches to them.
        // This avoids blank first-cycle flashes while keeping initial display fast.
        preloadImagesRef.current = CUSTOM_ASSETS.map((source) => {
          const frame = new window.Image();
          frame.onload = () => {
            const decoded = typeof frame.decode === "function" ? frame.decode() : Promise.resolve();
            Promise.resolve(decoded).catch(() => {}).finally(() => { if (!disposed) readyAssets.add(source); });
          };
          frame.src = source;
          return frame;
        });
      };
      image.onerror = () => {
        attempts += 1;
        timer = window.setTimeout(load, Math.min(1000 * 2 ** Math.min(attempts - 1, 5), 30000));
      };
      image.src = url;
    };
    load();
    window.addEventListener("online", load);
    return () => {
      disposed = true;
      complete = true;
      window.clearTimeout(timer);
      image.onload = null;
      image.onerror = null;
      preloadImagesRef.current.forEach((frame) => { frame.onload = null; frame.onerror = null; });
      preloadImagesRef.current = [];
      readyAssets.clear();
      window.removeEventListener("online", load);
    };
  }, []);

  useEffect(() => {
    const sprite = spriteRef.current;
    if (!loaded || !sprite) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    const readWorld = createWorldReader();
    let world = null;
    let controls = [];
    let pet = null;
    let frameId = null;
    let lastTime = null;
    let lastMeasure = -Infinity;
    let currentScene = sceneRef.current;
    let pointer = null;
    let dirty = true;
    let lastCell = "";
    let selection = null;
    let selectionExpires = 0;
    let selectionTimer;
    let dragging = false;
    let nextLook = 0;
    let lookUntil = 0;
    let wasQuiet = false;
    let currentDialog = null;
    let displayArtScale = 1;
    const bubble = reactionRef.current;
    const hitbox = hitboxRef.current;
    const measure = () => { dirty = true; };
    const reset = () => { measure(); pet = null; };
    const viewport = () => ({ top: window.scrollY, bottom: window.scrollY + window.innerHeight });
    const tick = (now) => {
      frameId = null;
      if (document.hidden) { lastTime = null; return; }
      const dt = lastTime === null ? 0 : Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const roaming = desktop.matches && !reducedMotion.matches;
      const quiet = dragging || Boolean(document.activeElement?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])'));
      const dialog = [...document.querySelectorAll('[role="dialog"], .custom-overlay')].find((element) => {
        const style = getComputedStyle(element);
        return element.getClientRects().length && style.display !== "none" && style.visibility !== "hidden";
      });
      currentDialog = dialog;
      if (currentScene !== sceneRef.current) {
        currentScene = sceneRef.current;
        dirty = true;
        // Keep his position across sections; let gravity find the new surfaces.
        selection = null;
        if (pet) Object.assign(pet, { ground: null, wall: null, target: null, intent: null, mode: "fall", time: 0, vx: 0, vy: 0 });
      }
      if (dirty || now - lastMeasure > 500) {
        world = readWorld();
        const view = viewport();
        world.platforms = world.platforms.filter((p) => p.id === "floor" || (p.top >= view.top + 95 && p.top < view.bottom - 12));
        world.walls = world.walls.filter((w) => world.platforms.some((p) => p.id === w.id));
        // Re-querying the control list is the expensive part of safePetHitbox;
        // only do it when the world itself is re-measured, not on every frame.
        controls = [...document.querySelectorAll(CONTROL)];
        lastMeasure = now;
        dirty = false;
      }
      if (!pet) pet = createPet(world, viewport());
      // Only geometry is retained; selected text is never read or transmitted.
      world.platforms = world.platforms.filter((p) => p.id !== "selection");
      const selected = selectionSurface(selection, pet);
      if (selected && pet.clock < selectionExpires) {
        world.platforms.push(selected);
        if (pet.intent?.kind === "selection") Object.assign(pet.intent, { x: selected.x, y: selected.y });
      } else if (pet.intent?.kind === "selection") { pet.intent = null; pet.target = null; }
      if (quiet && !wasQuiet && pet.intent?.kind === "chase") { pet.intent = null; pet.target = null; }
      wasQuiet = quiet;
      let cell;
      let x;
      let y;
      let scaleX = 1;
      let scaleY = 1;
      if (roaming) {
        if (document.activeElement !== hitbox || !hitbox.matches(":focus-visible")) stepPet(pet, world, dt);
        else pet.clock += dt;
        const view = viewport();
        const outside = !Number.isFinite(pet.x) || !Number.isFinite(pet.y) ||
          pet.y < view.top - NYO_HEIGHT * 2 || pet.y > view.bottom + NYO_HEIGHT * 2;
        // Recovery only: ceiling/floor contacts are handled by physics, not respawning.
        if (outside) {
          const memory = { energy: pet.energy, clock: pet.clock, visited: pet.visited, failed: pet.failed,
            selectionAfter: pet.selectionAfter, chaseAfter: pet.chaseAfter, reactionAfter: pet.reactionAfter };
          pet = { ...createPet(world, view), ...memory };
        }
        cell = petCell(pet);
        if (lost && ["idle", "proud"].includes(pet.mode)) cell = petCell({ ...pet, mode: "wait" });
        if (["idle", "sit", "wait"].includes(pet.mode) && pointer && now < lookUntil && !quiet) {
          const dx = pointer.x + window.scrollX - pet.x;
          const dy = pointer.y + window.scrollY - (pet.y - 55);
          if (Math.hypot(dx, dy) < 450) cell = gazeCell(dx, dy);
        }
        if (pet.mode === "prepare") { scaleX = 1.05; scaleY = 0.92; }
        if (pet.mode === "land") {
          const squash = Math.sin(Math.min(1, pet.time / 0.18) * Math.PI);
          scaleX = 1 + squash * 0.1; scaleY = 1 - squash * 0.12;
        }
        if (pet.mode === "climb" || pet.mode === "hang") scaleX = pet.direction;
        if (["sit", "sleepy"].includes(pet.mode)) scaleY = 0.9;
        x = pet.x - window.scrollX - NYO_WIDTH / 2;
        y = pet.y - window.scrollY - (cell.asset === "sleep" ? SLEEP_FOOT_OFFSET : footOffset(cell.row, cell.frame));
      } else {
        pet.mode = "idle";
        pet.time += dt;
        pet.clock += dt;
        cell = reducedMotion.matches ? { row: 0, frame: 0 } : petCell(pet);
        x = desktop.matches ? 16 : 128;
        y = Math.max(16, window.innerHeight - (desktop.matches ? NYO_HEIGHT + 70 : 180));
      }
      const scale = desktop.matches ? 1 : 0.65;
      // Side poses contain less painted area than front-facing poses. A small,
      // uniform correction preserves proportions, and easing avoids a scale pop
      // when the animation changes between front and side views.
      const targetArtScale = cell.asset === "climb" ? CLIMB_ART_SCALE :
        cell.row === 1 || cell.row === 2 ? SIDE_ART_SCALE : 1;
      const scaleBlend = dt === 0 ? 1 : 1 - Math.exp(-dt * 16);
      displayArtScale += (targetArtScale - displayArtScale) * scaleBlend;
      if (Math.abs(targetArtScale - displayArtScale) < 0.0005) displayArtScale = targetArtScale;
      const sole = cell.asset === "sleep" ? SLEEP_FOOT_OFFSET : footOffset(cell.row, cell.frame);
      sprite.style.transformOrigin = `42px ${sole}px`;
      sprite.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale * displayArtScale * scaleX}, ${scale * displayArtScale * scaleY})`;
      const source = customSource(cell);
      const customReady = !source || readyAssetsRef.current.has(source);
      const key = `${cell.asset ?? "atlas"}:${cell.row}:${cell.frame}`;
      if (customReady && key !== lastCell) {
        if (source) {
          sprite.style.backgroundImage = `url("${source}")`;
          sprite.style.backgroundSize = `${NYO_WIDTH}px ${NYO_HEIGHT}px`;
          sprite.style.backgroundPosition = "0px 0px";
        } else {
          sprite.style.backgroundImage = `url("${loaded}")`;
          sprite.style.backgroundSize = `${NYO_WIDTH * 8}px ${NYO_HEIGHT * 11}px`;
          sprite.style.backgroundPosition = `${-cell.frame * NYO_WIDTH}px ${-cell.row * NYO_HEIGHT}px`;
        }
        lastCell = key;
      }
      sprite.dataset.art = customReady ? cell.asset ?? "atlas" : "atlas";
      sprite.dataset.animation = pet.mode;
      sprite.dataset.behindDialog = String(Boolean(dialog));
      sprite.dataset.grounded = String(Boolean(pet.ground));
      sprite.dataset.surface = pet.ground ?? pet.wall ?? "";
      sprite.dataset.feet = pet.y.toFixed(2);
      sprite.dataset.energy = pet.energy.toFixed(1);
      sprite.dataset.intention = pet.intent?.kind ?? "";
      sprite.dataset.artScale = displayArtScale.toFixed(3);
      // The popup overlay uses z-index 99. Keep Nyo in his normal world and
      // temporarily render every one of his layers beneath that overlay.
      const backgroundLayer = dialog ? "98" : "";
      sprite.style.zIndex = backgroundLayer;
      bubble.style.zIndex = backgroundLayer;
      hitbox.style.zIndex = backgroundLayer;
      sprite.style.opacity = "1";
      const bounds = sprite.getBoundingClientRect();
      const emoji = pet.emoteUntil > pet.clock ? pet.emote : pet.mode === "sleep" ? "Zzz" : "";
      bubble.textContent = emoji;
      bubble.style.opacity = emoji ? "1" : "0";
      bubble.style.transform = `translate3d(${Math.max(8, Math.min(window.innerWidth - 52, bounds.left + bounds.width / 2 - 20))}px, ${Math.max(8, bounds.top - 32)}px, 0)`;
      const hitLeft = bounds.left + bounds.width * 0.25;
      const hitTop = bounds.top + bounds.height * 0.2;
      const hitWidth = bounds.width * 0.5;
      const hitHeight = bounds.height * 0.75;
      hitbox.style.transform = `translate3d(${hitLeft}px, ${hitTop}px, 0)`;
      hitbox.style.width = `${hitWidth}px`; hitbox.style.height = `${hitHeight}px`;
      const safe = !dragging && !dialog && safePetHitbox(hitbox, hitLeft, hitTop, hitWidth, hitHeight, controls);
      hitbox.style.pointerEvents = safe ? "auto" : "none";
      hitbox.tabIndex = safe ? 0 : -1;
      frameId = requestAnimationFrame(tick);
    };
    reactRef.current = () => { if (pet) petReaction(pet); };
    const onPointer = (event) => {
      const now = performance.now();
      pointer = { x: event.clientX, y: event.clientY, time: now };
      if (!pet || !desktop.matches || reducedMotion.matches || dragging || wasQuiet || currentDialog || event.target?.closest?.(CONTROL)) return;
      const point = { x: pointer.x + window.scrollX, y: pointer.y + window.scrollY };
      if (Math.hypot(point.x - pet.x, point.y - (pet.y - 45)) > 220) return;
      if (now > nextLook) {
        nextLook = now + 4000;
        if (Math.random() < 0.65) lookUntil = now + 1800;
      }
      if (pet.intent?.kind === "chase") {
        pet.intent.x = point.x;
        const support = world?.platforms.find((p) => p.id === pet.ground);
        if (support && pet.target?.kind === "walk") {
          pet.target.launchX = Math.max(support.left + 8, Math.min(support.right - 8, point.x));
          pet.direction = pet.target.launchX >= pet.x ? 1 : -1;
        }
        return;
      }
      requestInterest(pet, point, "chase");
    };
    const onSelection = () => {
      window.clearTimeout(selectionTimer);
      selectionTimer = window.setTimeout(() => {
        if (dragging || currentDialog || !pet || !desktop.matches || reducedMotion.matches) return;
        const range = selectedRange();
        const point = selectionSurface(range, pet);
        if (selection && (!range || range.compareBoundaryPoints(0, selection) !== 0 || range.compareBoundaryPoints(2, selection) !== 0)) {
          selection = null;
          if (pet.intent?.kind === "selection") { pet.intent = null; pet.target = null; }
        }
        if (point && requestInterest(pet, point, "selection")) {
          selection = range; selectionExpires = pet.clock + 24; measure();
        }
      }, 350);
    };
    const onDown = (event) => { dragging = event.target !== hitbox; };
    const onUp = () => { dragging = false; onSelection(); };
    const onVisibility = () => {
      dragging = false;
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = null;
      lastTime = null;
      if (!document.hidden) { measure(); frameId = requestAnimationFrame(tick); }
    };
    const onBlur = () => { dragging = false; };
    const observer = new MutationObserver(measure);
    const content = document.querySelector(".tab-panel_list, .error_page");
    if (content) observer.observe(content, { childList: true, subtree: true });
    const resizeObserver = new ResizeObserver(measure);
    if (content) resizeObserver.observe(content);
    window.addEventListener("resize", measure);
    // Scroll fires far more often than animation frames during a fling; rate-limit
    // it so it can't defeat readWorld()'s own ~500ms throttle in tick().
    let scrollDirtyAt = 0;
    const onScroll = () => {
      const now = performance.now();
      if (now - scrollDirtyAt > 150) { scrollDirtyAt = now; measure(); }
    };
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    window.addEventListener("blur", onBlur);
    document.addEventListener("selectionchange", onSelection);
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", reset);
    desktop.addEventListener("change", reset);
    frameId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("selectionchange", onSelection);
      window.clearTimeout(selectionTimer);
      reactRef.current = () => {};
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", reset);
      desktop.removeEventListener("change", reset);
    };
  }, [loaded, lost]);

  if (!loaded) return null;
  return createPortal(
    <>
      <div ref={spriteRef} className="nyo-sprite" style={{ backgroundImage: `url("${loaded}")` }} aria-hidden="true" />
      <span ref={reactionRef} className="nyo-reaction" aria-hidden="true" />
      <button ref={hitboxRef} className="nyo-hitbox" type="button" aria-label="Pet Nyo" onClick={() => reactRef.current()} />
    </>, document.body
  );
}

import { describe, expect, it } from "vitest";
import { createPet, jumpVelocity, stepPet } from "./nyo";
import { chooseDestination, petReaction, requestInterest, routeTo, startleFromTheme } from "./nyo-behavior";

const floor = { id: "floor", top: 700, left: 24, right: 976 };
const world = { width: 1000, height: 720, platforms: [floor], walls: [] };
function pet(extra = {}) {
  return { ...createPet(world, { top: 0, bottom: 720 }, () => 0.9), x: 150, y: 700,
    ground: "floor", mode: "idle", wait: 0, ...extra };
}
function run(p, w, seconds, random = () => 0.9) {
  for (let i = 0; i < seconds * 120; i++) stepPet(p, w, 1 / 120, random);
}

describe("Nyo intentions and personality", () => {
  it("cross-jumps onto a reachable ledge instead of launching vertically", () => {
    const ledge = { id: "ledge", left: 100, right: 300, top: 620 };
    const scene = { ...world, platforms: [ledge, floor] };
    const p = pet();
    const route = routeTo(p, scene, ledge, jumpVelocity);
    expect(route).toMatchObject({ id: "ledge", kind: "jump" });
    expect(Math.abs(route.x - route.launchX)).toBeGreaterThanOrEqual(28);
    Object.assign(p, { mode: "walk", target: route, direction: route.launchX >= p.x ? 1 : -1 });
    run(p, scene, 1.5);
    expect(p.visited).toContain("ledge");
  });
  it("uses intermediate ledges when a higher destination is out of jump range", () => {
    const low = { id: "low", left: 100, right: 300, top: 620 };
    const high = { id: "high", left: 100, right: 300, top: 540 };
    const scene = { ...world, platforms: [high, low, floor] };
    expect(jumpVelocity(pet(), { x: 246, y: high.top })).toBeNull();
    const route = routeTo(pet(), scene, high, jumpVelocity);
    expect(route).toMatchObject({ id: "low", kind: "jump" });
    expect(Math.abs(route.x - route.launchX)).toBeGreaterThanOrEqual(28);
  });
  it("power-jumps toward a tall component, catches its side, and climbs it", () => {
    const card = { id: "card", left: 250, right: 500, top: 350 };
    const scene = { ...world, platforms: [card, floor], walls: [{ ...card, bottom: 710 }] };
    const p = pet();
    const route = routeTo(p, scene, card, jumpVelocity);
    expect(route).toMatchObject({ kind: "wall-jump", wallSide: "left" });
    expect(route.x).toBeGreaterThan(route.launchX);
    expect(route.y).toBeLessThan(p.y);
    run(p, scene, 2);
    expect(["hang", "climb"]).toContain(p.mode);
    run(p, scene, 12);
    expect(p.visited).toContain("card");
  });
  it("does not invent a route to an inaccessible high surface", () => {
    const high = { id: "high", left: 100, right: 300, top: 100 };
    expect(routeTo(pet(), { ...world, platforms: [high, floor] }, high, jumpVelocity)).toBeNull();
  });
  it("favors unvisited higher destinations and avoids recent failed destinations", () => {
    const old = { id: "old", left: 100, right: 300, top: 640 };
    const fresh = { ...old, id: "fresh", top: 620 };
    const scene = { ...world, platforms: [old, fresh, floor] };
    expect(chooseDestination(pet({ visited: ["old"] }), scene, () => 0)[0].id).toBe("fresh");
    expect(chooseDestination(pet({ failed: [{ id: "fresh", until: 10 }] }), scene, () => 0).map(p => p.id)).not.toContain("fresh");
  });
  it("avoids immediately doubling back to the platform it just left", () => {
    const old = { id: "old", left: 100, right: 300, top: 640 };
    const fresh = { ...old, id: "fresh", top: 620 };
    const scene = { ...world, platforms: [old, fresh, floor] };
    const justLeft = pet({ previous: "fresh", previousUntil: 20 });
    expect(chooseDestination(justLeft, scene, () => 0).map(p => p.id)).not.toContain("fresh");
  });
  it("allows revisiting a platform once the just-left cooldown expires", () => {
    const old = { id: "old", left: 100, right: 300, top: 640 };
    const fresh = { ...old, id: "fresh", top: 620 };
    const scene = { ...world, platforms: [old, fresh, floor] };
    const cooledDown = pet({ previous: "fresh", previousUntil: 5, clock: 20 });
    expect(chooseDestination(cooledDown, scene, () => 0).map(p => p.id)).toContain("fresh");
  });
  it("penalizes recently visited destinations enough to prefer a fresh one at equal appeal", () => {
    const visitedHigh = { id: "visitedHigh", left: 100, right: 300, top: 690 };
    const freshLow = { id: "freshLow", left: 100, right: 300, top: 700 };
    const scene = { ...world, platforms: [visitedHigh, freshLow, floor] };
    const p = pet({ visited: ["visitedHigh"] });
    expect(chooseDestination(p, scene, () => 0)[0].id).toBe("freshLow");
  });
  it("rests, sleeps, regains energy, and stretches before resuming", () => {
    const p = pet({ energy: 15 });
    run(p, world, 0.1);
    expect(p.mode).toBe("sleepy");
    expect(p.emote).toBe("🥱");
    run(p, world, 2);
    expect(p.mode).toBe("sleep");
    run(p, world, 19);
    expect(p.energy).toBeGreaterThan(70);
    expect(p.mode).toBe("stretch");
    expect(p.emote).toBe("😃");
    run(p, world, 2);
    expect(p.mode).toBe("walk");
  });
  it("occasionally sits rather than constantly roaming", () => {
    const p = pet({ clock: 20 });
    run(p, world, 0.1, () => 0.1);
    expect(p.mode).toBe("sit");
  });
  it("responds to some selections, rate limits attempts, and avoids interrupting sleep", () => {
    const p = pet();
    const point = { id: "selection", x: 200, y: 600 };
    expect(requestInterest(p, point, "selection", () => 0.1)).toBe(true);
    expect(requestInterest(p, point, "selection", () => 0.1)).toBe(false);
    p.clock = 21;
    expect(requestInterest(p, point, "selection", () => 0.9)).toBe(false);
    p.clock = 45; p.mode = "sleep";
    expect(requestInterest(p, point, "selection", () => 0)).toBe(false);
  });
  it("chases only briefly and keeps the destination on its supporting surface", () => {
    const p = pet();
    expect(requestInterest(p, { x: 1500, y: 600 }, "chase", () => 0)).toBe(true);
    run(p, world, 0.4);
    expect(p.target.launchX).toBeLessThan(floor.right);
    run(p, world, 3);
    expect(p.intent).toBeNull();
  });
  it("startles from a theme switch sometimes, not every time, and rate limits attempts", () => {
    const p = pet();
    expect(startleFromTheme(p, () => 0.5)).toBe(false); // above the 0.4 chance
    expect(p.emote).toBe("");
    p.clock = 26; // past the cooldown the failed attempt above still set
    expect(startleFromTheme(p, () => 0.1)).toBe(true);
    expect(p.emote).toBe("😮");
    expect(p.poseOverride).toBe("startled");
    expect(startleFromTheme(p, () => 0.1)).toBe(false); // cooldown, even though the roll would pass
    p.clock = 52;
    expect(startleFromTheme(p, () => 0.1)).toBe(true);
  });
  it("petting wakes a sleeping pet and rate limits emoji", () => {
    const p = pet({ mode: "sleep", energy: 20 });
    expect(petReaction(p)).toBe(true);
    expect(p.mode).toBe("stretch");
    expect(p.emote).toBe("🥱");
    expect(petReaction(p)).toBe(false);
  });
  it("sometimes undershoots a marginal jump and remembers the miss", () => {
    const ledge = { id: "ledge", left: 100, right: 300, top: 610 };
    const scene = { ...world, platforms: [ledge, floor] };
    const p = pet({ mode: "prepare", target: { id: "ledge", x: 246, y: 610, launchX: 150 } });
    run(p, scene, 1.3, () => 0);
    expect(p.ground).toBe("floor");
    expect(p.failed.map(f => f.id)).toContain("ledge");
  });
});

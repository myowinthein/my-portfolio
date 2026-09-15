import { describe, expect, it } from "vitest";
import { createPet, footOffset, gazeCell, GRAVITY, jumpVelocity, NYO_HEIGHT, petCell, stepPet } from "./nyo";

const floor = { id: "floor", left: 24, right: 895, top: 700 };
const platform = { id: "card", left: 200, right: 400, top: 300 };
const world = { platforms: [platform, floor], walls: [], width: 1000, height: 712 };
function pet(overrides = {}) {
  return { ...createPet(world, { top: 0, bottom: 712 }, () => 0.9), x: 250, y: 300,
    mode: "idle", ground: "card", wait: 10, ...overrides };
}
function simulate(character, scene, seconds, hz = 60) {
  for (let i = 0; i < seconds * hz; i++) stepPet(character, scene, 1 / hz, () => 0.9);
  return character;
}

describe("Nyo physical movement", () => {
  it("hits the ceiling and falls in place while retaining horizontal momentum", () => {
    const scene = { ...world, ceiling: 4 };
    const character = pet({ ground: null, mode: "jump", y: 100, vx: 75, vy: -460 });
    stepPet(character, scene, 0.03);
    expect(character.mode).toBe("fall");
    expect(character.y).toBeGreaterThanOrEqual(4 + NYO_HEIGHT);
    expect(character.vy).toBeGreaterThanOrEqual(0);
    expect(character.vx).toBe(75);
    expect(character.x).toBeCloseTo(252.25);
    expect(character.ground).toBeNull();
    expect(character.emote).toBe("😮");
    expect(character.poseOverride).toBe("startled");
    expect(petCell(character)).toEqual({ sheet: "extra", row: 3, frame: 3 });
    const impactHeight = character.y;
    stepPet(character, scene, 0.05);
    expect(character.y).toBeGreaterThan(impactHeight);
  });
  it("catches even a high-speed jump on a slow frame", () => {
    const character = pet({ ground: null, mode: "jump", y: 110, vy: -1800, vx: 30 });
    stepPet(character, { ...world, ceiling: 4 }, 0.1);
    expect(character.y).toBeGreaterThanOrEqual(4 + NYO_HEIGHT);
    expect(character.mode).toBe("fall");
    expect(character.x).toBeCloseTo(253);
  });
  it("moves the ceiling with scrolling without respawning or resetting memory", () => {
    const character = pet({ ground: null, mode: "fall", y: 200, vx: 40, vy: 100, visited: ["card"], energy: 55 });
    stepPet(character, { ...world, ceiling: 304 }, 0);
    expect(character.y).toBe(304 + NYO_HEIGHT);
    expect(character.x).toBe(250);
    expect(character.vx).toBe(40);
    expect(character.vy).toBe(100);
    expect(character.visited).toEqual(["card"]);
    expect(character.energy).toBe(55);
  });
  it("releases a climbing grip at the ceiling rather than clipping through it", () => {
    const character = pet({ ground: null, mode: "climb", wall: "wall", y: 95.1 });
    const scene = { ...world, ceiling: 4, walls: [{ id: "wall", left: 269, right: 450, top: 20, bottom: 500 }] };
    stepPet(character, scene, 0.02);
    expect(character.mode).toBe("fall");
    expect(character.wall).toBeNull();
    expect(character.ignoreWall).toBe("wall");
    expect(character.y).toBeGreaterThanOrEqual(95);
  });
  it("keeps walking on the viewport floor as it moves with scrolling", () => {
    const character = pet({ ground: "floor", mode: "walk", x: 250, y: floor.top, direction: 1 });
    for (const top of [700, 1300, 1000, 500]) {
      const scene = { ...world, platforms: [{ ...floor, top }] };
      stepPet(character, scene, 0.05);
      expect(character.ground).toBe("floor");
      expect(character.mode).toBe("walk");
      expect(character.y).toBe(top);
    }
    expect(character.x).toBeGreaterThan(250);
  });
  it("catches an airborne pet if scrolling or resizing raises the floor above him", () => {
    const character = pet({ ground: null, mode: "fall", y: 650, vy: 300 });
    stepPet(character, { ...world, platforms: [{ ...floor, top: 600 }] }, 0.01);
    expect(character.ground).toBe("floor");
    expect(character.mode).toBe("land");
    expect(character.y).toBe(600);
    expect(character.x).toBe(250);
  });
  it("spawns inside the viewport even when the only floor is far below it", () => {
    const scene = { ...world, platforms: [{ ...floor, top: 9000 }] };
    const character = createPet(scene, { top: 1000, bottom: 1700 });
    expect(character.y).toBeGreaterThan(1000);
    expect(character.y).toBeLessThan(1700);
  });
  it("walks with both feet on the platform height", () => {
    const character = pet({ mode: "walk", direction: 1 });
    simulate(character, world, 0.5);
    expect(character.x).toBeCloseTo(286, 2);
    expect(character.y).toBe(300);
    expect(character.ground).toBe("card");
  });
  it("falls under gravity after walking past the edge", () => {
    const character = pet({ mode: "walk", x: 398, direction: 1 });
    simulate(character, world, 0.2);
    expect(character.mode).toBe("fall");
    expect(character.ground).toBeNull();
    expect(character.y).toBeGreaterThan(300);
    expect(character.vy).toBeGreaterThan(0);
  });
  it("lands on a thin platform even with fast downward velocity", () => {
    const character = pet({ ground: null, mode: "fall", y: 290, vy: 900 });
    stepPet(character, world, 0.05);
    expect(character.ground).toBe("card");
    expect(character.y).toBe(300);
    expect(character.vy).toBe(0);
    expect(character.hardLanding).toBe(true);
  });
  it("lands when a paw reaches a text edge even if his center is just outside", () => {
    const character = pet({ ground: null, mode: "fall", x: 191, y: 290, vy: 900 });
    stepPet(character, world, 0.05);
    expect(character.ground).toBe("card");
    expect(character.y).toBe(300);
  });
  it("still falls past a platform when neither paw reaches it", () => {
    const character = pet({ ground: null, mode: "fall", x: 189, y: 290, vy: 900 });
    stepPet(character, world, 0.05);
    expect(character.ground).toBeNull();
    expect(character.y).toBeGreaterThan(300);
  });
  it("does not land while rising through a surface", () => {
    const character = pet({ ground: null, mode: "jump", y: 310, vy: -460 });
    stepPet(character, world, 0.05);
    expect(character.y).toBeLessThan(300);
    expect(character.ground).toBeNull();
  });
  it("computes a ballistic jump that reaches the destination", () => {
    const from = { x: 200, y: 300 };
    const target = { x: 320, y: 230 };
    const velocity = jumpVelocity(from, target);
    const time = (target.x - from.x) / velocity.vx;
    expect(from.y + velocity.vy * time + GRAVITY * time * time / 2).toBeCloseTo(target.y);
    const angle = Math.atan2(-velocity.vy, Math.abs(velocity.vx)) * 180 / Math.PI;
    expect(angle).toBeGreaterThan(25);
    expect(angle).toBeLessThan(85);
    expect(jumpVelocity(from, { x: from.x, y: 230 })).toBeNull();
    expect(jumpVelocity(from, { x: 320, y: 50 })).toBeNull();
    expect(jumpVelocity(from, { x: 1200, y: 300 })).toBeNull();
  });
  it("produces consistent gravity on 30 Hz and 120 Hz displays", () => {
    const slow = pet({ ground: null, mode: "fall", y: 100, vx: 40 });
    const fast = { ...slow };
    simulate(slow, world, 0.4, 30);
    simulate(fast, world, 0.4, 120);
    expect(slow.x).toBeCloseTo(fast.x, 4);
    expect(slow.y).toBeCloseTo(fast.y, 4);
  });
  it("falls if the component it stands on disappears", () => {
    const character = pet();
    stepPet(character, { ...world, platforms: [floor] }, 0.05);
    expect(character.ground).toBeNull();
    expect(character.y).toBeGreaterThan(300);
  });
  it("follows the supporting component when its layout moves", () => {
    const character = pet();
    stepPet(character, { ...world, platforms: [{ ...platform, top: 320 }, floor] }, 0.01);
    expect(character.y).toBe(320);
  });
  it("grabs a wall, climbs it, pulls over the edge, and lands on top", () => {
    const wall = { ...platform, bottom: 490 };
    const scene = { ...world, walls: [wall] };
    const character = pet({ ground: null, mode: "fall", x: 177, y: 400, vx: 72, vy: 10 });
    simulate(character, scene, 0.1);
    expect(character.mode).toBe("hang");
    expect(character.wall).toBe("card");
    simulate(character, scene, 0.6);
    expect(character.mode).toBe("climb");
    const before = character.y;
    simulate(character, scene, 0.5);
    expect(character.y).toBeLessThan(before);
    let landed = false;
    for (let i = 0; i < 400; i++) {
      stepPet(character, scene, 1 / 120, () => 0.9);
      if (character.ground === "card") { landed = true; break; }
    }
    expect(landed).toBe(true);
    expect(character.y).toBe(300);
  });
  it("shows different reactions for preparation, falling, and effort", () => {
    expect(petCell(pet({ mode: "prepare" }))).toMatchObject({ sheet: "core", row: 4 });
    expect(petCell(pet({ mode: "fall" }))).toMatchObject({ sheet: "core", row: 3 });
    expect(petCell(pet({ mode: "climb" }))).toEqual({ sheet: "extra", row: 6, frame: 0 });
    expect(petCell(pet({ mode: "hang", time: 2 }))).toEqual({ sheet: "extra", row: 6, frame: 0 });
    expect(petCell(pet({ mode: "proud" }))).toMatchObject({ sheet: "extra", row: 2 });
    expect(footOffset("core", 1, 0)).toBeLessThan(footOffset("core", 0, 0));
  });
  it("plays climbing frames forward from upward distance and freezes during wall rests", () => {
    const frames = [0, 7.5, 15, 22.5, 30, 37.5, 45].map((climbDistance) =>
      petCell(pet({ mode: "climb", climbDistance })).frame
    );
    expect(frames).toEqual([0, 1, 2, 3, 4, 5, 0]);

    const wall = { ...platform, bottom: 490 };
    const character = pet({ ground: null, mode: "climb", wall: "card", y: 400, climbDistance: 30, climbRest: 0.5 });
    const before = petCell(character);
    stepPet(character, { ...world, walls: [wall] }, 0.1);
    expect(petCell(character)).toEqual(before);
    expect(character.y).toBe(400);
  });
  it("uses the dedicated closed-eye artwork as a six-frame sleep loop", () => {
    expect(petCell(pet({ mode: "sleep", time: 0 }))).toEqual({ sheet: "extra", row: 7, frame: 0 });
    expect(petCell(pet({ mode: "sleep", time: 1 }))).toEqual({ sheet: "extra", row: 7, frame: 3 });
    expect(petCell(pet({ mode: "sleep", time: 2 }))).toEqual({ sheet: "extra", row: 7, frame: 0 });
  });
  it("shows a puzzled pose when a route to an unreachable target fails", () => {
    const faraway = { id: "faraway", left: 5000, right: 5100, top: 0 };
    const scene = { ...world, platforms: [...world.platforms, faraway] };
    const character = pet({ mode: "wait", time: 10, wait: 0.5,
      intent: { id: "faraway", x: 5050, y: 0, kind: "explore", until: Infinity } });
    stepPet(character, scene, 0.02);
    expect(character.intent).toBeNull();
    expect(character.failed.map((f) => f.id)).toContain("faraway");
    expect(character.poseOverride).toBe("confused");
    expect(petCell(character)).toEqual({ sheet: "extra", row: 3, frame: 2 });
  });
  it("never lets a brief pose override mask a load-bearing pose", () => {
    const climbing = pet({ mode: "climb", climbDistance: 0, poseOverride: "startled", poseUntil: Infinity });
    expect(petCell(climbing)).toEqual({ sheet: "extra", row: 6, frame: 0 });
    const sleeping = pet({ mode: "sleep", time: 0, poseOverride: "confused", poseUntil: Infinity });
    expect(petCell(sleeping)).toEqual({ sheet: "extra", row: 7, frame: 0 });
  });
  it("stops in place to react instead of continuing to walk under a frozen face", () => {
    const character = pet({ mode: "walk", direction: 1, poseOverride: "startled", poseUntil: Infinity });
    stepPet(character, world, 0.5);
    expect(character.x).toBe(250);
    expect(character.mode).toBe("walk");
    expect(character.poseOverride).toBe("startled");
  });
  it("resumes walking once the pose override expires", () => {
    const character = pet({ mode: "walk", direction: 1, poseOverride: "startled", poseUntil: 0.1 });
    simulate(character, world, 0.5);
    expect(character.x).toBeGreaterThan(250);
  });
  it("runs a faster stride while chasing than while idly wandering", () => {
    const wandering = petCell(pet({ mode: "walk", direction: 1, time: 0.3 }));
    const chasing = petCell(pet({ mode: "walk", direction: 1, time: 0.3, intent: { kind: "chase" } }));
    expect(wandering).toEqual({ sheet: "core", row: 1, frame: 2 });
    expect(chasing).toEqual({ sheet: "core", row: 1, frame: 3 });
  });
});
describe("Nyo gaze", () => {
  it.each([[0, -100, 4, 0], [100, 0, 4, 4], [0, 100, 5, 0], [-100, 0, 5, 4]])(
    "maps screen direction (%s, %s) to its atlas cell", (dx, dy, row, frame) => {
      expect(gazeCell(dx, dy)).toEqual({ sheet: "extra", row, frame });
    }
  );
});

import { chooseDestination, routeTo } from "./nyo-behavior";

export const NYO_WIDTH = 84;
export const NYO_HEIGHT = 91;
export const GRAVITY = 1100;
const WALK_SPEED = 72;
const JUMP_SPEED = 460;
const MIN_JUMP_SPEED = 300;
const MAX_JUMP_X_SPEED = 320;
const MIN_CROSS_JUMP = 28;
const BODY_RADIUS = 19;
const FOOT_RADIUS = 10;

// Two atlases, loaded in priority order (see Nyo.jsx): "core" covers the poses
// needed the instant Nyo can appear at all, "extra" covers everything that only
// shows up after some interaction has already happened, and warms up lazily.
export const CORE_COLS = 8;
export const CORE_ROWS = 5;
export const EXTRA_COLS = 8;
export const EXTRA_ROWS = 8;

export const NYO_ANIMATIONS = {
  idle: { sheet: "core", row: 0, frames: 6, fps: 6 },
  right: { sheet: "core", row: 1, frames: 8, fps: 9 },
  left: { sheet: "core", row: 2, frames: 8, fps: 9 },
  jump: { sheet: "core", row: 3, frames: 5, fps: 6 },
  wait: { sheet: "core", row: 4, frames: 6, fps: 6 },
  wave: { sheet: "extra", row: 0, frames: 4, fps: 6 },
  sad: { sheet: "extra", row: 1, frames: 8, fps: 8 },
  proud: { sheet: "extra", row: 2, frames: 6, fps: 6 },
  // Row 3 is a set of held single-frame expressions in the source art, not a
  // walk-style cycle - only specific frames are used, briefly, as pose overrides.
  confused: { sheet: "extra", row: 3, frame: 2 },
  startled: { sheet: "extra", row: 3, frame: 3 },
  // Two forward-only paw cycles per 90px climbing burst. Tying frames to
  // distance freezes the pose during wall rests instead of cycling in place.
  climb: { sheet: "extra", row: 6, frames: 6, cycleDistance: 45 },
  sleep: { sheet: "extra", row: 7, frames: 6, fps: 3 },
};

// Source silhouette bottoms: each pose meets the same physical foot position.
// Rows without an explicit entry (proud, confused/startled, climb, sleep) fall
// back to the default below - sleep gets its own hardcoded offset in Nyo.jsx.
const SOLES_CORE = [
  [203, 203, 203, 203, 203, 203],           // idle
  [184, 186, 184, 183, 186, 185, 184, 185], // right
  [184, 186, 184, 183, 186, 185, 184, 185], // left
  [200, 203, 203, 203, 198],                 // jump
];
const SOLES_EXTRA = [
  [203, 203, 202, 203],                     // wave
  [203, 202, 197, 150, 165, 203, 202, 203], // sad
];
export const footOffset = (sheet, row, frame) => {
  const table = sheet === "extra" ? SOLES_EXTRA : SOLES_CORE;
  return (table[row]?.[frame] ?? 203) * NYO_HEIGHT / 208;
};

export function gazeCell(dx, dy) {
  const angle = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
  const index = Math.round(angle / 22.5) % 16;
  return { sheet: "extra", row: 4 + Math.floor(index / 8), frame: index % 8 };
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
// Nyo lands on the width of his paws, not only on his exact center point.
const hasFooting = (pet, platform) => pet.x >= platform.left - FOOT_RADIUS && pet.x <= platform.right + FOOT_RADIUS;
function enter(pet, mode) { pet.mode = mode; pet.time = 0; }

export function createPet(world, viewport, random = Math.random) {
  const visible = world.platforms.filter((p) => p.top > viewport.top + 100 && p.top < viewport.bottom - 50 && p.right - p.left > 65);
  const platform = visible[0] ?? world.platforms.find((p) => p.id === "floor");
  const x = platform ? clamp(platform.left + 36, 38, world.width - 110) : 60;
  return {
    x, y: clamp(platform ? platform.top - 110 : viewport.top + 100, viewport.top + 90, viewport.bottom - 16),
    vx: 0, vy: 0, direction: random() > 0.5 ? 1 : -1,
    mode: "fall", time: 0, ground: null, target: null, wall: null,
    previous: null, hops: 0, wait: 1.2,
    clock: 0, energy: 90, curiosity: 0.8, playfulness: 0.65,
    visited: [], failed: [], intent: null, jumpGoal: null,
    selectionAfter: 0, chaseAfter: 0, reactionAfter: 0, themeAfter: 0,
    emote: "", emoteUntil: 0, restAfter: 8, climbDistance: 0,
    // Brief single-frame face override, same pattern as emote/emoteUntil, but
    // for body pose. Doesn't touch pet.mode, so it never disturbs physics.
    poseOverride: null, poseUntil: 0,
  };
}

export function jumpVelocity(from, target) {
  const dy = target.y - from.y;
  const dx = target.x - from.x;
  if (Math.abs(dx) < MIN_CROSS_JUMP) return null;
  // Use only as much upward power as the ledge needs. Low and level hops then
  // travel diagonally instead of looking like full-strength vertical jumps,
  // while the cap keeps genuinely high tops reserved for wall climbing.
  const rise = Math.max(0, -dy);
  const jumpSpeed = Math.min(JUMP_SPEED, Math.max(MIN_JUMP_SPEED, Math.sqrt(2 * GRAVITY * rise) + 48));
  const discriminant = jumpSpeed ** 2 + 2 * GRAVITY * dy;
  if (discriminant < 0) return null;
  const seconds = (jumpSpeed + Math.sqrt(discriminant)) / GRAVITY;
  const vx = dx / seconds;
  return Math.abs(vx) <= MAX_JUMP_X_SPEED ? { vx, vy: -jumpSpeed } : null;
}

function startJump(pet, point, random = Math.random) {
  const velocity = jumpVelocity(pet, point);
  if (!velocity) return false;
  Object.assign(pet, velocity);
  // Only borderline climbs sometimes undershoot; the resulting arc still uses gravity.
  if (point.y < pet.y - 65 && random() < 0.12) pet.vy *= 0.88;
  pet.jumpGoal = point.id ?? null;
  pet.jumpPoint = { x: point.x, y: point.y };
  pet.energy = Math.max(0, pet.energy - 3);
  pet.direction = velocity.vx >= 0 ? 1 : -1;
  pet.previous = pet.ground;
  pet.ground = null;
  pet.target = null;
  pet.hops += 1;
  enter(pet, "jump");
  return true;
}

function planWalk(pet, world, random) {
  const support = world.platforms.find((p) => p.id === pet.ground);
  if (!support) { enter(pet, "fall"); pet.ground = null; return; }
  pet.target = null;
  if (pet.energy < 24 && support.right - support.left > 90) {
    pet.intent = null; pet.wait = 1.5;
    pet.emote = "🥱"; pet.emoteUntil = pet.clock + 2;
    enter(pet, "sleepy"); return;
  }
  if (!pet.intent && pet.clock > pet.restAfter && random() < 0.2) {
    pet.restAfter = pet.clock + 12;
    pet.wait = 2 + random() * 3;
    enter(pet, random() < 0.7 ? "sit" : "wave"); return;
  }
  if (pet.intent && (pet.intent.until < pet.clock ||
      (pet.intent.kind !== "chase" && !world.platforms.some((p) => p.id === pet.intent.id)))) pet.intent = null;
  if (pet.intent && (pet.intent.kind === "chase" || Math.abs(pet.intent.y - pet.y) < 6)) {
    const destination = clamp(pet.intent.x, support.left + 8, support.right - 8);
    if (Math.abs(destination - pet.x) < 20) {
      pet.emote = pet.intent.kind === "selection" ? "👀" : "✨";
      pet.emoteUntil = pet.clock + 1.6; pet.intent = null;
      pet.wait = 1.5; enter(pet, "wait"); return;
    }
    pet.target = { kind: "walk", launchX: destination };
  } else {
    const destinations = pet.intent ? world.platforms.filter((p) => p.id === pet.intent.id) : chooseDestination(pet, world, random);
    for (const next of destinations) {
      const route = routeTo(pet, world, next, jumpVelocity);
      if (!route) continue;
      pet.target = route;
      if (!pet.intent) pet.intent = { id: next.id, x: route.x, y: next.top, kind: "explore", until: pet.clock + 16 };
      break;
    }
    if (pet.intent && !pet.target) {
      pet.failed.push({ id: pet.intent.id, until: pet.clock + 15 });
      pet.intent = null; pet.emote = "?"; pet.emoteUntil = pet.clock + 1.2;
      pet.poseOverride = "confused"; pet.poseUntil = pet.clock + 1.2;
    }
  }
  if (pet.target) {
    pet.direction = pet.target.launchX >= pet.x ? 1 : -1;
  }
  if (!pet.target) {
    if (pet.x > world.width - 180) pet.direction = -1;
    else if (pet.x < 90) pet.direction = 1;
    else pet.direction = random() > 0.5 ? 1 : -1;
  }
  enter(pet, "walk");
}

function catchWall(pet, world, oldX) {
  const wall = world.walls.find((w) => w.id !== pet.ignoreWall && w.bottom > pet.y - 65 && w.top < pet.y - 16 &&
    pet.y - w.top < 600 && w.top > 85 && (
      (pet.vx > 0 && oldX + BODY_RADIUS <= w.left && pet.x + BODY_RADIUS >= w.left) ||
      (pet.vx < 0 && oldX - BODY_RADIUS >= w.right && pet.x - BODY_RADIUS <= w.right)
    ));
  if (!wall) return false;
  pet.direction = pet.vx > 0 ? 1 : -1;
  pet.x = pet.direction > 0 ? wall.left - BODY_RADIUS : wall.right + BODY_RADIUS;
  pet.wall = wall.id;
  pet.ground = null;
  pet.vx = 0;
  pet.vy = 0;
  pet.climbDistance = 0;
  pet.climbRest = 0;
  enter(pet, "hang");
  return true;
}

function landOn(pet, platform) {
  const reachedPoint = pet.jumpPoint && Math.abs(pet.jumpPoint.y - platform.top) < 6 && Math.abs(pet.jumpPoint.x - pet.x) < 30;
  if (pet.jumpGoal && pet.jumpGoal !== platform.id && !reachedPoint) {
    pet.failed.push({ id: pet.jumpGoal, until: pet.clock + 18 });
    pet.intent = null; pet.emote = "😮"; pet.emoteUntil = pet.clock + 1.5;
    pet.poseOverride = "startled"; pet.poseUntil = pet.clock + 1.5;
  }
  pet.jumpGoal = null;
  if (platform.id !== "floor") pet.visited = [...pet.visited.filter((id) => id !== platform.id), platform.id].slice(-5);
  if (pet.intent?.id === platform.id || (pet.intent?.kind === "selection" && reachedPoint)) {
    pet.emote = pet.intent.kind === "selection" ? "👀" : "✨";
    pet.emoteUntil = pet.clock + 1.5; pet.intent = null;
  }
  pet.jumpPoint = null;
  pet.hardLanding = pet.vy > 650;
  pet.y = platform.top; pet.vx = 0; pet.vy = 0;
  pet.ground = platform.id;
  pet.wall = null;
  pet.ignoreWall = null;
  pet.wait = pet.hardLanding ? 1 : 0.8;
  pet.target = null;
  enter(pet, "land");
}

function advance(pet, world, dt, random) {
  pet.time += dt;
  pet.clock += dt;
  pet.energy = clamp(pet.energy + dt * (pet.mode === "sleep" ? 4 : ["sit", "idle"].includes(pet.mode) ? 0.35 : -0.65), 0, 100);
  pet.failed = pet.failed.filter((f) => f.until > pet.clock).slice(-8);
  if (pet.intent && pet.intent.until < pet.clock) { pet.intent = null; pet.target = null; }
  const support = world.platforms.find((p) => p.id === pet.ground);
  if (pet.ground) {
    if (!support || !hasFooting(pet, support)) {
      pet.previous = pet.ground;
      pet.ground = null;
      pet.vy = 0;
      enter(pet, "fall");
    } else { pet.y = support.top; pet.vy = 0; }
  }
  // Scrolling up or shrinking the window can move its floor above Nyo between
  // frames. Catch him there instead of treating this as a fall out of the world.
  const floor = world.platforms.find((p) => p.id === "floor");
  if (floor && pet.y > floor.top && hasFooting(pet, floor)) {
    landOn(pet, floor);
    return;
  }
  if (pet.mode === "land") {
    if (pet.time >= 0.18) enter(pet, pet.hardLanding ? "sad" : "proud");
    return;
  }
  if (pet.mode === "sleepy") {
    if (pet.time >= pet.wait) { pet.wait = 12 + random() * 8; enter(pet, "sleep"); }
    return;
  }
  if (pet.mode === "sleep") {
    if (pet.time >= pet.wait) { pet.wait = 1.4; enter(pet, "stretch"); }
    return;
  }
  if (["idle", "proud", "sad", "wait", "wave", "sit", "stretch"].includes(pet.mode)) {
    if (pet.time >= pet.wait) planWalk(pet, world, random);
    return;
  }
  if (pet.mode === "hang" || pet.mode === "climb") {
    const wall = world.walls.find((w) => w.id === pet.wall);
    if (!wall) { pet.wall = null; enter(pet, "fall"); return; }
    if (pet.mode === "hang") {
      if (pet.time > 0.45) enter(pet, "climb");
      return;
    }
    if (pet.climbRest > 0) { pet.climbRest -= dt; return; }
    pet.x = pet.direction > 0 ? wall.left - BODY_RADIUS : wall.right + BODY_RADIUS;
    pet.y -= dt * 52;
    pet.climbDistance += dt * 52;
    if (pet.climbDistance > 90) { pet.climbDistance = 0; pet.climbRest = 0.8; }
    if (pet.y - 24 <= wall.top) {
      pet.ignoreWall = pet.wall;
      pet.wall = null;
      pet.vx = pet.direction * 95;
      pet.vy = -285;
      enter(pet, "jump");
    }
    return;
  }
  if (pet.mode === "prepare") {
    if (!pet.target || !world.platforms.some((p) => p.id === pet.target.id)) {
      pet.target = null; enter(pet, "walk"); return;
    }
    if (pet.time > 0.3 && !startJump(pet, pet.target, random)) { pet.target = null; enter(pet, "walk"); }
    return;
  }
  if (pet.mode === "walk") {
    // A brief pose override (confused/startled) means Nyo has frozen to react -
    // hold still instead of gliding forward under a face that isn't animating.
    // Falling/jumping keeps its momentum on purpose (see enforceCeiling); only
    // ground locomotion has a leg-cycle to visually clash with a frozen face.
    if (pet.poseOverride && pet.poseUntil > pet.clock) { pet.vx = 0; return; }
    if (pet.target && Math.abs(pet.x - pet.target.launchX) < 4) {
      if (pet.target.kind === "walk") {
        pet.target = null; pet.wait = 0.6; pet.vx = 0; enter(pet, "idle"); return;
      }
      pet.vx = 0; enter(pet, "prepare"); return;
    }
    const oldX = pet.x;
    pet.vx = pet.direction * WALK_SPEED;
    const distance = pet.vx * dt;
    pet.x += pet.target ? Math.sign(distance) * Math.min(Math.abs(distance), Math.abs(pet.target.launchX - pet.x)) : distance;
    if (catchWall(pet, world, oldX)) return;
    if (!support || !hasFooting(pet, support)) {
      pet.previous = pet.ground;
      pet.ground = null;
      pet.target = null;
      pet.vy = 0;
      pet.hops += 1;
      enter(pet, "fall");
    } else if (pet.x < 36 || pet.x > world.width - 110) {
      pet.direction *= -1;
      pet.target = null;
      const next = world.platforms.find((p) => p.id !== support.id && p.top < pet.y &&
        jumpVelocity(pet, { x: clamp(pet.x, p.left + 12, p.right - 12), y: p.top }));
      if (next) startJump(pet, { x: clamp(pet.x, next.left + 12, next.right - 12), y: next.top });
    } else if (pet.time > 2.8 && !pet.target) {
      pet.wait = 0.7 + random(); enter(pet, "idle");
    }
    return;
  }

  const oldX = pet.x;
  const oldY = pet.y;
  pet.x += pet.vx * dt;
  pet.y += pet.vy * dt + GRAVITY * dt * dt / 2;
  pet.vy += GRAVITY * dt;
  if (pet.vy >= 0 && pet.mode === "jump") enter(pet, "fall");
  if (catchWall(pet, world, oldX)) return;
  if (pet.x < 30 || pet.x > world.width - 100) {
    pet.x = clamp(pet.x, 30, world.width - 100); pet.vx *= -0.5;
  }
  // Swept foot collision catches thin text lines, even on a slow frame.
  const landing = world.platforms.filter((p) => pet.vy > 0 && oldY <= p.top && pet.y >= p.top && hasFooting(pet, p))
    .sort((a, b) => a.top - b.top)[0];
  if (landing) {
    landOn(pet, landing);
  }
}

function enforceCeiling(pet, world) {
  if (!Number.isFinite(world.ceiling)) return;
  const floor = world.platforms.find((p) => p.id === "floor");
  const minFeet = Math.min(world.ceiling + NYO_HEIGHT, floor?.top ?? Infinity);
  if (pet.y >= minFeet) return;
  const bumped = pet.vy < 0 || pet.mode === "climb";
  pet.y = minFeet;
  pet.vy = Math.max(0, pet.vy);
  pet.ground = null;
  // Release a climbing grip without immediately catching the same wall again.
  if (pet.wall) pet.ignoreWall = pet.wall;
  pet.wall = null;
  pet.target = null;
  pet.intent = null;
  if (bumped) {
    pet.emote = "😮"; pet.emoteUntil = pet.clock + 1.2;
    pet.poseOverride = "startled"; pet.poseUntil = pet.clock + 1.2;
  }
  enter(pet, "fall");
}

export function stepPet(pet, world, seconds, random = Math.random) {
  const duration = Math.min(Math.max(seconds, 0), 0.1);
  const steps = Math.max(1, Math.ceil(duration / (1 / 120)));
  // Resolve a scroll-moved ceiling before integration, and fast head impacts
  // after every substep. Horizontal position and velocity are never reset.
  enforceCeiling(pet, world);
  for (let i = 0; i < steps; i++) {
    advance(pet, world, duration / steps, random);
    enforceCeiling(pet, world);
  }
  return pet;
}

export function petCell(pet) {
  // Never mask a mode where the pose itself is load-bearing (mid-climb, asleep).
  if (pet.poseOverride && pet.poseUntil > pet.clock && !["hang", "climb", "sleep"].includes(pet.mode)) {
    const override = NYO_ANIMATIONS[pet.poseOverride];
    return { sheet: override.sheet, row: override.row, frame: override.frame };
  }
  let action = pet.mode;
  if (action === "hang") return { sheet: NYO_ANIMATIONS.climb.sheet, row: NYO_ANIMATIONS.climb.row, frame: 0 };
  if (action === "climb") {
    const animation = NYO_ANIMATIONS.climb;
    const distance = Math.max(0, pet.climbDistance ?? 0);
    const frame = Math.floor(distance * animation.frames / animation.cycleDistance) % animation.frames;
    return { sheet: animation.sheet, row: animation.row, frame };
  }
  if (action === "sleep") {
    const animation = NYO_ANIMATIONS[action];
    return { sheet: animation.sheet, row: animation.row, frame: Math.floor(pet.time * animation.fps) % animation.frames };
  }
  if (["sit", "sleepy"].includes(action)) action = "wait";
  if (action === "stretch") action = "wave";
  if (action === "prepare") action = "wait";
  if (action === "fall") return { sheet: "core", row: 3, frame: 3 };
  if (action === "land") return { sheet: "core", row: 3, frame: 4 };
  if (action === "jump") return { sheet: "core", row: 3, frame: pet.vy < -200 ? 1 : 2 };
  if (action === "walk") {
    const animation = NYO_ANIMATIONS[pet.direction > 0 ? "right" : "left"];
    // No new art for "alert" - chasing something fun just runs a bit faster.
    const fps = pet.intent?.kind === "chase" ? animation.fps * 1.4 : animation.fps;
    return { sheet: animation.sheet, row: animation.row, frame: Math.floor(pet.time * fps) % animation.frames };
  }
  const animation = NYO_ANIMATIONS[action] ?? NYO_ANIMATIONS.idle;
  return { sheet: animation.sheet, row: animation.row, frame: Math.floor(pet.time * animation.fps) % animation.frames };
}

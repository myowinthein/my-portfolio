const clamp = (n, low, high) => Math.max(low, Math.min(high, n));
const BODY_RADIUS = 19;
const PLATFORM_INSET = 16;
const CROSS_JUMP_DISTANCE = 96;
const WALL_JUMP_RISE = 72;

const unique = (values) => [...new Set(values.map((value) => Math.round(value * 100) / 100))];

function directJump(from, to, x, jump) {
  const inset = Math.min(PLATFORM_INSET, (to.right - to.left) / 3);
  const targetLeft = to.left + inset;
  const targetRight = to.right - inset;
  const sourceLeft = from.left + 8;
  const sourceRight = from.right - 8;
  const targetCenter = (targetLeft + targetRight) / 2;
  const preferredDirection = targetCenter >= x ? 1 : -1;
  let targets;

  if (to.top > from.top + 5) {
    // A downward arc must clear the old platform before descending through its
    // top, otherwise Nyo simply lands where he started.
    targets = [
      targetRight > from.right + BODY_RADIUS ? targetRight : null,
      targetLeft < from.left - BODY_RADIUS ? targetLeft : null,
    ].filter(Number.isFinite).sort((a, b) => Math.abs(a - x) - Math.abs(b - x));
  } else {
    targets = unique([
      clamp(x + preferredDirection * CROSS_JUMP_DISTANCE, targetLeft, targetRight),
      clamp(x - preferredDirection * CROSS_JUMP_DISTANCE, targetLeft, targetRight),
      targetCenter,
      targetLeft,
      targetRight,
    ]);
  }

  for (const targetX of targets) {
    const direction = Math.sign(targetX - x) || preferredDirection;
    const launchAtEdge = direction > 0 ? sourceRight : sourceLeft;
    const launches = to.top > from.top + 5 ? [launchAtEdge] : unique([
      clamp(x, sourceLeft, sourceRight),
      clamp(targetX - direction * CROSS_JUMP_DISTANCE, sourceLeft, sourceRight),
      launchAtEdge,
    ]);
    for (const launchX of launches) {
      if (!jump({ x: launchX, y: from.top }, { x: targetX, y: to.top })) continue;
      return { id: to.id, x: targetX, y: to.top, launchX, kind: "jump" };
    }
  }
  return null;
}

function wallJump(from, to, x, world, jump) {
  const wall = world.walls.find((candidate) => candidate.id === to.id);
  const climbHeight = from.top - wall?.top;
  if (!wall || climbHeight < 25 || climbHeight > 600 || wall.bottom < from.top - 65) return null;

  const sourceLeft = from.left + 8;
  const sourceRight = from.right - 8;
  const targetY = clamp(from.top - WALL_JUMP_RISE, wall.top + 36, Math.min(from.top - 28, wall.bottom - 12));
  const sides = [
    { direction: 1, targetX: wall.left - BODY_RADIUS + 4 },
    { direction: -1, targetX: wall.right + BODY_RADIUS - 4 },
  ].map((side) => ({ ...side, launchX: clamp(side.targetX - side.direction * CROSS_JUMP_DISTANCE, sourceLeft, sourceRight) }))
    .filter((side) => side.direction > 0 ? side.launchX + BODY_RADIUS <= wall.left : side.launchX - BODY_RADIUS >= wall.right)
    .sort((a, b) => Math.abs(a.launchX - x) - Math.abs(b.launchX - x));

  for (const side of sides) {
    if (!jump({ x: side.launchX, y: from.top }, { x: side.targetX, y: targetY })) continue;
    return { id: to.id, x: side.targetX, y: targetY, launchX: side.launchX,
      kind: "wall-jump", wallSide: side.direction > 0 ? "left" : "right" };
  }
  return null;
}

// A route edge is an actual jump or an accessible wall, never a teleport.
function connection(from, to, x, world, jump) {
  return directJump(from, to, x, jump) ?? wallJump(from, to, x, world, jump);
}

export function routeTo(pet, world, destination, jump) {
  const source = world.platforms.find((p) => p.id === pet.ground);
  if (!source || !destination) return null;
  const queue = [{ platform: source, x: pet.x, steps: [] }];
  const seen = new Set([source.id]);
  // The visible world is small, and four hops is plenty for a short intention.
  while (queue.length) {
    const current = queue.shift();
    if (current.steps.length >= 4) continue;
    const candidates = world.platforms.filter((p) => p.id !== "floor" && !seen.has(p.id) &&
      !pet.failed.some((f) => f.id === p.id && f.until > pet.clock))
      .sort((a, b) => Math.abs(a.top - destination.top) - Math.abs(b.top - destination.top));
    for (const next of candidates) {
      const edge = connection(current.platform, next, current.x, world, jump);
      if (!edge) continue;
      const steps = [...current.steps, edge];
      if (next.id === destination.id) return steps[0];
      seen.add(next.id);
      queue.push({ platform: next, x: edge.x, steps });
    }
  }
  return null;
}

export function chooseDestination(pet, world, random = Math.random) {
  const floor = world.platforms.find((p) => p.id === "floor");
  const candidates = world.platforms.filter((p) => p.id !== "floor" && p.id !== "selection" && p.id !== pet.ground &&
    p.top <= (floor?.top ?? Infinity) && !pet.failed.some((f) => f.id === p.id && f.until > pet.clock));
  const ranked = candidates.map((p) => ({ platform: p, score:
    (p.top < pet.y ? 3 * pet.curiosity : 0.4) +
    (pet.visited.includes(p.id) ? 0 : 2) + random() * 2 - Math.abs((p.left + p.right) / 2 - pet.x) / 500,
  })).sort((a, b) => b.score - a.score);
  return ranked.slice(0, 5).map((item) => item.platform);
}

export function requestInterest(pet, point, kind, random = Math.random) {
  if (!pet.ground || ["sleep", "sleepy", "prepare", "land"].includes(pet.mode) || pet.energy < 28) return false;
  const selection = kind === "selection";
  const key = selection ? "selectionAfter" : "chaseAfter";
  if (pet.clock < pet[key]) return false;
  pet[key] = pet.clock + (selection ? 20 : 12);
  if (random() >= (selection ? 0.25 : pet.playfulness * 0.3)) return false;
  pet.intent = { ...point, kind, until: pet.clock + (selection ? 18 : 3) };
  pet.target = null;
  pet.mode = "idle";
  pet.time = 0;
  pet.wait = 0.25;
  return true;
}

export function petReaction(pet, random = Math.random) {
  if (pet.clock < pet.reactionAfter) return false;
  pet.reactionAfter = pet.clock + 1.5;
  const sleeping = ["sleep", "sleepy"].includes(pet.mode);
  pet.emote = sleeping ? "🥱" : ["♥", "✨", "👋"][Math.floor(random() * 3)];
  pet.emoteUntil = pet.clock + 2;
  if (pet.ground) {
    pet.target = null; pet.intent = null; pet.vx = 0;
    pet.mode = sleeping ? "stretch" : "wave";
    pet.time = 0; pet.wait = 1.4;
    if (sleeping) pet.energy = Math.max(45, pet.energy);
  }
  return true;
}

// A sudden light/dark flip is startling, but reacting to every single toggle
// would read as robotic rather than alive - same cooldown-plus-chance shape
// as requestInterest, tuned for a rarer, more dramatic stimulus.
export function startleFromTheme(pet, random = Math.random) {
  if (pet.clock < pet.themeAfter) return false;
  pet.themeAfter = pet.clock + 25;
  if (random() >= 0.4) return false;
  pet.emote = "😮"; pet.emoteUntil = pet.clock + 1.2;
  pet.poseOverride = "startled"; pet.poseUntil = pet.clock + 1.2;
  return true;
}

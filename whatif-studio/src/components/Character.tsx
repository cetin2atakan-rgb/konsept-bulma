import React from "react";
import { interpolate, Easing } from "remotion";
import { Prop } from "./Props";
import { Emote } from "./Emotes";
import { HumanBody } from "./Human";

// ---------------------------------------------------------------------------
// Rig: feet at y=0, hips -125, shoulders -255, head centre -340 (r 62).
// Screen-left limbs are "l", screen-right "r". Angles in degrees, 0 = hanging
// down, positive = clockwise (so raising the left arm outward is +, the right -).
// ---------------------------------------------------------------------------
export type Pose = {
  la: number; le: number; ra: number; re: number;
  ll: number; lk: number; rl: number; rk: number;
  tilt: number; head: number; crouch?: number;
};

export type Rig = {
  shL: [number, number]; shR: [number, number]; l1: number; l2: number; headTop: number;
  anchors: Record<string, [number, number]>;
};

// cartoon rig (round head, ~3 heads tall)
export const CARTOON: Rig = {
  shL: [-40, -255], shR: [40, -255], l1: 72, l2: 66, headTop: -400,
  anchors: { chin: [24, -290], face: [8, -335], ear: [58, -340], hipL: [-40, -150], hipR: [40, -150], chestL: [32, -200], chestR: [-30, -192],
    front: [120, -200], phone: [105, -225], phone2: [100, -235], faceL: [-28, -320], faceR: [28, -320] },
};
// illustrated human rig (~6.5 heads tall, same overall height)
export const HUMAN: Rig = {
  shL: [-44, -378], shR: [44, -378], l1: 94, l2: 86, headTop: -490,
  anchors: { chin: [10, -398], face: [6, -440], ear: [34, -440], hipL: [-46, -250], hipR: [46, -250], chestL: [26, -322], chestR: [-26, -314],
    front: [140, -300], phone: [112, -296], phone2: [108, -306], faceL: [-14, -428], faceR: [14, -428] },
};

// two-bone IK: returns [upper, elbow] rotation for a hand target; bend +1/-1 picks elbow side
const ik = (s: [number, number], t: [number, number], bend: number, L1: number, L2: number): [number, number] => {
  const dx = t[0] - s[0], dy = t[1] - s[1];
  const d = Math.min(Math.max(Math.hypot(dx, dy), 8), L1 + L2 - 0.5);
  const th = Math.atan2(dy, dx);
  const al = Math.acos((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d));
  const ph = th + bend * al;
  const ex = s[0] + L1 * Math.cos(ph), ey = s[1] + L1 * Math.sin(ph);
  const ps = Math.atan2(t[1] - ey, t[0] - ex);
  const deg = (r: number) => (r * 180) / Math.PI;
  const ua = deg(ph) - 90;
  let re = deg(ps) - 90 - ua;
  re = ((re + 540) % 360) - 180;
  return [((ua + 540) % 360) - 180, re];
};

const base: Pose = { la: 8, le: -6, ra: -8, re: 6, ll: 4, lk: 0, rl: -4, rk: 0, tilt: 0, head: 0 };
type Src = Partial<Pose> & { lh?: [string, number]; rh?: [string, number] };
const SRC: Record<string, Src> = {
  idle: {},
  idle_b: { la: 14, le: -14, ra: -4, re: 20, tilt: 1.5, head: 4 },
  wave: { ra: -150, re: -25, tilt: -3, head: -4 },
  point: { ra: -95, re: 0, tilt: -2, head: -3 },
  point_b: { ra: -120, re: 4, tilt: -3, head: -6 },
  explain: { ra: -55, re: -45, head: 4 },
  explain_b: { la: 50, le: 40, ra: -55, re: -45, head: -3 },
  shrug: { la: 55, le: -115, ra: -55, re: 115, head: 9 },
  shrug_b: { la: 60, le: -125, ra: -60, re: 125, head: -8, tilt: 2 },
  think: { rh: ["chin", -1], la: 30, le: -95, head: 8 },
  think_b: { rh: ["chin", -1], la: 30, le: -95, head: -6, tilt: 2 },
  surprised: { la: 140, le: 25, ra: -140, re: -25, ll: 10, rl: -10, head: -5 },
  surprised_b: { la: 150, le: 35, ra: -150, re: -35, ll: 12, rl: -12, head: 5 },
  happy: { la: 150, le: -15, ra: -150, re: 15, ll: 8, rl: -8 },
  happy_b: { la: 165, le: -25, ra: -165, re: 25, ll: 10, rl: -10, head: 6 },
  cheer: { la: 165, le: -10, ra: -165, re: 10, ll: 12, rl: -12, head: -8 },
  stretch: { la: 172, le: 0, ra: -172, re: 0, head: -10 },
  skeptical: { lh: ["hipL", 1], rh: ["hipR", -1], tilt: -4, head: -8 },
  skeptical_b: { lh: ["hipL", 1], rh: ["hipR", -1], tilt: 3, head: 7 },
  hips: { lh: ["hipL", 1], rh: ["hipR", -1] },
  cross: { lh: ["chestL", -1], rh: ["chestR", 1], head: -4 },
  cross_b: { lh: ["chestL", -1], rh: ["chestR", 1], head: 7, tilt: 2 },
  facepalm: { rh: ["face", 1], la: 10, head: 14, tilt: 3 },
  phone: { rh: ["phone", -1], head: 12 },
  phone_b: { rh: ["phone2", -1], head: 16, tilt: 2 },
  call: { rh: ["ear", 1], head: -6 },
  hold: { rh: ["front", -1] },
  give: { ra: -78, re: -8, tilt: -4, head: -3 },
  scared: { lh: ["faceL", 1], rh: ["faceR", -1], ll: 10, rl: -10, lk: 6, rk: -6, head: 6, crouch: 14 },
  sad: { la: 4, le: -2, ra: -4, re: 2, tilt: 5, head: 18, crouch: 6 },
  sad_b: { la: 4, le: -2, ra: -4, re: 2, tilt: 5, head: 22, crouch: 8 },
  angry: { la: 25, le: -40, ra: -25, re: 40, ll: 12, rl: -12, tilt: -4, head: -10 },
  walk: { la: 0, le: -10, ra: 0, re: 10, ll: 0, rl: 0, tilt: 2 },
  run: { tilt: 8 },
  jump: { la: 150, le: -15, ra: -150, re: 15, ll: 30, lk: -60, rl: -30, rk: 60 },
};

const buildPoses = (rig: Rig): Record<string, Pose> => {
  const out: Record<string, Pose> = {};
  Object.entries(SRC).forEach(([k, o]) => {
    const p: any = { ...base, ...o };
    if (o.lh) [p.la, p.le] = ik(rig.shL, rig.anchors[o.lh[0]], o.lh[1], rig.l1, rig.l2);
    if (o.rh) [p.ra, p.re] = ik(rig.shR, rig.anchors[o.rh[0]], o.rh[1], rig.l1, rig.l2);
    delete p.lh; delete p.rh;
    out[k] = p;
  });
  return out;
};
export const POSES = buildPoses(CARTOON);
const POSES_HUMAN = buildPoses(HUMAN);

// Face presets: eyes / brows / mouth
type Face = { eyes: string; brows?: string; mouth?: string };
export const FACES: Record<string, Face> = {
  normal: { eyes: "dot" },
  happy: { eyes: "arc", brows: "up", mouth: "smile" },
  smile: { eyes: "dot", mouth: "smile" },
  angry: { eyes: "dot", brows: "angry", mouth: "frown" },
  sad: { eyes: "dot", brows: "sad", mouth: "frown" },
  shocked: { eyes: "wide", brows: "up", mouth: "o" },
  sleepy: { eyes: "closed" },
  skeptical: { eyes: "narrow", brows: "skeptic", mouth: "flat" },
  frustrated: { eyes: "xx", brows: "angry", mouth: "flat" },
  worried: { eyes: "dot", brows: "sad", mouth: "wavy" },
  smug: { eyes: "half", brows: "skeptic", mouth: "smirk" },
  awkward: { eyes: "dot", brows: "sad", mouth: "flat" },
  love: { eyes: "heart", mouth: "smile" },
};
const LEGACY_MOOD: Record<string, string> = { wide: "shocked", narrow: "skeptical", normal: "normal", sleepy: "sleepy", happy: "happy", awkward: "awkward" };

export type CharSpec = {
  id: string; x: number; color: string;
  pose?: string; pose2?: string; keys?: [string, number][];
  mood?: string; mood2?: string; face?: [string, number][];
  move?: { to: number; from?: number; until?: number; run?: boolean };
  act?: [string, number][]; // jump | nod | shake | shiver | hop
  emote?: [string, number][];
  prop?: string; propAt?: number; propHand?: "r" | "l";
  glow?: string | null; glowAt?: number;
  facing?: number; look?: number; scale?: number; hat?: string | null; hair?: string | null; enter?: string | null;
  body?: "tall" | "short" | "wide" | "kid";
  style?: "cartoon" | "human"; skin?: string; hairColor?: string; pants?: string; outfit?: string; sleeves?: "short" | "long"; female?: boolean;
};

const mix = (a: Pose, b: Pose, t: number): Pose => {
  const o: any = {};
  (Object.keys(base) as (keyof Pose)[]).forEach((k) => (o[k] = (a[k] ?? 0) + ((b[k] ?? 0) - (a[k] ?? 0)) * t));
  return o;
};

const shade = (hex: string, f: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (s: number) => Math.max(0, Math.min(255, Math.round(((n >> s) & 255) * f)));
  return `rgb(${c(16)},${c(8)},${c(0)})`;
};

const hash = (s: string) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973; return h; };

const Limb: React.FC<{ x: number; y: number; a: number; b: number; l1: number; l2: number; w: number; color: string; color2?: string; outline?: string; end: React.ReactNode }> =
  ({ x, y, a, b, l1, l2, w, color, color2, outline, end }) => (
    <g transform={`translate(${x},${y}) rotate(${a})`}>
      {outline && <line x1={0} y1={0} x2={0} y2={l1} stroke={outline} strokeWidth={w + 7} strokeLinecap="round" />}
      <line x1={0} y1={0} x2={0} y2={l1} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <g transform={`translate(0,${l1}) rotate(${b})`}>
        {outline && <line x1={0} y1={0} x2={0} y2={l2} stroke={outline} strokeWidth={w + 7} strokeLinecap="round" />}
        <line x1={0} y1={0} x2={0} y2={l2} stroke={color2 ?? color} strokeWidth={w} strokeLinecap="round" />
        <g transform={`translate(0,${l2})`}>{end}</g>
      </g>
    </g>
  );

// build the key list: explicit keys > pose/pose2 > single pose with automatic variation every ~1.7 s
const buildKeys = (c: CharSpec, dur: number): [string, number][] => {
  if (c.keys?.length) return c.keys;
  if (c.pose2) return [[c.pose ?? "idle", 0], [c.pose2, 0.5]];
  const p = c.pose ?? "idle";
  if (POSES[p + "_b"] && dur > 80) {
    const k: [string, number][] = [];
    const step = 52 / dur;
    const off = (hash(c.id) % 20) / dur;
    for (let t = 0, i = 0; t < 1; t += step, i++) k.push([i % 2 ? p + "_b" : p, i === 0 ? 0 : t + off]);
    return k;
  }
  return [[p, 0]];
};

const keyAt = <T,>(keys: [T, number][], f: number, dur: number) => {
  let i = 0;
  keys.forEach((k, j) => { if (f >= k[1] * dur) i = j; });
  return { i, start: keys[i][1] * dur };
};

export const Character: React.FC<{ c: CharSpec; frame: number; dur: number; y: number; scale: number; others?: number[] }> = ({ c, frame, dur, y, scale }) => {
  const seed = hash(c.id);
  const human = c.style === "human";
  const PS = human ? POSES_HUMAN : POSES;
  const rig = human ? HUMAN : CARTOON;
  const keys = buildKeys(c, dur);
  const { i: ki, start: kStart } = keyAt(keys, frame, dur);
  const prev = PS[keys[Math.max(0, ki - 1)][0]] ?? PS.idle;
  const cur = PS[keys[ki][0]] ?? PS.idle;
  const since = frame - kStart;
  const bl = ki === 0 ? 1 : interpolate(since, [0, 9], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.8)) });
  let pose = mix(prev, cur, bl);
  const poseName = keys[ki][0];

  // movement across the floor
  let x = c.x, moving = false, dir = c.facing ?? 1;
  if (c.move) {
    const f0 = (c.move.from ?? 0) * dur, f1 = (c.move.until ?? 0.6) * dur;
    x = interpolate(frame, [f0, f1], [c.x, c.move.to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
    moving = frame > f0 && frame < f1;
    if (c.facing === undefined) dir = c.move.to >= c.x ? 1 : -1;
  }
  const walking = moving || poseName === "walk" || poseName === "run";
  const running = c.move?.run || poseName === "run";
  const breath = Math.sin(frame / 14 + seed) * 2.5;
  if (walking) {
    const sp = running ? 2.6 : 4.2;
    const s = Math.sin(frame / sp);
    const amp = running ? 38 : 24;
    pose = { ...pose, ll: amp * s, rl: -amp * s, lk: Math.max(0, -amp * 1.3 * s), rk: Math.max(0, amp * 1.3 * s) };
    if (poseName === "walk" || poseName === "run" || moving && ["idle", "idle_b"].includes(poseName))
      pose = { ...pose, la: -amp * 0.9 * s + 6, ra: -amp * 0.9 * s - 6, le: running ? -70 : -10, re: running ? 70 : 10, tilt: running ? 8 : 2 };
  } else {
    pose = { ...pose, la: pose.la + Math.sin(frame / 18 + seed) * 2.5, ra: pose.ra - Math.sin(frame / 21 + seed) * 2.5, head: pose.head + Math.sin(frame / 33 + seed) * 2 };
  }
  if (poseName === "wave") pose = { ...pose, re: pose.re + Math.sin(frame / 3) * 22 };

  // actions: jump / hop / nod / shake / shiver
  let jy = 0, sqx = 1, sqy = 1, extraHead = 0, shiverX = 0;
  (c.act ?? []).forEach(([a, at]) => {
    const f = frame - at * dur;
    if (a === "jump" || a === "hop") {
      const T = a === "jump" ? 22 : 14, H = a === "jump" ? 170 : 70;
      if (f > -6 && f < 0) { const k = (f + 6) / 6; sqy *= 1 - 0.12 * k; sqx *= 1 + 0.08 * k; }
      if (f >= 0 && f <= T) { const u = f / T; jy -= 4 * H * u * (1 - u); sqy *= 1 + 0.1 * Math.sin(u * Math.PI); sqx *= 1 - 0.06 * Math.sin(u * Math.PI);
        pose = mix(pose, PS.jump, Math.sin(u * Math.PI) * 0.8); }
      if (f > T && f < T + 8) { const k = 1 - (f - T) / 8; sqy *= 1 - 0.1 * k; sqx *= 1 + 0.07 * k; }
    }
    if (a === "nod" && f >= 0 && f < 24) extraHead += Math.sin((f / 24) * Math.PI * 4) * 10;
    if (a === "shake" && f >= 0 && f < 30) pose = { ...pose, head: pose.head + Math.sin((f / 30) * Math.PI * 6) * 12 };
    if (a === "shiver" && f >= 0 && f < 40) shiverX = Math.sin(f * 2.2) * 4;
  });

  // squash on every pose change (snap feel)
  if (ki > 0 && since >= 0 && since < 12) { const q = Math.sin((since / 12) * Math.PI * 2) * 0.05 * (1 - since / 12); sqy *= 1 - q; sqx *= 1 + q * 0.6; }

  const crouch = pose.crouch ?? 0;
  const bob = walking ? Math.abs(Math.sin(frame / (running ? 2.6 : 4.2))) * (running ? -16 : -10) : breath;

  // entrance
  const enterOff = c.enter === "right" ? interpolate(frame, [0, 18], [800, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
    : c.enter === "left" ? interpolate(frame, [0, 18], [-800, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }) : 0;
  const popIn = c.enter === "pop" ? interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(2.2)) })
    : c.enter ? 1 : interpolate(frame, [0, 8], [0.88, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });

  // face
  const faceKeys: [string, number][] = c.face ?? (c.mood2 ? [[LEGACY_MOOD[c.mood ?? "normal"] ?? "normal", 0], [LEGACY_MOOD[c.mood2] ?? "normal", 0.5]] : [[LEGACY_MOOD[c.mood ?? "normal"] ?? c.mood ?? "normal", 0]]);
  const fk = keyAt(faceKeys, frame, dur);
  const face = FACES[faceKeys[fk.i][0]] ?? FACES.normal;
  const faceSince = frame - fk.start;

  const body = c.body ?? "normal";
  const bw = body === "wide" ? 1.25 : body === "kid" ? 0.95 : 1;
  const bh = body === "tall" ? 1.12 : body === "short" ? 0.9 : body === "kid" ? 0.78 : 1;
  const sc = (c.scale ?? 1) * scale * popIn * (human ? 0.8 : 1); // human rig is taller; keep the same screen height
  const facing = dir;
  const pants = "#2b2d42";
  const skin = "#1d1d1f";
  const propOn = c.prop && frame >= (c.propAt ?? 0) * dur;
  const propPop = propOn ? interpolate(frame - (c.propAt ?? 0) * dur, [0, 8], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(2.5)) }) : 0;
  const glowOn = c.glow && frame >= (c.glowAt ?? 0) * dur;
  const glowK = glowOn ? interpolate(frame - (c.glowAt ?? 0) * dur, [0, 14], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }) : 0;

  const handProp = (side: "r" | "l") => propOn && (c.propHand ?? "r") === side ? (
    <g transform={`scale(${propPop})`}><g transform={`rotate(${-(side === "r" ? pose.ra + pose.re : pose.la + pose.le) - pose.tilt})`}><Prop name={c.prop!} frame={frame} /></g></g>
  ) : null;

  const gaze = (c.look ?? 0.4) * 6 + Math.sin(frame / 47 + seed) * 2;

  return (
    <g transform={`translate(${x + enterOff + shiverX},${y + jy})`}>
      {glowOn && (
        <g opacity={(0.55 + Math.sin(frame / 10) * 0.12) * glowK} transform={`scale(${sc * (0.6 + 0.4 * glowK)})`}>
          <ellipse cx={0} cy={-230 * bh} rx={200} ry={310 * bh} fill={c.glow!} filter="url(#glowBlur)" />
        </g>
      )}
      <ellipse cx={0} cy={6} rx={95 * sc * bw} ry={14 * sc} fill="rgba(0,0,0,0.18)" opacity={1 + jy / 300} />
      <g transform={`translate(0,${bob}) scale(${sc * facing * sqx},${sc * sqy})`}>
        <g transform={`scale(${bw},${bh})`}>
          {human ? <HumanBody c={c} pose={pose} frame={frame} seed={seed} gaze={gaze} face={face} faceSince={faceSince} handProp={handProp} /> : (
          <g transform={`translate(0,${crouch}) rotate(${pose.tilt},0,-120)`}>
            <Limb x={-22} y={-125} a={pose.ll} b={pose.lk} l1={64} l2={66} w={24} color={pants} end={<ellipse cx={-10} cy={4} rx={24} ry={11} fill="#111" />} />
            <Limb x={22} y={-125} a={pose.rl} b={pose.rk} l1={64} l2={66} w={24} color={pants} end={<ellipse cx={10} cy={4} rx={24} ry={11} fill="#111" />} />
            <Limb x={CARTOON.shL[0]} y={CARTOON.shL[1]} a={pose.la} b={pose.le} l1={CARTOON.l1} l2={CARTOON.l2} w={22} color={shade(c.color, 0.82)} color2={shade(c.color, 0.82)}
              end={<g><circle r={13} fill={skin} />{handProp("l")}</g>} />
            <path d="M -48 -268 Q -54 -200 -46 -128 Q 0 -112 46 -128 Q 54 -200 48 -268 Q 0 -286 -48 -268 Z" fill={c.color} />
            <path d="M -20 -200 Q 0 -192 20 -200 L 18 -160 Q 0 -154 -18 -160 Z" fill={shade(c.color, 0.8)} opacity={0.6} />
            <path d="M -22 -270 Q 0 -250 22 -270" stroke={shade(c.color, 0.7)} strokeWidth={6} fill="none" />
            <g transform={`rotate(${pose.head + extraHead},0,-280)`}>
              <ellipse cx={0} cy={-300} rx={56} ry={12} fill={shade(c.color, 0.72)} />
              <circle cx={0} cy={-340} r={62} fill={skin} />
              {c.hair === "gray" && <path d="M -58 -360 Q -40 -408 0 -404 Q 40 -408 58 -360 Q 40 -388 0 -386 Q -40 -388 -58 -360 Z" fill="#c9c9c9" />}
              {c.hair === "bun" && <circle cx={-30} cy={-402} r={24} fill="#3b2a20" />}
              {c.hair === "long" && <path d="M -62 -350 Q -70 -280 -50 -250 L -40 -300 Z M 62 -350 Q 70 -280 50 -250 L 40 -300 Z" fill="#3b2a20" />}
              {c.hair === "pony" && <path d="M -50 -385 Q -95 -380 -100 -320 Q -80 -350 -55 -360 Z" fill="#3b2a20" />}
              <FaceDraw face={face} frame={frame} seed={seed} gaze={gaze} since={faceSince} />
              {c.hat === "cap" && <path d="M -62 -360 Q -60 -414 0 -414 Q 60 -414 62 -360 Z M 50 -362 L 105 -356 L 52 -350 Z" fill="#e63946" />}
              {c.hat === "flat" && <path d="M -66 -370 Q -40 -410 30 -404 Q 70 -396 78 -372 Q 10 -362 -66 -370 Z" fill="#6b705c" />}
              {c.hat === "paper" && <path d="M -56 -378 L 56 -378 L 44 -420 L -44 -420 Z" fill="#fff" stroke="#ddd" strokeWidth={3} />}
              {c.hat === "fedora" && <path d="M -90 -372 Q 0 -360 90 -372 Q 70 -384 52 -384 Q 50 -430 0 -428 Q -50 -430 -52 -384 Q -70 -384 -90 -372 Z" fill="#4a3b2f" />}
            </g>
            <Limb x={CARTOON.shR[0]} y={CARTOON.shR[1]} a={pose.ra} b={pose.re} l1={CARTOON.l1} l2={CARTOON.l2} w={22} color={c.color} outline={shade(c.color, 0.55)}
              end={<g><circle r={13} fill={skin} />{handProp("r")}</g>} />
          </g>)}
        </g>
      </g>
      {(c.emote ?? []).map(([e, at], i) => {
        const f = frame - at * dur;
        if (f < 0) return null;
        return <g key={i} transform={`translate(${70 * sc * facing},${rig.headTop * sc * bh + bob})`}><Emote name={e} f={f} s={sc} /></g>;
      })}
    </g>
  );
};

const FaceDraw: React.FC<{ face: Face; frame: number; seed: number; gaze: number; since: number }> = ({ face, frame, seed, gaze, since }) => {
  const blink = ((frame + seed * 13) % 103) < 4 ? 0.1 : 1;
  const pop = interpolate(since, [0, 6], [0.6, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(3)) });
  const ex = [-20, 24], ey = -342;
  const W = "#fff";
  const eyes = () => {
    switch (face.eyes) {
      case "arc": return ex.map((x, i) => <path key={i} d={`M ${x - 13} ${ey + 6} Q ${x} ${ey - 14} ${x + 13} ${ey + 6}`} stroke={W} strokeWidth={7} fill="none" strokeLinecap="round" />);
      case "closed": return ex.map((x, i) => <path key={i} d={`M ${x - 13} ${ey} Q ${x} ${ey + 8} ${x + 13} ${ey}`} stroke={W} strokeWidth={6} fill="none" strokeLinecap="round" />);
      case "xx": return [<path key={0} d={`M ${ex[0] - 12} ${ey - 10} L ${ex[0] + 10} ${ey} L ${ex[0] - 12} ${ey + 10}`} stroke={W} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />,
        <path key={1} d={`M ${ex[1] + 12} ${ey - 10} L ${ex[1] - 10} ${ey} L ${ex[1] + 12} ${ey + 10}`} stroke={W} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />];
      case "heart": return ex.map((x, i) => <path key={i} transform={`translate(${x},${ey}) scale(${pop})`} d="M 0 10 C -22 -4 -12 -20 0 -9 C 12 -20 22 -4 0 10 Z" fill="#ff5d8f" />);
      case "wide": return ex.map((x, i) => <g key={i}><ellipse cx={x} cy={ey} rx={17 * pop} ry={24 * blink * pop} fill={W} /><circle cx={x + gaze * 0.5} cy={ey} r={4} fill="#111" opacity={blink} /></g>);
      case "narrow": return ex.map((x, i) => <g key={i}><ellipse cx={x} cy={ey} rx={13} ry={8 * blink} fill={W} /><circle cx={x + gaze} cy={ey} r={5} fill="#111" opacity={blink} /></g>);
      case "half": return ex.map((x, i) => <g key={i}><path d={`M ${x - 13} ${ey - 2} L ${x + 13} ${ey - 2} Q ${x + 13} ${ey + 14} ${x} ${ey + 14} Q ${x - 13} ${ey + 14} ${x - 13} ${ey - 2} Z`} fill={W} /><circle cx={x + gaze} cy={ey + 6} r={5} fill="#111" /></g>);
      default: return ex.map((x, i) => <g key={i}><ellipse cx={x} cy={ey} rx={13} ry={18 * blink} fill={W} /><circle cx={x + gaze} cy={ey + 1} r={5.5} fill="#111" opacity={blink} /></g>);
    }
  };
  const brows = () => {
    const by = ey - 30;
    switch (face.brows) {
      case "angry": return [<line key={0} x1={ex[0] - 16} y1={by - 6} x2={ex[0] + 12} y2={by + 6} stroke={W} strokeWidth={6} strokeLinecap="round" />, <line key={1} x1={ex[1] + 16} y1={by - 6} x2={ex[1] - 12} y2={by + 6} stroke={W} strokeWidth={6} strokeLinecap="round" />];
      case "sad": return [<line key={0} x1={ex[0] - 16} y1={by + 6} x2={ex[0] + 12} y2={by - 6} stroke={W} strokeWidth={6} strokeLinecap="round" />, <line key={1} x1={ex[1] + 16} y1={by + 6} x2={ex[1] - 12} y2={by - 6} stroke={W} strokeWidth={6} strokeLinecap="round" />];
      case "up": return ex.map((x, i) => <path key={i} d={`M ${x - 14} ${by - 4} Q ${x} ${by - 16} ${x + 14} ${by - 4}`} stroke={W} strokeWidth={6} fill="none" strokeLinecap="round" />);
      case "skeptic": return [<line key={0} x1={ex[0] - 14} y1={by + 4} x2={ex[0] + 14} y2={by + 4} stroke={W} strokeWidth={6} strokeLinecap="round" />, <path key={1} d={`M ${ex[1] - 14} ${by - 2} Q ${ex[1]} ${by - 16} ${ex[1] + 14} ${by - 6}`} stroke={W} strokeWidth={6} fill="none" strokeLinecap="round" />];
      default: return null;
    }
  };
  const mouth = () => {
    const my = -304, mx = 4;
    switch (face.mouth) {
      case "smile": return <path d={`M ${mx - 18} ${my - 4} Q ${mx} ${my + 14} ${mx + 18} ${my - 4}`} stroke={W} strokeWidth={6} fill="none" strokeLinecap="round" />;
      case "frown": return <path d={`M ${mx - 16} ${my + 6} Q ${mx} ${my - 8} ${mx + 16} ${my + 6}`} stroke={W} strokeWidth={6} fill="none" strokeLinecap="round" />;
      case "o": return <ellipse cx={mx} cy={my} rx={9 * pop} ry={12 * pop} fill={W} />;
      case "flat": return <line x1={mx - 14} y1={my} x2={mx + 14} y2={my} stroke={W} strokeWidth={6} strokeLinecap="round" />;
      case "wavy": return <path d={`M ${mx - 18} ${my} q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0`} stroke={W} strokeWidth={5} fill="none" strokeLinecap="round" />;
      case "smirk": return <path d={`M ${mx - 14} ${my + 2} Q ${mx + 6} ${my + 6} ${mx + 18} ${my - 8}`} stroke={W} strokeWidth={6} fill="none" strokeLinecap="round" />;
      default: return null;
    }
  };
  return <g transform="translate(6,0)">{eyes()}{brows()}{mouth()}</g>;
};

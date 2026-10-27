import React from "react";
import { interpolate, Easing } from "remotion";

export type Pose = {
  la: number; le: number; ra: number; re: number; // left/right shoulder + elbow (deg, 0 = arm hanging down)
  ll: number; lk: number; rl: number; rk: number; // hips + knees
  tilt: number; head: number;
};

// Screen-left limb = "l". SVG rotation is clockwise, so raising the left arm outward is +, the right arm outward is -.
export const POSES: Record<string, Pose> = {
  idle:      { la: 8,   le: -6,   ra: -8,   re: 6,    ll: 4,  lk: 0, rl: -4, rk: 0, tilt: 0,  head: 0 },
  wave:      { la: 8,   le: -6,   ra: -150, re: -25,  ll: 4,  lk: 0, rl: -4, rk: 0, tilt: -3, head: -4 },
  point:     { la: 10,  le: -8,   ra: -95,  re: 0,    ll: 6,  lk: 0, rl: -6, rk: 0, tilt: -2, head: -3 },
  shrug:     { la: 55,  le: -115, ra: -55,  re: 115,  ll: 5,  lk: 0, rl: -5, rk: 0, tilt: 0,  head: 9 },
  think:     { la: 25,  le: -100, ra: -30,  re: -140, ll: 3,  lk: 0, rl: -3, rk: 0, tilt: 2,  head: 8 },
  surprised: { la: 140, le: 25,   ra: -140, re: -25,  ll: 10, lk: 0, rl: -10, rk: 0, tilt: 0, head: -5 },
  happy:     { la: 150, le: -15,  ra: -150, re: 15,   ll: 8,  lk: 0, rl: -8, rk: 0, tilt: 0,  head: 0 },
  stretch:   { la: 172, le: 0,    ra: -172, re: 0,    ll: 3,  lk: 0, rl: -3, rk: 0, tilt: 0,  head: -10 },
  skeptical: { la: 35,  le: -120, ra: -35,  re: 120,  ll: 6,  lk: 0, rl: -6, rk: 0, tilt: -4, head: -8 },
  walk:      { la: 0,   le: -10,  ra: 0,    re: 10,   ll: 0,  lk: 0, rl: 0,  rk: 0, tilt: 2,  head: 0 },
};

const mix = (a: Pose, b: Pose, t: number): Pose => {
  const o: any = {};
  (Object.keys(a) as (keyof Pose)[]).forEach((k) => (o[k] = a[k] + (b[k] - a[k]) * t));
  return o;
};

type Props = {
  frame: number; x: number; y: number; scale?: number; color: string;
  pose: string; pose2?: string; switchAt?: number; dur: number;
  facing?: number; glow?: string | null; mood?: string; mood2?: string;
  hat?: string | null; hair?: string | null; enter?: string | null;
};

const Limb: React.FC<{ x: number; y: number; a: number; b: number; l1: number; l2: number; w: number; color: string; end: React.ReactNode }> =
  ({ x, y, a, b, l1, l2, w, color, end }) => (
    <g transform={`translate(${x},${y}) rotate(${a})`}>
      <line x1={0} y1={0} x2={0} y2={l1} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <g transform={`translate(0,${l1}) rotate(${b})`}>
        <line x1={0} y1={0} x2={0} y2={l2} stroke={color} strokeWidth={w} strokeLinecap="round" />
        <g transform={`translate(0,${l2})`}>{end}</g>
      </g>
    </g>
  );

const shade = (hex: string, f: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (s: number) => Math.max(0, Math.min(255, Math.round(((n >> s) & 255) * f)));
  return `rgb(${c(16)},${c(8)},${c(0)})`;
};

export const StickFigure: React.FC<Props> = (p) => {
  const { frame, dur } = p;
  const switchAt = (p.switchAt ?? 0.5) * dur;
  // pose blend: start pose -> optional second pose around switchAt
  const blend = p.pose2 ? interpolate(frame, [switchAt - 6, switchAt + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }) : 0;
  let pose = mix(POSES[p.pose] ?? POSES.idle, POSES[p.pose2 ?? p.pose] ?? POSES.idle, blend);
  const walking = (p.pose === "walk" && blend < 0.5) || (p.pose2 === "walk" && blend >= 0.5);
  const breath = Math.sin(frame / 14) * 2.5;
  if (walking) {
    const s = Math.sin(frame / 4.2);
    pose = { ...pose, ll: 24 * s, rl: -24 * s, lk: Math.max(0, -28 * s), rk: Math.max(0, 28 * s), la: -20 * s + 6, ra: -20 * s - 6 };
  } else {
    pose = { ...pose, la: pose.la + Math.sin(frame / 18) * 2, ra: pose.ra - Math.sin(frame / 18) * 2 };
  }
  const bob = walking ? Math.abs(Math.sin(frame / 4.2)) * -10 : breath;
  // entrance slide
  const enterOff = p.enter === "right" ? interpolate(frame, [0, 18], [700, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
    : p.enter === "left" ? interpolate(frame, [0, 18], [-700, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }) : 0;
  // pop-in for figures without entrance
  const popIn = p.enter ? 1 : interpolate(frame, [0, 8], [0.85, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });

  const mood = blend >= 0.5 && p.mood2 ? p.mood2 : p.mood ?? "normal";
  const blink = (frame % 97) < 4 ? 0.12 : 1;
  const eyeRy = mood === "sleepy" ? 5 : mood === "wide" ? 24 : mood === "narrow" ? 9 : mood === "happy" ? 14 : 18;
  const eyeRx = mood === "wide" ? 16 : 13;
  const facing = p.facing ?? 1;
  const sc = (p.scale ?? 1) * popIn;
  const pants = "#2b2d42";
  const skin = "#1d1d1f";

  return (
    <g transform={`translate(${p.x + enterOff},${p.y + bob}) scale(${sc * facing},${sc})`}>
      {p.glow && (
        <g opacity={0.55 + Math.sin(frame / 10) * 0.12}>
          <ellipse cx={0} cy={-230} rx={190} ry={300} fill={p.glow} filter="url(#glowBlur)" />
        </g>
      )}
      <ellipse cx={0} cy={6} rx={95} ry={14} fill="rgba(0,0,0,0.18)" />
      <g transform={`rotate(${pose.tilt},0,-120)`}>
        {/* legs */}
        <Limb x={-22} y={-125} a={pose.ll} b={pose.lk} l1={64} l2={66} w={24} color={pants} end={<ellipse cx={-10} cy={4} rx={24} ry={11} fill="#111" />} />
        <Limb x={22} y={-125} a={pose.rl} b={pose.rk} l1={64} l2={66} w={24} color={pants} end={<ellipse cx={10} cy={4} rx={24} ry={11} fill="#111" />} />
        {/* back arm */}
        <Limb x={-40} y={-255} a={pose.la} b={pose.le} l1={72} l2={66} w={22} color={shade(p.color, 0.85)} end={<circle r={13} fill={skin} />} />
        {/* torso (hoodie) */}
        <path d="M -48 -268 Q -54 -200 -46 -128 Q 0 -112 46 -128 Q 54 -200 48 -268 Q 0 -286 -48 -268 Z" fill={p.color} />
        <path d="M -20 -200 Q 0 -192 20 -200 L 18 -160 Q 0 -154 -18 -160 Z" fill={shade(p.color, 0.8)} opacity={0.6} />
        {/* front arm */}
        <Limb x={40} y={-255} a={pose.ra} b={pose.re} l1={72} l2={66} w={22} color={p.color} end={<circle r={13} fill={skin} />} />
        {/* head */}
        <g transform={`rotate(${pose.head},0,-270)`}>
          <ellipse cx={0} cy={-300} rx={56} ry={12} fill={shade(p.color, 0.75)} />
          <circle cx={0} cy={-340} r={62} fill={skin} />
          {p.hair === "gray" && <path d="M -58 -360 Q -40 -408 0 -404 Q 40 -408 58 -360 Q 40 -388 0 -386 Q -40 -388 -58 -360 Z" fill="#c9c9c9" />}
          {p.hair === "bun" && <circle cx={-30} cy={-400} r={24} fill="#3b2a20" />}
          <g transform={`translate(10,0)`}>
            <ellipse cx={-22} cy={-342} rx={eyeRx} ry={eyeRy * blink} fill="#fff" />
            <ellipse cx={22} cy={-342} rx={eyeRx} ry={eyeRy * blink} fill="#fff" />
            {mood !== "sleepy" && <><circle cx={-18} cy={-340} r={5} fill="#111" opacity={blink} /><circle cx={26} cy={-340} r={5} fill="#111" opacity={blink} /></>}
            {mood === "happy" && <path d="M -14 -306 Q 6 -292 26 -306" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" />}
            {mood === "awkward" && <path d="M -10 -304 L 24 -308" stroke="#fff" strokeWidth={5} strokeLinecap="round" />}
            {mood === "narrow" && <><line x1={-38} y1={-366} x2={-8} y2={-358} stroke="#fff" strokeWidth={5} strokeLinecap="round" /><line x1={38} y1={-366} x2={8} y2={-358} stroke="#fff" strokeWidth={5} strokeLinecap="round" /></>}
            {mood === "wide" && <ellipse cx={6} cy={-302} rx={8} ry={10} fill="#fff" />}
          </g>
          {p.hat === "cap" && <path d="M -62 -360 Q -60 -414 0 -414 Q 60 -414 62 -360 Z M 50 -362 L 105 -356 L 52 -350 Z" fill="#e63946" />}
          {p.hat === "flat" && <path d="M -66 -370 Q -40 -410 30 -404 Q 70 -396 78 -372 Q 10 -362 -66 -370 Z" fill="#6b705c" />}
          {p.hat === "paper" && <path d="M -56 -378 L 56 -378 L 44 -420 L -44 -420 Z" fill="#fff" stroke="#ddd" strokeWidth={3} />}
        </g>
      </g>
    </g>
  );
};

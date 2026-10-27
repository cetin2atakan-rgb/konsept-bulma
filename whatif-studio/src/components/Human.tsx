import React from "react";
import { interpolate, Easing } from "remotion";
import type { Pose, CharSpec } from "./Character";

// Illustrated "human" body for the same rig angles as the cartoon figure.
// Proportions ~6 heads; feet y=0, hips -235, shoulders -378, head centre -442.

const OUT = "#3a2a20";
const SKINS = ["#f1c27d", "#e0ac69", "#ffdbac", "#c68642", "#8d5524", "#f3d1b5"];
const HAIRS = ["#2b1d14", "#4a3222", "#6b4423", "#1b1b1b", "#a0522d", "#d9b26f"];

const shade = (hex: string, f: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (s: number) => Math.max(0, Math.min(255, Math.round(((n >> s) & 255) * f)));
  return `rgb(${c(16)},${c(8)},${c(0)})`;
};

const Seg: React.FC<{ len: number; w: number; w2?: number; color: string }> = ({ len, w, w2, color }) => {
  const b = w2 ?? w * 0.82;
  // tapered capsule along +y
  const d = `M ${-w / 2} 0 L ${-b / 2} ${len} A ${b / 2} ${b / 2} 0 0 0 ${b / 2} ${len} L ${w / 2} 0 A ${w / 2} ${w / 2} 0 0 0 ${-w / 2} 0 Z`;
  return <path d={d} fill={color} stroke={OUT} strokeWidth={2.5} strokeLinejoin="round" />;
};

const Arm: React.FC<{ x: number; y: number; a: number; b: number; sleeve: string; skin: string; short: boolean; hand: React.ReactNode }> = ({ x, y, a, b, sleeve, skin, short, hand }) => (
  <g transform={`translate(${x},${y}) rotate(${a})`}>
    <Seg len={94} w={30} w2={25} color={sleeve} />
    {short && <path d="M -16 40 L 16 40" stroke={OUT} strokeWidth={2.5} />}
    <g transform={`translate(0,94) rotate(${b})`}>
      <Seg len={84} w={short ? 21 : 25} w2={short ? 17 : 21} color={short ? skin : sleeve} />
      {!short && <rect x={-12} y={68} width={24} height={10} rx={3} fill={shade(sleeve, 1.1)} stroke={OUT} strokeWidth={2} />}
      <g transform="translate(0,90)">{hand}</g>
    </g>
  </g>
);

const Leg: React.FC<{ x: number; a: number; b: number; color: string; shoe: string; skin?: string }> = ({ x, a, b, color, shoe, skin }) => (
  <g transform={`translate(${x},-235) rotate(${a})`}>
    <Seg len={116} w={38} w2={31} color={color} />
    <g transform={`translate(0,116) rotate(${b})`}>
      <Seg len={108} w={31} w2={24} color={skin ?? color} />
      <g transform={`translate(0,112) rotate(${-(a + b)})`}>
        <path d="M -16 -10 Q -18 8 0 9 L 34 9 Q 40 -2 26 -8 Q 10 -14 -16 -10 Z" fill={shoe} stroke={OUT} strokeWidth={2.5} />
      </g>
    </g>
  </g>
);

export const HumanBody: React.FC<{
  c: CharSpec; pose: Pose; frame: number; seed: number; gaze: number; face: { eyes: string; brows?: string; mouth?: string }; faceSince: number;
  handProp: (side: "r" | "l") => React.ReactNode;
}> = ({ c, pose, frame, seed, gaze, face, faceSince, handProp }) => {
  const skin = c.skin ?? SKINS[seed % SKINS.length];
  const skinD = shade(skin, 0.82);
  const hairC = c.hairColor ?? (c.hair === "gray" ? "#bdbdbd" : HAIRS[(seed >> 2) % HAIRS.length]);
  const shirt = c.color;
  const pants = c.pants ?? "#34405a";
  const shoe = "#3b2a20";
  const outfit = c.outfit ?? (c.female ? "dress" : "shirt");
  const short = c.sleeves === "short";
  const hair = c.hair ?? (c.female ? "long" : ["short", "side", "short", "bald"][seed % 4]);
  const hand = (side: "r" | "l") => (
    <g>
      <ellipse cx={0} cy={4} rx={12} ry={14} fill={skin} stroke={OUT} strokeWidth={2.5} />
      <ellipse cx={side === "r" ? -9 : 9} cy={-1} rx={5} ry={8} fill={skin} stroke={OUT} strokeWidth={2} transform={`rotate(${side === "r" ? 25 : -25})`} />
      {handProp(side)}
    </g>
  );
  const crouch = pose.crouch ?? 0;
  const dress = outfit === "dress";

  return (
    <g transform={`translate(0,${crouch}) rotate(${pose.tilt},0,-235)`}>
      {/* hair behind head */}
      <g transform={`rotate(${pose.head},0,-400)`}>
        {hair === "long" && <path d="M -42 -455 Q -50 -360 -36 -330 L 36 -330 Q 50 -360 42 -455 Z" fill={hairC} stroke={OUT} strokeWidth={2.5} />}
        {hair === "pony" && <path d="M -30 -470 Q -80 -455 -70 -380 Q -60 -420 -32 -440 Z" fill={hairC} stroke={OUT} strokeWidth={2.5} />}
      </g>
      {/* back arm */}
      <Arm x={-44} y={-378} a={pose.la} b={pose.le} sleeve={shade(shirt, 0.82)} skin={skinD} short={short} hand={hand("l")} />
      {/* legs */}
      <Leg x={-18} a={pose.ll} b={pose.lk} color={dress ? skinD : shade(pants, 0.9)} shoe={shoe} skin={dress ? skinD : undefined} />
      <Leg x={18} a={pose.rl} b={pose.rk} color={dress ? skin : pants} shoe={shoe} skin={dress ? skin : undefined} />
      {/* hips / skirt */}
      {dress
        ? <path d="M -44 -262 L 44 -262 L 70 -140 Q 0 -126 -70 -140 Z" fill={shirt} stroke={OUT} strokeWidth={2.5} strokeLinejoin="round" />
        : <path d="M -44 -258 L 44 -258 L 46 -214 Q 0 -206 -46 -214 Z" fill={pants} stroke={OUT} strokeWidth={2.5} />}
      {/* neck */}
      <rect x={-12} y={-412} width={24} height={36} fill={skinD} stroke={OUT} strokeWidth={2.5} />
      {/* torso */}
      <path d="M -30 -392 Q 0 -398 30 -392 Q 58 -388 57 -360 L 46 -252 Q 0 -244 -46 -252 L -57 -360 Q -58 -388 -30 -392 Z" fill={shirt} stroke={OUT} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M 30 -390 Q 56 -386 55 -360 L 45 -254 Q 34 -250 26 -250 L 36 -360 Z" fill={shade(shirt, 0.86)} />
      {outfit === "suit" && <path d="M -18 -392 L 0 -330 L 18 -392 L 30 -390 L 4 -300 L -4 -300 L -30 -390 Z" fill={shade(shirt, 0.7)} stroke={OUT} strokeWidth={2} />}
      {outfit === "suit" && <path d="M -10 -392 L 0 -350 L 10 -392 Z" fill="#fff" />}
      {outfit === "suit" && <path d="M -4 -380 L 4 -380 L 6 -330 L 0 -322 L -6 -330 Z" fill="#8b1e2d" />}
      {outfit !== "suit" && <path d="M -14 -394 L 0 -372 L 14 -394 Z" fill={skinD} stroke={OUT} strokeWidth={2} />}
      {outfit === "shirt" && <><path d="M -16 -396 L -2 -378 L -24 -380 Z M 16 -396 L 2 -378 L 24 -380 Z" fill={shade(shirt, 1.12)} stroke={OUT} strokeWidth={2} />
        {[-350, -320, -290].map((y) => <circle key={y} cx={0} cy={y} r={2.6} fill={shade(shirt, 0.6)} />)}</>}
      {outfit === "apron" && <path d="M -30 -350 L 30 -350 L 38 -200 L -38 -200 Z" fill="#fbfbf7" stroke={OUT} strokeWidth={2} />}
      {!dress && <rect x={-46} y={-260} width={92} height={10} fill={shade(pants, 0.6)} />}
      {/* head (slightly enlarged for readable expressions) */}
      <g transform={`rotate(${pose.head},0,-400) translate(0,-400) scale(1.14) translate(0,400)`}>
        <ellipse cx={-36} cy={-440} rx={7} ry={11} fill={skin} stroke={OUT} strokeWidth={2.5} />
        <ellipse cx={36} cy={-440} rx={7} ry={11} fill={skin} stroke={OUT} strokeWidth={2.5} />
        <path d="M -37 -452 Q -38 -400 -14 -394 Q 0 -390 14 -394 Q 38 -400 37 -452 Q 36 -488 0 -488 Q -36 -488 -37 -452 Z" fill={skin} stroke={OUT} strokeWidth={2.5} />
        <Hair style={hair} color={hairC} />
        <HumanFace face={face} frame={frame} seed={seed} gaze={gaze} since={faceSince} brow={hairC === "#bdbdbd" ? "#8a8a8a" : hairC} skinD={skinD} />
        {c.hat === "cap" && <path d="M -40 -458 Q -38 -500 0 -500 Q 38 -500 40 -458 Z M 32 -462 L 70 -456 L 34 -450 Z" fill="#e63946" stroke={OUT} strokeWidth={2.5} />}
        {c.hat === "paper" && <path d="M -36 -470 L 36 -470 L 30 -500 L -30 -500 Z" fill="#fff" stroke={OUT} strokeWidth={2.5} />}
        {c.hat === "fedora" && <path d="M -62 -466 Q 0 -456 62 -466 Q 50 -476 36 -476 Q 34 -512 0 -510 Q -34 -512 -36 -476 Q -50 -476 -62 -466 Z" fill="#4a3b2f" stroke={OUT} strokeWidth={2.5} />}
        {c.hat === "flat" && <path d="M -42 -462 Q -26 -496 20 -492 Q 46 -486 52 -466 Q 6 -458 -42 -462 Z" fill="#6b705c" stroke={OUT} strokeWidth={2.5} />}
      </g>
      {/* front arm */}
      <Arm x={44} y={-378} a={pose.ra} b={pose.re} sleeve={shirt} skin={skin} short={short} hand={hand("r")} />
    </g>
  );
};

const Hair: React.FC<{ style: string; color: string }> = ({ style, color }) => {
  const st = { fill: color, stroke: OUT, strokeWidth: 2.5, strokeLinejoin: "round" as const };
  switch (style) {
    case "bald": return <path d="M -37 -448 Q -40 -470 -30 -474 L -28 -446 Z M 37 -448 Q 40 -470 30 -474 L 28 -446 Z" {...st} />;
    case "gray": return <path d="M -38 -444 Q -42 -476 -24 -480 Q -30 -464 -30 -446 Z M 38 -444 Q 42 -476 24 -480 Q 30 -464 30 -446 Z M -22 -484 Q 0 -492 22 -484 Q 0 -480 -22 -484 Z" {...st} />;
    case "side": return <path d="M -39 -446 Q -44 -494 -2 -496 Q 40 -496 40 -450 Q 34 -470 14 -474 Q -8 -462 -30 -466 Q -34 -458 -39 -446 Z" {...st} />;
    case "long": return <path d="M -40 -440 Q -46 -496 0 -496 Q 46 -496 40 -440 Q 34 -476 6 -478 Q -20 -470 -34 -462 Q -38 -452 -40 -440 Z" {...st} />;
    case "bun": return <g><circle cx={0} cy={-500} r={16} {...st} /><path d="M -39 -448 Q -42 -494 0 -494 Q 42 -494 39 -448 Q 30 -474 0 -476 Q -30 -474 -39 -448 Z" {...st} /></g>;
    case "pony": return <path d="M -39 -448 Q -42 -494 0 -494 Q 42 -494 39 -448 Q 30 -474 0 -476 Q -30 -474 -39 -448 Z" {...st} />;
    case "curly": return <g>{[-30, -15, 0, 15, 30].map((x, i) => <circle key={i} cx={x} cy={-484 + Math.abs(x) * 0.25} r={14} {...st} />)}</g>;
    default: return <path d="M -39 -448 Q -42 -494 0 -494 Q 42 -494 39 -448 Q 36 -470 20 -472 Q 0 -466 -20 -472 Q -36 -470 -39 -448 Z" {...st} />;
  }
};

const HumanFace: React.FC<{ face: { eyes: string; brows?: string; mouth?: string }; frame: number; seed: number; gaze: number; since: number; brow: string; skinD: string }> =
  ({ face, frame, seed, gaze, since, brow, skinD }) => {
    const blink = ((frame + seed * 13) % 103) < 4;
    const pop = interpolate(since, [0, 6], [0.7, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(3)) });
    const ex = [-12, 16], ey = -446;
    const g = gaze * 0.4;
    const eye = (x: number, i: number) => {
      switch (face.eyes) {
        case "arc": return <path key={i} d={`M ${x - 7} ${ey + 2} Q ${x} ${ey - 7} ${x + 7} ${ey + 2}`} stroke={OUT} strokeWidth={3} fill="none" strokeLinecap="round" />;
        case "closed": return <path key={i} d={`M ${x - 7} ${ey} Q ${x} ${ey + 4} ${x + 7} ${ey}`} stroke={OUT} strokeWidth={3} fill="none" strokeLinecap="round" />;
        case "xx": return <path key={i} d={i === 0 ? `M ${x - 6} ${ey - 5} L ${x + 5} ${ey} L ${x - 6} ${ey + 5}` : `M ${x + 6} ${ey - 5} L ${x - 5} ${ey} L ${x + 6} ${ey + 5}`} stroke={OUT} strokeWidth={3} fill="none" strokeLinecap="round" />;
        case "heart": return <path key={i} transform={`translate(${x},${ey}) scale(${0.5 * pop})`} d="M 0 10 C -22 -4 -12 -20 0 -9 C 12 -20 22 -4 0 10 Z" fill="#e63946" />;
        default: {
          const big = face.eyes === "wide" ? 1.35 * pop : 1;
          const lid = face.eyes === "narrow" ? 0.45 : face.eyes === "half" ? 0.55 : 1;
          if (blink) return <path key={i} d={`M ${x - 7} ${ey} L ${x + 7} ${ey}`} stroke={OUT} strokeWidth={3} strokeLinecap="round" />;
          return (
            <g key={i}>
              <ellipse cx={x} cy={ey} rx={7.5 * big} ry={6.5 * big} fill="#fff" stroke={OUT} strokeWidth={2} />
              <circle cx={x + g} cy={ey + 0.5} r={4 * (face.eyes === "wide" ? 0.9 : 1)} fill="#4a3324" />
              <circle cx={x + g} cy={ey + 0.5} r={2} fill="#111" />
              <circle cx={x + g + 1.5} cy={ey - 1.5} r={1.1} fill="#fff" />
              {lid < 1 && <path d={`M ${x - 8.5} ${ey - 8} L ${x + 8.5} ${ey - 8} L ${x + 8.5} ${ey - 7 + 13 * (1 - lid)} L ${x - 8.5} ${ey - 7 + 13 * (1 - lid)} Z`} fill={skinD} stroke={OUT} strokeWidth={1.5} />}
            </g>
          );
        }
      }
    };
    const by = ey - 13;
    const browEl = () => {
      const st = { stroke: brow, strokeWidth: 3.6, strokeLinecap: "round" as const, fill: "none" };
      switch (face.brows) {
        case "angry": return <><line x1={ex[0] - 8} y1={by - 3} x2={ex[0] + 7} y2={by + 3} {...st} /><line x1={ex[1] + 8} y1={by - 3} x2={ex[1] - 7} y2={by + 3} {...st} /></>;
        case "sad": return <><line x1={ex[0] - 8} y1={by + 3} x2={ex[0] + 7} y2={by - 3} {...st} /><line x1={ex[1] + 8} y1={by + 3} x2={ex[1] - 7} y2={by - 3} {...st} /></>;
        case "up": return <>{ex.map((x, i) => <path key={i} d={`M ${x - 8} ${by - 2} Q ${x} ${by - 9} ${x + 8} ${by - 2}`} {...st} />)}</>;
        case "skeptic": return <><line x1={ex[0] - 8} y1={by + 2} x2={ex[0] + 8} y2={by + 2} {...st} /><path d={`M ${ex[1] - 8} ${by - 1} Q ${ex[1]} ${by - 9} ${ex[1] + 8} ${by - 3}`} {...st} /></>;
        default: return <>{ex.map((x, i) => <path key={i} d={`M ${x - 8} ${by} Q ${x} ${by - 4} ${x + 8} ${by}`} {...st} />)}</>;
      }
    };
    const my = -414, mx = 4;
    const mouth = () => {
      const st = { stroke: OUT, strokeWidth: 3, fill: "none", strokeLinecap: "round" as const };
      switch (face.mouth) {
        case "smile": return face.eyes === "arc"
          ? <path d={`M ${mx - 11} ${my - 3} Q ${mx} ${my + 12} ${mx + 11} ${my - 3} Z`} fill="#7a2e2e" stroke={OUT} strokeWidth={2.5} />
          : <path d={`M ${mx - 10} ${my - 2} Q ${mx} ${my + 7} ${mx + 10} ${my - 2}`} {...st} />;
        case "frown": return <path d={`M ${mx - 9} ${my + 4} Q ${mx} ${my - 4} ${mx + 9} ${my + 4}`} {...st} />;
        case "o": return <ellipse cx={mx} cy={my + 1} rx={5 * pop} ry={7 * pop} fill="#7a2e2e" stroke={OUT} strokeWidth={2.5} />;
        case "flat": return <line x1={mx - 8} y1={my} x2={mx + 8} y2={my} {...st} />;
        case "wavy": return <path d={`M ${mx - 10} ${my} q 3.3 -3 6.6 0 q 3.3 3 6.6 0 q 3.3 -3 6.6 0`} {...st} strokeWidth={2.6} />;
        case "smirk": return <path d={`M ${mx - 8} ${my + 1} Q ${mx + 3} ${my + 4} ${mx + 10} ${my - 4}`} {...st} />;
        default: return <path d={`M ${mx - 7} ${my} Q ${mx} ${my + 3} ${mx + 7} ${my}`} {...st} strokeWidth={2.6} />;
      }
    };
    return (
      <g>
        {(face.mouth === "smile" || face.eyes === "heart") && <><circle cx={-20} cy={-428} r={6} fill="#ff8a8a" opacity={0.35} /><circle cx={26} cy={-428} r={6} fill="#ff8a8a" opacity={0.35} /></>}
        {ex.map(eye)}
        {browEl()}
        <path d="M 4 -444 Q 9 -432 8 -428 Q 5 -425 1 -427" stroke={OUT} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        {mouth()}
      </g>
    );
  };

import React from "react";
import { interpolate, Easing } from "remotion";

// Emotion marks above a character's head. f = frames since the emote started.
export const Emote: React.FC<{ name: string; f: number; s: number }> = ({ name, f, s }) => {
  const k = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(3)) });
  const fade = interpolate(f, [60, 75], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wob = Math.sin(f / 4) * 6;
  const g = (el: React.ReactNode) => <g opacity={fade} transform={`scale(${s * k}) rotate(${wob})`}>{el}</g>;
  switch (name) {
    case "!": return g(<g><rect x={-12} y={-70} width={24} height={60} rx={10} fill="#ffd60a" stroke="#1d1d1f" strokeWidth={6} /><circle cy={10} r={13} fill="#ffd60a" stroke="#1d1d1f" strokeWidth={6} /></g>);
    case "?": return g(<text x={0} y={10} fontFamily="Fredoka" fontWeight={700} fontSize={110} fill="#fff" stroke="#1d1d1f" strokeWidth={6} paintOrder="stroke" textAnchor="middle">?</text>);
    case "anger": return g(<g stroke="#e63946" strokeWidth={9} strokeLinecap="round" fill="none">
      {[0, 90, 180, 270].map((a) => <path key={a} transform={`rotate(${a})`} d="M 8 -30 Q 8 -8 30 -8" />)}</g>);
    case "sweat": {
      const y = interpolate(f, [0, 40], [-10, 40], { extrapolateRight: "clamp" });
      return <g opacity={fade} transform={`translate(0,${y * s}) scale(${s * k})`}><path d="M 0 -30 Q 22 0 0 14 Q -22 0 0 -30 Z" fill="#7fd1ff" stroke="#1d1d1f" strokeWidth={4} /></g>;
    }
    case "sparkle": return g(<g fill="#ffd60a">{[[0, 0, 1], [-40, 30, 0.6], [36, 36, 0.5]].map(([x, y, z], i) =>
      <path key={i} transform={`translate(${x},${y}) scale(${(z as number) * (0.8 + 0.2 * Math.sin(f / 3 + i))})`} d="M 0 -30 Q 4 -4 30 0 Q 4 4 0 30 Q -4 4 -30 0 Q -4 -4 0 -30 Z" />)}</g>);
    case "heart": return g(<path transform={`translate(0,${-f * 0.6}) scale(2.2)`} d="M 0 10 C -22 -4 -12 -20 0 -9 C 12 -20 22 -4 0 10 Z" fill="#ff5d8f" stroke="#1d1d1f" strokeWidth={2} />);
    case "idea": return g(<g><circle cy={-20} r={30} fill="#ffe066" stroke="#1d1d1f" strokeWidth={6} /><rect x={-14} y={8} width={28} height={18} rx={4} fill="#adb5bd" stroke="#1d1d1f" strokeWidth={5} />
      {[-60, -30, 0, 30, 60].map((a) => <line key={a} transform={`rotate(${a},0,-20)`} x1={0} y1={-62} x2={0} y2={-80} stroke="#ffd60a" strokeWidth={6} strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(f / 3)} />)}</g>);
    case "zzz": return g(<text x={0} y={-((f * 0.7) % 40)} fontFamily="Fredoka" fontWeight={700} fontSize={64} fill="#fff" stroke="#1d1d1f" strokeWidth={5} paintOrder="stroke">Zz</text>);
    case "music": return g(<text x={0} y={-((f * 0.8) % 40)} fontSize={70} fill="#1d1d1f">♪</text>);
    case "dots": return g(<g>{[0, 1, 2].map((i) => <circle key={i} cx={-30 + i * 30} cy={0} r={10} fill="#fff" stroke="#1d1d1f" strokeWidth={4} opacity={(Math.floor(f / 8) % 4) > i ? 1 : 0.2} />)}</g>);
    case "lines": return g(<g stroke="#1d1d1f" strokeWidth={6} strokeLinecap="round">{[-30, 0, 30].map((a) => <line key={a} transform={`rotate(${a})`} x1={0} y1={-20} x2={0} y2={-50} />)}</g>);
    default: return null;
  }
};

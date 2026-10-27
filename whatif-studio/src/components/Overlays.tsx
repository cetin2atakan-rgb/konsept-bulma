import React from "react";
import { spring, interpolate } from "remotion";

export type Theme = { font: string; ink: string; paper: string; accent: string; retro: boolean };

export const THEMES: Record<string, Theme> = {
  modern: { font: "Fredoka", ink: "#1d1d1f", paper: "#ffffff", accent: "#ffd60a", retro: false },
  retro: { font: "Oswald", ink: "#2b1d12", paper: "#f6ecd2", accent: "#e63946", retro: true },
};

type OProps = { o: any; frame: number; dur: number; fps: number; theme: Theme };

const pop = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 11, stiffness: 160, mass: 0.7 } });

const Box: React.FC<{ s: number; rot?: number; style: React.CSSProperties; children: React.ReactNode }> = ({ s, rot = 0, style, children }) => (
  <div style={{ position: "absolute", transform: `scale(${s}) rotate(${rot}deg)`, ...style }}>{children}</div>
);

export const Overlay: React.FC<OProps> = ({ o, frame, dur, fps, theme }) => {
  const at = Math.round((o.at ?? 0) * dur);
  const s = pop(frame, fps, at);
  if (frame < at) return null;
  const base: React.CSSProperties = { fontFamily: theme.font, fontWeight: 700, color: theme.ink, textAlign: "center" };
  const card: React.CSSProperties = {
    ...base, background: theme.paper, border: `8px solid ${theme.ink}`, borderRadius: theme.retro ? 6 : 28,
    boxShadow: `10px 12px 0 ${theme.ink}`, padding: "18px 44px",
  };

  switch (o.type) {
    case "title": {
      const out = interpolate(frame, [dur - 14, dur - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return (
        <Box s={s * out} rot={-2} style={{ ...card, left: 260, right: 260, top: 40, fontSize: 70, lineHeight: 1.05, background: theme.accent }}>
          {o.text}
        </Box>
      );
    }
    case "tag":
      return (
        <Box s={s} rot={-4} style={{ ...card, left: "50%", top: 36, marginLeft: -300, width: 600, fontSize: 84, background: o.color ?? theme.accent }}>
          {o.text}
        </Box>
      );
    case "sticker":
      return (
        <Box s={s} rot={8} style={{ ...base, right: 170, top: 150, width: 300, height: 300, borderRadius: 150, background: theme.accent,
          border: `10px solid ${theme.ink}`, boxShadow: `10px 12px 0 ${theme.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 120 }}>
          {o.text}
        </Box>
      );
    case "endcard":
      return (
        <Box s={s} rot={-2} style={{ ...card, left: 300, right: 300, top: 110, fontSize: 92, background: theme.accent }}>
          {o.text}
        </Box>
      );
    case "calendar":
      return (
        <Box s={s} rot={5} style={{ ...base, right: 220, top: 120, width: 380, background: theme.paper, border: `8px solid ${theme.ink}`, boxShadow: `10px 12px 0 ${theme.ink}` }}>
          <div style={{ background: theme.accent, color: "#fff", fontSize: 72, padding: "10px 0" }}>{o.text}</div>
          <div style={{ fontSize: 170, lineHeight: 1.2 }}>{o.sub}</div>
        </Box>
      );
    case "bubble":
      return (
        <div style={{ position: "absolute", left: 980, top: 110, width: 800 }}>
          <Box s={s} style={{ ...card, position: "relative", fontSize: 44, padding: "26px 40px", borderRadius: 60, textAlign: "left" }}>
            <div style={{ fontSize: 40, opacity: 0.7, marginBottom: 10 }}>NEVER HAPPENED YET:</div>
            {(o.items as string[]).map((t, i) => {
              const k = pop(frame, fps, at + 14 + i * 16);
              return (
                <div key={i} style={{ fontSize: 62, opacity: k, transform: `translateX(${(1 - k) * 60}px)` }}>
                  <span style={{ color: theme.accent }}>✕</span> {t}
                </div>
              );
            })}
          </Box>
        </div>
      );
    case "bars": {
      const max = Math.max(...o.bars.map((b: any) => b.value));
      return (
        <div style={{ position: "absolute", left: 360, right: 360, top: 170, bottom: 230, display: "flex", alignItems: "flex-end", justifyContent: "space-around" }}>
          {o.bars.map((b: any, i: number) => {
            const k = spring({ frame: frame - at - i * 12, fps, config: { damping: 18, stiffness: 70 } });
            const v = Math.round(b.value * k);
            return (
              <div key={i} style={{ ...base, width: 360, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontSize: 110 }}>{v}%</div>
                <div style={{ width: 300, height: (b.value / max) * 480 * k, background: b.color, border: `8px solid ${theme.ink}`, borderRadius: 18, boxShadow: `10px 12px 0 ${theme.ink}` }} />
                <div style={{ fontSize: 64, marginTop: 18 }}>{b.label}</div>
              </div>
            );
          })}
        </div>
      );
    }
    case "growth": {
      const pts = [[0, 0], [0.25, 0.05], [0.5, 0.12], [0.7, 0.3], [0.85, 0.55], [1, 1]];
      const k = interpolate(frame, [at, at + 70], [0, 1], { extrapolateRight: "clamp" });
      const W = 760, H = 520;
      const d = pts.map(([x, y], i) => `${i ? "L" : "M"} ${x * W} ${H - y * H}`).join(" ");
      return (
        <div style={{ position: "absolute", right: 140, top: 150, ...card, padding: 30 }}>
          <div style={{ fontSize: 54, marginBottom: 10 }}>{o.label ?? "A SMALL COMPANY, 1955 → TODAY"}</div>
          <svg width={W} height={H} style={{ overflow: "visible" }}>
            <line x1={0} y1={H} x2={W} y2={H} stroke={theme.ink} strokeWidth={6} />
            <line x1={0} y1={0} x2={0} y2={H} stroke={theme.ink} strokeWidth={6} />
            <path d={d} fill="none" stroke={theme.accent} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
          </svg>
          <div style={{ fontSize: 96, color: theme.accent, opacity: interpolate(k, [0.85, 1], [0, 1], { extrapolateLeft: "clamp" }) }}>{o.end ?? "GIANT"}</div>
        </div>
      );
    }
    default:
      return null;
  }
};

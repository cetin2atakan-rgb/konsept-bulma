import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Background, Dust } from "./components/Backgrounds";
import { Character, CharSpec } from "./components/Character";
import { Overlay, THEMES, Theme } from "./components/Overlays";
import { Captions } from "./components/Captions";
import { loadFonts } from "./fonts";

const FLOOR = 900;
const BIG_OVERLAYS = ["bars", "growth", "bubble", "calendar", "endcard", "title", "count", "legend"];

type Shot = { at: number; z: number; fx: number; fy: number; z2?: number; dx?: number };

const charScale = (sc: any) => (sc.chars.length === 1 && sc.bg.startsWith("abstract") ? 1.75 : 1.5);
const overlaysOf = (sc: any): any[] => (sc.overlays ?? (sc.overlay ? [sc.overlay] : []));

// Shot list: explicit > auto (cut every ~2.2 s between wide / close-up / medium)
const shotsFor = (sc: any): Shot[] => {
  const s = charScale(sc);
  const headY = FLOOR - 290 * s; // leaves headroom for emotes and labels
  const byId = (id: string) => sc.chars.find((c: CharSpec) => c.id === id);
  if (Array.isArray(sc.shots)) {
    return sc.shots.map((sh: any) => {
      const c = sh.focus ? byId(sh.focus) : null;
      return { at: sh.at ?? 0, z: sh.z ?? (c ? 1.6 : 1), z2: sh.z2, fx: sh.x ?? (c ? c.move?.to ?? c.x : 960), fy: sh.y ?? (c ? headY : 540), dx: sh.dx };
    });
  }
  const cam = sc.cam ?? { z: [1, 1.06], x: [0, 0], y: [0, 0] };
  const wide: Shot = { at: 0, z: cam.z[0], z2: cam.z[1], fx: 960 + cam.x[0], fy: 540 + cam.y[0], dx: cam.x[1] - cam.x[0] };
  const big = overlaysOf(sc).some((o) => BIG_OVERLAYS.includes(o.type));
  if (sc.shots === "none" || big || !sc.chars.length || sc.dur < 75) return [wide];
  const n = Math.max(1, Math.round(sc.dur / 66));
  const out: Shot[] = [];
  const movers = sc.chars.filter((c: CharSpec) => c.move);
  for (let i = 0; i < n; i++) {
    const at = i / n;
    if (i === 0) { out.push({ ...wide, z: 1.0, z2: 1.06 }); continue; }
    if (i % 2 === 1) {
      const c = sc.chars[Math.floor(i / 2) % sc.chars.length];
      if (movers.includes(c)) { out.push({ at, z: 1.15, z2: 1.2, fx: 960, fy: 560 }); continue; }
      out.push({ at, z: 1.62, z2: 1.7, fx: c.x, fy: headY, dx: (i % 4 === 1 ? 14 : -14) });
    } else {
      const xs = sc.chars.map((c: CharSpec) => c.x);
      out.push({ at, z: 1.28, z2: 1.33, fx: (Math.min(...xs) + Math.max(...xs)) / 2, fy: 600, dx: -20 });
    }
  }
  return out;
};

const camTransform = (sh: Shot, k: number) => {
  const z = sh.z + ((sh.z2 ?? sh.z * 1.04) - sh.z) * k;
  let fx = sh.fx + (sh.dx ?? 10) * k, fy = sh.fy;
  fx = Math.min(Math.max(fx, 960 / z), 1920 - 960 / z);
  fy = Math.min(Math.max(fy, 540 / z), 1080 - 540 / z);
  return { z, fx, fy };
};

const sfxList = (sc: any): [string, number][] => {
  const l: [string, number][] = typeof sc.sfx === "string" ? [[sc.sfx, 0]] : sc.sfx ?? [];
  sc.chars.forEach((c: CharSpec) => {
    (c.emote ?? []).forEach(([, at]) => l.push(["pop", at]));
    (c.act ?? []).forEach(([a, at]) => { if (a === "jump" || a === "hop") l.push(["boing", at]); });
  });
  overlaysOf(sc).forEach((o) => { if (o.type === "stamp") l.push(["boom", o.at ?? 0]); if (o.type === "label" || o.type === "tag") l.push(["pop", o.at ?? 0]); });
  if (sc.crowd?.glow) l.push(["shimmer", sc.crowd.glow.at ?? 0]);
  return l;
};

const Crowd: React.FC<{ cr: any; frame: number; dur: number; scale: number }> = ({ cr, frame, dur, scale }) => {
  const n = cr.n ?? 14, rows = cr.rows ?? 2;
  const pal = cr.colors ?? ["#e76f51", "#2a9d8f", "#6d597a", "#f4a261", "#457b9d", "#e9c46a", "#b5838d", "#588157"];
  const per = Math.ceil(n / rows);
  const items = [];
  for (let r = rows - 1; r >= 0; r--) {
    for (let i = 0; i < per && r * per + i < n; i++) {
      const idx = r * per + i;
      const x = 120 + (i + (r % 2) * 0.5) * (1680 / Math.max(1, per - 0.5));
      const glow = cr.glow && ((idx * 7) % 10) / 10 < (cr.glow.ratio ?? 1) ? (cr.glow.colors ? cr.glow.colors[idx % cr.glow.colors.length] : cr.glow.color) : null;
      items.push(
        <Character key={idx} frame={frame} dur={dur} y={(cr.y ?? FLOOR - 60) - r * 70} scale={scale * (cr.scale ?? 0.62) * (1 - r * 0.08)}
          c={{ id: `crowd${idx}`, x, color: pal[idx % pal.length], pose: cr.pose ?? "idle", glow, glowAt: (cr.glow?.at ?? 0) + (idx % 5) * 0.02, face: cr.face ? [[cr.face, 0]] : undefined,
            hair: idx % 6 === 2 ? "pony" : idx % 9 === 4 ? "gray" : null, hat: cr.hats ? (idx % 4 === 1 ? cr.hats : null) : null, body: idx % 5 === 3 ? "short" : idx % 7 === 2 ? "tall" : undefined }} />
      );
    }
  }
  return <g>{items}</g>;
};

const Scene: React.FC<{ sc: any; theme: Theme }> = ({ sc, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = sc.dur;
  const shots = shotsFor(sc);
  let si = 0;
  shots.forEach((s, i) => { if (frame >= s.at * dur) si = i; });
  const sh = shots[si];
  const sStart = sh.at * dur, sEnd = (shots[si + 1]?.at ?? 1) * dur;
  const k = interpolate(frame, [sStart, sEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const { z, fx, fy } = camTransform(sh, k);
  // screen shake
  const shakes: number[] = [...(sc.shake ?? []), ...overlaysOf(sc).filter((o) => o.type === "stamp").map((o) => o.at ?? 0), ...(sc.sfx === "boom" ? [0] : [])];
  let shx = 0, shy = 0;
  shakes.forEach((at) => { const f = frame - at * dur; if (f >= 0 && f < 16) { const d = 1 - f / 16; shx += Math.sin(f * 2.1) * 16 * d; shy += Math.cos(f * 2.7) * 11 * d; } });
  const scale = charScale(sc);
  const overlays = overlaysOf(sc);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate(${shx}px,${shy}px)` }}>
        <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
          <defs>
            <filter id="glowBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40" /></filter>
          </defs>
          <g transform={`translate(960,540) scale(${z}) translate(${-fx},${-fy})`}>
            <g transform={`translate(${(fx - 960) * 0.12},0)`}><Background name={sc.bg} frame={frame} /></g>
            {sc.crowd && <Crowd cr={sc.crowd} frame={frame} dur={dur} scale={scale} />}
            {sc.chars.map((c: CharSpec, i: number) => (
              <Character key={c.id + i} c={{ ...c, enter: c.enter ?? (i > 0 && !sc.crowd ? "right" : null) }} frame={frame} dur={dur} y={FLOOR} scale={scale} />
            ))}
            {overlays.filter((o) => o.type === "label").map((o, i) => {
              const c = sc.chars.find((ch: CharSpec) => ch.id === o.target);
              if (!c || frame < (o.at ?? 0) * dur) return null;
              const kk = interpolate(frame - (o.at ?? 0) * dur, [0, 8], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(2.4)) });
              const y = FLOOR - 470 * scale * (c.scale ?? 1);
              const w = o.text.length * 30 + 60;
              return (
                <g key={i} transform={`translate(${c.move?.to ?? c.x},${y}) scale(${kk})`}>
                  <rect x={-w / 2} y={-62} width={w} height={74} rx={37} fill={o.color ?? theme.accent} stroke={theme.ink} strokeWidth={6} />
                  <path d="M -16 10 L 0 34 L 16 10 Z" fill={theme.ink} />
                  <text x={0} y={-10} textAnchor="middle" fontFamily={theme.font} fontWeight={700} fontSize={46} fill={theme.ink}>{o.text}</text>
                </g>
              );
            })}
            <Dust frame={frame} />
          </g>
        </svg>
      </AbsoluteFill>
      {overlays.filter((o) => o.type !== "label").map((o, i) => <Overlay key={i} o={o} frame={frame} dur={dur} fps={fps} theme={theme} />)}
      <Captions words={sc.words} frame={frame} start={sc.start} theme={theme} />
      {sc.transition === "sticky" && <Sticky frame={frame} theme={theme} />}
      {sfxList(sc).map(([name, at], i) => (
        <Sequence key={i} from={Math.round(at * dur)} layout="none"><Audio src={staticFile(`sfx/${name}.wav`)} volume={name === "pop" ? 0.35 : 0.5} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};

const Sticky: React.FC<{ frame: number; theme: Theme }> = ({ frame, theme }) => {
  if (frame > 18) return null;
  const y = interpolate(frame, [0, 5, 11, 18], [-1200, 0, 0, 1300], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const r = interpolate(frame, [0, 5, 11, 18], [-12, -3, -3, 14]);
  return <AbsoluteFill style={{ transform: `translateY(${y}px) rotate(${r}deg) scale(1.3)`, background: theme.retro ? "#f1d58a" : "#ffe066", boxShadow: "0 30px 60px rgba(0,0,0,0.35)" }} />;
};

// colour-block wipe straddling a cut: covers the outgoing shot, reveals the new one
const Wipe: React.FC<{ color: string }> = ({ color }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 7, 9, 17], [-2100, 0, 0, 2100], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return <AbsoluteFill style={{ transform: `translateX(${x}px) skewX(-12deg) scaleX(1.25)`, background: color }} />;
};

const Grain: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply", opacity: 0.18 }}>
    <svg width={1920} height={1080}>
      <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={frame % 6} /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width={1920} height={1080} filter="url(#grain)" />
    </svg>
  </AbsoluteFill>
);

export const WhatIfVideo: React.FC<{ data: any }> = ({ data }) => {
  loadFonts();
  const theme = THEMES[data.theme] ?? THEMES.modern;
  const frame = useCurrentFrame();
  const n = data.scenes.length;
  return (
    <AbsoluteFill style={{ background: "#111" }}>
      <AbsoluteFill style={{ filter: theme.retro ? "sepia(0.32) saturate(0.88) contrast(1.05)" : undefined }}>
        {data.scenes.map((sc: any, i: number) => {
          const next = i < n - 1 ? data.scenes[i + 1].start : data.total;
          const from = i === 0 ? 0 : sc.start;
          return (
            <Sequence key={i} from={from} durationInFrames={next - from}>
              <Scene sc={{ ...sc, start: from, dur: next - from }} theme={theme} />
            </Sequence>
          );
        })}
        {data.scenes.map((sc: any, i: number) => sc.transition === "wipe" && i > 0 ? (
          <Sequence key={"w" + i} from={sc.start - 8} durationInFrames={18}>
            <Wipe color={sc.wipeColor ?? theme.accent} />
            <Audio src={staticFile("sfx/whoosh.wav")} volume={0.5} />
          </Sequence>
        ) : null)}
      </AbsoluteFill>
      {theme.retro && <Grain frame={frame} />}
      {theme.retro && <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(40,20,5,0.55) 100%)" }} />}
      <Audio src={staticFile(`audio/${data.id}.wav`)} />
      <Audio src={staticFile(data.music ?? "sfx/music_pad.wav")} loop volume={(f) => interpolate(f, [0, 20, data.total - 30, data.total], [0, 0.08, 0.08, 0], { extrapolateRight: "clamp" })} />
    </AbsoluteFill>
  );
};

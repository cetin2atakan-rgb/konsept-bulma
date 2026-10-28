import React from "react";
import { AbsoluteFill, Audio, Loop, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, KINDS } from "./kit";
import { scenes, VO_END } from "./scenes";
import captions from "./captions.json";
import { loadFonts } from "./fonts";

const FPS = 30;
export const TOTAL = Math.round((VO_END + 1.5) * FPS);

// Vice-City-at-dusk backdrop: sky, striped sun, skyline, palms, moving grid floor. All drawn, no footage.
const rnd = (i: number) => { const x = Math.sin(i * 127.1) * 43758.5453; return x - Math.floor(x); };
const SKYLINE = Array.from({ length: 46 }, (_, i) => ({ x: i * 44 - 40, w: 30 + rnd(i) * 40, h: 60 + rnd(i + 99) * 230 }));
const Palm: React.FC<{ x: number; s: number; flip?: boolean; sway: number }> = ({ x, s, flip, sway }) => (
  <g transform={`translate(${x},640) scale(${flip ? -s : s},${s})`} fill="#07030f">
    <path d="M0 0 C 6 -90, 4 -200, 18 -300 L 26 -300 C 14 -200, 16 -90, 12 0 Z" />
    <g transform={`translate(22,-300) rotate(${sway})`}>
      {[-150, -115, -70, -30, 10, 45].map((r, i) => (
        <path key={i} transform={`rotate(${r})`} d="M0 0 C 40 -18, 95 -14, 140 18 C 95 0, 45 -2, 0 6 Z" />
      ))}
    </g>
  </g>
);

const Backdrop: React.FC<{ hue: number }> = ({ hue }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const drift = Math.sin(t / 9) * 30;
  const gridOff = (t * 60) % 60;
  return (
    <AbsoluteFill style={{ background: C.ink, filter: `hue-rotate(${hue}deg)` }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#120726" /><stop offset="0.45" stopColor="#3a0f5c" /><stop offset="0.68" stopColor="#c2286f" /><stop offset="0.8" stopColor="#ff7a45" />
          </linearGradient>
          <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe36b" /><stop offset="1" stopColor="#ff2e88" /></linearGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a0b3d" /><stop offset="1" stopColor="#07030f" /></linearGradient>
          <mask id="sunmask"><rect width="1920" height="1080" fill="#fff" />{Array.from({ length: 8 }, (_, i) => <rect key={i} x="0" y={560 + i * 22 + ((t * 8) % 22)} width="1920" height={3 + i * 1.6} fill="#000" />)}</mask>
        </defs>
        <rect width="1920" height="700" fill="url(#sky)" />
        <g transform={`translate(${drift * 0.3},0)`}><circle cx="960" cy="560" r="250" fill="url(#sun)" mask="url(#sunmask)" opacity="0.95" /></g>
        <g transform={`translate(${drift * 0.6},0)`} fill="#14061f">
          {SKYLINE.map((b, i) => <rect key={i} x={b.x} y={660 - b.h} width={b.w} height={b.h + 40} />)}
          {SKYLINE.filter((_, i) => i % 3 === 0).map((b, i) => <rect key={"w" + i} x={b.x + 8} y={680 - b.h} width="4" height="4" fill="#ffd23f" opacity={0.5 + 0.5 * Math.sin(t * 2 + i)} />)}
        </g>
        <rect y="660" width="1920" height="420" fill="url(#floor)" />
        <g stroke="#ff2e88" strokeOpacity="0.55" strokeWidth="2">
          {Array.from({ length: 9 }, (_, i) => { const y = 660 + Math.pow((i * 60 + gridOff) / 540, 2) * 420; return <line key={i} x1="0" y1={y} x2="1920" y2={y} />; })}
          {Array.from({ length: 25 }, (_, i) => <line key={"v" + i} x1={960 + (i - 12) * 40} y1="660" x2={960 + (i - 12) * 260} y2="1080" />)}
        </g>
        <g transform={`translate(${drift},0)`}>
          <Palm x={120} s={1.5} sway={Math.sin(t * 0.9) * 3} />
          <Palm x={330} s={1.1} sway={Math.sin(t * 1.1 + 1) * 3} />
          <Palm x={1800} s={1.6} flip sway={Math.sin(t * 0.8 + 2) * 3} />
          <Palm x={1590} s={1.05} flip sway={Math.sin(t * 1.2 + 3) * 3} />
        </g>
      </svg>
      {/* dim for legibility, vignette, scanlines */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, #0b071666 0%, #0b0716c4 75%, #000 100%)" }} />
      <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, #ffffff06 0 2px, transparent 2px 4px)" }} />
    </AbsoluteFill>
  );
};

const Chip: React.FC<{ ch?: string }> = ({ ch }) => {
  if (!ch) return null;
  return (
    <div style={{ position: "absolute", left: 60, top: 50, fontFamily: "Oswald", fontWeight: 700, fontSize: 34, color: C.white, background: "#0b0716cc", border: `2px solid ${C.pink}`, borderRadius: 40, padding: "6px 26px", letterSpacing: 3 }}>
      <span style={{ color: C.pink }}>{ch}</span> / 13 · STILL UNCONFIRMED
    </div>
  );
};

const Captions: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const c = (captions as { s: number; e: number; t: string }[]).find((x) => t >= x.s - 0.05 && t < x.e + 0.25);
  if (!c) return null;
  const text = c.t.charAt(0).toUpperCase() + c.t.slice(1);
  const o = interpolate(t, [c.s - 0.05, c.s + 0.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ maxWidth: 1500, fontFamily: "Oswald", fontWeight: 500, fontSize: 44, lineHeight: 1.25, color: "#fff", background: "#000000b3", padding: "10px 28px", borderRadius: 12, textAlign: "center" }}>{text}</div>
    </div>
  );
};

const sfx = (name: string, at: number, vol: number) => (
  <Sequence key={name + at} from={Math.max(0, Math.round(at * FPS))} durationInFrames={30}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
  </Sequence>
);

export const GtaVideo: React.FC = () => {
  loadFonts();
  const f = useCurrentFrame();
  const t = f / FPS;
  const idx = scenes.findIndex((s, i) => t >= s.at && (i === scenes.length - 1 || t < scenes[i + 1].at));
  const cur = scenes[Math.max(0, idx)];
  const chapterNo = parseInt(cur.ch || "0", 10);
  const hue = [0, -12, 14, -24, 22, -8, 30, 10, -30, 18, -18, 6, -6, 0][chapterNo] ?? 0;
  const fadeOut = interpolate(t, [VO_END - 0.6, VO_END + 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cues: React.ReactNode[] = [];
  scenes.forEach((s, i) => {
    if (i > 0) cues.push(sfx("whoosh", s.at - 0.1, s.k === "chapter" ? 0.45 : 0.18));
    if (s.k === "chapter") cues.push(sfx("thud", s.at + 0.05, 0.5));
    if (s.stamp) cues.push(sfx("thud", s.at + (s.stampAt ?? 1), 0.6));
  });

  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Backdrop hue={hue} />
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {scenes.map((s, i) => {
          const from = Math.round(s.at * FPS);
          const end = i === scenes.length - 1 ? TOTAL : Math.round(scenes[i + 1].at * FPS);
          const K = KINDS[s.k];
          return (
            <Sequence key={i} from={from} durationInFrames={end - from}>
              <SceneWrap len={end - from}><K {...s} /></SceneWrap>
            </Sequence>
          );
        })}
        <Chip ch={cur.ch} />
      </AbsoluteFill>
      <Captions />
      <Audio src={staticFile("audio/vo.wav")} />
      <Loop durationInFrames={32 * FPS}>
        <Audio src={staticFile("sfx/music_bed.wav")} volume={(fr) => 0.13 * interpolate(fr, [0, 30], [0, 1], { extrapolateRight: "clamp" })} />
      </Loop>
      {cues}
    </AbsoluteFill>
  );
};

// quick zoom-in on enter, slow push while held, fade on exit
const SceneWrap: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 6, len - 5, len], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = interpolate(f, [0, len], [1, 1.04]);
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${s})` }}>{children}</AbsoluteFill>;
};

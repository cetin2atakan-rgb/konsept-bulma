import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Background, Dust } from "./components/Backgrounds";
import { StickFigure } from "./components/StickFigure";
import { Overlay, THEMES, Theme } from "./components/Overlays";
import { Captions } from "./components/Captions";
import { loadFonts } from "./fonts";

const FADE = 8;
const FLOOR = 900;

const Scene: React.FC<{ sc: any; theme: Theme }> = ({ sc, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = sc.dur;
  const t = interpolate(frame, [0, dur], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const cam = sc.cam ?? { z: [1, 1], x: [0, 0], y: [0, 0] };
  const z = cam.z[0] + (cam.z[1] - cam.z[0]) * t;
  const cx = cam.x[0] + (cam.x[1] - cam.x[0]) * t;
  const cy = cam.y[0] + (cam.y[1] - cam.y[0]) * t;
  const fadeIn = interpolate(frame, [0, FADE], [0, 1], { extrapolateRight: "clamp" });
  const solo = sc.chars.length === 1 && sc.bg.startsWith("abstract");
  const scale = solo ? 1.75 : 1.5;

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <AbsoluteFill style={{ transform: `translate(${-cx}px, ${-cy}px) scale(${z})`, transformOrigin: "50% 60%" }}>
        <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
          <defs>
            <filter id="glowBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40" /></filter>
          </defs>
          <Background name={sc.bg} frame={frame} />
          {sc.chars.map((c: any, i: number) => (
            <StickFigure key={c.id + i} frame={frame} dur={dur} x={c.x} y={FLOOR} scale={scale} color={c.color} pose={c.pose} pose2={c.pose2}
              facing={c.facing} glow={c.glow} mood={c.mood} mood2={c.mood2} hat={c.hat} hair={c.hair} enter={c.enter ?? (i > 0 ? "slide" : null)} />
          ))}
          <Dust frame={frame} />
        </svg>
      </AbsoluteFill>
      {sc.overlay && <Overlay o={sc.overlay} frame={frame} dur={dur} fps={fps} theme={theme} />}
      <Captions words={sc.words} frame={frame} start={sc.start} theme={theme} />
      {sc.transition === "sticky" && <Sticky frame={frame} theme={theme} />}
      {sc.sfx && <Audio src={staticFile(`sfx/${sc.sfx}.wav`)} volume={0.55} />}
    </AbsoluteFill>
  );
};

// A big sticky note slaps over the frame and peels off: marks a twist.
const Sticky: React.FC<{ frame: number; theme: Theme }> = ({ frame, theme }) => {
  if (frame > 18) return null;
  const y = interpolate(frame, [0, 5, 11, 18], [-1200, 0, 0, 1300], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const r = interpolate(frame, [0, 5, 11, 18], [-12, -3, -3, 14]);
  return (
    <AbsoluteFill style={{ transform: `translateY(${y}px) rotate(${r}deg) scale(1.3)`, background: theme.retro ? "#f1d58a" : "#ffe066",
      boxShadow: "0 30px 60px rgba(0,0,0,0.35)" }} />
  );
};

const Grain: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply", opacity: 0.22 }}>
    <svg width={1920} height={1080}>
      <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 12} /><feColorMatrix type="saturate" values="0" /></filter>
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
      <AbsoluteFill style={{ filter: theme.retro ? "sepia(0.35) saturate(0.85) contrast(1.05)" : undefined }}>
        {data.scenes.map((sc: any, i: number) => {
          const next = i < n - 1 ? data.scenes[i + 1].start : data.total;
          const from = i === 0 ? 0 : sc.start;
          return (
            <Sequence key={i} from={from} durationInFrames={next - from + (i < n - 1 ? FADE : 0)}>
              <Scene sc={{ ...sc, start: from, dur: next - from }} theme={theme} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
      {theme.retro && <Grain frame={frame} />}
      {theme.retro && <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(40,20,5,0.55) 100%)" }} />}
      <Audio src={staticFile(`audio/${data.id}.wav`)} />
      <Audio src={staticFile("sfx/music_pad.wav")} volume={(f) => interpolate(f, [0, 20, data.total - 30, data.total], [0, 0.09, 0.09, 0], { extrapolateRight: "clamp" })} />
    </AbsoluteFill>
  );
};

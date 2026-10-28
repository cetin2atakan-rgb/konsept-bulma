import React from "react";
import { AbsoluteFill, Audio, Loop, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, KINDS } from "./kit";
import { scenes } from "./scenes";
import captions from "./captions.json";
import { loadFonts } from "./fonts";
import { Footage, SceneWrap, sfx } from "./Video";

// Short 1: the file-size segment of Video 1, re-cut vertical (1080x1920), ending on a card that points to the full video.
// CLIPS are [start, end] in Video 1 seconds; everything inside a clip (VO, cards, footage, sfx) plays in Video 1 time.
const FPS = 30;
const CLIPS: [number, number][] = [
  [0, 2.85],      // "Why will nobody tell you how big GTA 6 is?"
  [41.15, 90.5],  // 87 GB -> 210 GB leak -> fake 676.7 GB -> Series S can't fit it -> Rockstar still silent
  [20.38, 22.1],  // "and that is number one of 13."
];
const CTA = 3.5;
const frames = (s: number) => Math.round(s * FPS);
const STARTS = CLIPS.reduce<number[]>((acc, [a, b], i) => [...acc, (acc[i] ?? 0) + frames(b - a)], [0]);
export const SHORT_TOTAL = STARTS[CLIPS.length] + frames(CTA);

const FONT = "Oswald, Impact, sans-serif";
// landscape cards drawn at 1920x1080, shown at 0.75 and centred; the side margins they never use fall off-canvas
const CARD_SCALE = 0.68, CARD_TOP = 520;

const Cards: React.FC = () => (
  <div style={{ position: "absolute", left: (1080 - 1920 * CARD_SCALE) / 2, top: CARD_TOP, width: 1920, height: 1080, transform: `scale(${CARD_SCALE})`, transformOrigin: "0 0" }}>
    {scenes.map((s, i) => {
      const from = frames(s.at);
      const end = i === scenes.length - 1 ? from + 300 : frames(scenes[i + 1].at);
      const K = KINDS[s.k];
      return (
        <Sequence key={i} from={from} durationInFrames={end - from}>
          <SceneWrap len={end - from}><K {...s} /></SceneWrap>
        </Sequence>
      );
    })}
  </div>
);

const Captions: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const c = (captions as { s: number; e: number; t: string }[]).find((x) => t >= x.s - 0.05 && t < x.e + 0.25);
  if (!c) return null;
  const text = c.t.charAt(0).toUpperCase() + c.t.slice(1);
  const o = interpolate(t, [c.s - 0.05, c.s + 0.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 120, right: 120, top: 1330, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 64, lineHeight: 1.15, color: "#fff", background: "#000000b8", padding: "12px 28px", borderRadius: 14, textAlign: "center" }}>{text}</div>
    </div>
  );
};

const Cues: React.FC = () => (
  <>
    {scenes.flatMap((s, i) => [
      i > 0 ? sfx("whoosh", s.at - 0.1, s.k === "chapter" ? 0.45 : 0.18) : null,
      s.stamp ? sfx("thud", s.at + (s.stampAt ?? 1), 0.6) : null,
    ])}
  </>
);

// One clip of Video 1, playing in Video 1 time.
const Clip: React.FC<{ from: number }> = ({ from }) => (
  <Sequence from={-frames(from)}>
    <Footage />
    <Cards />
    <Captions />
    <Audio src={staticFile("audio/vo.wav")} />
    <Cues />
  </Sequence>
);

const Header: React.FC = () => (
  <div style={{ position: "absolute", top: 190, left: 0, right: 0, textAlign: "center", fontFamily: FONT, color: C.white }}>
    <div style={{ display: "inline-block", fontSize: 40, fontWeight: 700, letterSpacing: 4, color: C.pink, border: `3px solid ${C.pink}`, borderRadius: 40, padding: "4px 26px", background: "#0b0716cc" }}>GTA 6 · STILL UNCONFIRMED</div>
    <div style={{ fontSize: 92, fontWeight: 700, marginTop: 14, textShadow: `0 0 30px ${C.pink}88, 0 6px 0 #000a` }}>THE FILE SIZE</div>
  </div>
);

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f, fps, config: { damping: 14, stiffness: 140 } });
  const bob = Math.sin((f / fps) * 6) * 14;
  return (
    <AbsoluteFill style={{ background: "#0b0716e6", fontFamily: FONT, color: C.white, alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 80px 260px" }}>
      <div style={{ opacity: p, transform: `scale(${0.7 + 0.3 * p})` }}>
        <div style={{ fontSize: 200, fontWeight: 700, color: C.cyan, lineHeight: 1, textShadow: `0 0 40px ${C.cyan}88` }}>12</div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1, marginTop: 10 }}>MORE THINGS ROCKSTAR<br />STILL HASN'T TOLD US</div>
        <div style={{ fontSize: 58, fontWeight: 700, marginTop: 60, color: C.ink, background: C.pink, borderRadius: 16, padding: "14px 40px", display: "inline-block" }}>WATCH THE FULL VIDEO</div>
        <div style={{ fontSize: 120, marginTop: 30, color: C.pink, transform: `translateY(${bob}px)` }}>↓</div>
      </div>
    </AbsoluteFill>
  );
};

export const GtaShort: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      {CLIPS.map(([a, b], i) => (
        <Sequence key={i} from={STARTS[i]} durationInFrames={frames(b - a)}>
          <Clip from={a} />
        </Sequence>
      ))}
      <Sequence from={0} durationInFrames={STARTS[CLIPS.length]}><Header /></Sequence>
      <Sequence from={STARTS[CLIPS.length]} durationInFrames={frames(CTA)}>
        <EndCard />
        {sfx("whoosh", 0, 0.45)}
        {sfx("thud", 0.1, 0.5)}
      </Sequence>
      <Loop durationInFrames={32 * FPS}>
        <Audio src={staticFile("sfx/music_bed.wav")} volume={(fr) => 0.13 * interpolate(fr, [0, 30], [0, 1], { extrapolateRight: "clamp" })} />
      </Loop>
    </AbsoluteFill>
  );
};

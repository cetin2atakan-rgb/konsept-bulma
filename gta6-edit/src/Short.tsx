import React from "react";
import { AbsoluteFill, Audio, Loop, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, KINDS } from "./kit";
import { Scene } from "./scenes";
import { loadFonts } from "./fonts";
import { Cap, Footage, SceneWrap, sfx, VideoData } from "./Video";

// A Short: segments of a long video re-cut vertical (1080x1920), ending on a card that points to the full video.
// clips are [start, end] in the long video's seconds; everything inside a clip (VO, cards, footage, sfx) plays in that time.
const FPS = 30;
export type ShortSpec = {
  data: VideoData; clips: [number, number][]; kicker: string; title: string;
  end: { big: string; line: string[] }; cta?: number; cardScale?: number;
};
const frames = (s: number) => Math.round(s * FPS);
const starts = (sp: ShortSpec) => sp.clips.reduce<number[]>((acc, [a, b], i) => [...acc, (acc[i] ?? 0) + frames(b - a)], [0]);
export const shortFrames = (sp: ShortSpec) => starts(sp)[sp.clips.length] + frames(sp.cta ?? 3.5);

const FONT = "Oswald, Impact, sans-serif";
// landscape cards drawn at 1920x1080, scaled down (0.68 default) and centred on y=887; the side margins they never use
// fall off-canvas. Chapter cards are skipped: they are wider than a phone and the header already names the topic.
const Cards: React.FC<{ scenes: Scene[]; scale: number }> = ({ scenes, scale }) => (
  <div style={{ position: "absolute", left: (1080 - 1920 * scale) / 2, top: 887 - 540 * scale, width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
    {scenes.map((s, i) => {
      const from = frames(s.at);
      const end = i === scenes.length - 1 ? from + 300 : frames(scenes[i + 1].at);
      const K = KINDS[s.k];
      if (s.k === "chapter") return null;
      return (
        <Sequence key={i} from={from} durationInFrames={end - from}>
          <SceneWrap len={end - from}><K {...s} zoomScale={1} /></SceneWrap>
        </Sequence>
      );
    })}
  </div>
);

const Captions: React.FC<{ captions: Cap[] }> = ({ captions }) => {
  const t = useCurrentFrame() / FPS;
  const c = captions.find((x) => t >= x.s - 0.05 && t < x.e + 0.25);
  if (!c) return null;
  const text = c.t.charAt(0).toUpperCase() + c.t.slice(1);
  const o = interpolate(t, [c.s - 0.05, c.s + 0.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 120, right: 120, top: 1330, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 64, lineHeight: 1.15, color: "#fff", background: "#000000b8", padding: "12px 28px", borderRadius: 14, textAlign: "center" }}>{text}</div>
    </div>
  );
};

const Cues: React.FC<{ scenes: Scene[] }> = ({ scenes }) => (
  <>
    {scenes.flatMap((s, i) => [
      i > 0 ? sfx("whoosh", s.at - 0.1, s.k === "chapter" ? 0.45 : 0.18) : null,
      s.stamp ? sfx("thud", s.at + (s.stampAt ?? 1), 0.6) : null,
    ])}
  </>
);

// One clip of the long video, playing in its time.
const Clip: React.FC<{ from: number; data: VideoData; scale: number }> = ({ from, data, scale }) => (
  <Sequence from={-frames(from)}>
    <Footage footage={data.footage} />
    <Cards scenes={data.scenes} scale={scale} />
    <Captions captions={data.captions} />
    <Audio src={staticFile(data.vo)} />
    <Cues scenes={data.scenes} />
  </Sequence>
);

const Header: React.FC<{ kicker: string; title: string }> = ({ kicker, title }) => (
  <div style={{ position: "absolute", top: 190, left: 0, right: 0, textAlign: "center", fontFamily: FONT, color: C.white }}>
    <div style={{ display: "inline-block", fontSize: 40, fontWeight: 700, letterSpacing: 4, color: C.pink, border: `3px solid ${C.pink}`, borderRadius: 40, padding: "4px 26px", background: "#0b0716cc" }}>{kicker}</div>
    <div style={{ fontSize: 92, fontWeight: 700, marginTop: 14, textShadow: `0 0 30px ${C.pink}88, 0 6px 0 #000a` }}>{title}</div>
  </div>
);

const EndCard: React.FC<{ big: string; line: string[] }> = ({ big, line }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f, fps, config: { damping: 14, stiffness: 140 } });
  const bob = Math.sin((f / fps) * 6) * 14;
  return (
    <AbsoluteFill style={{ background: "#0b0716e6", fontFamily: FONT, color: C.white, alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 80px 260px" }}>
      <div style={{ opacity: p, transform: `scale(${0.7 + 0.3 * p})` }}>
        <div style={{ fontSize: big.length > 4 ? 130 : 200, fontWeight: 700, color: C.cyan, lineHeight: 1, textShadow: `0 0 40px ${C.cyan}88` }}>{big}</div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1, marginTop: 10 }}>{line.map((l, i) => <div key={i}>{l}</div>)}</div>
        <div style={{ fontSize: 58, fontWeight: 700, marginTop: 60, color: C.ink, background: C.pink, borderRadius: 16, padding: "14px 40px", display: "inline-block" }}>WATCH THE FULL VIDEO</div>
        <div style={{ fontSize: 120, marginTop: 30, color: C.pink, transform: `translateY(${bob}px)` }}>↓</div>
      </div>
    </AbsoluteFill>
  );
};

export const GtaShort: React.FC<{ spec: ShortSpec }> = ({ spec }) => {
  loadFonts();
  const { clips: CLIPS, data } = spec;
  const STARTS = starts(spec);
  const CTA = spec.cta ?? 3.5;
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      {CLIPS.map(([a, b], i) => (
        <Sequence key={i} from={STARTS[i]} durationInFrames={frames(b - a)}>
          <Clip from={a} data={data} scale={spec.cardScale ?? 0.68} />
        </Sequence>
      ))}
      <Sequence from={0} durationInFrames={STARTS[CLIPS.length]}><Header kicker={spec.kicker} title={spec.title} /></Sequence>
      <Sequence from={STARTS[CLIPS.length]} durationInFrames={frames(CTA)}>
        <EndCard big={spec.end.big} line={spec.end.line} />
        {sfx("whoosh", 0, 0.45)}
        {sfx("thud", 0.1, 0.5)}
      </Sequence>
      <Loop durationInFrames={32 * FPS}>
        <Audio src={staticFile("sfx/music_bed.wav")} volume={(fr) => 0.13 * interpolate(fr, [0, 30], [0, 1], { extrapolateRight: "clamp" })} />
      </Loop>
    </AbsoluteFill>
  );
};

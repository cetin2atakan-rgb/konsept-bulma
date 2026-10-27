import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Character, POSES, FACES } from "./components/Character";
import { loadFonts } from "./fonts";

// Dev contact sheet: frame 0 = poses, frame 1 = faces + props + emotes.
export const Sheet: React.FC = () => {
  loadFonts();
  const page = useCurrentFrame();
  const poses = Object.keys(POSES);
  const faces = Object.keys(FACES);
  const props = ["phone", "paper", "newspaper", "coffee", "sandwich", "burger", "money", "letter", "soda", "key", "flower", "ticket", "map", "bag"];
  const emotes = ["!", "?", "anger", "sweat", "sparkle", "heart", "idea", "zzz", "dots", "lines"];
  const cells: { label: string; c: any }[] =
    page === 0 ? poses.map((p) => ({ label: p, c: { id: p, x: 0, color: "#2a9d8f", keys: [[p, 0]] } }))
      : [...faces.map((f) => ({ label: f, c: { id: f, x: 0, color: "#e76f51", keys: [["idle", 0]], face: [[f, 0]] } })),
         ...props.map((p) => ({ label: p, c: { id: p, x: 0, color: "#6d597a", keys: [["hold", 0]], prop: p } })),
         ...emotes.map((e) => ({ label: e, c: { id: e, x: 0, color: "#f4a261", keys: [["idle", 0]], emote: [[e, 0]] } }))];
  const cols = 10;
  return (
    <AbsoluteFill style={{ background: "#f3efe6" }}>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
        {cells.map((cell, i) => {
          const cx = (i % cols) * 192 + 96, cy = Math.floor(i / cols) * 270 + 250;
          return (
            <g key={i}>
              <g transform={`translate(${cx},${cy})`}><Character c={{ ...cell.c, x: 0 }} frame={30} dur={300} y={0} scale={0.5} /></g>
              <text x={cx} y={cy + 26} textAnchor="middle" fontFamily="Fredoka" fontSize={20}>{cell.label}</text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

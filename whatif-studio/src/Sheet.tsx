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
    page === 2 ? [
      ...poses.slice(0, 20).map((p, i) => ({ label: p, c: { id: p + i, x: 0, style: "human", color: ["#3d5a80", "#e07a5f", "#81b29a", "#f2cc8f"][i % 4], keys: [[p, 0]], female: i % 3 === 1, outfit: i % 5 === 4 ? "suit" : undefined, hair: i % 7 === 3 ? "gray" : undefined } })),
      ...faces.map((f, i) => ({ label: f, c: { id: f, x: 0, style: "human", color: "#457b9d", keys: [["idle", 0]], face: [[f, 0]], sleeves: i % 2 ? "short" : undefined } })),
      ...["phone", "coffee", "newspaper", "money", "cross", "hips", "facepalm"].map((p, i) => ({ label: p, c: { id: "h" + p, x: 0, style: "human", color: "#9c6644", keys: [[i < 4 ? "hold" : p, 0]], prop: i < 4 ? p : undefined, hat: i === 2 ? "fedora" : undefined } })),
    ] : page === 0 ? poses.map((p) => ({ label: p, c: { id: p, x: 0, color: "#2a9d8f", keys: [[p, 0]] } }))
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

import React from "react";
import { Theme } from "./Overlays";

// Bottom captions: shows a 3-6 word chunk, highlights the word being spoken.
export const Captions: React.FC<{ words: { w: string; s: number }[]; frame: number; start: number; theme: Theme }> = ({ words, frame, start, theme }) => {
  const abs = frame + start;
  const chunks: { w: string; s: number }[][] = [];
  let cur: { w: string; s: number }[] = [];
  words.forEach((w) => {
    cur.push(w);
    if (cur.length >= 5 || /[.,!?;:]$/.test(w.w) && cur.length >= 3) { chunks.push(cur); cur = []; }
  });
  if (cur.length) chunks.push(cur);
  let ci = 0;
  chunks.forEach((c, i) => { if (abs >= c[0].s) ci = i; });
  const chunk = chunks[ci];
  if (!chunk || abs < chunk[0].s) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", fontFamily: theme.font, fontWeight: 700, fontSize: 64, letterSpacing: theme.retro ? 2 : 0, textTransform: theme.retro ? "uppercase" : "none" }}>
      <span style={{ background: "rgba(0,0,0,0.72)", padding: "10px 28px", borderRadius: 18, display: "inline-flex", gap: 18 }}>
        {chunk.map((w, i) => {
          const next = chunk[i + 1]?.s ?? Infinity;
          const on = abs >= w.s && abs < next;
          return (
            <span key={i} style={{ color: on ? theme.accent : "#fff", display: "inline-block", transform: on ? "translateY(-4px)" : "none" }}>
              {w.w}
            </span>
          );
        })}
      </span>
    </div>
  );
};

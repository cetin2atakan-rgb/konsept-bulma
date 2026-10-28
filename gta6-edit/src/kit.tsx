import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LIST13 } from "./scenes";

export const C = { pink: "#ff2e88", cyan: "#29e0ff", yellow: "#ffd23f", red: "#ff3d3d", white: "#f7f3ff", dim: "#a99cc8", ink: "#0b0716" };
const col = (c?: string) => (C as any)[c || "white"] || c;
const FONT = "Oswald, Impact, sans-serif";

// local time helpers (frame 0 = scene start)
const useT = () => useCurrentFrame() / 30;
const usePop = (delay = 0) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay * 30, fps, config: { damping: 14, stiffness: 140, mass: 0.7 } });
};

const Center: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 24 }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap, fontFamily: FONT, color: C.white, padding: "0 140px 120px", textAlign: "center" }}>
    {children}
  </div>
);

const Pop: React.FC<{ d?: number; children: React.ReactNode; style?: React.CSSProperties; from?: number }> = ({ d = 0, children, style, from = 0.6 }) => {
  const p = usePop(d);
  if (useT() < d) return <div style={{ ...style, opacity: 0 }}>{children}</div>;
  return <div style={{ ...style, opacity: Math.min(1, p * 1.4), transform: `scale(${from + (1 - from) * p}) translateY(${(1 - p) * 30}px)` }}>{children}</div>;
};

const glow = (c: string) => `0 0 24px ${c}aa, 0 0 60px ${c}55, 0 6px 0 #000a`;

export const Stamp: React.FC<{ text: string; at: number; color?: string; rot?: number }> = ({ text, at, color = C.red, rot = -8 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at * 30) return null;
  const p = spring({ frame: f - at * 30, fps, config: { damping: 11, stiffness: 220 } });
  return (
    <div style={{ marginTop: 18, transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * p})`, opacity: Math.min(1, p * 2), border: `8px solid ${color}`, color, padding: "8px 34px", fontSize: 64, fontWeight: 700, letterSpacing: 6, borderRadius: 12, background: "#0b0716cc", textShadow: `0 0 18px ${color}88` }}>
      {text}
    </div>
  );
};

const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: "linear-gradient(180deg,#1b1233ee,#0f0a1fee)", border: "2px solid #ffffff22", borderRadius: 26, boxShadow: "0 30px 80px #000c, inset 0 1px 0 #ffffff22", ...style }}>{children}</div>
);

const sizeFor = (s: string, max = 300) => Math.min(max, Math.round(2300 / Math.max(3, s.length)));

// ---------- scene kinds ----------

const Title: React.FC<any> = ({ kicker, text }) => (
  <Center>
    <Pop><div style={{ background: C.pink, color: C.ink, fontSize: 44, fontWeight: 700, padding: "6px 28px", borderRadius: 10, letterSpacing: 8 }}>{kicker}</div></Pop>
    <Pop d={0.15}><div style={{ fontSize: 118, fontWeight: 700, lineHeight: 1.05, whiteSpace: "pre-line", textTransform: "uppercase", textShadow: glow(C.pink) }}>{text}</div></Pop>
  </Center>
);

const Big: React.FC<any> = ({ value, label, sub, color, stamp, stampAt }) => (
  <Center gap={10}>
    <Pop><div style={{ fontSize: sizeFor(value), fontWeight: 700, lineHeight: 1, color: col(color), textShadow: glow(col(color)), whiteSpace: "nowrap" }}>{value}</div></Pop>
    {label && <Pop d={0.25}><div style={{ fontSize: 58, fontWeight: 500, letterSpacing: 2, marginTop: 14 }}>{label}</div></Pop>}
    {sub && <Pop d={0.6}><div style={{ fontSize: 42, color: C.dim }}>{sub}</div></Pop>}
    {stamp && <Stamp text={stamp} at={stampAt ?? 1} />}
  </Center>
);

const Chapter: React.FC<any> = ({ n, title }) => {
  const t = useT();
  const sweep = interpolate(t, [0, 0.5], [-120, 120], { extrapolateRight: "clamp" });
  return (
    <Center gap={0}>
      <div style={{ position: "absolute", left: 0, right: 0, top: "41%", height: 220, background: `linear-gradient(90deg,transparent,${C.pink}55,transparent)`, transform: `translateX(${sweep}%) skewX(-20deg)` }} />
      {n !== "" && <Pop><div style={{ fontSize: 250, fontWeight: 700, lineHeight: 1, color: "transparent", WebkitTextStroke: `6px ${C.cyan}`, textShadow: `0 0 40px ${C.cyan}66` }}>{n.length < 4 ? `#${n}` : n}</div></Pop>}
      <Pop d={0.2}><div style={{ fontSize: 120, fontWeight: 700, letterSpacing: 6, textShadow: glow(C.pink) }}>{title}</div></Pop>
    </Center>
  );
};

const Store: React.FC<any> = ({ note }) => {
  const t = useT();
  const scroll = interpolate(t, [0, 3], [60, 0], { extrapolateRight: "clamp" });
  const blink = Math.floor(t * 2) % 2 === 0;
  const row = (k: string, v: React.ReactNode, hi = false) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "22px 0", borderBottom: "1px solid #ffffff18", fontSize: 40, color: hi ? C.white : C.dim }}>
      <span>{k}</span><span>{v}</span>
    </div>
  );
  return (
    <Center>
      <Panel style={{ width: 1350, padding: 44, display: "flex", gap: 50, textAlign: "left", transform: `translateY(${scroll}px)` }}>
        <div style={{ width: 380, height: 500, borderRadius: 16, background: "linear-gradient(160deg,#ff2e88,#7b2cff 55%,#29e0ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 200, fontWeight: 700, color: "#fff", textShadow: "0 8px 30px #0008" }}>VI</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 26, letterSpacing: 6, color: C.cyan }}>STORE PAGE</div>
          <div style={{ fontSize: 70, fontWeight: 700, margin: "6px 0 18px" }}>Grand Theft Auto VI</div>
          {row("Release", "Nov 19")}
          {row("Publisher", "Rockstar Games")}
          {row("Platforms", "PS5 · Xbox Series X|S")}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 18px", margin: "10px -18px 0", fontSize: 46, border: `3px dashed ${C.yellow}`, borderRadius: 12, color: C.white }}>
            <span>File size</span>
            <span style={{ width: 220, height: 50, background: "#ffffff10", borderRadius: 6, display: "flex", alignItems: "center", paddingLeft: 12 }}>
              <span style={{ width: 4, height: 40, background: blink ? C.yellow : "transparent" }} />
            </span>
          </div>
        </div>
      </Panel>
      {note && <Pop d={1.2}><div style={{ fontSize: 64, fontWeight: 700, color: C.yellow, textShadow: glow(C.yellow) }}>{note}</div></Pop>}
    </Center>
  );
};

const Post: React.FC<any> = ({ handle, body, stamp, stampAt }) => (
  <Center>
    <Pop>
      <Panel style={{ width: 1100, padding: 50, textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 90, height: 90, borderRadius: 45, background: `linear-gradient(135deg,${C.cyan},#3b5bff)` }} />
          <div><div style={{ fontSize: 40, fontWeight: 700 }}>PlayStation Game Size</div><div style={{ fontSize: 32, color: C.dim }}>{handle}</div></div>
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, marginTop: 30 }}>{body}</div>
        <div style={{ fontSize: 30, color: C.dim, marginTop: 14 }}>leak account · not an official source</div>
      </Panel>
    </Pop>
    {stamp && <Stamp text={stamp} at={stampAt} />}
  </Center>
);

const Bars: React.FC<any> = ({ title, items, unit, warn, warnAt = 1.5 }) => {
  const t = useT();
  return (
    <Center gap={30}>
      <Pop><div style={{ fontSize: 60, fontWeight: 700, letterSpacing: 6, color: C.cyan }}>{title}</div></Pop>
      <Panel style={{ width: 1400, padding: "40px 50px", textAlign: "left" }}>
        {items.map((it: any, i: number) => {
          const a = it.appear ?? i * 0.4;
          const p = interpolate(t, [a, a + 1.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const ease = 1 - Math.pow(1 - p, 3);
          const w = (it.q ? 1 : it.value / it.max) * ease;
          return (
            <div key={i} style={{ margin: "26px 0", opacity: t < a ? 0.25 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 46, marginBottom: 12 }}>
                <span>{it.label}</span>
                <span style={{ color: col(it.color), fontWeight: 700 }}>{it.q ? "?" : `${Math.round(it.value * ease).toLocaleString("en-US")} ${unit}`}</span>
              </div>
              <div style={{ height: 64, borderRadius: 12, background: "#ffffff12", overflow: "hidden", border: it.q ? `3px dashed ${col(it.color)}` : "none" }}>
                <div style={{ width: `${w * 100}%`, height: "100%", background: it.q ? `repeating-linear-gradient(45deg,${col(it.color)}55 0 20px,transparent 20px 40px)` : `linear-gradient(90deg,${col(it.color)}aa,${col(it.color)})`, boxShadow: `0 0 30px ${col(it.color)}88` }} />
              </div>
            </div>
          );
        })}
      </Panel>
      {warn && t > warnAt && <div style={{ fontSize: 58, fontWeight: 700, color: C.red, opacity: Math.floor(t * 3) % 2 ? 1 : 0.55, textShadow: glow(C.red) }}>{warn}</div>}
    </Center>
  );
};

const Flash: React.FC<any> = ({ items, every, end }) => {
  const t = useT();
  const i = Math.floor(t / every);
  if (end && i >= items.length) return <Center><Pop d={items.length * every}><div style={{ fontSize: 96, fontWeight: 700, color: C.yellow, textShadow: glow(C.yellow) }}>{end}</div></Pop></Center>;
  const k = Math.min(i, items.length - 1);
  const local = t - k * every;
  const s = interpolate(local, [0, 0.15], [1.25, 1], { extrapolateRight: "clamp" });
  return (
    <Center>
      <div style={{ fontSize: 30, letterSpacing: 8, color: C.dim }}>{`${k + 1} / ${items.length}`}</div>
      <div style={{ transform: `scale(${s})`, fontSize: sizeFor(items[k], 150), fontWeight: 700, textTransform: "uppercase", textShadow: glow(k % 2 ? C.cyan : C.pink) }}>{items[k]}</div>
    </Center>
  );
};

const List13: React.FC<any> = ({ blur, hi }) => {
  const t = useT();
  return (
    <Center gap={20}>
      <Pop><div style={{ fontSize: 56, fontWeight: 700, letterSpacing: 6, color: C.cyan }}>{blur ? "13 THINGS STILL MISSING" : "WHICH ONE DO YOU WANT ANSWERED?"}</div></Pop>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 60px", width: 1400, textAlign: "left" }}>
        {LIST13.map((s, i) => {
          const a = i * 0.12;
          const on = hi === i + 1 && t > 2.2;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 46, opacity: t < a ? 0 : 1, background: on ? `${C.pink}33` : "#ffffff0d", border: on ? `3px solid ${C.pink}` : "3px solid transparent", borderRadius: 12, padding: "8px 20px", boxShadow: on ? glow(C.pink) : "none" }}>
              <span style={{ width: 70, fontWeight: 700, color: on ? C.pink : C.yellow }}>{i + 1}</span>
              <span style={{ filter: blur ? "blur(14px)" : "none" }}>{s}</span>
            </div>
          );
        })}
      </div>
    </Center>
  );
};

const Quote: React.FC<any> = ({ text, who, src }) => (
  <Center gap={20}>
    <Pop><div style={{ fontSize: 200, lineHeight: 0.6, color: C.pink, fontFamily: "Georgia, serif" }}>{"“"}</div></Pop>
    <Pop d={0.15}><div style={{ fontSize: sizeFor(text, 110) * 1.15, fontWeight: 700, maxWidth: 1500, lineHeight: 1.12 }}>{text}</div></Pop>
    <Pop d={0.5}><div style={{ fontSize: 46, color: C.cyan }}>{"— " + who}</div></Pop>
    {src && <Pop d={0.7}><div style={{ fontSize: 34, color: C.dim }}>{src}</div></Pop>}
  </Center>
);

const Strip: React.FC<any> = ({ title, items, stamp, stampAt }) => (
  <Center gap={30}>
    <Pop><div style={{ fontSize: 56, fontWeight: 700, letterSpacing: 6, color: C.cyan }}>{title}</div></Pop>
    <div style={{ display: "flex", gap: 40 }}>
      {items.map((it: any, i: number) => (
        <Pop key={i} d={0.2 + i * 0.25}>
          <Panel style={{ width: 380, padding: "40px 0", border: it.q ? `4px dashed ${C.yellow}` : it.hi ? `4px solid ${C.pink}` : undefined, boxShadow: it.hi ? glow(C.pink) : undefined }}>
            <div style={{ fontSize: 190, fontWeight: 700, lineHeight: 1, color: it.q ? C.yellow : C.white }}>{it.v}</div>
            <div style={{ fontSize: 30, color: C.dim, letterSpacing: 4 }}>FPS</div>
            <div style={{ fontSize: 42, marginTop: 14, color: it.q ? C.yellow : C.white }}>{it.label}</div>
          </Panel>
        </Pop>
      ))}
    </div>
    {stamp && <Stamp text={stamp} at={stampAt} />}
  </Center>
);

const Checklist: React.FC<any> = ({ title, items, at2, mode }) => {
  const t = useT();
  return (
    <Center gap={30}>
      <Pop><div style={{ fontSize: 60, fontWeight: 700, letterSpacing: 4, color: C.cyan }}>{title}</div></Pop>
      <Panel style={{ width: 1100, padding: "30px 50px", textAlign: "left" }}>
        {items.map((s: string, i: number) => {
          const a = at2?.[i] ?? 0.4 + i * 0.4;
          const on = t >= a;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", borderBottom: i < items.length - 1 ? "1px solid #ffffff18" : "none", opacity: on ? 1 : 0.3, fontSize: 54 }}>
              <span>{s}</span>
              <span style={{ fontSize: 40, fontWeight: 700, color: mode === "q" ? C.yellow : C.red, minWidth: 300, textAlign: "right" }}>{on ? (mode === "q" ? "NOBODY KNOWS" : "NONE") : ""}</span>
            </div>
          );
        })}
      </Panel>
    </Center>
  );
};

const Badge: React.FC<any> = ({ text, sub, empty }) => {
  const t = useT();
  const pulse = 1 + Math.sin(t * 4) * 0.015;
  return (
    <Center gap={36}>
      <Pop><div style={{ transform: `scale(${pulse})`, fontSize: 90, fontWeight: 700, letterSpacing: 4, padding: "26px 60px", borderRadius: 60, background: "linear-gradient(90deg,#1c1c1c,#3a3a3a)", border: `4px solid ${C.white}`, boxShadow: `0 0 60px ${C.cyan}66` }}>{text}</div></Pop>
      {empty && <Pop d={0.3}><div style={{ width: 900, height: 200, border: `4px dashed ${C.dim}`, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: C.dim }}>(no details)</div></Pop>}
      <Pop d={0.4}><div style={{ fontSize: 56, color: empty ? C.yellow : C.white }}>{sub}</div></Pop>
    </Center>
  );
};

const Avatar: React.FC<{ c: string; size?: number }> = ({ c, size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs><linearGradient id={`g${c}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={c} /><stop offset="1" stopColor="#2a1650" /></linearGradient></defs>
    <circle cx="50" cy="50" r="48" fill={`url(#g${c})`} />
    <circle cx="50" cy="40" r="17" fill="#0b0716" opacity="0.85" />
    <path d="M18 88 C22 64 78 64 82 88 Z" fill="#0b0716" opacity="0.85" />
  </svg>
);

const People: React.FC<any> = ({ title, items }) => {
  const t = useT();
  const many = items.length > 3;
  return (
    <Center gap={34}>
      {title && <Pop><div style={{ fontSize: 60, fontWeight: 700, letterSpacing: 4, color: C.cyan }}>{title}</div></Pop>}
      <div style={{ display: "flex", gap: many ? 26 : 60 }}>
        {items.map((it: any, i: number) => {
          const a = it.appear ?? 0.2 + i * 0.25;
          return (
            <Pop key={i} d={a}>
              <Panel style={{ width: many ? 300 : 560, padding: many ? "30px 10px" : "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <Avatar c={[C.pink, C.cyan, C.yellow, "#9b5cff", "#ff8a3d"][i % 5]} size={many ? 170 : 240} />
                <div style={{ position: "relative", fontSize: many ? 40 : 64, fontWeight: 700 }}>
                  {it.name}
                  {it.strike && t > a + 0.8 && <div style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 8, background: C.red, transform: "rotate(-4deg)" }} />}
                </div>
                {it.role && <div style={{ fontSize: many ? 30 : 44, color: it.role.includes("?") ? C.yellow : C.dim }}>{it.role}</div>}
                {it.tag && t > a + (it.tagAt ?? 1) && <div style={{ fontSize: 34, fontWeight: 700, color: C.red, border: `3px solid ${C.red}`, borderRadius: 8, padding: "4px 16px" }}>{it.tag}</div>}
                {many && <div style={{ fontSize: 30, color: C.yellow }}>missions?</div>}
              </Panel>
            </Pop>
          );
        })}
      </div>
    </Center>
  );
};

const Cards: React.FC<any> = ({ title, items }) => (
  <Center gap={36}>
    <Pop><div style={{ fontSize: 56, fontWeight: 700, letterSpacing: 4, color: C.cyan }}>{title}</div></Pop>
    <div style={{ display: "flex", gap: 40 }}>
      {items.map((it: any, i: number) => (
        <Pop key={i} d={it.at}>
          <Panel style={{ width: items.length > 2 ? 500 : 640, padding: "44px 24px" }}>
            <div style={{ fontSize: 190, fontWeight: 700, lineHeight: 1, color: [C.pink, C.cyan, C.yellow][i % 3], textShadow: glow([C.pink, C.cyan, C.yellow][i % 3]) }}>{it.v}</div>
            <div style={{ fontSize: 64, fontWeight: 700, marginTop: 10 }}>{it.t}</div>
            <div style={{ fontSize: 34, color: C.dim, marginTop: 8 }}>{it.s}</div>
          </Panel>
        </Pop>
      ))}
    </div>
  </Center>
);

const Box: React.FC<any> = ({ price, items }) => (
  <Center gap={30}>
    <div style={{ display: "flex", gap: 80, alignItems: "center" }}>
      <Pop>
        <div style={{ position: "relative", width: 440, height: 440 }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(150deg,#2b1a4a,#120b24)", border: "3px solid #ffffff33", borderRadius: 16, transform: "perspective(900px) rotateY(-18deg)", boxShadow: "0 40px 80px #000c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, fontWeight: 700, color: C.dim }}>COLLECTOR BOX</div>
          <div style={{ position: "absolute", right: -40, top: -30, background: C.yellow, color: C.ink, fontSize: 80, fontWeight: 700, padding: "6px 30px", borderRadius: 14, transform: "rotate(8deg)" }}>{price}</div>
        </div>
      </Pop>
      <div style={{ textAlign: "left" }}>
        {items.map((s: string, i: number) => (
          <Pop key={i} d={0.5 + i * 1.5}><div style={{ fontSize: 54, margin: "16px 0", color: i === 2 ? C.red : C.white }}>{"• " + s}</div></Pop>
        ))}
      </div>
    </div>
  </Center>
);

const Regions: React.FC<any> = ({ items, stamp, stampAt }) => (
  <Center gap={30}>
    <Pop><div style={{ fontSize: 50, letterSpacing: 6, color: C.cyan }}>THE OFFICIAL REGIONS OF LEONIDA</div></Pop>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, width: 1400 }}>
      {items.map((s: string, i: number) => (
        <Pop key={i} d={0.1 + i * 0.15}><Panel style={{ padding: "26px 0", fontSize: 54, fontWeight: 700 }}>{s}</Panel></Pop>
      ))}
    </div>
    <Stamp text={stamp} at={stampAt} />
  </Center>
);

const Rating: React.FC<any> = ({ items, missing, missAt }) => {
  const t = useT();
  return (
    <Center>
      <Panel style={{ width: 1300, padding: 44, display: "flex", gap: 44, textAlign: "left", background: "#f4f1ea", color: "#111" }}>
        <div style={{ width: 230, height: 300, background: "#111", color: "#fff", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 190, fontWeight: 700, lineHeight: 1 }}>M</div>
          <div style={{ fontSize: 30 }}>MATURE 17+</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 30, letterSpacing: 4, color: "#555" }}>ESRB RATING · CONTENT DESCRIPTORS</div>
          {items.map((s: string, i: number) => <div key={i} style={{ fontSize: 40, margin: "8px 0" }}>{s}</div>)}
          <div style={{ marginTop: 18, padding: "14px 20px", border: `4px dashed ${t > missAt ? "#e0002a" : "#bbb"}`, borderRadius: 10, fontSize: 40, color: "#e0002a", minHeight: 60 }}>
            {t > missAt ? `“${missing}” — not there` : ""}
          </div>
        </div>
      </Panel>
    </Center>
  );
};

const Grid: React.FC<any> = ({ title, filled, fillAt, names, namesAt, sub, subAt }) => {
  const t = useT();
  return (
    <Center gap={26}>
      <Pop><div style={{ fontSize: 58, fontWeight: 700, letterSpacing: 4, color: C.cyan }}>{title}</div></Pop>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(17, 80px)", gap: 12 }}>
        {Array.from({ length: 34 }, (_, i) => {
          const n = i + 1;
          const k = filled.indexOf(n);
          const on = k >= 0 && t > fillAt + k * 0.25;
          return (
            <div key={i} style={{ height: 80, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 700, background: on ? C.pink : "#ffffff0d", border: on ? "none" : "2px dashed #ffffff33", color: on ? C.ink : "#ffffff55", boxShadow: on ? glow(C.pink) : "none", opacity: t > i * 0.04 ? 1 : 0 }}>{n}</div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 1500 }}>
        {names.map((s: string, i: number) => (
          <Pop key={i} d={namesAt + i * 0.6}><div style={{ fontSize: 40, padding: "8px 22px", borderRadius: 30, background: "#ffffff14" }}>{s}</div></Pop>
        ))}
      </div>
      {t > subAt && <Pop d={subAt}><div style={{ fontSize: 60, fontWeight: 700, color: C.yellow }}>{sub}</div></Pop>}
    </Center>
  );
};

const Stations: React.FC<any> = ({ items, extra, extraAt }) => {
  const t = useT();
  return (
    <Center gap={30}>
      <Pop><div style={{ fontSize: 58, fontWeight: 700, letterSpacing: 4, color: C.cyan }}>6 STATIONS REVEALED · OCTOBER</div></Pop>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 380px)", gap: 24 }}>
        {items.map((s: string, i: number) => (
          <Pop key={i} d={0.3 + i * 1.0}><Panel style={{ padding: "30px 10px", fontSize: 46, fontWeight: 700 }}><div style={{ fontSize: 26, color: C.pink, letterSpacing: 4 }}>RADIO</div>{s}</Panel></Pop>
        ))}
        {extra.map((s: string, i: number) => (
          t > extraAt + i * 0.6 ? <Pop key={"x" + i} d={extraAt + i * 0.6}><div style={{ padding: "30px 10px", fontSize: 46, fontWeight: 700, color: C.yellow, border: `4px dashed ${C.yellow}`, borderRadius: 26 }}><div style={{ fontSize: 26, letterSpacing: 4 }}>NO NAME · NO FREQ.</div>{s}</div></Pop> : null
        ))}
      </div>
    </Center>
  );
};

const Counter: React.FC<any> = ({ to, prefix, label, xAt, xLabel }) => {
  const t = useT();
  const p = interpolate(t, [0.2, 3.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const v = Math.round(to * (1 - Math.pow(1 - p, 3)));
  const x = t > xAt;
  return (
    <Center gap={20}>
      <div style={{ position: "relative" }}>
        <div style={{ fontSize: 190, fontWeight: 700, color: C.yellow, textShadow: glow(C.yellow), opacity: x ? 0.45 : 1 }}>{prefix + v.toLocaleString("en-US")}</div>
        {x && <svg style={{ position: "absolute", inset: 0 }} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M5 10 L95 90 M95 10 L5 90" stroke={C.red} strokeWidth="5" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 22 }} /></svg>}
      </div>
      <div style={{ fontSize: 54 }}>{label}</div>
      {x && <Pop d={xAt}><div style={{ fontSize: 52, fontWeight: 700, color: C.red }}>{xLabel}</div></Pop>}
    </Center>
  );
};

const Timeline: React.FC<any> = ({ dates, recap }) => {
  const t = useT();
  return (
    <Center gap={50}>
      <Pop><div style={{ fontSize: 60, fontWeight: 700, letterSpacing: 6, color: C.cyan }}>{recap ? "READ THAT ORDER AGAIN" : "THE CALENDAR"}</div></Pop>
      <div style={{ position: "relative", width: 1500, height: 420 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, height: 8, background: "#ffffff33", borderRadius: 4 }} />
        {dates.map((d: any, i: number) => {
          const on = t >= d.at;
          const c = d.red ? C.red : d.hi ? C.yellow : C.pink;
          const x = (i + 0.5) / dates.length * 100;
          return (
            <div key={i} style={{ position: "absolute", left: `${x}%`, top: 0, width: 460, marginLeft: -230, display: "flex", flexDirection: "column", alignItems: "center", opacity: on ? 1 : 0.15, transform: `scale(${on ? 1 : 0.9})` }}>
              <div style={{ fontSize: 70, fontWeight: 700, color: c, textShadow: on ? glow(c) : "none" }}>{d.d}</div>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: c, margin: "6px 0 26px", boxShadow: on ? glow(c) : "none" }} />
              <div style={{ fontSize: 52, fontWeight: 700 }}>{d.l}</div>
              {d.s && <div style={{ fontSize: 34, color: C.dim, marginTop: 8 }}>{d.s}</div>}
            </div>
          );
        })}
      </div>
    </Center>
  );
};

const Facts: React.FC<any> = ({ items, every }) => (
  <Center gap={34}>
    {items.map((s: string, i: number) => (
      <Pop key={i} d={i * every} from={1}><div style={{ fontSize: 96, fontWeight: 700, color: i === 1 ? C.yellow : C.white }}>{s}</div></Pop>
    ))}
  </Center>
);

export const KINDS: Record<string, React.FC<any>> = {
  title: Title, big: Big, chapter: Chapter, store: Store, post: Post, bars: Bars, flash: Flash, list13: List13,
  quote: Quote, strip: Strip, checklist: Checklist, badge: Badge, people: People, cards: Cards, box: Box,
  regions: Regions, rating: Rating, grid: Grid, stations: Stations, counter: Counter, timeline: Timeline, facts: Facts,
};

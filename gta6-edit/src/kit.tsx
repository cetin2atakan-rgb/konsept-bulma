import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LIST13 } from "./scenes";

export const C = { pink: "#ff2e88", cyan: "#29e0ff", yellow: "#ffd23f", red: "#ff3d3d", white: "#f7f3ff", dim: "#a99cc8", ink: "#0b0716" };
const GREEN = "#3dff9a";
const col = (c?: string) => (c === "green" ? GREEN : (C as any)[c || "white"] || c);
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

const Strike: React.FC<{ at: number }> = ({ at }) => {
  const p = interpolate(useT(), [at, at + 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return p > 0 ? <div style={{ position: "absolute", left: "-4%", top: "48%", height: 16, width: `${108 * p}%`, background: C.red, transform: "rotate(-6deg)", boxShadow: glow(C.red) }} /> : null;
};

const Big: React.FC<any> = ({ value, label, sub, color, stamp, stampAt, strikeAt }) => (
  <Center gap={10}>
    <Pop><div style={{ position: "relative", fontSize: sizeFor(value), fontWeight: 700, lineHeight: 1, color: col(color), textShadow: glow(col(color)), whiteSpace: "nowrap" }}>{value}{strikeAt !== undefined && <Strike at={strikeAt} />}</div></Pop>
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

const Store: React.FC<any> = ({ note, field = "File size" }) => {
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
            <span>{field}</span>
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

const Post: React.FC<any> = ({ name = "PlayStation Game Size", handle, body, foot = "leak account · not an official source", stamp, stampAt }) => (
  <Center>
    <Pop>
      <Panel style={{ width: 1100, padding: 50, textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 90, height: 90, borderRadius: 45, background: `linear-gradient(135deg,${C.cyan},#3b5bff)` }} />
          <div><div style={{ fontSize: 40, fontWeight: 700 }}>{name}</div><div style={{ fontSize: 32, color: C.dim }}>{handle}</div></div>
        </div>
        <div style={{ fontSize: sizeFor(body, 76) * 1.6 > 76 ? 76 : 56, fontWeight: 700, marginTop: 30 }}>{body}</div>
        <div style={{ fontSize: 30, color: C.dim, marginTop: 14 }}>{foot}</div>
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

const Box: React.FC<any> = ({ price, items, label = "COLLECTOR BOX", red = 2 }) => (
  <Center gap={30}>
    <div style={{ display: "flex", gap: 80, alignItems: "center" }}>
      <Pop>
        <div style={{ position: "relative", width: 440, height: 440 }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(150deg,#2b1a4a,#120b24)", border: "3px solid #ffffff33", borderRadius: 16, transform: "perspective(900px) rotateY(-18deg)", boxShadow: "0 40px 80px #000c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, fontWeight: 700, color: C.dim, textAlign: "center", padding: 20 }}>{label}</div>
          <div style={{ position: "absolute", right: -40, top: -30, background: C.yellow, color: C.ink, fontSize: 80, fontWeight: 700, padding: "6px 30px", borderRadius: 14, transform: "rotate(8deg)" }}>{price}</div>
        </div>
      </Pop>
      <div style={{ textAlign: "left" }}>
        {items.map((s: string, i: number) => (
          <Pop key={i} d={0.5 + i * 1.5}><div style={{ fontSize: 54, margin: "16px 0", color: i === red ? C.red : C.white }}>{"• " + s}</div></Pop>
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

const Timeline: React.FC<any> = ({ dates, recap, title }) => {
  const t = useT();
  return (
    <Center gap={50}>
      <Pop><div style={{ fontSize: 60, fontWeight: 700, letterSpacing: 6, color: C.cyan }}>{title ?? (recap ? "READ THAT ORDER AGAIN" : "THE CALENDAR")}</div></Pop>
      <div style={{ position: "relative", width: 1500, height: 420 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, height: 8, background: "#ffffff33", borderRadius: 4 }} />
        {dates.map((d: any, i: number) => {
          const on = t >= d.at;
          const c = d.ok ? GREEN : d.red ? C.red : d.hi ? C.yellow : C.pink;
          const wide = dates.length > 3 ? 360 : 460;
          const x = (i + 0.5) / dates.length * 100;
          return (
            <div key={i} style={{ position: "absolute", left: `${x}%`, top: 0, width: wide, marginLeft: -wide / 2, display: "flex", flexDirection: "column", alignItems: "center", opacity: on ? 1 : 0.15, transform: `scale(${on ? 1 : 0.9})` }}>
              <div style={{ fontSize: 70, fontWeight: 700, color: c, textShadow: on ? glow(c) : "none" }}>{d.d}{d.q && t >= d.q ? <span style={{ color: C.yellow }}> ?</span> : null}{d.tick && t >= d.tick ? <span style={{ color: GREEN }}> ✓</span> : null}</div>
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


// ---------- Video 2 kinds ----------

// November as a strip of days: circled days, a shaded range with a label, days that light up later.
const Days: React.FC<any> = ({ title, from = 10, to = 21, marks = [], range, sub, subAt = 1 }) => {
  const t = useT();
  const days = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  return (
    <Center gap={34}>
      {title && <Pop><div style={{ fontSize: 60, fontWeight: 700, letterSpacing: 6, color: C.cyan }}>{title}</div></Pop>}
      <div style={{ position: "relative", display: "flex", gap: 14 }}>
        {range && t >= (range.at ?? 0) && (
          <div style={{ position: "absolute", top: -64, height: 330, left: (range.a - from) * 124 - 6, width: (range.b - range.a) * 124 + 122, background: `${col(range.color || "red")}26`, border: `3px dashed ${col(range.color || "red")}`, borderRadius: 18 }}>
            <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, fontSize: 40, fontWeight: 700, color: col(range.color || "red") }}>{range.label}</div>
          </div>
        )}
        {days.map((d) => {
          const m = marks.find((x: any) => x.d === d);
          const on = m && t >= (m.at ?? 0);
          const c = on ? col(m.color || "pink") : "#ffffff55";
          return (
            <div key={d} style={{ width: 110, height: 150, borderRadius: 14, background: on ? `${c}22` : "#ffffff0b", border: on ? `5px solid ${c}` : "2px solid #ffffff22", boxShadow: on ? glow(c) : "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${on ? 1.06 : 1})` }}>
              <div style={{ fontSize: 24, color: C.dim, letterSpacing: 3 }}>NOV</div>
              <div style={{ fontSize: 64, fontWeight: 700, color: on ? C.white : "#ffffff66" }}>{d}</div>
              {on && m.l && <div style={{ position: "absolute", marginTop: m.up ? -250 : 250, fontSize: 36, fontWeight: 700, color: c, width: 240, textAlign: "center" }}>{m.l}</div>}
            </div>
          );
        })}
      </div>
      <div style={{ height: 60 }} />
      {sub && t >= subAt && <Pop d={subAt}><div style={{ fontSize: 54, fontWeight: 700, color: C.yellow, textShadow: glow(C.yellow) }}>{sub}</div></Pop>}
    </Center>
  );
};

// A terms page; one line gets circled, then the date in it zoomed.
const Terms: React.FC<any> = ({ lines, hi, circleAt = 99, zoomAt = 99, zoom, foot }) => {
  const t = useT();
  const z = interpolate(t, [zoomAt, zoomAt + 0.6], [1, 1.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const draw = interpolate(t, [circleAt, circleAt + 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Center gap={26}>
      <Panel style={{ width: 1350, padding: "40px 56px", textAlign: "left", background: "#f4f1ea", color: "#222", transform: `scale(${z})`, transformOrigin: "50% 72%" }}>
        <div style={{ fontSize: 28, letterSpacing: 5, color: "#777" }}>PRE-ORDER TERMS · PARAPHRASED</div>
        {lines.map((l: string, i: number) => (
          <div key={i} style={{ position: "relative", fontSize: 38, margin: "16px 0", fontFamily: "Georgia, serif", color: i === hi ? "#111" : "#888" }}>
            {i === hi && zoom && t >= zoomAt ? <>{l.split(zoom)[0]}<b style={{ background: "#ffe36b" }}>{zoom}</b>{l.split(zoom)[1]}</> : l}
            {i === hi && draw > 0 && (
              <svg style={{ position: "absolute", left: -24, top: -16, overflow: "visible" }} width="1270" height="82" viewBox="0 0 1270 82">
                <ellipse cx="635" cy="41" rx="640" ry="44" fill="none" stroke="#e0002a" strokeWidth="6" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
              </svg>
            )}
          </div>
        ))}
      </Panel>
      {foot && <Pop d={0.5}><div style={{ fontSize: 34, color: C.dim }}>{foot}</div></Pop>}
    </Center>
  );
};

const Donut: React.FC<any> = ({ pct, label, other }) => {
  const t = useT();
  const p = interpolate(t, [0.2, 1.6], [0, pct / 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const r = 160, L = 2 * Math.PI * r;
  return (
    <Center>
      <div style={{ display: "flex", alignItems: "center", gap: 90 }}>
        <svg width="440" height="440" viewBox="0 0 440 440">
          <circle cx="220" cy="220" r={r} fill="none" stroke="#ffffff1c" strokeWidth="70" />
          <circle cx="220" cy="220" r={r} fill="none" stroke={C.pink} strokeWidth="70" strokeDasharray={`${L * p} ${L}`} transform="rotate(-90 220 220)" style={{ filter: `drop-shadow(0 0 20px ${C.pink})` }} />
          <text x="220" y="250" textAnchor="middle" fill="#fff" fontSize="96" fontWeight="700" fontFamily="Oswald">{Math.round(p * 100)}%</text>
        </svg>
        <div style={{ textAlign: "left" }}>
          <Pop d={0.5}><div style={{ fontSize: 72, fontWeight: 700, color: C.pink }}>{label}</div></Pop>
          <Pop d={1.0}><div style={{ fontSize: 50, color: C.dim, marginTop: 20 }}>{other}</div></Pop>
        </div>
      </div>
    </Center>
  );
};

// Title + plain list, one line at a time.
const List: React.FC<any> = ({ title, items, every = 0.6, start = 0.3, size = 64, sub, subAt, tag, tagDelay = 0.5 }) => {
  const t = useT();
  return (
    <Center gap={18}>
      {title && <Pop><div style={{ fontSize: 58, fontWeight: 700, letterSpacing: 5, color: C.cyan, marginBottom: 14 }}>{title}</div></Pop>}
      {items.map((s: string, i: number) => (
        <Pop key={i} d={start + i * every} from={0.9}><div style={{ fontSize: size, fontWeight: 700, display: "flex", alignItems: "center", gap: 28, justifyContent: "center" }}>{s}{tag && t >= start + i * every + tagDelay && <span style={{ fontSize: 30, color: C.red, border: `3px solid ${C.red}`, borderRadius: 8, padding: "2px 14px", letterSpacing: 2 }}>{tag}</span>}</div></Pop>
      ))}
      {sub && t >= subAt && <Pop d={subAt}><div style={{ fontSize: 46, color: C.yellow, marginTop: 20 }}>{sub}</div></Pop>}
    </Center>
  );
};

// Side-by-side option cards, each with what it costs you.
const Options: React.FC<any> = ({ title, items }) => (
  <Center gap={34}>
    {title && <Pop><div style={{ fontSize: 56, fontWeight: 700, letterSpacing: 5, color: C.cyan }}>{title}</div></Pop>}
    <div style={{ display: "flex", gap: 34 }}>
      {items.map((it: any, i: number) => (
        <Pop key={i} d={it.at ?? i * 0.3}>
          <Panel style={{ width: items.length > 2 ? 520 : 680, minHeight: 380, padding: "36px 30px", display: "flex", flexDirection: "column", gap: 18, border: `3px solid ${col(it.color || "pink")}` }}>
            <div style={{ fontSize: 30, letterSpacing: 5, color: col(it.color || "pink") }}>{it.k}</div>
            <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1 }}>{it.t}</div>
            <div style={{ flex: 1 }} />
            <div style={{ fontSize: 36, color: C.dim }}>{it.costLabel ?? "You give up"}</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: C.yellow }}>{it.cost}</div>
          </Panel>
        </Pop>
      ))}
    </div>
  </Center>
);

// ---------- Video 3 kinds ----------

const Clear: React.FC<any> = () => null;

// GPU vs CPU: the CPU box fills up with simulation work until it overflows, then base PS5 vs Pro bars under each box.
const CpuGpu: React.FC<any> = ({ gpuAt = 0, cpuAt = 0, load = [], barsAt = 99, gpuBarAt = 99, cpuBarAt = 99, fractionalAt = 99, bottleneckAt = 99, verdictAt = 99 }) => {
  const t = useT();
  const shown = load.filter((l: any) => t >= l.at);
  const jam = t >= bottleneckAt;
  const bar = (label: string, w: number, at: number, c: string) => {
    const p = interpolate(t, [at, at + 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 32, marginTop: 10, opacity: t >= at ? 1 : 0 }}>
        <span style={{ width: 130, textAlign: "right", color: C.dim }}>{label}</span>
        <div style={{ flex: 1, height: 34, background: "#ffffff12", borderRadius: 8, overflow: "hidden" }}><div style={{ width: `${w * p}%`, height: "100%", background: `linear-gradient(90deg,${c}aa,${c})`, boxShadow: `0 0 20px ${c}88` }} /></div>
      </div>
    );
  };
  const box = (name: string, sub: string, on: boolean, c: string, body: React.ReactNode, under: React.ReactNode, red = false) => (
    <div style={{ width: 700, display: "flex", flexDirection: "column", gap: 16 }}>
      <Panel style={{ height: 360, padding: "26px 30px", textAlign: "left", opacity: on ? 1 : 0.35, border: red ? `5px solid ${C.red}` : on ? `3px solid ${c}` : undefined, boxShadow: red ? glow(C.red) : on ? `0 0 40px ${c}44` : undefined, position: "relative", overflow: "visible" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}><span style={{ fontSize: 64, fontWeight: 700, color: c }}>{name}</span><span style={{ fontSize: 34, color: C.dim }}>{sub}</span></div>
        {body}
        {red && <div style={{ position: "absolute", top: -26, right: 24, background: C.red, color: "#fff", fontSize: 34, fontWeight: 700, padding: "4px 20px", borderRadius: 10, opacity: Math.floor(t * 3) % 2 ? 1 : 0.7 }}>BOTTLENECK</div>}
      </Panel>
      <div style={{ minHeight: 120 }}>{under}</div>
    </div>
  );
  return (
    <Center gap={18}>
      <div style={{ display: "flex", gap: 60 }}>
        {box("GPU", "graphics", t >= gpuAt && t < cpuAt + 0.01 || t >= barsAt, C.cyan,
          <div style={{ fontSize: 38, color: C.white, marginTop: 30, lineHeight: 1.6 }}>Lighting<br />Textures<br />Resolution</div>,
          t >= barsAt && <>{bar("PS5", 52, gpuBarAt, C.cyan)}{bar("PS5 Pro", 88, gpuBarAt + 0.3, C.cyan)}{t >= gpuBarAt + 0.8 && <div style={{ fontSize: 32, color: C.cyan, marginTop: 8, textAlign: "center" }}>a serious step up</div>}</>)}
        {box("CPU", "simulation", t >= cpuAt, C.pink,
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 22 }}>
            {shown.map((l: any, i: number) => (
              <Pop key={i} from={1.4}><div style={{ fontSize: 40, fontWeight: 700, padding: "8px 20px", borderRadius: 10, background: i >= 5 ? `${C.red}44` : `${C.pink}33`, border: `2px solid ${i >= 5 ? C.red : C.pink}`, transform: i >= 5 ? `rotate(${(i % 2 ? 3 : -4)}deg)` : undefined }}>{l.t}</div></Pop>
            ))}
          </div>,
          t >= barsAt && <>{bar("PS5", 80, cpuBarAt, C.pink)}{bar("PS5 Pro", 83, cpuBarAt + 0.3, C.pink)}{t >= fractionalAt && <div style={{ fontSize: 32, color: C.pink, marginTop: 8, textAlign: "center" }}>“fractional” — Digital Foundry</div>}</>,
          jam)}
      </div>
      {t >= verdictAt && <Pop d={verdictAt}><div style={{ fontSize: 60, fontWeight: 700, color: C.yellow, textShadow: glow(C.yellow) }}>Pro = a better-looking 30. Not a 60.</div></Pop>}
    </Center>
  );
};

// Answer table with a confidence label per row, built as spoken; optional one-line end card.
const Confidence: React.FC<any> = ({ title, rows, endCard, endAt = 99 }) => {
  const t = useT();
  return (
    <>
      <Center gap={20}>
        <Pop><div style={{ fontSize: 56, fontWeight: 700, letterSpacing: 5, color: C.cyan }}>{title}</div></Pop>
        <Panel style={{ width: 1560, padding: "16px 44px", textAlign: "left" }}>
          {rows.map((r: any, i: number) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: i < rows.length - 1 ? "1px solid #ffffff18" : "none", opacity: t >= r.at ? 1 : 0, transform: `translateX(${t >= r.at ? 0 : -30}px)` }}>
              <span style={{ fontSize: 44, fontWeight: 500 }}>{r.t}</span>
              <span style={{ fontSize: 36, fontWeight: 700, color: col(r.color), border: `3px solid ${col(r.color)}`, borderRadius: 10, padding: "2px 18px", letterSpacing: 2 }}>{r.c}</span>
            </div>
          ))}
        </Panel>
      </Center>
      {endCard && t >= endAt && <div style={{ position: "absolute", left: 60, top: 46, fontFamily: FONT, fontSize: 32, fontWeight: 700, color: C.ink, background: C.yellow, borderRadius: 12, padding: "8px 26px" }}>{endCard}</div>}
    </>
  );
};

export const KINDS: Record<string, React.FC<any>> = {
  title: Title, big: Big, chapter: Chapter, store: Store, post: Post, bars: Bars, flash: Flash, list13: List13,
  quote: Quote, strip: Strip, checklist: Checklist, badge: Badge, people: People, cards: Cards, box: Box,
  regions: Regions, rating: Rating, grid: Grid, stations: Stations, counter: Counter, timeline: Timeline, facts: Facts,
  days: Days, terms: Terms, donut: Donut, list: List, options: Options,
  clear: Clear, cpugpu: CpuGpu, confidence: Confidence,
};

import React from "react";

const FLOOR_Y = 860;

const Window: React.FC<{ x: number; y: number; w: number; h: number; sky?: string }> = ({ x, y, w, h, sky = "#bfe3f5" }) => (
  <g>
    <rect x={x - 14} y={y - 14} width={w + 28} height={h + 28} rx={10} fill="#fff8ee" />
    <rect x={x} y={y} width={w} height={h} rx={6} fill={sky} />
    <circle cx={x + w * 0.75} cy={y + h * 0.3} r={h * 0.12} fill="#fff6c9" opacity={0.9} />
    <rect x={x + w / 2 - 6} y={y} width={12} height={h} fill="#fff8ee" />
    <rect x={x} y={y + h / 2 - 6} width={w} height={12} fill="#fff8ee" />
  </g>
);

const Bedroom: React.FC<{ retro?: boolean }> = ({ retro }) => (
  <g>
    <rect width={1920} height={FLOOR_Y} fill={retro ? "#e9d3a8" : "#f6d8b8"} />
    {retro && Array.from({ length: 24 }).map((_, i) => <rect key={i} x={i * 80} y={0} width={40} height={FLOOR_Y} fill="#e2c795" opacity={0.6} />)}
    <rect y={FLOOR_Y} width={1920} height={220} fill={retro ? "#9c6b45" : "#c49a6c"} />
    <rect y={FLOOR_Y - 18} width={1920} height={18} fill="#fff1df" />
    <Window x={1260} y={170} w={420} h={330} sky={retro ? "#cfe6ea" : "#bfe3f5"} />
    {/* bed */}
    <rect x={140} y={640} width={560} height={150} rx={24} fill={retro ? "#7b9e89" : "#8ecae6"} />
    <rect x={120} y={520} width={40} height={300} rx={14} fill="#8d5a3b" />
    <rect x={160} y={590} width={180} height={70} rx={30} fill="#fffaf0" />
    <rect x={140} y={760} width={560} height={30} fill="#6d4c41" opacity={0.25} />
    {/* nightstand + clock */}
    <rect x={760} y={680} width={150} height={160} rx={10} fill="#a1693f" />
    <circle cx={835} cy={640} r={42} fill={retro ? "#c0392b" : "#264653"} />
    <circle cx={835} cy={640} r={32} fill="#fffaf0" />
    <line x1={835} y1={640} x2={835} y2={618} stroke="#222" strokeWidth={4} />
    <line x1={835} y1={640} x2={852} y2={648} stroke="#222" strokeWidth={4} />
    {retro && <>
      {/* wall calendar */}
      <rect x={1000} y={240} width={170} height={210} rx={6} fill="#fffaf0" stroke="#b08968" strokeWidth={4} />
      <rect x={1000} y={240} width={170} height={52} fill="#c0392b" />
      <text x={1085} y={278} fontFamily="Oswald" fontWeight={700} fontSize={34} fill="#fff" textAnchor="middle">JUNE</text>
      <text x={1085} y={400} fontFamily="Oswald" fontWeight={700} fontSize={78} fill="#333" textAnchor="middle">1955</text>
    </>}
    {!retro && <rect x={980} y={260} width={180} height={130} rx={8} fill="#e76f51" opacity={0.85} />}
  </g>
);

const Street: React.FC<{ retro?: boolean }> = ({ retro }) => (
  <g>
    <rect width={1920} height={1080} fill={retro ? "#d9ecef" : "#cdeffd"} />
    {[0, 1, 2, 3].map((i) => (
      <g key={i} transform={`translate(${80 + i * 470},0)`}>
        <rect x={0} y={420} width={380} height={440} fill={["#f2cc8f", "#e07a5f", "#81b29a", "#f4f1de"][i]} />
        <polygon points="-20,430 190,280 400,430" fill={["#9c6644", "#6d597a", "#3d405b", "#b56576"][i]} />
        <rect x={150} y={700} width={80} height={160} fill="#5e4b3c" />
        <rect x={40} y={520} width={90} height={90} fill="#fffaf0" />
        <rect x={250} y={520} width={90} height={90} fill="#fffaf0" />
      </g>
    ))}
    <rect y={FLOOR_Y} width={1920} height={220} fill={retro ? "#8d8d8d" : "#9aa5ab"} />
    <rect y={FLOOR_Y} width={1920} height={30} fill="#d6d6d6" />
    {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={i * 210 + 40} y={990} width={110} height={12} fill="#f1f1f1" />)}
    {retro && <g transform="translate(1500,890)">
      <rect x={0} y={20} width={360} height={80} rx={40} fill="#4a7c8c" />
      <rect x={70} y={-30} width={200} height={70} rx={30} fill="#5b8fa0" />
      <circle cx={80} cy={105} r={32} fill="#222" /><circle cx={290} cy={105} r={32} fill="#222" />
    </g>}
  </g>
);

const Hallway: React.FC = () => (
  <g>
    <rect width={1920} height={FLOOR_Y} fill="#cde3e8" />
    {Array.from({ length: 14 }).map((_, i) => (
      <g key={i} transform={`translate(${i * 140},300)`}>
        <rect x={10} y={0} width={124} height={560} fill={i % 2 ? "#2a9d8f" : "#3fb3a3"} stroke="#1f7a6f" strokeWidth={4} />
        {[30, 50, 70].map((y) => <rect key={y} x={40} y={y} width={64} height={8} rx={4} fill="#1f7a6f" />)}
        <rect x={104} y={260} width={12} height={40} rx={6} fill="#e9c46a" />
      </g>
    ))}
    <rect y={FLOOR_Y} width={1920} height={220} fill="#e8e1d5" />
    <rect y={280} width={1920} height={20} fill="#f7f3ea" />
  </g>
);

const Classroom: React.FC = () => (
  <g>
    <rect width={1920} height={FLOOR_Y} fill="#f3e7c9" />
    <rect x={360} y={140} width={1200} height={420} rx={14} fill="#2f5d50" stroke="#8d5a3b" strokeWidth={18} />
    <path d="M 460 260 Q 560 220 660 270 M 760 300 L 1000 300 M 1100 250 Q 1200 330 1320 260" stroke="#e9f5ef" strokeWidth={6} fill="none" opacity={0.7} />
    <rect y={FLOOR_Y} width={1920} height={220} fill="#d4a373" />
    {[260, 1460].map((x) => <g key={x}><rect x={x} y={760} width={280} height={30} rx={8} fill="#a1693f" /><rect x={x + 30} y={790} width={20} height={80} fill="#6d4c41" /><rect x={x + 230} y={790} width={20} height={80} fill="#6d4c41" /></g>)}
  </g>
);

const Abstract: React.FC<{ retro?: boolean; frame: number }> = ({ retro, frame }) => (
  <g>
    <defs>
      <radialGradient id="abs" cx="50%" cy="45%" r="70%">
        <stop offset="0%" stopColor={retro ? "#f7e7c6" : "#fdf0e3"} />
        <stop offset="100%" stopColor={retro ? "#d9b98a" : "#f6c9b2"} />
      </radialGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#abs)" />
    {Array.from({ length: 18 }).map((_, i) => (
      <circle key={i} cx={(i * 337 + frame * (0.3 + (i % 3) * 0.2)) % 2000 - 40} cy={(i * 191) % 1080} r={8 + (i % 4) * 6} fill="#fff" opacity={0.35} />
    ))}
    <rect y={FLOOR_Y + 40} width={1920} height={180} fill="#000" opacity={0.05} />
  </g>
);

const Diner: React.FC = () => (
  <g>
    <rect width={1920} height={FLOOR_Y} fill="#f7e1b5" />
    <rect y={120} width={1920} height={40} fill="#c0392b" />
    <rect x={720} y={190} width={480} height={130} rx={18} fill="#c0392b" />
    <text x={960} y={285} fontFamily="Oswald" fontWeight={700} fontSize={92} fill="#fffaf0" textAnchor="middle">DINER</text>
    <rect x={0} y={600} width={1920} height={60} fill="#e9e3d7" />
    <rect x={0} y={660} width={1920} height={150} fill="#c0392b" />
    <rect x={0} y={660} width={1920} height={16} fill="#d8d8d8" />
    {Array.from({ length: 24 }).map((_, i) => Array.from({ length: 4 }).map((__, j) =>
      <rect key={`${i}-${j}`} x={i * 80} y={FLOOR_Y + j * 55} width={80} height={55} fill={(i + j) % 2 ? "#111" : "#f4f4f4"} />))}
    {[300, 560, 1600].map((x) => <g key={x}><rect x={x - 8} y={740} width={16} height={130} fill="#bbb" /><ellipse cx={x} cy={735} rx={48} ry={16} fill="#c0392b" /></g>)}
    <g transform="translate(1180,600)"><rect x={0} y={-50} width={44} height={50} rx={6} fill="#fffaf0" /><path d="M 44 -40 Q 64 -28 44 -14" stroke="#fffaf0" strokeWidth={8} fill="none" /></g>
  </g>
);

const Gas: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#cfe6ea" />
    <rect x={200} y={180} width={1300} height={70} fill="#c0392b" />
    <rect x={260} y={250} width={30} height={610} fill="#ddd" />
    <rect x={1410} y={250} width={30} height={610} fill="#ddd" />
    <g transform="translate(860,560)">
      <rect x={0} y={0} width={150} height={300} rx={20} fill="#e63946" />
      <circle cx={75} cy={-20} r={56} fill="#fffaf0" stroke="#e63946" strokeWidth={10} />
      <rect x={30} y={60} width={90} height={60} rx={8} fill="#fffaf0" />
      <path d="M 150 120 Q 210 140 200 240" stroke="#222" strokeWidth={10} fill="none" />
    </g>
    <rect y={FLOOR_Y} width={1920} height={220} fill="#8d8d8d" />
  </g>
);

export const Background: React.FC<{ name: string; frame: number }> = ({ name, frame }) => {
  switch (name) {
    case "bedroom": return <Bedroom />;
    case "bedroom55": return <Bedroom retro />;
    case "street": return <Street />;
    case "street55": return <Street retro />;
    case "hallway": return <Hallway />;
    case "classroom": return <Classroom />;
    case "diner": return <Diner />;
    case "gas": return <Gas />;
    case "abstract55": return <Abstract retro frame={frame} />;
    default: return <Abstract frame={frame} />;
  }
};

export const Dust: React.FC<{ frame: number }> = ({ frame }) => (
  <g opacity={0.5}>
    {Array.from({ length: 26 }).map((_, i) => {
      const x = (i * 271 + Math.sin(frame / 40 + i) * 40) % 1920;
      const y = (i * 149 + frame * (0.2 + (i % 5) * 0.08)) % 1080;
      return <circle key={i} cx={x} cy={1080 - y} r={2 + (i % 3)} fill="#fff" opacity={0.6} />;
    })}
  </g>
);
